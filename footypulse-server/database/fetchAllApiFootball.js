// ============================================
// database/fetchAllApiFootball.js
// ============================================
// PURPOSE: Fetch FULL football data from API-Football v3
//          - Competitions & Seasons
//          - Standings (League Tables)
//          - Fixtures (Matches) with Scores
//          - Match Events (Goals, Cards, Subs)
//          - Top Scorers → Achievements
//
// API:     https://v3.football.api-sports.io
// DOCS:    https://www.api-football.com/documentation-v3
//
// SETUP:
//   1. Add to .env: API_FOOTBALL_KEY=your_key_here
//   2. Run fetchTeamsApiFootball.js FIRST (to populate teams & squads)
//
// USAGE:   node database/fetchAllApiFootball.js
//
// FREE TIER: 100 requests/day — this script uses ~40-60 requests
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// ── Leagues (API-Football IDs) ──
const LEAGUES = [
  { id: 39,  name: 'Premier League',       shortName: 'PL',  type: 'league',        format: 'league',         countryCode: 'ENG' },
  { id: 140, name: 'La Liga',              shortName: 'LL',  type: 'league',        format: 'league',         countryCode: 'ESP' },
  { id: 78,  name: 'Bundesliga',           shortName: 'BL',  type: 'league',        format: 'league',         countryCode: 'GER' },
  { id: 135, name: 'Serie A',              shortName: 'SA',  type: 'league',        format: 'league',         countryCode: 'ITA' },
  { id: 61,  name: 'Ligue 1',             shortName: 'L1',  type: 'league',        format: 'league',         countryCode: 'FRA' },
  { id: 2,   name: 'UEFA Champions League', shortName: 'UCL', type: 'international', format: 'group_knockout', countryCode: null },
];

const CURRENT_SEASON = 2024;

// ── Helpers ──
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

  const response = await fetch(url, {
    headers: { 'x-apisports-key': API_KEY },
  });

  if (response.status === 429) {
    console.log('   [WAIT] Rate limited — waiting 65 seconds...');
    await sleep(65000);
    requestCount = 0;
    return apiFetch(endpoint);
  }

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText} — ${endpoint}`);
  }

  const data = await response.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    console.log(`   [WARN] API error: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

// Map match status from API-Football to our schema
function mapStatus(apiStatus) {
  const map = {
    'TBD': 'scheduled', 'NS': 'scheduled',   // Not Started
    '1H': 'live', 'HT': 'live', '2H': 'live', 'ET': 'live', 'BT': 'live', 'P': 'live',
    'FT': 'finished', 'AET': 'finished', 'PEN': 'finished', 'AWD': 'finished', 'WO': 'finished',
    'PST': 'postponed', 'SUSP': 'postponed', 'INT': 'postponed',
    'CANC': 'cancelled', 'ABD': 'cancelled',
  };
  return map[apiStatus] || 'scheduled';
}

// Map event type from API-Football
function mapEventType(type, detail) {
  if (type === 'Goal') {
    if (detail === 'Own Goal') return 'own_goal';
    if (detail === 'Penalty') return 'penalty';
    if (detail === 'Missed Penalty') return 'penalty_miss';
    return 'goal';
  }
  if (type === 'Card') {
    if (detail === 'Yellow Card') return 'yellow';
    if (detail === 'Second Yellow card') return 'second_yellow';
    if (detail === 'Red Card') return 'red';
    return 'yellow';
  }
  if (type === 'subst') return 'sub';
  if (type === 'Var') return 'var';
  return null;
}

// Find team_id by name (fuzzy)
async function findTeamId(teamName) {
  if (!teamName) return null;
  const result = await pool.query(
    `SELECT team_id FROM teams WHERE name = $1 OR short_name = $1 LIMIT 1`,
    [teamName]
  );
  if (result.rows.length > 0) return result.rows[0].team_id;

  const partial = await pool.query(
    `SELECT team_id FROM teams WHERE name ILIKE $1 OR short_name ILIKE $1 LIMIT 1`,
    [`%${teamName}%`]
  );
  return partial.rows.length > 0 ? partial.rows[0].team_id : null;
}

// Find person_id by name
async function findPersonId(name) {
  if (!name) return null;
  const result = await pool.query(
    `SELECT person_id FROM persons WHERE display_name ILIKE $1 LIMIT 1`,
    [`%${name}%`]
  );
  return result.rows.length > 0 ? result.rows[0].person_id : null;
}


