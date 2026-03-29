// ============================================
// database/fetchAll.js
// ============================================
// PURPOSE: Fetch FULL football data from Football-Data.org API
//          - Competitions & Seasons
//          - Matches & Match Events
//          - Standings (League Tables)
//          - Top Scorers
//          - Detailed Player & Manager info
//
// SETUP:
//   1. Get a FREE API key at: https://www.football-data.org/client/register
//   2. Add to .env:  FOOTBALL_DATA_API_KEY=your_key_here
//   3. Run fetchTeams.js FIRST (to populate teams & basic squads)
//
// USAGE:
//   node database/fetchAll.js
//
// FREE TIER: 10 requests/min -- script auto-waits between requests
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

// -- Leagues to fetch --
const LEAGUES = [
  { code: 'PL',  name: 'Premier League',       shortName: 'PL',  type: 'league', format: 'league',         countryCode: 'ENG' },
  { code: 'PD',  name: 'La Liga',              shortName: 'LL',  type: 'league', format: 'league',         countryCode: 'ESP' },
  { code: 'BL1', name: 'Bundesliga',            shortName: 'BL',  type: 'league', format: 'league',         countryCode: 'GER' },
  { code: 'SA',  name: 'Serie A',               shortName: 'SA',  type: 'league', format: 'league',         countryCode: 'ITA' },
  { code: 'FL1', name: 'Ligue 1',               shortName: 'L1',  type: 'league', format: 'league',         countryCode: 'FRA' },
  { code: 'CL',  name: 'UEFA Champions League', shortName: 'UCL', type: 'international', format: 'group_knockout', countryCode: null },
];

