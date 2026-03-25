// ============================================
// database/fetchTeams.js
// ============================================
// PURPOSE: Fetch real teams & squads from Football-Data.org API
//          and insert into your Neon PostgreSQL database
//
// SETUP:
//   1. Get a FREE API key at: https://www.football-data.org/client/register
//   2. Add to your .env file:  FOOTBALL_DATA_API_KEY=your_key_here
//   3. Make sure schema is already created: npm run db:schema
//
// USAGE:
//   node database/fetchTeams.js
//
// WHAT IT DOES:
//   ✅ Fetches teams from Premier League, La Liga, Bundesliga, Serie A, Ligue 1
//   ✅ Fetches squad (players) for each team
//   ✅ Maps API data → your schema (countries, stadiums, teams, persons, contracts)
//   ✅ Skips duplicates (safe to run multiple times)
//
// FREE TIER LIMITS:
//   - 10 requests/minute → script auto-waits between requests
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

// ── Leagues to fetch (Football-Data.org competition codes) ──
const LEAGUES = [
  { code: 'PL',  name: 'Premier League',  countryName: 'England',  countryCode: 'ENG', confederation: 'UEFA' },
  { code: 'PD',  name: 'La Liga',         countryName: 'Spain',    countryCode: 'ESP', confederation: 'UEFA' },
  { code: 'BL1', name: 'Bundesliga',       countryName: 'Germany',  countryCode: 'GER', confederation: 'UEFA' },
  { code: 'SA',  name: 'Serie A',          countryName: 'Italy',    countryCode: 'ITA', confederation: 'UEFA' },
  { code: 'FL1', name: 'Ligue 1',          countryName: 'France',   countryCode: 'FRA', confederation: 'UEFA' },
];

// ── Helper: API fetch with rate limiting ──
async function apiFetch(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`    Fetching: ${url}`);

  const response = await fetch(url, {
    headers: { 'X-Auth-Token': API_KEY },
  });

  if (response.status === 429) {
    console.log('    Rate limited — waiting 60 seconds...');
    await sleep(60000);
    return apiFetch(endpoint); // retry
  }

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Helper: Get or create a country ──
async function getOrCreateCountry(name, code, confederation) {
  // Check if exists
  const existing = await pool.query(
    'SELECT country_id FROM countries WHERE code = $1',
    [code]
  );
  if (existing.rows.length > 0) return existing.rows[0].country_id;

  // Create it
  const result = await pool.query(
    `INSERT INTO countries (name, code, confederation)
     VALUES ($1, $2, $3)
     ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
     RETURNING country_id`,
    [name, code, confederation]
  );
  console.log(`   Created country: ${name} (${code})`);
  return result.rows[0].country_id;
}

// ── Helper: Get or create a stadium ──
async function getOrCreateStadium(name, city, countryId, capacity) {
  if (!name) return null;

  const existing = await pool.query(
    'SELECT stadium_id FROM stadiums WHERE name = $1',
    [name]
  );
  if (existing.rows.length > 0) return existing.rows[0].stadium_id;

  const result = await pool.query(
    `INSERT INTO stadiums (name, city, country_id, capacity)
     VALUES ($1, $2, $3, $4)
     RETURNING stadium_id`,
    [name, city, countryId, capacity]
  );
  console.log(`    Created stadium: ${name}`);
  return result.rows[0].stadium_id;
}

// ── Helper: Map API position → your schema position codes ──
function mapPosition(apiPosition) {
  const map = {
    'Goalkeeper':          'GK',
    'Centre-Back':         'CB',
    'Left-Back':           'LB',
    'Right-Back':          'RB',
    'Defensive Midfield':  'CDM',
    'Central Midfield':    'CM',
    'Attacking Midfield':  'CAM',
    'Left Winger':         'LW',
    'Right Winger':        'RW',
    'Centre-Forward':      'ST',
    'Left Midfield':       'LW',
    'Right Midfield':      'RW',
    'Defence':             'CB',
    'Midfield':            'CM',
    'Offence':             'ST',
  };
  return map[apiPosition] || null;
}

