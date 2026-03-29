// ============================================
// database/fetchAllApiFootball.js
// ============================================
// PURPOSE: Fetch historical data from API-Football v3 (season 2024)
//          - Competitions & Seasons
//          - Standings
//          - Fixtures with scores + external_id saved
//          - Match Stats (possession, shots, etc.)
//          - Top Scorers -> Achievements
//
// CHANGES FROM ORIGINAL:
//   - external_id is now saved on every match row
//   - match stats (home_stats/away_stats) are fetched per finished match
//   - Section 4 (old events-by-date) removed -- use fetchEventsAndLineups.js instead
//
// USAGE:   node database/fetchAllApiFootball.js
// FREE TIER: 100 requests/day
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

const LEAGUES = [
  { id: 39,  name: 'Premier League',        shortName: 'PL',  type: 'league',        format: 'league',         countryCode: 'ENG' },
  { id: 140, name: 'La Liga',               shortName: 'LL',  type: 'league',        format: 'league',         countryCode: 'ESP' },
  { id: 78,  name: 'Bundesliga',            shortName: 'BL',  type: 'league',        format: 'league',         countryCode: 'GER' },
  { id: 135, name: 'Serie A',               shortName: 'SA',  type: 'league',        format: 'league',         countryCode: 'ITA' },
  { id: 61,  name: 'Ligue 1',              shortName: 'L1',  type: 'league',        format: 'league',         countryCode: 'FRA' },
  { id: 2,   name: 'UEFA Champions League', shortName: 'UCL', type: 'international', format: 'group_knockout', countryCode: null  },
];

// Season 2024 = 2024/25 season -- fully supported on free tier
const CURRENT_SEASON = 2024;

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
    console.log(`   [WARN] API error: ${JSON.stringify(data.errors)}`);
  }
  return data;
}

function mapStatus(apiStatus) {
  const map = {
    'TBD': 'scheduled', 'NS': 'scheduled',
    '1H': 'live', 'HT': 'live', '2H': 'live', 'ET': 'live', 'BT': 'live', 'P': 'live',
    'FT': 'finished', 'AET': 'finished', 'PEN': 'finished', 'AWD': 'finished', 'WO': 'finished',
    'PST': 'postponed', 'SUSP': 'postponed', 'INT': 'postponed',
    'CANC': 'cancelled', 'ABD': 'cancelled',
  };
  return map[apiStatus] || 'scheduled';
}

async function findTeamId(teamName) {
  if (!teamName) return null;
  let r = await pool.query(
    `SELECT team_id FROM teams WHERE name = $1 OR short_name = $1 LIMIT 1`, [teamName]
  );
  if (r.rows.length > 0) return r.rows[0].team_id;
  r = await pool.query(
    `SELECT team_id FROM teams WHERE name ILIKE $1 OR short_name ILIKE $1 LIMIT 1`,
    [`%${teamName}%`]
  );
  return r.rows[0]?.team_id || null;
}

async function findPersonId(name) {
  if (!name) return null;
  const r = await pool.query(
    `SELECT person_id FROM persons WHERE display_name ILIKE $1 LIMIT 1`, [`%${name}%`]
  );
  return r.rows[0]?.person_id || null;
}

