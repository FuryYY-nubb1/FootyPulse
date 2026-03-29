// ============================================
// database/fetchEventsAndLineups.js
// ============================================
// PURPOSE: Fetch match_events + match_players (lineups) from API-Football
//          for all season 2024 (2024/25) finished matches
//
// STRATEGY:
//   1. Fetch all finished fixtures per league from API-Football (season 2024)
//   2. Match each fixture to our DB using external_id (most reliable)
//      Falls back to team name matching if external_id not set yet
//   3. Pull events + lineups for each matched fixture
//
// PREREQUISITE: Run fetchAllApiFootball.js first so matches have external_id set
//
// USAGE:    node database/fetchEventsAndLineups.js
// FREE TIER: 100 requests/day
//   Budget:  6 league list requests + (FIXTURES_PER_LEAGUE x 6 x 2) event/lineup requests
//   Default: 6 + (10 x 6 x 2) = 126 requests -- reduce FIXTURES_PER_LEAGUE to 7 if needed
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// Season 2024 = 2024/25 -- fully covered by API-Football free tier
const LEAGUES = [
  { id: 39,  name: 'Premier League',        season: 2024 },
  { id: 140, name: 'La Liga',               season: 2024 },
  { id: 78,  name: 'Bundesliga',            season: 2024 },
  { id: 135, name: 'Serie A',               season: 2024 },
  { id: 61,  name: 'Ligue 1',              season: 2024 },
  { id: 2,   name: 'UEFA Champions League', season: 2024 },
];

// Fixtures to process per league per run
// Lower this if you are close to the 100 req/day free limit
const FIXTURES_PER_LEAGUE = 10;

// Team name aliases: API-Football name -> name stored in your DB
// Add more here if you see [SKIP] Teams not in DB in the output
const TEAM_ALIASES = {
  // Premier League
  'Wolves':              'Wolverhampton Wanderers',
  'Bournemouth':         'AFC Bournemouth',
  'Ipswich':             'Ipswich Town',
  'Leicester':           'Leicester City',
  'Brentford':           'Brentford FC',
  'Nottm Forest':        'Nottingham Forest FC',
  // Serie A
  'Inter':               'Inter Milan',
  'Napoli':              'SSC Napoli',
  'Juventus':            'Juventus FC',
  'Venezia':             'Venezia FC',
  'Empoli':              'Empoli FC',
  'Como':                'Como 1907',
  'Monza':               'AC Monza',
  'Cagliari':            'Cagliari Calcio',
  'Hellas Verona':       'Hellas Verona FC',
  // La Liga
  'Girona':              'Girona FC',
  'Alaves':              'Deportivo Alaves',
  'Osasuna':             'CA Osasuna',
  'Getafe':              'Getafe CF',
  'Celta Vigo':          'RC Celta de Vigo',
  'Leganes':             'CD Leganes',
  'Valladolid':          'Real Valladolid',
  'Espanyol':            'RCD Espanyol',
  'Las Palmas':          'UD Las Palmas',
  // Bundesliga
  'FSV Mainz 05':        '1. FSV Mainz 05',
  'SV Elversberg':       'SV 07 Elversberg',
  // Ligue 1
  'Paris Saint Germain': 'Paris Saint-Germain',
  'Reims':               'Stade de Reims',
  'Metz':                'FC Metz',
  'Lille':               'LOSC Lille',
  'Marseille':           'Olympique de Marseille',
  'Rennes':              'Stade Rennais FC',
  'Nantes':              'FC Nantes',
  'Montpellier':         'Montpellier HSC',
  'Strasbourg':          'RC Strasbourg',
  'Le Havre':            'Le Havre AC',
};