// -- Helpers --
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let requestCount = 0;
async function apiFetch(endpoint) {
  // Rate limit: max 10 requests per minute
  requestCount++;
  if (requestCount % 9 === 0) {
    console.log('   [WAIT] Rate limit pause (60s)...');
    await sleep(62000);
  }

  const url = `${BASE_URL}${endpoint}`;
  console.log(`   [FETCH] ${url}`);

  const response = await fetch(url, {
    headers: { 'X-Auth-Token': API_KEY },
  });

  if (response.status === 429) {
    console.log('   [WAIT] Rate limited -- waiting 65 seconds...');
    await sleep(65000);
    requestCount = 0;
    return apiFetch(endpoint);
  }

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText} -- ${endpoint}`);
  }

  return response.json();
}

// -- Map API position to schema position --
function mapPosition(pos) {
  const map = {
    'Goalkeeper': 'GK', 'Centre-Back': 'CB', 'Left-Back': 'LB', 'Right-Back': 'RB',
    'Defensive Midfield': 'CDM', 'Central Midfield': 'CM', 'Attacking Midfield': 'CAM',
    'Left Winger': 'LW', 'Right Winger': 'RW', 'Centre-Forward': 'ST',
    'Left Midfield': 'LW', 'Right Midfield': 'RW',
    'Defence': 'CB', 'Midfield': 'CM', 'Offence': 'ST',
  };
  return map[pos] || null;
}

// -- Map match status --
function mapStatus(apiStatus) {
  const map = {
    'SCHEDULED': 'scheduled', 'TIMED': 'scheduled', 'IN_PLAY': 'live',
    'PAUSED': 'live', 'FINISHED': 'finished', 'POSTPONED': 'postponed',
    'CANCELLED': 'cancelled', 'SUSPENDED': 'postponed', 'AWARDED': 'finished',
  };
  return map[apiStatus] || 'scheduled';
}

// -- Map event type --
function mapEventType(type, detail) {
  if (type === 'GOAL') {
    if (detail === 'OWN') return 'own_goal';
    if (detail === 'PENALTY') return 'penalty';
    return 'goal';
  }
  if (type === 'CARD') {
    if (detail === 'YELLOW') return 'yellow';
    if (detail === 'YELLOW_RED') return 'second_yellow';
    if (detail === 'RED') return 'red';
    return 'yellow';
  }
  if (type === 'SUBSTITUTION') return 'sub';
  if (type === 'VAR') return 'var';
  if (type === 'PENALTY_MISSED') return 'penalty_miss';
  return null;
}

// -- Find team_id by name (fuzzy match) --
async function findTeamId(teamName) {
  if (!teamName) return null;
  const result = await pool.query(
    `SELECT team_id FROM teams WHERE name = $1 OR short_name = $1 LIMIT 1`,
    [teamName]
  );
  if (result.rows.length > 0) return result.rows[0].team_id;

  // Try partial match
  const partial = await pool.query(
    `SELECT team_id FROM teams WHERE name ILIKE $1 OR short_name ILIKE $1 LIMIT 1`,
    [`%${teamName}%`]
  );
  return partial.rows.length > 0 ? partial.rows[0].team_id : null;
}

// -- Find person_id by name --
async function findPersonId(name) {
  if (!name) return null;
  const result = await pool.query(
    `SELECT person_id FROM persons WHERE display_name ILIKE $1 LIMIT 1`,
    [`%${name}%`]
  );
  return result.rows.length > 0 ? result.rows[0].person_id : null;
}

// -- Get or create country --
async function getOrCreateCountry(name, code, confederation) {
  if (!code) return null;
  const existing = await pool.query('SELECT country_id FROM countries WHERE code = $1', [code]);
  if (existing.rows.length > 0) return existing.rows[0].country_id;

  const result = await pool.query(
    `INSERT INTO countries (name, code, confederation) VALUES ($1, $2, $3)
     ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING country_id`,
    [name, code, confederation || 'UEFA']
  );
  return result.rows[0].country_id;
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
      const data = await apiFetch(`/competitions/${league.code}`);

      // Get country_id
      let countryId = null;
      if (league.countryCode) {
        countryId = await getOrCreateCountry(
          data.area?.name || league.name,
          league.countryCode,
          'UEFA'
        );
      }

      // Insert competition
      const compResult = await pool.query(
        `INSERT INTO competitions (name, short_name, competition_type, country_id, level, season_format, logo_url)
         VALUES ($1, $2, $3, $4, 1, $5, $6)
         ON CONFLICT DO NOTHING
         RETURNING competition_id`,
        [
          data.name || league.name,
          league.shortName,
          league.type,
          countryId,
          league.format,
          data.emblem || null,
        ]
      );

      let competitionId;
      if (compResult.rows.length > 0) {
        competitionId = compResult.rows[0].competition_id;
        console.log(`   [OK] Created competition: ${league.name}`);
        created++;
      } else {
        const existing = await pool.query(
          'SELECT competition_id FROM competitions WHERE name = $1', [data.name || league.name]
        );
        competitionId = existing.rows.length > 0 ? existing.rows[0].competition_id : null;
        console.log(`   [SKIP] Competition exists: ${league.name}`);
      }

      // Insert current season
      if (competitionId && data.currentSeason) {
        const season = data.currentSeason;
        const seasonName = season.startDate?.substring(0, 4) + '/' +
          (parseInt(season.startDate?.substring(0, 4)) + 1).toString().slice(-2);

        await pool.query(
          `INSERT INTO seasons (competition_id, name, start_date, end_date, is_current)
           VALUES ($1, $2, $3, $4, true)
           ON CONFLICT (competition_id, name) DO UPDATE SET is_current = true
           RETURNING season_id`,
          [competitionId, seasonName || '2024/25', season.startDate, season.endDate]
        );
        console.log(`      Season: ${seasonName}`);
      }

      await sleep(3000);
    } catch (err) {
      console.error(`   [ERROR] Error with ${league.name}: ${err.message}`);
    }
  }

  console.log(`\n   Competitions created: ${created}`);
}


// ============================================
// SECTION 2: STANDINGS (League Tables)
// ============================================
async function fetchStandings() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 2: Standings (League Tables)');
  console.log(`${'='.repeat(60)}`);

  // Only fetch for league competitions (not UCL group stage on free tier)
  const leagueCodes = ['PL', 'PD', 'BL1', 'SA', 'FL1'];
  let totalRows = 0;

  for (const code of leagueCodes) {
    try {
      const data = await apiFetch(`/competitions/${code}/standings`);
      const standings = data.standings || [];

      // Find season_id
      const compName = data.competition?.name;
      const seasonRow = await pool.query(
        `SELECT s.season_id FROM seasons s
         JOIN competitions c ON s.competition_id = c.competition_id
         WHERE c.name = $1 AND s.is_current = true LIMIT 1`,
        [compName]
      );

      if (seasonRow.rows.length === 0) {
        console.log(`   [WARN] No season found for ${compName}, skipping standings`);
        continue;
      }

      const seasonId = seasonRow.rows[0].season_id;

      // Clear existing standings for this season
      await pool.query('DELETE FROM standings WHERE season_id = $1', [seasonId]);

      for (const table of standings) {
        if (table.type !== 'TOTAL') continue; // only overall standings

        for (const row of table.table || []) {
          const teamId = await findTeamId(row.team?.name);
          if (!teamId) {
            console.log(`      [WARN] Team not found: ${row.team?.name}`);
            continue;
          }

          // Extract last 5 results for form
          const form = row.form || null; // e.g. "W,W,D,L,W"
          const formClean = form ? form.replace(/,/g, '').substring(0, 5) : null;

          await pool.query(
            `INSERT INTO standings (season_id, team_id, position, played, won, drawn, lost,
                                    goals_for, goals_against, points, form)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (season_id, group_name, team_id) DO UPDATE SET
               position = EXCLUDED.position, played = EXCLUDED.played,
               won = EXCLUDED.won, drawn = EXCLUDED.drawn, lost = EXCLUDED.lost,
               goals_for = EXCLUDED.goals_for, goals_against = EXCLUDED.goals_against,
               points = EXCLUDED.points, form = EXCLUDED.form`,
            [
              seasonId, teamId, row.position,
              row.playedGames, row.won, row.draw, row.lost,
              row.goalsFor, row.goalsAgainst, row.points, formClean,
            ]
          );
          totalRows++;
        }

        console.log(`   [OK] ${compName}: ${table.table?.length || 0} teams`);
      }

      await sleep(7000);
    } catch (err) {
      console.error(`   [ERROR] Error fetching ${code} standings: ${err.message}`);
    }
  }

  console.log(`\n   Total standing rows: ${totalRows}`);
}


// ============================================
// SECTION 3: MATCHES
// ============================================
async function fetchMatches() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 3: Matches (Recent & Upcoming)');
  console.log(`${'='.repeat(60)}`);

  let totalMatches = 0;

  for (const league of LEAGUES) {
    try {
      // Fetch recent + upcoming matches
      const data = await apiFetch(`/competitions/${league.code}/matches?status=SCHEDULED,FINISHED,IN_PLAY`);
      const matches = data.matches || [];

      // Find season_id
      const compName = data.competition?.name || league.name;
      const seasonRow = await pool.query(
        `SELECT s.season_id FROM seasons s
         JOIN competitions c ON s.competition_id = c.competition_id
         WHERE c.name = $1 AND s.is_current = true LIMIT 1`,
        [compName]
      );

      if (seasonRow.rows.length === 0) {
        console.log(`   [WARN] No season found for ${compName}, skipping`);
        continue;
      }
      const seasonId = seasonRow.rows[0].season_id;

      console.log(`   ${compName}: ${matches.length} matches`);

      // Take last 30 finished + next 15 scheduled (to stay within limits)
      const finished = matches.filter(m => m.status === 'FINISHED').slice(-30);
      const upcoming = matches.filter(m => m.status !== 'FINISHED').slice(0, 15);
      const selected = [...finished, ...upcoming];

      for (const match of selected) {
        const homeTeamId = await findTeamId(match.homeTeam?.name);
        const awayTeamId = await findTeamId(match.awayTeam?.name);

        if (!homeTeamId || !awayTeamId) {
          continue; // skip if teams not in our DB
        }

        // Check if match already exists
        const existingMatch = await pool.query(
          `SELECT match_id FROM matches
           WHERE season_id = $1 AND home_team_id = $2 AND away_team_id = $3 AND match_date = $4`,
          [seasonId, homeTeamId, awayTeamId, match.utcDate?.substring(0, 10)]
        );

        if (existingMatch.rows.length > 0) continue; // skip duplicates

        const homeScore = match.score?.fullTime?.home;
        const awayScore = match.score?.fullTime?.away;
        const homePen = match.score?.penalties?.home;
        const awayPen = match.score?.penalties?.away;

        try {
          await pool.query(
            `INSERT INTO matches (season_id, stage_name, matchday, home_team_id, away_team_id,
                                  home_score, away_score, home_penalties, away_penalties,
                                  match_date, kick_off_time, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
              seasonId,
              match.stage || match.group || `Matchday ${match.matchday}`,
              match.matchday,
              homeTeamId,
              awayTeamId,
              homeScore,
              awayScore,
              homePen,
              awayPen,
              match.utcDate?.substring(0, 10),
              match.utcDate?.substring(11, 16) || null,
              mapStatus(match.status),
            ]
          );
          totalMatches++;
        } catch (insertErr) {
          // Skip constraint violations (duplicate teams etc)
        }
      }

      await sleep(7000);
    } catch (err) {
      console.error(`   [ERROR] Error fetching ${league.name} matches: ${err.message}`);
    }
  }

  console.log(`\n   Total matches inserted: ${totalMatches}`);
}


