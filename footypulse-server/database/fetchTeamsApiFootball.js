// ============================================
// database/fetchTeamsApiFootball.js
// ============================================
// PURPOSE: Fetch teams, squads, venues & coaches from API-Football v3
//          and insert into Neon PostgreSQL database
//
// API:     https://v3.football.api-sports.io
// DOCS:    https://www.api-football.com/documentation-v3
//
// SETUP:
//   1. Get API key at: https://www.api-football.com/ (or via RapidAPI)
//   2. Add to .env:  API_FOOTBALL_KEY=your_key_here
//   3. Make sure schema exists: npm run db:schema
//   4. Run clearDatabase.js first if you want a fresh start
//
// USAGE:   node database/fetchTeamsApiFootball.js
//
// FREE TIER: 100 requests/day — script tracks usage
// PAID TIER: Rate limits vary — script auto-waits on 429
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// ── Leagues to fetch (API-Football league IDs) ──
const LEAGUES = [
  { id: 39,  name: 'Premier League',       country: 'England',  code: 'ENG', confederation: 'UEFA' },
  { id: 140, name: 'La Liga',              country: 'Spain',    code: 'ESP', confederation: 'UEFA' },
  { id: 78,  name: 'Bundesliga',           country: 'Germany',  code: 'GER', confederation: 'UEFA' },
  { id: 135, name: 'Serie A',              country: 'Italy',    code: 'ITA', confederation: 'UEFA' },
  { id: 61,  name: 'Ligue 1',             country: 'France',   code: 'FRA', confederation: 'UEFA' },
  { id: 2,   name: 'UEFA Champions League', country: null,      code: null,  confederation: 'UEFA' },
];

// Current season (API-Football uses the start year, e.g. 2024 for 2024/25)
const CURRENT_SEASON = 2024;