// ============================================
// Helpers
// ============================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let requestCount = 0;
async function apiFetch(endpoint) {
  requestCount++;
  if (requestCount % 8 === 0) {
    console.log('   [WAIT] Rate limit pause (65s)...');
    await sleep(65000);
  }
  const url = `${BASE_URL}${endpoint}`;
  console.log(`   [FETCH] ${url}`);
  const response = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });
  if (response.status === 429) {
    console.log('   [WAIT] Rate limited -- waiting 65s...');
    await sleep(65000);
    requestCount = 0;
    return apiFetch(endpoint);
  }
  if (!response.ok) throw new Error(`API ${response.status}: ${response.statusText}`);
  const data = await response.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    const errMsg = JSON.stringify(data.errors);
    if (errMsg.includes('token') || errMsg.includes('requests')) {
      throw new Error(`API key error or daily limit reached: ${errMsg}`);
    }
    console.log(`   [WARN] API warning: ${errMsg}`);
  }
  return data;
}

function mapEventType(type, detail) {
  if (type === 'Goal') {
    if (detail === 'Own Goal')       return 'own_goal';
    if (detail === 'Penalty')        return 'penalty';
    if (detail === 'Missed Penalty') return 'penalty_miss';
    return 'goal';
  }
  if (type === 'Card') {
    if (detail === 'Yellow Card')         return 'yellow';
    if (detail === 'Second Yellow card')  return 'second_yellow';
    if (detail === 'Red Card')            return 'red';
  }
  if (type === 'subst') return 'sub';
  if (type === 'Var')   return 'var';
  return null;
}

function resolveTeamName(apiName) {
  return TEAM_ALIASES[apiName] || apiName;
}

async function findTeamId(rawName) {
  const name = resolveTeamName(rawName);
  if (!name) return null;
  // Exact match first
  let r = await pool.query(
    `SELECT team_id FROM teams WHERE name = $1 OR short_name = $1 LIMIT 1`, [name]
  );
  if (r.rows.length > 0) return r.rows[0].team_id;
  // Partial match
  r = await pool.query(
    `SELECT team_id FROM teams WHERE name ILIKE $1 OR short_name ILIKE $1 LIMIT 1`,
    [`%${name}%`]
  );
  if (r.rows.length > 0) return r.rows[0].team_id;
  // Last resort: raw name if alias didn't help
  if (name !== rawName) {
    r = await pool.query(
      `SELECT team_id FROM teams WHERE name ILIKE $1 OR short_name ILIKE $1 LIMIT 1`,
      [`%${rawName}%`]
    );
    return r.rows[0]?.team_id || null;
  }
  return null;
}

async function findPersonId(name) {
  if (!name) return null;
  const r = await pool.query(
    `SELECT person_id FROM persons WHERE display_name ILIKE $1 LIMIT 1`,
    [`%${name}%`]
  );
  return r.rows[0]?.person_id || null;
}

// Find match_id -- first try external_id (reliable), then fall back to team name lookup
async function findMatchId(apiFixtureId, homeTeamId, awayTeamId) {
  // Primary: external_id lookup (set by fetchAllApiFootball.js)
  const byExtId = await pool.query(
    `SELECT match_id FROM matches WHERE external_id = $1 LIMIT 1`,
    [String(apiFixtureId)]
  );
  if (byExtId.rows.length > 0) return byExtId.rows[0].match_id;

  // Fallback: match by home + away team on any finished match
  if (!homeTeamId || !awayTeamId) return null;
  const byTeams = await pool.query(
    `SELECT match_id FROM matches
     WHERE home_team_id = $1 AND away_team_id = $2 AND status = 'finished'
     ORDER BY match_date DESC LIMIT 1`,
    [homeTeamId, awayTeamId]
  );
  return byTeams.rows[0]?.match_id || null;
}