// ============================================
// SECTION 4: TOP SCORERS -> Updates persons with stats
// ============================================
async function fetchTopScorers() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 4: Top Scorers');
  console.log(`${'='.repeat(60)}`);

  const leagueCodes = ['PL', 'PD', 'BL1', 'SA', 'FL1'];
  let totalScorers = 0;

  for (const code of leagueCodes) {
    try {
      const data = await apiFetch(`/competitions/${code}/scorers?limit=20`);
      const scorers = data.scorers || [];

      console.log(`   ${data.competition?.name}: ${scorers.length} scorers`);

      for (const scorer of scorers) {
        const player = scorer.player;
        if (!player) continue;

        // Try to find existing person
        let personId = await findPersonId(player.name);

        if (!personId) {
          // Create the player if not found
          const nameParts = (player.name || 'Unknown Player').split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ') || nameParts[0];

          let nationalityId = null;
          if (player.nationality) {
            nationalityId = await getOrCreateCountry(
              player.nationality,
              nationalityToCode(player.nationality),
              getConfederation(player.nationality)
            );
          }

          const personResult = await pool.query(
            `INSERT INTO persons (person_type, first_name, last_name, date_of_birth,
                                  nationality_id, primary_position)
             VALUES ('player', $1, $2, $3, $4, $5)
             RETURNING person_id`,
            [firstName, lastName, player.dateOfBirth || null, nationalityId, mapPosition(player.position)]
          );
          personId = personResult.rows[0].person_id;

          // Link to team if available
          if (scorer.team?.name) {
            const teamId = await findTeamId(scorer.team.name);
            if (teamId) {
              await pool.query(
                `INSERT INTO contracts (person_id, team_id, contract_type, start_date, is_current)
                 VALUES ($1, $2, 'player', CURRENT_DATE, true)
                 ON CONFLICT DO NOTHING`,
                [personId, teamId]
              );
            }
          }
        }

        // Create achievement for top scorer
        const compRow = await pool.query(
          'SELECT competition_id FROM competitions WHERE name = $1 LIMIT 1',
          [data.competition?.name]
        );
        const competitionId = compRow.rows.length > 0 ? compRow.rows[0].competition_id : null;

        const goals = scorer.goals || 0;
        const assists = scorer.assists || 0;

        if (goals > 0 && competitionId) {
          await pool.query(
            `INSERT INTO achievements (person_id, achievement_type, title, description,
                                       competition_id, year, is_major)
             VALUES ($1, 'top_scorer', $2, $3, $4, $5, $6)
             ON CONFLICT DO NOTHING`,
            [
              personId,
              `Top Scorer - ${data.competition?.name}`,
              `${goals} goals, ${assists} assists in the current season`,
              competitionId,
              new Date().getFullYear(),
              goals >= 15,
            ]
          );
          totalScorers++;
        }
      }

      await sleep(7000);
    } catch (err) {
      console.error(`   [ERROR] Error fetching ${code} scorers: ${err.message}`);
    }
  }

  console.log(`\n   Scorers processed: ${totalScorers}`);
}