// ── Helpers ──
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let requestCount = 0;
async function apiFetch(endpoint) {
  requestCount++;

  // Rate limiting: pause every 8 requests (free tier: ~10/min safe)
  if (requestCount % 8 === 0) {
    console.log('   [WAIT] Rate limit pause (65s)...');
    await sleep(65000);
  }

  const url = `${BASE_URL}${endpoint}`;
  console.log(`   [FETCH] ${url}`);

  const response = await fetch(url, {
    headers: {
      'x-apisports-key': API_KEY,
    },
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

  // Check for API errors in the response body
  if (data.errors && Object.keys(data.errors).length > 0) {
    console.log(`   [WARN] API error: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

// Map API-Football position to schema position
function mapPosition(pos) {
  if (!pos) return null;
  const map = {
    'Goalkeeper': 'GK',
    'Defender': 'CB',
    'Midfielder': 'CM',
    'Attacker': 'ST',
  };
  return map[pos] || null;
}

// Guess confederation from country name
function guessConfederation(country) {
  if (!country) return 'UEFA';
  const uefa = ['England', 'Spain', 'Germany', 'Italy', 'France', 'Portugal', 'Netherlands',
    'Belgium', 'Scotland', 'Wales', 'Ireland', 'Norway', 'Sweden', 'Denmark', 'Finland',
    'Poland', 'Austria', 'Switzerland', 'Turkey', 'Greece', 'Serbia', 'Croatia', 'Ukraine',
    'Czech Republic', 'Romania', 'Hungary', 'Slovakia', 'Slovenia', 'Bulgaria',
    'Republic of Ireland', 'Bosnia and Herzegovina', 'North Macedonia', 'Albania',
    'Montenegro', 'Kosovo', 'Iceland', 'Luxembourg', 'Georgia', 'Armenia',
    'Azerbaijan', 'Cyprus', 'Malta', 'Estonia', 'Latvia', 'Lithuania', 'Belarus',
    'Moldova', 'Liechtenstein', 'Andorra', 'San Marino', 'Gibraltar', 'Faroe Islands'];
  const conmebol = ['Brazil', 'Argentina', 'Uruguay', 'Colombia', 'Chile', 'Ecuador',
    'Paraguay', 'Peru', 'Venezuela', 'Bolivia'];
  const concacaf = ['Mexico', 'USA', 'United States', 'Canada', 'Jamaica', 'Costa Rica',
    'Honduras', 'Panama', 'El Salvador', 'Trinidad And Tobago', 'Guatemala', 'Haiti'];
  const afc = ['Japan', 'South Korea', 'Korea Republic', 'Australia', 'Iran', 'Saudi Arabia',
    'China', 'Qatar', 'UAE', 'Thailand', 'Indonesia', 'Vietnam', 'India',
    'Uzbekistan', 'Iraq', 'Oman', 'Bahrain', 'Jordan', 'Palestine', 'Syria',
    'Lebanon', 'Kuwait', 'Yemen', 'Bangladesh', 'Myanmar', 'Philippines',
    'Malaysia', 'Singapore', 'Chinese Taipei', 'Hong Kong', 'Macao'];

  if (uefa.includes(country)) return 'UEFA';
  if (conmebol.includes(country)) return 'CONMEBOL';
  if (concacaf.includes(country)) return 'CONCACAF';
  if (afc.includes(country)) return 'AFC';
  return 'CAF';
}


// ============================================
// SECTION 1: COUNTRIES
// ============================================
async function fetchCountries() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 1: Countries');
  console.log(`${'='.repeat(60)}`);

  // Insert the league countries first (these are guaranteed)
  const leagueCountries = [
    { name: 'England', code: 'ENG', confederation: 'UEFA' },
    { name: 'Spain',   code: 'ESP', confederation: 'UEFA' },
    { name: 'Germany', code: 'GER', confederation: 'UEFA' },
    { name: 'Italy',   code: 'ITA', confederation: 'UEFA' },
    { name: 'France',  code: 'FRA', confederation: 'UEFA' },
  ];

  let created = 0;

  for (const c of leagueCountries) {
    try {
      await pool.query(
        `INSERT INTO countries (name, code, confederation)
         VALUES ($1, $2, $3)
         ON CONFLICT (code) DO NOTHING`,
        [c.name, c.code, c.confederation]
      );
      created++;
    } catch (err) {
      console.log(`   [SKIP] ${c.name}: ${err.message}`);
    }
  }

  // Also fetch countries from API to get flag URLs
  try {
    const data = await apiFetch('/countries');
    const countries = data.response || [];

    for (const c of countries) {
      if (!c.name || !c.code) continue;

      // API-Football uses 2-letter codes, our schema uses 3-letter
      // We'll use the 2-letter code padded or map common ones
      let code3 = c.code;
      if (code3 && code3.length === 2) {
        // Common 2→3 letter mappings
        const map2to3 = {
          'GB': 'ENG', 'ES': 'ESP', 'DE': 'GER', 'IT': 'ITA', 'FR': 'FRA',
          'PT': 'POR', 'NL': 'NED', 'BE': 'BEL', 'BR': 'BRA', 'AR': 'ARG',
          'US': 'USA', 'MX': 'MEX', 'JP': 'JPN', 'KR': 'KOR', 'AU': 'AUS',
          'CA': 'CAN', 'CH': 'SUI', 'AT': 'AUT', 'SE': 'SWE', 'NO': 'NOR',
          'DK': 'DEN', 'PL': 'POL', 'HR': 'CRO', 'RS': 'SRB', 'TR': 'TUR',
          'GR': 'GRE', 'RO': 'ROU', 'UA': 'UKR', 'CZ': 'CZE', 'IE': 'IRL',
          'SC': 'SCO', 'WA': 'WAL', 'CL': 'CHI', 'CO': 'COL', 'UY': 'URU',
          'EC': 'ECU', 'PY': 'PAR', 'PE': 'PER', 'VE': 'VEN', 'BO': 'BOL',
          'SA': 'KSA', 'QA': 'QAT', 'IR': 'IRN', 'CN': 'CHN', 'IN': 'IND',
          'NG': 'NGA', 'GH': 'GHA', 'CM': 'CMR', 'SN': 'SEN', 'CI': 'CIV',
          'EG': 'EGY', 'MA': 'MAR', 'TN': 'TUN', 'DZ': 'ALG', 'ZA': 'RSA',
          'HU': 'HUN', 'SK': 'SVK', 'SI': 'SVN', 'BG': 'BUL', 'FI': 'FIN',
          'IS': 'ISL', 'AL': 'ALB', 'BA': 'BIH', 'ME': 'MNE', 'MK': 'MKD',
          'GE': 'GEO', 'AM': 'ARM', 'AZ': 'AZE', 'CY': 'CYP', 'LU': 'LUX',
          'MT': 'MLT', 'EE': 'EST', 'LV': 'LVA', 'LT': 'LTU', 'BY': 'BLR',
          'RU': 'RUS', 'JM': 'JAM', 'CR': 'CRC', 'HN': 'HON', 'PA': 'PAN',
          'SV': 'SLV', 'GT': 'GUA', 'HT': 'HAI', 'TH': 'THA', 'ID': 'IDN',
          'VN': 'VIE', 'PH': 'PHI', 'MY': 'MAS', 'SG': 'SGP', 'BD': 'BAN',
        };
        code3 = map2to3[c.code] || (c.code + 'X').substring(0, 3);
      }

      const confed = guessConfederation(c.name);

      try {
        await pool.query(
          `INSERT INTO countries (name, code, flag_url, confederation)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (code) DO UPDATE SET flag_url = EXCLUDED.flag_url`,
          [c.name, code3, c.flag || null, confed]
        );
      } catch (err) {
        // Skip duplicates silently
      }
    }

    created = (await pool.query('SELECT COUNT(*) as c FROM countries')).rows[0].c;
    console.log(`   ✅ Countries in DB: ${created}`);

  } catch (err) {
    console.error(`   [ERROR] ${err.message}`);
  }
}


// ============================================
// SECTION 2: TEAMS + VENUES (Stadiums)
// ============================================
async function fetchTeamsAndVenues() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 2: Teams & Venues (Stadiums)');
  console.log(`${'='.repeat(60)}`);

  let totalTeams = 0;
  let totalVenues = 0;

  for (const league of LEAGUES) {
    try {
      // Fetch teams for this league + season
      const data = await apiFetch(`/teams?league=${league.id}&season=${CURRENT_SEASON}`);
      const teams = data.response || [];

      console.log(`\n   ${league.name}: ${teams.length} teams`);

      for (const item of teams) {
        const team = item.team;
        const venue = item.venue;

        // Find country_id
        let countryId = null;
        if (league.code) {
          const cResult = await pool.query(
            'SELECT country_id FROM countries WHERE code = $1 LIMIT 1',
            [league.code]
          );
          if (cResult.rows.length > 0) countryId = cResult.rows[0].country_id;
        }

        // If no country found, try to find by team's country name
        if (!countryId && team.country) {
          const cResult = await pool.query(
            'SELECT country_id FROM countries WHERE name ILIKE $1 LIMIT 1',
            [team.country]
          );
          if (cResult.rows.length > 0) countryId = cResult.rows[0].country_id;

          // If still no match, insert the country
          if (!countryId) {
            const code3 = (team.country || 'UNK').substring(0, 3).toUpperCase();
            try {
              const ins = await pool.query(
                `INSERT INTO countries (name, code, confederation)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (code) DO NOTHING
                 RETURNING country_id`,
                [team.country, code3, guessConfederation(team.country)]
              );
              if (ins.rows.length > 0) countryId = ins.rows[0].country_id;
              else {
                const existing = await pool.query(
                  'SELECT country_id FROM countries WHERE code = $1', [code3]
                );
                if (existing.rows.length > 0) countryId = existing.rows[0].country_id;
              }
            } catch (e) { /* skip */ }
          }
        }

        // Default country if still null
        if (!countryId) {
          const def = await pool.query('SELECT country_id FROM countries LIMIT 1');
          if (def.rows.length > 0) countryId = def.rows[0].country_id;
        }

        // Insert venue (stadium)
        let stadiumId = null;
        if (venue && venue.name && countryId) {
          try {
            const vResult = await pool.query(
              `INSERT INTO stadiums (name, city, country_id, capacity)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT DO NOTHING
               RETURNING stadium_id`,
              [venue.name, venue.city || null, countryId, venue.capacity || null]
            );
            if (vResult.rows.length > 0) {
              stadiumId = vResult.rows[0].stadium_id;
              totalVenues++;
            } else {
              // Find existing
              const existing = await pool.query(
                'SELECT stadium_id FROM stadiums WHERE name = $1 LIMIT 1',
                [venue.name]
              );
              if (existing.rows.length > 0) stadiumId = existing.rows[0].stadium_id;
            }
          } catch (e) {
            // Try to find existing
            const existing = await pool.query(
              'SELECT stadium_id FROM stadiums WHERE name = $1 LIMIT 1',
              [venue.name]
            );
            if (existing.rows.length > 0) stadiumId = existing.rows[0].stadium_id;
          }
        }

        // Insert team
        try {
          const tResult = await pool.query(
            `INSERT INTO teams (name, short_name, team_type, country_id, city, stadium_id,
                                founded_year, logo_url)
             VALUES ($1, $2, 'club', $3, $4, $5, $6, $7)
             ON CONFLICT DO NOTHING
             RETURNING team_id`,
            [
              team.name,
              team.code || team.name.substring(0, 3).toUpperCase(),
              countryId,
              venue?.city || null,
              stadiumId,
              team.founded || null,
              team.logo || null,
            ]
          );

          if (tResult.rows.length > 0) {
            totalTeams++;
          }
        } catch (e) {
          // Team might already exist, skip
          console.log(`      [SKIP] ${team.name}: ${e.message}`);
        }
      }

      await sleep(3000); // small pause between leagues
    } catch (err) {
      console.error(`   [ERROR] ${league.name}: ${err.message}`);
    }
  }

  console.log(`\n   ✅ Teams created: ${totalTeams}`);
  console.log(`   ✅ Venues created: ${totalVenues}`);
}


// ============================================
// SECTION 3: SQUADS (Players) + COACHES
// ============================================
async function fetchSquadsAndCoaches() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  SECTION 3: Squads (Players) & Coaches');
  console.log(`${'='.repeat(60)}`);

  let totalPlayers = 0;
  let totalCoaches = 0;
  let totalContracts = 0;

  // Get all teams from DB
  const teamsResult = await pool.query('SELECT team_id, name, country_id FROM teams ORDER BY team_id');
  const teams = teamsResult.rows;

  console.log(`   Processing ${teams.length} teams...\n`);

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    console.log(`   [${i + 1}/${teams.length}] ${team.name}`);

    try {
      // Fetch squad for this team
      const data = await apiFetch(`/players/squads?team=${getApiTeamId(team.name)}`);
      const squads = data.response || [];

      if (squads.length === 0) {
        // Try fetching players by league approach if squad endpoint returns empty
        console.log(`      No squad data, skipping...`);
        continue;
      }

      const players = squads[0]?.players || [];

      for (const player of players) {
        // Find or create country for player nationality
        let nationalityId = team.country_id; // default to team's country

        // Insert person
        try {
          const firstName = player.name?.split(' ').slice(0, -1).join(' ') || player.name || 'Unknown';
          const lastName = player.name?.split(' ').slice(-1).join(' ') || '';

          const pResult = await pool.query(
            `INSERT INTO persons (person_type, first_name, last_name, date_of_birth,
                                  nationality_id, photo_url, primary_position)
             VALUES ('player', $1, $2, $3, $4, $5, $6)
             ON CONFLICT DO NOTHING
             RETURNING person_id`,
            [
              firstName || 'Unknown',
              lastName || 'Player',
              player.age ? null : null, // API squad doesn't give DOB directly
              nationalityId,
              player.photo || null,
              mapPosition(player.position),
            ]
          );

          let personId = null;
          if (pResult.rows.length > 0) {
            personId = pResult.rows[0].person_id;
            totalPlayers++;
          } else {
            // Find existing
            const existing = await pool.query(
              `SELECT person_id FROM persons
               WHERE first_name = $1 AND last_name = $2 AND person_type = 'player' LIMIT 1`,
              [firstName || 'Unknown', lastName || 'Player']
            );
            if (existing.rows.length > 0) personId = existing.rows[0].person_id;
          }

          // Insert contract
          if (personId) {
            try {
              await pool.query(
                `INSERT INTO contracts (person_id, team_id, contract_type, start_date,
                                        jersey_number, is_current)
                 VALUES ($1, $2, 'player', CURRENT_DATE, $3, true)
                 ON CONFLICT DO NOTHING`,
                [personId, team.team_id, player.number || null]
              );
              totalContracts++;
            } catch (e) { /* skip duplicate contracts */ }
          }
        } catch (e) {
          // Skip player on error
        }
      }

      console.log(`      ${players.length} players processed`);
      await sleep(3000);

    } catch (err) {
      console.error(`      [ERROR] ${err.message}`);
    }

    // Fetch coach for this team
    try {
      const coachData = await apiFetch(`/coachs?team=${getApiTeamId(team.name)}`);
      const coaches = coachData.response || [];

      if (coaches.length > 0) {
        const coach = coaches[0]; // current coach

        let nationalityId = team.country_id;
        if (coach.nationality) {
          const cResult = await pool.query(
            'SELECT country_id FROM countries WHERE name ILIKE $1 LIMIT 1',
            [coach.nationality]
          );
          if (cResult.rows.length > 0) nationalityId = cResult.rows[0].country_id;
        }

        const firstName = coach.firstname || coach.name?.split(' ')[0] || 'Unknown';
        const lastName = coach.lastname || coach.name?.split(' ').slice(1).join(' ') || 'Coach';

        try {
          const pResult = await pool.query(
            `INSERT INTO persons (person_type, first_name, last_name, date_of_birth,
                                  nationality_id, photo_url)
             VALUES ('manager', $1, $2, $3, $4, $5)
             ON CONFLICT DO NOTHING
             RETURNING person_id`,
            [
              firstName,
              lastName,
              coach.birth?.date || null,
              nationalityId,
              coach.photo || null,
            ]
          );

          let personId = null;
          if (pResult.rows.length > 0) {
            personId = pResult.rows[0].person_id;
            totalCoaches++;
          } else {
            const existing = await pool.query(
              `SELECT person_id FROM persons
               WHERE first_name = $1 AND last_name = $2 AND person_type = 'manager' LIMIT 1`,
              [firstName, lastName]
            );
            if (existing.rows.length > 0) personId = existing.rows[0].person_id;
          }

          if (personId) {
            await pool.query(
              `INSERT INTO contracts (person_id, team_id, contract_type, start_date, is_current)
               VALUES ($1, $2, 'manager', CURRENT_DATE, true)
               ON CONFLICT DO NOTHING`,
              [personId, team.team_id]
            );
          }
        } catch (e) { /* skip */ }
      }

      await sleep(3000);
    } catch (err) {
      // Coach fetch failed, continue
    }
  }

  console.log(`\n   ✅ Players created: ${totalPlayers}`);
  console.log(`   ✅ Coaches created: ${totalCoaches}`);
  console.log(`   ✅ Contracts created: ${totalContracts}`);
}


// ============================================
// Helper: Map team name → API-Football team ID
// We search by team name in the API when we don't have the ID cached
// ============================================
// Since the squad endpoint needs API-Football's team ID (not our DB ID),
// we maintain a simple lookup. On first use, we fetch from the API.
const teamIdCache = {};

async function getApiTeamId(teamName) {
  if (teamIdCache[teamName]) return teamIdCache[teamName];

  // Search for team in API
  try {
    const data = await apiFetch(`/teams?search=${encodeURIComponent(teamName)}`);
    const results = data.response || [];
    if (results.length > 0) {
      teamIdCache[teamName] = results[0].team.id;
      return results[0].team.id;
    }
  } catch (err) {
    console.log(`      [WARN] Could not find API ID for ${teamName}`);
  }

  return null;
}


// ============================================
// SUMMARY
// ============================================
async function showSummary() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  DATABASE SUMMARY');
  console.log(`${'='.repeat(60)}`);

  const tables = ['countries', 'stadiums', 'teams', 'persons', 'contracts'];
  for (const table of tables) {
    const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
    const count = result.rows[0].count;
    const status = parseInt(count) > 0 ? '✅' : '⚠️ ';
    console.log(`   ${status} ${table.padEnd(15)} → ${count} rows`);
  }

  const players = await pool.query("SELECT COUNT(*) as c FROM persons WHERE person_type = 'player'");
  const managers = await pool.query("SELECT COUNT(*) as c FROM persons WHERE person_type = 'manager'");
  console.log(`\n   Players:  ${players.rows[0].c}`);
  console.log(`   Managers: ${managers.rows[0].c}`);
}


// ============================================
// MAIN
// ============================================
async function main() {
  console.log('\n⚽ FootyPulse — Fetch Teams from API-Football v3');
  console.log('='.repeat(60));

  if (!API_KEY) {
    console.error('[ERROR] Missing API_FOOTBALL_KEY in .env file!');
    console.error('   Get your key at: https://www.api-football.com/');
    console.error('   Then add to .env: API_FOOTBALL_KEY=your_key_here');
    process.exit(1);
  }

  console.log(`   API: ${BASE_URL}`);
  console.log(`   Season: ${CURRENT_SEASON}`);
  console.log(`   Leagues: ${LEAGUES.map(l => l.name).join(', ')}\n`);

  await fetchCountries();
  await fetchTeamsAndVenues();
  await fetchSquadsAndCoaches();
  await showSummary();

  console.log(`\n${'='.repeat(60)}`);
  console.log('  ✅ Teams fetch complete!');
  console.log('  Next: node database/fetchAllApiFootball.js');
  console.log(`${'='.repeat(60)}\n`);

  await pool.end();
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err);
  pool.end();
  process.exit(1);
});