// ── Helper: Map nationality to country code ──
// Football-Data.org gives full country names; we need 3-letter codes
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
    'Bolivia': 'BOL', 'Scotland': 'SCO', 'Wales': 'WAL', 'Ireland': 'IRL',
    'Northern Ireland': 'NIR', 'Norway': 'NOR', 'Sweden': 'SWE', 'Denmark': 'DEN',
    'Finland': 'FIN', 'Poland': 'POL', 'Czech Republic': 'CZE', 'Austria': 'AUT',
    'Switzerland': 'SUI', 'Turkey': 'TUR', 'Greece': 'GRE', 'Romania': 'ROU',
    'Serbia': 'SRB', 'Ukraine': 'UKR', 'Russia': 'RUS', 'Australia': 'AUS',
    'China PR': 'CHN', 'India': 'IND', 'Iran': 'IRN', 'Saudi Arabia': 'KSA',
    'DR Congo': 'COD', 'Mali': 'MLI', 'Burkina Faso': 'BFA', 'Guinea': 'GUI',
    'Jamaica': 'JAM', 'Costa Rica': 'CRC', 'Panama': 'PAN', 'Honduras': 'HON',
    'Hungary': 'HUN', 'Slovakia': 'SVK', 'Slovenia': 'SVN', 'Iceland': 'ISL',
    'Albania': 'ALB', 'North Macedonia': 'MKD', 'Montenegro': 'MNE',
    'Bosnia and Herzegovina': 'BIH', 'Georgia': 'GEO', 'Armenia': 'ARM',
    'Israel': 'ISR', 'Congo': 'CGO', 'Gabon': 'GAB', 'Equatorial Guinea': 'GEQ',
    'Mozambique': 'MOZ', 'Angola': 'ANG', 'Zimbabwe': 'ZIM', 'Zambia': 'ZAM',
    'New Zealand': 'NZL', 'Republic of Ireland': 'IRL', 'Côte d\'Ivoire': 'CIV',
    'Korea Republic': 'KOR', 'United States': 'USA',
  };
  return map[nationality] || nationality?.substring(0, 3).toUpperCase() || 'UNK';
}

function getConfederation(nationality) {
  const uefa = ['England', 'Spain', 'Germany', 'France', 'Italy', 'Portugal', 'Netherlands',
    'Belgium', 'Croatia', 'Scotland', 'Wales', 'Ireland', 'Northern Ireland', 'Norway',
    'Sweden', 'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Austria', 'Switzerland',
    'Turkey', 'Greece', 'Romania', 'Serbia', 'Ukraine', 'Russia', 'Hungary', 'Slovakia',
    'Slovenia', 'Iceland', 'Albania', 'North Macedonia', 'Montenegro',
    'Bosnia and Herzegovina', 'Georgia', 'Armenia', 'Israel', 'Republic of Ireland'];
  const conmebol = ['Brazil', 'Argentina', 'Uruguay', 'Colombia', 'Chile', 'Ecuador',
    'Paraguay', 'Peru', 'Venezuela', 'Bolivia'];
  const concacaf = ['Mexico', 'USA', 'United States', 'Canada', 'Jamaica', 'Costa Rica',
    'Panama', 'Honduras'];
  const afc = ['Japan', 'South Korea', 'Korea Republic', 'China PR', 'India', 'Iran',
    'Saudi Arabia', 'Australia'];

  if (uefa.includes(nationality)) return 'UEFA';
  if (conmebol.includes(nationality)) return 'CONMEBOL';
  if (concacaf.includes(nationality)) return 'CONCACAF';
  if (afc.includes(nationality)) return 'AFC';
  return 'CAF'; // default for African + others
}