// ============================================
// SECTION 5: DETAILED PLAYER INFO (from /persons endpoint)
// ============================================
async function fetchDetailedPlayerInfo() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 5: Detailed Player & Manager Info');
  console.log(`${'='.repeat(60)}`);

  // Get all teams and re-fetch their squads with full detail
  let updatedPlayers = 0;

  for (const league of LEAGUES) {
    if (league.code === 'CL') continue; // skip UCL (overlaps with league teams)

    try {
      const data = await apiFetch(`/competitions/${league.code}/teams`);
      const teams = data.teams || [];

      console.log(`   ${league.name}: Updating ${teams.length} teams`);

      for (const team of teams) {
        const teamId = await findTeamId(team.name);
        if (!teamId) continue;

        const squad = team.squad || [];
        for (const player of squad) {
          // Find existing person
          const personId = await findPersonId(player.name);
          if (!personId) continue;

          // Update with detailed info (market value, section, etc.)
          await pool.query(
            `UPDATE persons SET
              date_of_birth = COALESCE($1, date_of_birth),
              primary_position = COALESCE($2, primary_position)
            WHERE person_id = $3`,
            [player.dateOfBirth || null, mapPosition(player.position), personId]
          );

          // Update contract jersey number if available
          if (player.shirtNumber) {
            await pool.query(
              `UPDATE contracts SET jersey_number = $1
               WHERE person_id = $2 AND team_id = $3 AND is_current = true`,
              [player.shirtNumber, personId, teamId]
            );
          }

          updatedPlayers++;
        }

        // Update coach info
        if (team.coach) {
          const coachId = await findPersonId(team.coach.name);
          if (coachId) {
            await pool.query(
              `UPDATE persons SET
                date_of_birth = COALESCE($1, date_of_birth)
              WHERE person_id = $2`,
              [team.coach.dateOfBirth || null, coachId]
            );
          }
        }
      }

      await sleep(7000);
    } catch (err) {
      console.error(`   [ERROR] Error updating ${league.name}: ${err.message}`);
    }
  }

  console.log(`\n   Players updated with details: ${updatedPlayers}`);
}


