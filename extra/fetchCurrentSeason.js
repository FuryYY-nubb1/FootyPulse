// ============================================
// database/fetchCurrentSeason.js
// ============================================
// PURPOSE: Fetch current 2025/26 season data from football-data.org
//          - Adds a second season (2025/26) to existing competitions
//          - Fetches all fixtures with external_id saved
//          - Fetches current standings
//          - Does NOT touch teams/players (already populated by API-Football)
//
// Run AFTER fetchAllApiFootball.js (teams + season 2024 must exist first)
//
// USAGE:   node database/fetchCurrentSeason.js
// FREE TIER: 10 requests/min -- script auto-waits
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

// football-data.org competition codes mapped to our competition names
// (names must match what fetchAllApiFootball.js inserted)
const LEAGUES = [
  { code: 'PL',  name: 'Premier League'        },
  { code: 'PD',  name: 'La Liga'               },
  { code: 'BL1', name: 'Bundesliga'            },
  { code: 'SA',  name: 'Serie A'               },
  { code: 'FL1', name: 'Ligue 1'              },
  { code: 'CL',  name: 'UEFA Champions League' },
];

// ============================================
// Helpers
// ============================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let lastRequest = 0;
async function apiFetch(endpoint) {
  // football-data.org free tier: 10 requests/min = 1 every 6 seconds
  const now = Date.now();
  const gap = now - lastRequest;
  if (gap < 6500) await sleep(6500 - gap);
  lastRequest = Date.now();

  const url = `${BASE_URL}${endpoint}`;
  console.log(`   [FETCH] ${url}`);

  const response = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
  if (response.status === 429) {
    console.log('   [WAIT] Rate limited -- waiting 65s...');
    await sleep(65000);
    return apiFetch(endpoint);
  }
  if (!response.ok) throw new Error(`API ${response.status}: ${response.statusText}`);
  return response.json();
}

function mapStatus(apiStatus) {
  const map = {
    'SCHEDULED': 'scheduled', 'TIMED': 'scheduled',
    'IN_PLAY':   'live',      'PAUSED': 'live',
    'FINISHED':  'finished',
    'POSTPONED': 'postponed', 'SUSPENDED': 'postponed',
    'CANCELLED': 'cancelled',
  };
  return map[apiStatus] || 'scheduled';
}

async function findTeamId(name) {
  if (!name) return null;
  let r = await pool.query(
    `SELECT team_id FROM teams WHERE name = $1 OR short_name = $1 LIMIT 1`, [name]
  );
  if (r.rows.length > 0) return r.rows[0].team_id;
  r = await pool.query(
    `SELECT team_id FROM teams WHERE name ILIKE $1 OR short_name ILIKE $1 LIMIT 1`,
    [`%${name}%`]
  );
  return r.rows[0]?.team_id || null;
}

// ============================================
// SECTION 1: Seasons for 2025/26
// Creates a 2025/26 season row for each competition
// ============================================
async function fetchSeasons() {
  console.log('\n' + '='.repeat(60));
  console.log('  SECTION 1: Create 2025/26 Seasons');
  console.log('='.repeat(60));

  let created = 0;

  for (const league of LEAGUES) {
    try {
      const data = await apiFetch(`/competitions/${league.code}`);

      // Find our competition_id by name
      const compRow = await pool.query(
        'SELECT competition_id FROM competitions WHERE name ILIKE $1 LIMIT 1',
        [`%${league.name}%`]
      );

      if (compRow.rows.length === 0) {
        console.log(`   [SKIP] Competition not found in DB: ${league.name}`);
        continue;
      }

      const competitionId = compRow.rows[0].competition_id;
      const currentSeason = data.currentSeason;

      if (!currentSeason) { console.log(`   [SKIP] No current season for ${league.name}`); continue; }

      const startYear = currentSeason.startDate?.substring(0, 4);
      const endYear   = currentSeason.endDate?.substring(0, 4);
      const seasonName = startYear && endYear ? `${startYear}/${endYear.slice(-2)}` : '2025/26';

      // Mark any old is_current = true seasons as false first
      await pool.query(
        'UPDATE seasons SET is_current = false WHERE competition_id = $1 AND is_current = true AND name != $2',
        [competitionId, seasonName]
      );

      await pool.query(
        `INSERT INTO seasons (competition_id, name, start_date, end_date, is_current)
         VALUES ($1,$2,$3,$4,true)
         ON CONFLICT (competition_id, name) DO UPDATE SET
           is_current = true,
           start_date = EXCLUDED.start_date,
           end_date   = EXCLUDED.end_date`,
        [competitionId, seasonName, currentSeason.startDate, currentSeason.endDate]
      );

      console.log(`   [OK] ${league.name} -> ${seasonName}`);
      created++;

    } catch (err) {
      console.error(`   [ERROR] ${league.name}: ${err.message}`);
    }
  }

  console.log(`\n   Seasons created/updated: ${created}`);
}