async function main() {
  console.log('\n FootyPulse — Fetching Teams & Squads from Football-Data.org\n');

  if (!API_KEY) {
    console.error('Missing FOOTBALL_DATA_API_KEY in .env file!');
    console.error('   Get your free key at: https://www.football-data.org/client/register');
    process.exit(1);
  }

  let totalTeams = 0;
  let totalPlayers = 0;

  for (const league of LEAGUES) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`   ${league.name} (${league.code})`);
    console.log(`${'═'.repeat(60)}`);

    // 1. Ensure league country exists
    const leagueCountryId = await getOrCreateCountry(
      league.countryName, league.countryCode, league.confederation
    );

    // 2. Fetch teams from this competition
    const data = await apiFetch(`/competitions/${league.code}/teams`);
    const teams = data.teams || [];
    console.log(`   Found ${teams.length} teams\n`);

    for (const team of teams) {
      try {
        // 3. Determine team's country
        const teamCountryCode = nationalityToCode(team.area?.name || league.countryName);
        const teamCountryId = await getOrCreateCountry(
          team.area?.name || league.countryName,
          teamCountryCode,
          getConfederation(team.area?.name || league.countryName)
        );

        // 4. Create stadium
        const stadiumId = await getOrCreateStadium(
          team.venue, team.address?.split(',').pop()?.trim(), teamCountryId, null
        );

        // 5. Insert or update team
        const teamResult = await pool.query(
          `INSERT INTO teams (name, short_name, team_type, country_id, stadium_id,
                              founded_year, logo_url, primary_color)
           VALUES ($1, $2, 'club', $3, $4, $5, $6, $7)
           ON CONFLICT ON CONSTRAINT teams_pkey DO NOTHING
           RETURNING team_id`,
          [
            team.name,
            team.shortName || team.tla,
            teamCountryId,
            stadiumId,
            team.founded,
            team.crest,
            team.clubColors?.split('/')[0]?.trim() || null,
          ]
        );

        // If team already exists, find its ID
        let teamId;
        if (teamResult.rows.length > 0) {
          teamId = teamResult.rows[0].team_id;
          console.log(`   Created team: ${team.name}`);
          totalTeams++;
        } else {
          const existing = await pool.query(
            'SELECT team_id FROM teams WHERE name = $1',
            [team.name]
          );
          if (existing.rows.length > 0) {
            teamId = existing.rows[0].team_id;
            console.log(`   Team exists: ${team.name}`);
          } else {
            console.log(`    Could not find/create team: ${team.name}`);
            continue;
          }
        }

        // 6. Fetch squad for this team
        const squad = team.squad || [];
        console.log(`       Squad: ${squad.length} players`);

        for (const player of squad) {
          try {
            // Get player nationality country
            let nationalityId = null;
            if (player.nationality) {
              const natCode = nationalityToCode(player.nationality);
              nationalityId = await getOrCreateCountry(
                player.nationality, natCode, getConfederation(player.nationality)
              );
            }

            // Split name into first/last
            const nameParts = (player.name || 'Unknown Player').split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || nameParts[0];

            // Insert person
            const personResult = await pool.query(
              `INSERT INTO persons (person_type, first_name, last_name, date_of_birth,
                                    nationality_id, primary_position)
               VALUES ('player', $1, $2, $3, $4, $5)
               RETURNING person_id`,
              [
                firstName,
                lastName,
                player.dateOfBirth || null,
                nationalityId,
                mapPosition(player.position),
              ]
            );

            const personId = personResult.rows[0].person_id;

            // Create contract linking player to team
            await pool.query(
              `INSERT INTO contracts (person_id, team_id, contract_type, start_date, is_current)
               VALUES ($1, $2, 'player', CURRENT_DATE, true)`,
              [personId, teamId]
            );

            totalPlayers++;
          } catch (playerErr) {
            console.log(`        Skipped player ${player.name}: ${playerErr.message}`);
          }
        }

        // 7. If the team has a coach, insert them too
        if (team.coach) {
          try {
            const coachName = (team.coach.name || 'Unknown Coach').split(' ');
            let coachNatId = null;
            if (team.coach.nationality) {
              const cCode = nationalityToCode(team.coach.nationality);
              coachNatId = await getOrCreateCountry(
                team.coach.nationality, cCode, getConfederation(team.coach.nationality)
              );
            }

            const coachResult = await pool.query(
              `INSERT INTO persons (person_type, first_name, last_name, date_of_birth, nationality_id)
               VALUES ('manager', $1, $2, $3, $4)
               RETURNING person_id`,
              [
                coachName[0],
                coachName.slice(1).join(' ') || coachName[0],
                team.coach.dateOfBirth || null,
                coachNatId,
              ]
            );

            await pool.query(
              `INSERT INTO contracts (person_id, team_id, contract_type, start_date, is_current)
               VALUES ($1, $2, 'manager', CURRENT_DATE, true)`,
              [coachResult.rows[0].person_id, teamId]
            );
            console.log(`       Added coach: ${team.coach.name}`);
          } catch (coachErr) {
            console.log(`       Skipped coach: ${coachErr.message}`);
          }
        }

      } catch (teamErr) {
        console.error(`    Error with ${team.name}: ${teamErr.message}`);
      }
    }

    // Rate limit: wait 7 seconds between leagues to stay under 10 req/min
    console.log('\n   ⏳ Waiting 7 seconds (rate limit)...');
    await sleep(7000);
  }

  // ── Summary ──
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`   DONE!`);
  console.log(`  Teams created:   ${totalTeams}`);
  console.log(`  Players created: ${totalPlayers}`);
  console.log(`${'═'.repeat(60)}\n`);

  await pool.end();
}

main().catch(err => {
  console.error(' Fatal error:', err);
  pool.end();
  process.exit(1);
});