// -- Nationality helpers (same as fetchTeams.js) --
function nationalityToCode(nationality) {
  const map = {
    'England': 'ENG', 'Spain': 'ESP', 'Germany': 'GER', 'France': 'FRA',
    'Italy': 'ITA', 'Portugal': 'POR', 'Brazil': 'BRA', 'Argentina': 'ARG',
    'Netherlands': 'NED', 'Belgium': 'BEL', 'Croatia': 'CRO', 'Uruguay': 'URU',
    'Colombia': 'COL', 'Japan': 'JPN', 'South Korea': 'KOR', 'Nigeria': 'NGA',
    'Senegal': 'SEN', 'Ghana': 'GHA', 'Cameroon': 'CMR', 'Egypt': 'EGY',
    'Morocco': 'MAR', 'Algeria': 'ALG', 'Tunisia': 'TUN', 'Ivory Coast': 'CIV',
    'Mexico': 'MEX', 'USA': 'USA', 'Canada': 'CAN', 'Chile': 'CHI',
    'Ecuador': 'ECU', 'Paraguay': 'PAR', 'Peru': 'PER', 'Venezuela': 'VEN',
    'Scotland': 'SCO', 'Wales': 'WAL', 'Ireland': 'IRL', 'Norway': 'NOR',
    'Sweden': 'SWE', 'Denmark': 'DEN', 'Poland': 'POL', 'Austria': 'AUT',
    'Switzerland': 'SUI', 'Turkey': 'TUR', 'Greece': 'GRE', 'Serbia': 'SRB',
    'Ukraine': 'UKR', 'Australia': 'AUS', 'United States': 'USA',
    'Korea Republic': 'KOR', "Cote d'Ivoire": 'CIV', 'Republic of Ireland': 'IRL',
  };
  return map[nationality] || nationality?.substring(0, 3).toUpperCase() || 'UNK';
}