// ============================================
// SECTION 1: COMPETITIONS & SEASONS
// ============================================
async function fetchCompetitionsAndSeasons() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 1: Competitions & Seasons');
  console.log(`${'='.repeat(60)}`);

  let created = 0;

  for (const league of LEAGUES) {
    try {
      const data = await apiFetch(`/leagues?id=${league.id}`);
      const leagueData = data.response?.[0];

      if (!leagueData) {
        console.log(`   [WARN] No data for league ${league.id}`);
        continue;
      }

      // Find country_id
      let countryId = null;
      if (league.countryCode) {
        const cResult = await pool.query(
          'SELECT country_id FROM countries WHERE code = $1 LIMIT 1',
          [league.countryCode]
        );
        if (cResult.rows.length > 0) countryId = cResult.rows[0].country_id;
      }

      // Insert competition
      const compResult = await pool.query(
        `INSERT INTO competitions (name, short_name, competition_type, country_id, level, season_format, logo_url)
         VALUES ($1, $2, $3, $4, 1, $5, $6)
         ON CONFLICT DO NOTHING
         RETURNING competition_id`,
        [
          leagueData.league.name || league.name,
          league.shortName,
          league.type,
          countryId,
          league.format,
          leagueData.league.logo || null,
        ]
      );

      let competitionId = null;
      if (compResult.rows.length > 0) {
        competitionId = compResult.rows[0].competition_id;
        created++;
      } else {
        const existing = await pool.query(
          'SELECT competition_id FROM competitions WHERE name = $1 LIMIT 1',
          [leagueData.league.name || league.name]
        );
        competitionId = existing.rows[0]?.competition_id || null;
      }

      // Find the current season from API response
      if (competitionId && leagueData.seasons) {
        const currentSeason = leagueData.seasons.find(s => s.current === true);
        if (currentSeason) {
          const seasonName = `${currentSeason.year}/${(currentSeason.year + 1).toString().slice(-2)}`;

          await pool.query(
            `INSERT INTO seasons (competition_id, name, start_date, end_date, is_current)
             VALUES ($1, $2, $3, $4, true)
             ON CONFLICT (competition_id, name) DO UPDATE SET is_current = true
             RETURNING season_id`,
            [
              competitionId,
              seasonName,
              currentSeason.start || `${currentSeason.year}-08-01`,
              currentSeason.end || `${currentSeason.year + 1}-06-30`,
            ]
          );
          console.log(`   ✅ ${league.name} → Season ${seasonName}`);
        }
      }

      await sleep(3000);
    } catch (err) {
      console.error(`   [ERROR] ${league.name}: ${err.message}`);
    }
  }

  console.log(`\n   Competitions created: ${created}`);
}


// ============================================
// SECTION 2: STANDINGS
// ============================================
async function fetchStandings() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 2: Standings (League Tables)');
  console.log(`${'='.repeat(60)}`);

  // Only league-type competitions (not UCL for simplicity on free tier)
  const leagueIds = [39, 140, 78, 135, 61];
  let totalRows = 0;

  for (const leagueId of leagueIds) {
    try {
      const data = await apiFetch(`/standings?league=${leagueId}&season=${CURRENT_SEASON}`);
      const standings = data.response?.[0]?.league?.standings || [];

      // Find season_id
      const leagueName = LEAGUES.find(l => l.id === leagueId)?.name;
      const seasonRow = await pool.query(
        `SELECT s.season_id FROM seasons s
         JOIN competitions c ON s.competition_id = c.competition_id
         WHERE c.name ILIKE $1 AND s.is_current = true LIMIT 1`,
        [`%${leagueName}%`]
      );

      if (seasonRow.rows.length === 0) {
        console.log(`   [WARN] No season found for league ${leagueId}, skipping`);
        continue;
      }

      const seasonId = seasonRow.rows[0].season_id;

      // Clear existing standings for this season
      await pool.query('DELETE FROM standings WHERE season_id = $1', [seasonId]);

      // API-Football returns standings as array of arrays (for groups)
      for (const group of standings) {
        for (const row of group) {
          const teamId = await findTeamId(row.team?.name);
          if (!teamId) {
            console.log(`      [WARN] Team not found: ${row.team?.name}`);
            continue;
          }

          // Extract form (last 5 results)
          const form = row.form ? row.form.substring(0, 5) : null;

          await pool.query(
            `INSERT INTO standings (season_id, team_id, position, played, won, drawn, lost,
                                    goals_for, goals_against, points, form, group_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (season_id, group_name, team_id) DO UPDATE SET
               position = EXCLUDED.position, played = EXCLUDED.played,
               won = EXCLUDED.won, drawn = EXCLUDED.drawn, lost = EXCLUDED.lost,
               goals_for = EXCLUDED.goals_for, goals_against = EXCLUDED.goals_against,
               points = EXCLUDED.points, form = EXCLUDED.form`,
            [
              seasonId, teamId, row.rank,
              row.all?.played || 0, row.all?.win || 0, row.all?.draw || 0, row.all?.lose || 0,
              row.all?.goals?.for || 0, row.all?.goals?.against || 0,
              row.points || 0, form, row.group || null,
            ]
          );
          totalRows++;
        }
      }

      console.log(`   ✅ League ${leagueId}: standings loaded`);
      await sleep(7000);
    } catch (err) {
      console.error(`   [ERROR] League ${leagueId}: ${err.message}`);
    }
  }

  console.log(`\n   Total standing rows: ${totalRows}`);
}