// ============================================
// SECTION 1: Build fixture map
// Fetches finished fixtures per league, maps API fixture ID -> our match_id
// ============================================
async function buildFixtureMap() {
  console.log('\n' + '='.repeat(60));
  console.log('  SECTION 1: Mapping API Fixtures to DB Matches');
  console.log('='.repeat(60));

  // fixtureMap: { apiFixtureId -> our match_id }
  const fixtureMap = {};

  for (const league of LEAGUES) {
    try {
      console.log(`\n   [LEAGUE] ${league.name} (season ${league.season})`);

      const data = await apiFetch(
        `/fixtures?league=${league.id}&season=${league.season}&status=FT-AET-PEN`
      );
      const fixtures = data.response || [];

      if (fixtures.length === 0) {
        console.log(`   [WARN] No finished fixtures for season ${league.season}`);
        console.log(`          Free tier only covers seasons 2022-2024. Check your plan.`);
        continue;
      }

      console.log(`   Found ${fixtures.length} finished fixtures`);

      // Take the most recent N to stay within daily request limit
      const recent = fixtures
        .sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date))
        .slice(0, FIXTURES_PER_LEAGUE);

      let matched = 0, skippedTeam = 0, skippedMatch = 0;

      for (const item of recent) {
        const apiHomeName = item.teams?.home?.name;
        const apiAwayName = item.teams?.away?.name;
        const fixtureId   = item.fixture.id;

        // Resolve team IDs (needed for fallback lookup)
        const homeTeamId = await findTeamId(apiHomeName);
        const awayTeamId = await findTeamId(apiAwayName);

        if (!homeTeamId || !awayTeamId) {
          console.log(`   [SKIP] Teams not in DB: "${apiHomeName}" vs "${apiAwayName}"`);
          console.log(`          Add to TEAM_ALIASES at top of file if needed`);
          skippedTeam++;
          continue;
        }

        const matchId = await findMatchId(fixtureId, homeTeamId, awayTeamId);
        if (!matchId) {
          console.log(`   [SKIP] Match not in DB: ${apiHomeName} vs ${apiAwayName}`);
          skippedMatch++;
          continue;
        }

        // Also save external_id back to the match row if it wasn't set already
        // (handles case where fetchAllApiFootball.js wasn't run yet)
        await pool.query(
          `UPDATE matches SET external_id = $1
           WHERE match_id = $2 AND (external_id IS NULL OR external_id = '')`,
          [String(fixtureId), matchId]
        );

        fixtureMap[fixtureId] = matchId;
        matched++;
        console.log(`   [OK] ${apiHomeName} vs ${apiAwayName} -> match_id ${matchId}`);
      }

      console.log(`   Result: ${matched} matched, ${skippedTeam} unknown teams, ${skippedMatch} not in DB`);
      await sleep(3000);

    } catch (err) {
      console.log(`   [ERROR] ${league.name}: ${err.message}`);
      if (err.message.includes('daily limit')) {
        console.log('   [STOP] Daily limit reached. Run again tomorrow.');
        break;
      }
    }
  }

  return fixtureMap;
}

