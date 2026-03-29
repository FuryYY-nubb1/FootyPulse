// ============================================
// database/fetchTransfers.js
// ============================================
// PURPOSE: Fetch player transfer history from API-Football v3
//          Loops through all players in DB and fetches their transfers
//
// USAGE:   node database/fetchTransfers.js
// FREE TIER: 100 requests/day -- processes ~80 players per run
//            Run multiple times over multiple days for full coverage
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// How many players to process per run (keep under 80 to stay within 100 req/day)
// Each player costs 1 request. Run the script multiple days to cover all players.
const PLAYERS_PER_RUN = 80;

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
    console.log(`   [WARN] ${JSON.stringify(data.errors)}`);
  }
  return data;
}

// Search API-Football for a player by name, return their API player_id
async function getApiPlayerId(displayName) {
  try {
    const data = await apiFetch(`/players?search=${encodeURIComponent(displayName)}&season=2024`);
    const results = data.response || [];
    if (results.length > 0) return results[0].player?.id || null;
  } catch (err) { /* skip */ }
  return null;
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

function mapTransferType(type) {
  if (!type) return 'permanent';
  const t = type.toLowerCase();
  if (t.includes('loan')) return 'loan';
  if (t.includes('free')) return 'free';
  return 'permanent';
}

// ============================================
// MAIN FETCH
// ============================================
async function fetchTransfers() {
  console.log('\n' + '='.repeat(60));
  console.log('  Fetching Player Transfers');
  console.log('='.repeat(60));

  // Get players that have not had transfers fetched yet
  // We track this by checking if they already have transfer rows
  const players = await pool.query(
    `SELECT p.person_id, p.display_name
     FROM persons p
     WHERE p.person_type = 'player'
       AND p.person_id NOT IN (SELECT DISTINCT person_id FROM transfers)
     ORDER BY p.person_id
     LIMIT $1`,
    [PLAYERS_PER_RUN]
  );

  console.log(`   Processing ${players.rows.length} players\n`);

  let totalTransfers = 0;
  let playersProcessed = 0;

  for (const player of players.rows) {
    try {
      // Find this player's API-Football ID by searching their name
      const apiPlayerId = await getApiPlayerId(player.display_name);
      if (!apiPlayerId) {
        console.log(`   [SKIP] No API ID for: ${player.display_name}`);
        continue;
      }

      // Fetch transfers for this player
      const data = await apiFetch(`/transfers?player=${apiPlayerId}`);
      const transfers = data.response || [];

      if (transfers.length === 0 || !transfers[0]?.transfers) {
        // Insert a dummy row so we don't retry this player next run
        // (use a no-op by just continuing -- player stays in "not in transfers" list
        // unless we mark them. We just skip and move on.)
        continue;
      }

      for (const item of (transfers[0].transfers || [])) {
        const fromTeamId = await findTeamId(item.teams?.out?.name);
        const toTeamId   = await findTeamId(item.teams?.in?.name);

        // Must have at least a destination team
        if (!toTeamId) continue;

        // Parse fee
        let fee = null;
        let feeCurrency = 'EUR';
        if (item.price && item.price !== 'Free' && item.price !== 'N/A') {
          // API returns values like "€ 50M" or "50000000"
          const cleaned = String(item.price).replace(/[€$£,\s]/g, '');
          if (cleaned.endsWith('M')) fee = parseFloat(cleaned) * 1000000;
          else if (cleaned.endsWith('K')) fee = parseFloat(cleaned) * 1000;
          else fee = parseFloat(cleaned) || null;
        }

        const transferType = mapTransferType(item.type);
        const status = 'official'; // API-Football only returns confirmed transfers

        // Parse date
        let transferDate = null;
        if (item.date) {
          transferDate = String(item.date).substring(0, 10);
        }

        // Parse window year from date
        const windowYear = transferDate ? parseInt(transferDate.substring(0, 4)) : null;
        const month = transferDate ? parseInt(transferDate.substring(5, 7)) : null;
        const windowType = month && month >= 6 && month <= 8 ? 'summer' : 'winter';

        try {
          await pool.query(
            `INSERT INTO transfers (person_id, from_team_id, to_team_id, transfer_type,
                                    status, fee, fee_currency, transfer_date,
                                    window_year, window_type)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             ON CONFLICT DO NOTHING`,
            [player.person_id, fromTeamId, toTeamId, transferType,
             status, fee, feeCurrency, transferDate, windowYear, windowType]
          );
          totalTransfers++;
        } catch (e) { /* skip duplicate */ }
      }

      playersProcessed++;
      console.log(`   [OK] ${player.display_name}: ${transfers[0]?.transfers?.length || 0} transfers`);
      await sleep(2000);

    } catch (err) {
      console.log(`   [ERROR] ${player.display_name}: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`   Players processed:  ${playersProcessed}`);
  console.log(`   Transfers inserted: ${totalTransfers}`);
  console.log('='.repeat(60));
}

async function main() {
  console.log('\nFootyPulse -- Fetch Transfers from API-Football');
  console.log('='.repeat(60));
  console.log(`   Processing up to ${PLAYERS_PER_RUN} players per run`);
  console.log('   Run multiple days to cover all players (100 req/day limit)\n');

  if (!API_KEY) {
    console.error('[ERROR] Missing API_FOOTBALL_KEY in .env');
    process.exit(1);
  }

  await fetchTransfers();

  const total = await pool.query('SELECT COUNT(*) as c FROM transfers');
  console.log(`\n   transfers table total: ${total.rows[0].c} rows`);

  await pool.end();
  console.log('\nDone.\n');
}

main().catch(err => { console.error('[FATAL]', err); pool.end(); process.exit(1); });