function getConfederation(nationality) {
  const uefa = ['England', 'Spain', 'Germany', 'France', 'Italy', 'Portugal', 'Netherlands',
    'Belgium', 'Croatia', 'Scotland', 'Wales', 'Ireland', 'Norway', 'Sweden', 'Denmark',
    'Poland', 'Austria', 'Switzerland', 'Turkey', 'Greece', 'Serbia', 'Ukraine',
    'Republic of Ireland'];
  const conmebol = ['Brazil', 'Argentina', 'Uruguay', 'Colombia', 'Chile', 'Ecuador',
    'Paraguay', 'Peru', 'Venezuela'];
  const concacaf = ['Mexico', 'USA', 'United States', 'Canada', 'Jamaica', 'Costa Rica'];
  const afc = ['Japan', 'South Korea', 'Korea Republic', 'Australia', 'Iran', 'Saudi Arabia'];

  if (uefa.includes(nationality)) return 'UEFA';
  if (conmebol.includes(nationality)) return 'CONMEBOL';
  if (concacaf.includes(nationality)) return 'CONCACAF';
  if (afc.includes(nationality)) return 'AFC';
  return 'CAF';
}


// ============================================
// SUMMARY: Show what's in the DB
// ============================================
async function showSummary() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  DATABASE SUMMARY');
  console.log(`${'='.repeat(60)}`);

  const tables = [
    'countries', 'stadiums', 'teams', 'competitions', 'seasons',
    'persons', 'contracts', 'matches', 'standings', 'achievements',
  ];

  for (const table of tables) {
    const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
    const count = result.rows[0].count;
    const status = count > 0 ? '[OK]' : '[EMPTY]';
    console.log(`   ${status} ${table.padEnd(15)} -> ${count} rows`);
  }

  // Show breakdown
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
  console.log('\nFootyPulse -- Full Data Fetch from Football-Data.org');
  console.log('='.repeat(60));

  if (!API_KEY) {
    console.error('[ERROR] Missing FOOTBALL_DATA_API_KEY in .env file!');
    console.error('   Get your free key at: https://www.football-data.org/client/register');
    process.exit(1);
  }

  // Verify teams exist (fetchTeams.js should have run first)
  const teamCount = await pool.query('SELECT COUNT(*) as c FROM teams');
  if (parseInt(teamCount.rows[0].c) === 0) {
    console.error('[ERROR] No teams found! Run fetchTeams.js first:');
    console.error('   node database/fetchTeams.js');
    process.exit(1);
  }
  console.log(`   [OK] Found ${teamCount.rows[0].c} teams in database\n`);

  // Run each section
  await fetchCompetitionsAndSeasons();
  await fetchStandings();
  await fetchMatches();
  await fetchTopScorers();
  await fetchDetailedPlayerInfo();

  // Show summary
  await showSummary();

  console.log(`\nAll done! Your FootyPulse database is now loaded with real data.\n`);

  await pool.end();
}

main().catch(err => {
  console.error('[FATAL]', err);
  pool.end();
  process.exit(1);
});