// ============================================
// SECTION 3: FIXTURES (Matches)
// ============================================
async function fetchMatches() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 3: Fixtures (Matches)');
  console.log(`${'='.repeat(60)}`);

  let totalMatches = 0;

  for (const league of LEAGUES) {
    try {
      // Fetch all fixtures for this league + season
      const data = await apiFetch(`/fixtures?league=${league.id}&season=${CURRENT_SEASON}`);
      const fixtures = data.response || [];

      console.log(`\n   ${league.name}: ${fixtures.length} fixtures`);

      // Find season_id
      const seasonRow = await pool.query(
        `SELECT s.season_id FROM seasons s
         JOIN competitions c ON s.competition_id = c.competition_id
         WHERE c.name ILIKE $1 AND s.is_current = true LIMIT 1`,
        [`%${league.name}%`]
      );

      if (seasonRow.rows.length === 0) {
        console.log(`   [WARN] No season for ${league.name}, skipping`);
        continue;
      }

      const seasonId = seasonRow.rows[0].season_id;

      for (const item of fixtures) {
        const fixture = item.fixture;
        const teams = item.teams;
        const goals = item.goals;
        const score = item.score;

        const homeTeamId = await findTeamId(teams?.home?.name);
        const awayTeamId = await findTeamId(teams?.away?.name);

        if (!homeTeamId || !awayTeamId) {
          continue; // skip if teams not in our DB
        }

        // Parse date & time
        const matchDate = fixture.date ? fixture.date.substring(0, 10) : null;
        const kickOffTime = fixture.date ? fixture.date.substring(11, 16) : null;

        // Find stadium
        let stadiumId = null;
        if (fixture.venue?.name) {
          const vResult = await pool.query(
            'SELECT stadium_id FROM stadiums WHERE name ILIKE $1 LIMIT 1',
            [`%${fixture.venue.name}%`]
          );
          if (vResult.rows.length > 0) stadiumId = vResult.rows[0].stadium_id;
        }

        // Find referee
        let refereeId = null;
        if (fixture.referee) {
          refereeId = await findPersonId(fixture.referee.split(',')[0]); // sometimes has nationality after comma
        }

        const status = mapStatus(fixture.status?.short);

        try {
          await pool.query(
            `INSERT INTO matches (season_id, matchday, home_team_id, away_team_id,
                                  home_score, away_score, home_penalties, away_penalties,
                                  match_date, kick_off_time, stadium_id, referee_id, status,
                                  stage_name, group_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             ON CONFLICT DO NOTHING`,
            [
              seasonId,
              item.league?.round ? extractMatchday(item.league.round) : null,
              homeTeamId,
              awayTeamId,
              goals?.home ?? null,
              goals?.away ?? null,
              score?.penalty?.home ?? null,
              score?.penalty?.away ?? null,
              matchDate,
              kickOffTime ? `${kickOffTime}:00` : null,
              stadiumId,
              refereeId,
              status,
              item.league?.round || null,
              null, // group_name (could parse from round for UCL)
            ]
          );
          totalMatches++;
        } catch (e) {
          // Skip duplicate matches
        }
      }

      await sleep(7000);
    } catch (err) {
      console.error(`   [ERROR] ${league.name}: ${err.message}`);
    }
  }

  console.log(`\n   Total matches inserted: ${totalMatches}`);
}