function extractMatchday(round) {
  if (!round) return null;
  const match = round.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// ============================================
// SECTION 1: Competitions & Seasons
// ============================================
async function fetchCompetitionsAndSeasons() {
  console.log('\n' + '='.repeat(60));
  console.log('  SECTION 1: Competitions & Seasons');
  console.log('='.repeat(60));

  let created = 0;

  for (const league of LEAGUES) {
    try {
      const data = await apiFetch(`/leagues?id=${league.id}`);
      const leagueData = data.response?.[0];
      if (!leagueData) { console.log(`   [WARN] No data for ${league.name}`); continue; }

      let countryId = null;
      if (league.countryCode) {
        const r = await pool.query('SELECT country_id FROM countries WHERE code = $1 LIMIT 1', [league.countryCode]);
        if (r.rows.length > 0) countryId = r.rows[0].country_id;
      }

      const compResult = await pool.query(
        `INSERT INTO competitions (name, short_name, competition_type, country_id, level, season_format, logo_url)
         VALUES ($1,$2,$3,$4,1,$5,$6) ON CONFLICT DO NOTHING RETURNING competition_id`,
        [leagueData.league.name || league.name, league.shortName, league.type, countryId, league.format, leagueData.league.logo || null]
      );

      let competitionId = compResult.rows[0]?.competition_id;
      if (!competitionId) {
        const ex = await pool.query('SELECT competition_id FROM competitions WHERE name = $1 LIMIT 1', [leagueData.league.name || league.name]);
        competitionId = ex.rows[0]?.competition_id;
      } else {
        created++;
      }

      if (competitionId && leagueData.seasons) {
        // Insert the 2024 season specifically (not just current, since free tier = 2024)
        const season2024 = leagueData.seasons.find(s => s.year === CURRENT_SEASON);
        if (season2024) {
          const seasonName = `${season2024.year}/${(season2024.year + 1).toString().slice(-2)}`;
          await pool.query(
            `INSERT INTO seasons (competition_id, name, start_date, end_date, is_current)
             VALUES ($1,$2,$3,$4,true)
             ON CONFLICT (competition_id, name) DO UPDATE SET is_current = true`,
            [competitionId, seasonName, season2024.start || `${season2024.year}-08-01`, season2024.end || `${season2024.year + 1}-06-30`]
          );
          console.log(`   [OK] ${league.name} -> Season ${seasonName}`);
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
// SECTION 2: Standings
// ============================================
async function fetchStandings() {
  console.log('\n' + '='.repeat(60));
  console.log('  SECTION 2: Standings');
  console.log('='.repeat(60));

  const leagueIds = [39, 140, 78, 135, 61];
  let totalRows = 0;

  for (const leagueId of leagueIds) {
    try {
      const data = await apiFetch(`/standings?league=${leagueId}&season=${CURRENT_SEASON}`);
      const standings = data.response?.[0]?.league?.standings || [];

      const leagueName = LEAGUES.find(l => l.id === leagueId)?.name;
      const seasonRow = await pool.query(
        `SELECT s.season_id FROM seasons s
         JOIN competitions c ON s.competition_id = c.competition_id
         WHERE c.name ILIKE $1 AND s.is_current = true LIMIT 1`,
        [`%${leagueName}%`]
      );
      if (seasonRow.rows.length === 0) { console.log(`   [WARN] No season for league ${leagueId}`); continue; }

      const seasonId = seasonRow.rows[0].season_id;
      await pool.query('DELETE FROM standings WHERE season_id = $1', [seasonId]);

      for (const group of standings) {
        for (const row of group) {
          const teamId = await findTeamId(row.team?.name);
          if (!teamId) continue;
          const form = row.form ? row.form.substring(0, 5) : null;
          await pool.query(
            `INSERT INTO standings (season_id, team_id, position, played, won, drawn, lost,
                                    goals_for, goals_against, points, form, group_name)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
             ON CONFLICT (season_id, group_name, team_id) DO UPDATE SET
               position=EXCLUDED.position, played=EXCLUDED.played, won=EXCLUDED.won,
               drawn=EXCLUDED.drawn, lost=EXCLUDED.lost, goals_for=EXCLUDED.goals_for,
               goals_against=EXCLUDED.goals_against, points=EXCLUDED.points, form=EXCLUDED.form`,
            [seasonId, teamId, row.rank, row.all?.played||0, row.all?.win||0, row.all?.draw||0,
             row.all?.lose||0, row.all?.goals?.for||0, row.all?.goals?.against||0,
             row.points||0, form, row.group||null]
          );
          totalRows++;
        }
      }

      console.log(`   [OK] League ${leagueId}: standings loaded`);
      await sleep(7000);
    } catch (err) {
      console.error(`   [ERROR] League ${leagueId}: ${err.message}`);
    }
  }

  console.log(`\n   Total standing rows: ${totalRows}`);
}

// ============================================
// SECTION 3: Fixtures (Matches) -- saves external_id
// ============================================
async function fetchMatches() {
  console.log('\n' + '='.repeat(60));
  console.log('  SECTION 3: Fixtures (Matches)');
  console.log('='.repeat(60));

  let totalMatches = 0;

  for (const league of LEAGUES) {
    try {
      const data = await apiFetch(`/fixtures?league=${league.id}&season=${CURRENT_SEASON}`);
      const fixtures = data.response || [];
      console.log(`\n   ${league.name}: ${fixtures.length} fixtures`);

      const seasonRow = await pool.query(
        `SELECT s.season_id FROM seasons s
         JOIN competitions c ON s.competition_id = c.competition_id
         WHERE c.name ILIKE $1 AND s.is_current = true LIMIT 1`,
        [`%${league.name}%`]
      );
      if (seasonRow.rows.length === 0) { console.log(`   [WARN] No season for ${league.name}`); continue; }

      const seasonId = seasonRow.rows[0].season_id;

      for (const item of fixtures) {
        const fixture = item.fixture;
        const teams = item.teams;
        const goals = item.goals;
        const score = item.score;

        const homeTeamId = await findTeamId(teams?.home?.name);
        const awayTeamId = await findTeamId(teams?.away?.name);
        if (!homeTeamId || !awayTeamId) continue;

        const matchDate = fixture.date ? fixture.date.substring(0, 10) : null;
        const kickOffTime = fixture.date ? fixture.date.substring(11, 16) : null;
        const status = mapStatus(fixture.status?.short);

        // Stadium lookup
        let stadiumId = null;
        if (fixture.venue?.name) {
          const vr = await pool.query('SELECT stadium_id FROM stadiums WHERE name ILIKE $1 LIMIT 1', [`%${fixture.venue.name}%`]);
          if (vr.rows.length > 0) stadiumId = vr.rows[0].stadium_id;
        }

        // Referee lookup
        let refereeId = null;
        if (fixture.referee) {
          refereeId = await findPersonId(fixture.referee.split(',')[0]);
        }

        try {
          // KEY CHANGE: save fixture.id as external_id
          await pool.query(
            `INSERT INTO matches (season_id, matchday, home_team_id, away_team_id,
                                  home_score, away_score, home_penalties, away_penalties,
                                  match_date, kick_off_time, stadium_id, referee_id,
                                  status, stage_name, group_name, external_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
             ON CONFLICT DO NOTHING`,
            [
              seasonId,
              item.league?.round ? extractMatchday(item.league.round) : null,
              homeTeamId, awayTeamId,
              goals?.home ?? null, goals?.away ?? null,
              score?.penalty?.home ?? null, score?.penalty?.away ?? null,
              matchDate, kickOffTime ? `${kickOffTime}:00` : null,
              stadiumId, refereeId, status,
              item.league?.round || null, null,
              String(fixture.id), // external_id from API-Football
            ]
          );
          totalMatches++;
        } catch (e) { /* skip duplicates */ }
      }

      await sleep(7000);
    } catch (err) {
      console.error(`   [ERROR] ${league.name}: ${err.message}`);
    }
  }

  console.log(`\n   Total matches inserted: ${totalMatches}`);
}

// ============================================
// SECTION 4: Match Stats (possession, shots, etc.)
// Fetches stats for recent finished matches only to save API requests
// ============================================
async function fetchMatchStats() {
  console.log('\n' + '='.repeat(60));
  console.log('  SECTION 4: Match Stats');
  console.log('='.repeat(60));

  // Get finished matches that have an external_id but no home_stats yet
  const matches = await pool.query(
    `SELECT match_id, external_id FROM matches
     WHERE status = 'finished'
       AND external_id IS NOT NULL
       AND home_stats IS NULL
     ORDER BY match_date DESC
     LIMIT 60`
  );

  console.log(`   Found ${matches.rows.length} matches needing stats\n`);
  let updated = 0;

  for (const match of matches.rows) {
    try {
      const data = await apiFetch(`/fixtures/statistics?fixture=${match.external_id}`);
      const stats = data.response || [];

      if (stats.length < 2) { continue; } // need both teams

      // Helper to extract a stat value by type name
      const getStat = (teamStats, typeName) => {
        const s = teamStats.statistics?.find(s => s.type === typeName);
        if (!s) return null;
        const v = s.value;
        if (v === null || v === undefined) return null;
        // Possession comes as "52%" -- strip percent
        if (typeof v === 'string' && v.endsWith('%')) return parseFloat(v);
        return typeof v === 'number' ? v : parseInt(v) || null;
      };

      const homeTeamStats = stats[0];
      const awayTeamStats = stats[1];

      const homeStats = {
        possession:       getStat(homeTeamStats, 'Ball Possession'),
        shots:            getStat(homeTeamStats, 'Total Shots'),
        shots_on_target:  getStat(homeTeamStats, 'Shots on Goal'),
        corners:          getStat(homeTeamStats, 'Corner Kicks'),
        fouls:            getStat(homeTeamStats, 'Fouls'),
        yellow_cards:     getStat(homeTeamStats, 'Yellow Cards'),
        red_cards:        getStat(homeTeamStats, 'Red Cards'),
        passes:           getStat(homeTeamStats, 'Total passes'),
        pass_accuracy:    getStat(homeTeamStats, 'Passes accurate'),
        offsides:         getStat(homeTeamStats, 'Offsides'),
        saves:            getStat(homeTeamStats, 'Goalkeeper Saves'),
      };

      const awayStats = {
        possession:       getStat(awayTeamStats, 'Ball Possession'),
        shots:            getStat(awayTeamStats, 'Total Shots'),
        shots_on_target:  getStat(awayTeamStats, 'Shots on Goal'),
        corners:          getStat(awayTeamStats, 'Corner Kicks'),
        fouls:            getStat(awayTeamStats, 'Fouls'),
        yellow_cards:     getStat(awayTeamStats, 'Yellow Cards'),
        red_cards:        getStat(awayTeamStats, 'Red Cards'),
        passes:           getStat(awayTeamStats, 'Total passes'),
        pass_accuracy:    getStat(awayTeamStats, 'Passes accurate'),
        offsides:         getStat(awayTeamStats, 'Offsides'),
        saves:            getStat(awayTeamStats, 'Goalkeeper Saves'),
      };

      await pool.query(
        `UPDATE matches SET home_stats = $1, away_stats = $2 WHERE match_id = $3`,
        [JSON.stringify(homeStats), JSON.stringify(awayStats), match.match_id]
      );
      updated++;
      console.log(`   [OK] match_id ${match.match_id} stats saved`);

      await sleep(4000);
    } catch (err) {
      console.log(`   [ERROR] fixture ${match.external_id}: ${err.message}`);
    }
  }

  console.log(`\n   Match stats updated: ${updated}`);
}

// ============================================
// SECTION 5: Top Scorers -> Achievements
// ============================================
async function fetchTopScorers() {
  console.log('\n' + '='.repeat(60));
  console.log('  SECTION 5: Top Scorers');
  console.log('='.repeat(60));

  const leagueIds = [39, 140, 78, 135, 61];
  let total = 0;

  for (const leagueId of leagueIds) {
    try {
      const data = await apiFetch(`/players/topscorers?league=${leagueId}&season=${CURRENT_SEASON}`);
      const scorers = data.response || [];
      const leagueName = LEAGUES.find(l => l.id === leagueId)?.name;

      const compRow = await pool.query('SELECT competition_id FROM competitions WHERE name ILIKE $1 LIMIT 1', [`%${leagueName}%`]);
      const competitionId = compRow.rows[0]?.competition_id || null;

      for (const scorer of scorers.slice(0, 10)) {
        const playerName = scorer.player?.name;
        const goals = scorer.statistics?.[0]?.goals?.total || 0;
        const assists = scorer.statistics?.[0]?.goals?.assists || 0;
        if (!playerName || goals === 0) continue;

        const personId = await findPersonId(playerName);
        if (!personId || !competitionId) continue;

        await pool.query(
          `INSERT INTO achievements (person_id, achievement_type, title, description, competition_id, year, is_major)
           VALUES ($1,'top_scorer',$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
          [personId, `Top Scorer - ${leagueName}`,
           `${goals} goals, ${assists} assists in ${CURRENT_SEASON}/${CURRENT_SEASON+1}`,
           competitionId, CURRENT_SEASON + 1, goals >= 15]
        );
        total++;
      }

      await sleep(7000);
    } catch (err) {
      console.error(`   [ERROR] League ${leagueId}: ${err.message}`);
    }
  }

  console.log(`\n   Scorers processed: ${total}`);
}

// ============================================
// Summary
// ============================================
async function showSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('  DATABASE SUMMARY');
  console.log('='.repeat(60));

  const tables = ['competitions', 'seasons', 'matches', 'standings', 'match_events', 'match_players', 'achievements'];
  for (const t of tables) {
    const r = await pool.query(`SELECT COUNT(*) as c FROM ${t}`);
    const status = parseInt(r.rows[0].c) > 0 ? '[OK]' : '[EMPTY]';
    console.log(`   ${status} ${t.padEnd(16)} -> ${r.rows[0].c} rows`);
  }

  const finished  = await pool.query("SELECT COUNT(*) as c FROM matches WHERE status='finished'");
  const scheduled = await pool.query("SELECT COUNT(*) as c FROM matches WHERE status='scheduled'");
  const withStats = await pool.query("SELECT COUNT(*) as c FROM matches WHERE home_stats IS NOT NULL");
  const withExtId = await pool.query("SELECT COUNT(*) as c FROM matches WHERE external_id IS NOT NULL");
  console.log(`\n   Finished matches:      ${finished.rows[0].c}`);
  console.log(`   Scheduled matches:     ${scheduled.rows[0].c}`);
  console.log(`   Matches with stats:    ${withStats.rows[0].c}`);
  console.log(`   Matches with ext ID:   ${withExtId.rows[0].c}`);
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('\nFootyPulse -- Full Data Fetch from API-Football v3 (Season 2024)');
  console.log('='.repeat(60));

  if (!API_KEY) {
    console.error('[ERROR] Missing API_FOOTBALL_KEY in .env');
    process.exit(1);
  }

  const teamCount = await pool.query('SELECT COUNT(*) as c FROM teams');
  if (parseInt(teamCount.rows[0].c) === 0) {
    console.error('[ERROR] No teams found. Run fetchTeamsApiFootball.js first.');
    process.exit(1);
  }

  console.log(`   Season: ${CURRENT_SEASON} (${CURRENT_SEASON}/${CURRENT_SEASON+1})`);
  console.log(`   Teams in DB: ${teamCount.rows[0].c}\n`);

  await fetchCompetitionsAndSeasons();
  await fetchStandings();
  await fetchMatches();
  await fetchMatchStats();
  await fetchTopScorers();
  await showSummary();

  await pool.end();
  console.log('\nDone.\n');
}

main().catch(err => { console.error('[FATAL]', err); pool.end(); process.exit(1); });