// ============================================
// SECTION 2: Fixtures for 2025/26 with external_id
// ============================================
async function fetchFixtures() {
  console.log('\n' + '='.repeat(60));
  console.log('  SECTION 2: Fixtures (2025/26)');
  console.log('='.repeat(60));

  let totalMatches = 0;

  for (const league of LEAGUES) {
    try {
      const data = await apiFetch(`/competitions/${league.code}/matches`);
      const matches = data.matches || [];

      console.log(`\n   ${league.name}: ${matches.length} matches`);

      // Find the current (2025/26) season_id
      const compRow = await pool.query(
        'SELECT competition_id FROM competitions WHERE name ILIKE $1 LIMIT 1',
        [`%${league.name}%`]
      );
      if (compRow.rows.length === 0) { console.log(`   [SKIP] Competition not in DB`); continue; }

      const seasonRow = await pool.query(
        'SELECT season_id FROM seasons WHERE competition_id = $1 AND is_current = true LIMIT 1',
        [compRow.rows[0].competition_id]
      );
      if (seasonRow.rows.length === 0) { console.log(`   [SKIP] No current season`); continue; }

      const seasonId = seasonRow.rows[0].season_id;

      for (const match of matches) {
        const homeTeamId = await findTeamId(match.homeTeam?.name);
        const awayTeamId = await findTeamId(match.awayTeam?.name);
        if (!homeTeamId || !awayTeamId) continue;

        const matchDate  = match.utcDate?.substring(0, 10);
        const kickOff    = match.utcDate?.substring(11, 16);
        const status     = mapStatus(match.status);
        const homeScore  = match.score?.fullTime?.home ?? null;
        const awayScore  = match.score?.fullTime?.away ?? null;
        const homePen    = match.score?.penalties?.home ?? null;
        const awayPen    = match.score?.penalties?.away ?? null;

        try {
          // Save football-data.org match id as external_id prefixed with "fd-"
          // to distinguish from API-Football IDs
          await pool.query(
            `INSERT INTO matches (season_id, matchday, stage_name, home_team_id, away_team_id,
                                  home_score, away_score, home_penalties, away_penalties,
                                  match_date, kick_off_time, status, external_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
             ON CONFLICT DO NOTHING`,
            [
              seasonId,
              match.matchday || null,
              match.stage || null,
              homeTeamId, awayTeamId,
              homeScore, awayScore, homePen, awayPen,
              matchDate, kickOff ? `${kickOff}:00` : null,
              status,
              `fd-${match.id}`, // prefix fd- so we know the source
            ]
          );
          totalMatches++;
        } catch (e) { /* skip duplicates */ }
      }

    } catch (err) {
      console.error(`   [ERROR] ${league.name}: ${err.message}`);
    }
  }

  console.log(`\n   Total matches inserted: ${totalMatches}`);
}