// Extract matchday number from round string like "Regular Season - 15"
function extractMatchday(round) {
  if (!round) return null;
  const match = round.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}


// ============================================
// SECTION 4: MATCH EVENTS (for finished matches)
// ============================================
async function fetchMatchEvents() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 4: Match Events (Recent Finished Matches)');
  console.log(`${'='.repeat(60)}`);

  // Get recent finished matches (last 30 to save API calls)
  const recentMatches = await pool.query(
    `SELECT m.match_id, m.home_team_id, m.away_team_id, m.match_date,
            ht.name as home_name, at.name as away_name
     FROM matches m
     JOIN teams ht ON m.home_team_id = ht.team_id
     JOIN teams at ON m.away_team_id = at.team_id
     WHERE m.status = 'finished'
     ORDER BY m.match_date DESC
     LIMIT 30`
  );

  console.log(`   Processing events for ${recentMatches.rows.length} recent matches...\n`);

  let totalEvents = 0;

  for (const match of recentMatches.rows) {
    // We need to find the fixture ID in API-Football
    // Search by date + teams
    try {
      const dateStr = match.match_date instanceof Date
        ? match.match_date.toISOString().substring(0, 10)
        : String(match.match_date).substring(0, 10);

      // Search for this fixture in the API
      const data = await apiFetch(
        `/fixtures?date=${dateStr}&status=FT-AET-PEN&timezone=UTC`
      );
      const fixtures = data.response || [];

      // Find the matching fixture
      const apiFixture = fixtures.find(f =>
        (f.teams?.home?.name?.toLowerCase().includes(match.home_name.toLowerCase().substring(0, 5)) ||
         match.home_name.toLowerCase().includes(f.teams?.home?.name?.toLowerCase().substring(0, 5)))
      );

      if (!apiFixture) {
        continue; // skip if we can't match the fixture
      }

      const fixtureId = apiFixture.fixture.id;

      // Fetch events for this fixture
      const eventsData = await apiFetch(`/fixtures/events?fixture=${fixtureId}`);
      const events = eventsData.response || [];

      for (const event of events) {
        const eventType = mapEventType(event.type, event.detail);
        if (!eventType) continue;

        const teamId = event.team?.name
          ? await findTeamId(event.team.name)
          : null;
        if (!teamId) continue;

        const personId = event.player?.name
          ? await findPersonId(event.player.name)
          : null;

        const assistId = event.assist?.name
          ? await findPersonId(event.assist.name)
          : null;

        try {
          await pool.query(
            `INSERT INTO match_events (match_id, event_type, team_id, person_id,
                                       related_person_id, minute, added_time, description)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT DO NOTHING`,
            [
              match.match_id,
              eventType,
              teamId,
              personId,
              assistId,
              event.time?.elapsed || 0,
              event.time?.extra || null,
              event.detail || null,
            ]
          );
          totalEvents++;
        } catch (e) { /* skip */ }
      }

      await sleep(4000);
    } catch (err) {
      // Skip on error, continue with next match
    }
  }

  console.log(`\n   Total events inserted: ${totalEvents}`);
}