// ============================================
// SECTION 2: Fetch events + lineups per fixture
// ============================================
async function fetchEventsAndLineups(fixtureMap) {
  console.log('\n' + '='.repeat(60));
  console.log('  SECTION 2: Fetching Events + Lineups');
  console.log('='.repeat(60));

  const fixtureIds = Object.keys(fixtureMap);
  console.log(`\n   Processing ${fixtureIds.length} matched fixtures\n`);

  let totalEvents = 0;
  let totalLineupRows = 0;

  for (const fixtureId of fixtureIds) {
    const matchId = fixtureMap[fixtureId];

    try {
      // -- Fetch match events --
      const eventsData = await apiFetch(`/fixtures/events?fixture=${fixtureId}`);
      let eventsInserted = 0;

      for (const event of eventsData.response || []) {
        const eventType = mapEventType(event.type, event.detail);
        if (!eventType) continue;

        const teamId   = await findTeamId(event.team?.name);
        if (!teamId) continue;

        const personId = await findPersonId(event.player?.name);
        const assistId = await findPersonId(event.assist?.name);

        await pool.query(
          `INSERT INTO match_events
             (match_id, event_type, team_id, person_id,
              related_person_id, minute, added_time, description)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT DO NOTHING`,
          [
            matchId, eventType, teamId, personId, assistId,
            event.time?.elapsed || 0,
            event.time?.extra   || null,
            event.detail        || null,
          ]
        );
        eventsInserted++;
        totalEvents++;
      }

      // -- Fetch lineups --
      const lineupData = await apiFetch(`/fixtures/lineups?fixture=${fixtureId}`);
      let lineupsInserted = 0;

      for (const team of lineupData.response || []) {
        const teamId = await findTeamId(team.team?.name);
        if (!teamId) continue;

        const starters    = (team.startXI     || []).map(p => ({ ...p.player, is_starter: true  }));
        const substitutes = (team.substitutes || []).map(p => ({ ...p.player, is_starter: false }));

        for (const player of [...starters, ...substitutes]) {
          const personId = await findPersonId(player.name);
          if (!personId) continue;

          await pool.query(
            `INSERT INTO match_players
               (match_id, person_id, team_id, is_starter, position, jersey_number)
             VALUES ($1,$2,$3,$4,$5,$6)
             ON CONFLICT DO NOTHING`,
            [
              matchId, personId, teamId,
              player.is_starter,
              player.pos    || null,
              player.number || null,
            ]
          );
          lineupsInserted++;
          totalLineupRows++;
        }
      }

      console.log(`   [OK] fixture ${fixtureId} -> match ${matchId}: ${eventsInserted} events, ${lineupsInserted} lineup rows`);
      await sleep(4000);

    } catch (err) {
      console.log(`   [ERROR] fixture ${fixtureId} (match ${matchId}): ${err.message}`);
      if (err.message.includes('daily limit')) {
        console.log('   [STOP] Daily limit reached. Run again tomorrow.');
        break;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`   Total events inserted:  ${totalEvents}`);
  console.log(`   Total lineup rows:      ${totalLineupRows}`);
  console.log('='.repeat(60));
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('\nFootyPulse -- Fetch Events & Lineups (Season 2024)');
  console.log('='.repeat(60));
  console.log(`   Season:              2024 (2024/25)`);
  console.log(`   Fixtures per league: ${FIXTURES_PER_LEAGUE}`);
  console.log(`   Leagues:             ${LEAGUES.length}`);
  console.log(`   Est. API requests:   ~${LEAGUES.length + (FIXTURES_PER_LEAGUE * LEAGUES.length * 2)}`);
  console.log('='.repeat(60));

  if (!API_KEY) {
    console.error('[ERROR] Missing API_FOOTBALL_KEY in .env');
    console.error('   Get your key at: https://www.api-football.com/');
    process.exit(1);
  }

  const fixtureMap = await buildFixtureMap();
  const matchedCount = Object.keys(fixtureMap).length;

  if (matchedCount === 0) {
    console.log('\n[WARN] No fixtures could be matched to your DB.');
    console.log('   Possible reasons:');
    console.log('   1. fetchAllApiFootball.js has not been run yet (matches table is empty)');
    console.log('   2. Free API plan limitation -- verify at dashboard.api-football.com');
    console.log('   3. All team names are mismatched -- check TEAM_ALIASES at top of file');
    await pool.end();
    return;
  }

  console.log(`\n   Total matched fixtures: ${matchedCount}`);

  await fetchEventsAndLineups(fixtureMap);

  // Summary
  const events  = await pool.query('SELECT COUNT(*) as c FROM match_events');
  const lineups = await pool.query('SELECT COUNT(*) as c FROM match_players');

  console.log('\n  DATABASE SUMMARY');
  console.log('='.repeat(60));
  console.log(`   match_events:  ${events.rows[0].c} rows`);
  console.log(`   match_players: ${lineups.rows[0].c} rows`);
  console.log('='.repeat(60));

  await pool.end();
  console.log('\nDone.\n');
}

main().catch(err => {
  console.error('[FATAL]', err);
  pool.end();
  process.exit(1);
});