// ============================================
// SECTION 3: Standings for 2025/26
// ============================================
async function fetchStandings() {
  console.log('\n' + '='.repeat(60));
  console.log('  SECTION 3: Standings (2025/26)');
  console.log('='.repeat(60));

  // UCL doesn't have simple standings on free tier
  const standingsLeagues = LEAGUES.filter(l => l.code !== 'CL');
  let totalRows = 0;

  for (const league of standingsLeagues) {
    try {
      const data = await apiFetch(`/competitions/${league.code}/standings`);
      const allStandings = data.standings || [];

      const compRow = await pool.query(
        'SELECT competition_id FROM competitions WHERE name ILIKE $1 LIMIT 1',
        [`%${league.name}%`]
      );
      if (compRow.rows.length === 0) continue;

      const seasonRow = await pool.query(
        'SELECT season_id FROM seasons WHERE competition_id = $1 AND is_current = true LIMIT 1',
        [compRow.rows[0].competition_id]
      );
      if (seasonRow.rows.length === 0) continue;

      const seasonId = seasonRow.rows[0].season_id;

      // Clear old standings for this season
      await pool.query('DELETE FROM standings WHERE season_id = $1', [seasonId]);

      for (const table of allStandings) {
        if (table.type !== 'TOTAL') continue; // only overall standings

        for (const row of table.table || []) {
          const teamId = await findTeamId(row.team?.name);
          if (!teamId) { console.log(`   [SKIP] Team not found: ${row.team?.name}`); continue; }

          const form = row.form ? row.form.replace(/,/g, '').substring(0, 5) : null;

          await pool.query(
            `INSERT INTO standings (season_id, team_id, position, played, won, drawn, lost,
                                    goals_for, goals_against, points, form)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
             ON CONFLICT (season_id, group_name, team_id) DO UPDATE SET
               position=EXCLUDED.position, played=EXCLUDED.played, won=EXCLUDED.won,
               drawn=EXCLUDED.drawn, lost=EXCLUDED.lost, goals_for=EXCLUDED.goals_for,
               goals_against=EXCLUDED.goals_against, points=EXCLUDED.points, form=EXCLUDED.form`,
            [seasonId, teamId, row.position, row.playedGames, row.won, row.draw, row.lost,
             row.goalsFor, row.goalsAgainst, row.points, form]
          );
          totalRows++;
        }
      }

      console.log(`   [OK] ${league.name}: standings loaded`);

    } catch (err) {
      console.error(`   [ERROR] ${league.name}: ${err.message}`);
    }
  }

  console.log(`\n   Total standing rows: ${totalRows}`);
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('\nFootyPulse -- Fetch Current Season 2025/26 from football-data.org');
  console.log('='.repeat(60));

  if (!API_KEY) {
    console.error('[ERROR] Missing FOOTBALL_DATA_API_KEY in .env');
    console.error('   Get your key at: https://www.football-data.org/client/register');
    process.exit(1);
  }

  const teamCount = await pool.query('SELECT COUNT(*) as c FROM teams');
  if (parseInt(teamCount.rows[0].c) === 0) {
    console.error('[ERROR] No teams found. Run fetchTeamsApiFootball.js first.');
    process.exit(1);
  }

  console.log(`   Teams in DB: ${teamCount.rows[0].c}`);
  console.log('   This adds 2025/26 season ON TOP of existing 2024/25 data\n');

  await fetchSeasons();
  await fetchFixtures();
  await fetchStandings();

  // Summary
  const seasons = await pool.query('SELECT COUNT(*) as c FROM seasons');
  const matches = await pool.query('SELECT COUNT(*) as c FROM matches');
  const live    = await pool.query("SELECT COUNT(*) as c FROM matches WHERE status='scheduled'");

  console.log('\n  DATABASE SUMMARY');
  console.log('='.repeat(60));
  console.log(`   Seasons total:         ${seasons.rows[0].c}`);
  console.log(`   Matches total:         ${matches.rows[0].c}`);
  console.log(`   Scheduled 2025/26:     ${live.rows[0].c}`);
  console.log('='.repeat(60));

  await pool.end();
  console.log('\nDone.\n');
}

main().catch(err => { console.error('[FATAL]', err); pool.end(); process.exit(1); });