// ============================================
// SECTION 5: TOP SCORERS → Achievements
// ============================================
async function fetchTopScorers() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 5: Top Scorers → Achievements');
  console.log(`${'='.repeat(60)}`);

  const leagueIds = [39, 140, 78, 135, 61]; // no UCL for free tier
  let totalAchievements = 0;

  for (const leagueId of leagueIds) {
    try {
      const data = await apiFetch(`/players/topscorers?league=${leagueId}&season=${CURRENT_SEASON}`);
      const scorers = data.response || [];

      const leagueName = LEAGUES.find(l => l.id === leagueId)?.name;

      // Find competition_id and season_id
      const compRow = await pool.query(
        'SELECT competition_id FROM competitions WHERE name ILIKE $1 LIMIT 1',
        [`%${leagueName}%`]
      );
      const seasonRow = await pool.query(
        `SELECT s.season_id FROM seasons s
         JOIN competitions c ON s.competition_id = c.competition_id
         WHERE c.name ILIKE $1 AND s.is_current = true LIMIT 1`,
        [`%${leagueName}%`]
      );

      const competitionId = compRow.rows[0]?.competition_id || null;
      const seasonId = seasonRow.rows[0]?.season_id || null;

      // Insert top 5 as achievements
      const top5 = scorers.slice(0, 5);
      for (let i = 0; i < top5.length; i++) {
        const scorer = top5[i];
        const playerName = scorer.player?.name;
        const goals = scorer.statistics?.[0]?.goals?.total || 0;

        const personId = await findPersonId(playerName);
        if (!personId) continue;

        try {
          await pool.query(
            `INSERT INTO achievements (person_id, achievement_type, title, description,
                                       competition_id, season_id, year, position, stats, is_major)
             VALUES ($1, 'top_scorer', $2, $3, $4, $5, $6, $7, $8, $9)
             ON CONFLICT DO NOTHING`,
            [
              personId,
              `${leagueName} Top Scorer ${CURRENT_SEASON}/${CURRENT_SEASON + 1}`,
              `${playerName} — ${goals} goals in ${leagueName}`,
              competitionId,
              seasonId,
              CURRENT_SEASON,
              i + 1,
              JSON.stringify({ goals, assists: scorer.statistics?.[0]?.goals?.assists || 0 }),
              i === 0, // only #1 is "major"
            ]
          );
          totalAchievements++;
        } catch (e) { /* skip */ }
      }

      console.log(`   ✅ ${leagueName}: ${top5.length} top scorers`);
      await sleep(7000);
    } catch (err) {
      console.error(`   [ERROR] League ${leagueId}: ${err.message}`);
    }
  }

  console.log(`\n   Total achievements created: ${totalAchievements}`);
}


// ============================================
// SUMMARY
// ============================================
async function showSummary() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  FULL DATABASE SUMMARY');
  console.log(`${'='.repeat(60)}`);

  const tables = [
    'countries', 'stadiums', 'teams', 'competitions', 'seasons',
    'persons', 'contracts', 'matches', 'match_events', 'match_players',
    'standings', 'transfers', 'achievements', 'articles', 'comments',
    'polls', 'poll_votes',
  ];

  for (const table of tables) {
    try {
      const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = result.rows[0].count;
      const status = parseInt(count) > 0 ? '✅' : '⬜';
      console.log(`   ${status} ${table.padEnd(18)} → ${count} rows`);
    } catch (e) {
      console.log(`   ❌ ${table.padEnd(18)} → error`);
    }
  }

  // Breakdowns
  const players = await pool.query("SELECT COUNT(*) as c FROM persons WHERE person_type = 'player'");
  const managers = await pool.query("SELECT COUNT(*) as c FROM persons WHERE person_type = 'manager'");
  const finished = await pool.query("SELECT COUNT(*) as c FROM matches WHERE status = 'finished'");
  const scheduled = await pool.query("SELECT COUNT(*) as c FROM matches WHERE status = 'scheduled'");

  console.log(`\n   Breakdown:`);
  console.log(`      Players:           ${players.rows[0].c}`);
  console.log(`      Managers:          ${managers.rows[0].c}`);
  console.log(`      Finished matches:  ${finished.rows[0].c}`);
  console.log(`      Upcoming matches:  ${scheduled.rows[0].c}`);
}


// ============================================
// MAIN
// ============================================
async function main() {
  console.log('\n⚽ FootyPulse — Full Data Fetch from API-Football v3');
  console.log('='.repeat(60));

  if (!API_KEY) {
    console.error('[ERROR] Missing API_FOOTBALL_KEY in .env file!');
    console.error('   Get your key at: https://www.api-football.com/');
    process.exit(1);
  }

  // Verify teams exist
  const teamCount = await pool.query('SELECT COUNT(*) as c FROM teams');
  if (parseInt(teamCount.rows[0].c) === 0) {
    console.error('[ERROR] No teams found! Run fetchTeamsApiFootball.js first.');
    process.exit(1);
  }

  console.log(`   API: ${BASE_URL}`);
  console.log(`   Season: ${CURRENT_SEASON}`);
  console.log(`   Teams in DB: ${teamCount.rows[0].c}\n`);

  await fetchCompetitionsAndSeasons();
  await fetchStandings();
  await fetchMatches();
  await fetchMatchEvents();
  await fetchTopScorers();
  await showSummary();

  console.log(`\n${'='.repeat(60)}`);
  console.log('  ✅ Full data fetch complete!');
  console.log('  Your FootyPulse database is ready.');
  console.log(`${'='.repeat(60)}\n`);

  await pool.end();
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err);
  pool.end();
  process.exit(1);
});
