

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

// Poll interval in milliseconds (2 minutes)
const POLL_INTERVAL_MS = 2 * 60 * 1000;

// ============================================
// Helpers
// ============================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function now() {
  return new Date().toISOString().substring(0, 19).replace('T', ' ');
}

async function apiFetch(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
  if (response.status === 429) {
    console.log(`   [${now()}] [WAIT] Rate limited -- waiting 65s...`);
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
  }
  if (type === 'SUBSTITUTION') return 'sub';
  return null;
}

async function findTeamId(name) {
  if (!name) return null;
  let r = await pool.query(
    `SELECT team_id FROM teams WHERE name = $1 OR short_name = $1 LIMIT 1`, [name]
  );
  if (r.rows.length > 0) return r.rows[0].team_id;
  r = await pool.query(
    `SELECT team_id FROM teams WHERE name ILIKE $1 LIMIT 1`, [`%${name}%`]
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

// ============================================
// CORE: Single poll cycle
// ============================================
async function pollLiveMatches() {
  try {
    // Step 1: Fetch all currently live matches from football-data.org
    const data = await apiFetch('/matches?status=IN_PLAY,PAUSED');
    const liveMatches = data.matches || [];

    if (liveMatches.length === 0) {
      console.log(`   [${now()}] No live matches right now`);
      return;
    }

    console.log(`   [${now()}] ${liveMatches.length} live match(es) found`);

    for (const match of liveMatches) {
      const externalId = `fd-${match.id}`;

      // Find this match in our DB
      const dbRow = await pool.query(
        'SELECT match_id, home_score, away_score, status FROM matches WHERE external_id = $1',
        [externalId]
      );

      if (dbRow.rows.length === 0) {
        // Match not in DB -- could be a cup match we didn't seed
        // Try to insert it if we can resolve both teams
        const homeTeamId = await findTeamId(match.homeTeam?.name);
        const awayTeamId = await findTeamId(match.awayTeam?.name);

        if (!homeTeamId || !awayTeamId) continue;

        // Find season_id for this competition
        const seasonRow = await pool.query(
          `SELECT s.season_id FROM seasons s
           JOIN competitions c ON s.competition_id = c.competition_id
           WHERE c.name ILIKE $1 AND s.is_current = true LIMIT 1`,
          [`%${match.competition?.name}%`]
        );
        if (seasonRow.rows.length === 0) continue;

        await pool.query(
          `INSERT INTO matches (season_id, matchday, home_team_id, away_team_id,
                                home_score, away_score, match_date, kick_off_time,
                                status, stage_name, external_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
           ON CONFLICT DO NOTHING`,
          [
            seasonRow.rows[0].season_id,
            match.matchday || null,
            homeTeamId, awayTeamId,
            match.score?.fullTime?.home ?? 0,
            match.score?.fullTime?.away ?? 0,
            match.utcDate?.substring(0, 10),
            match.utcDate?.substring(11, 16) ? `${match.utcDate.substring(11, 16)}:00` : null,
            'live',
            match.stage || null,
            externalId,
          ]
        );
        console.log(`   [NEW] Inserted live match: ${match.homeTeam?.name} vs ${match.awayTeam?.name}`);
        continue;
      }

      const dbMatch = dbRow.rows[0];
      const newHomeScore = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? 0;
      const newAwayScore = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? 0;
      const newStatus    = mapStatus(match.status);

      // Step 2: Update score + status if changed
      const scoreChanged  = dbMatch.home_score !== newHomeScore || dbMatch.away_score !== newAwayScore;
      const statusChanged = dbMatch.status !== newStatus;

      if (scoreChanged || statusChanged) {
        await pool.query(
          `UPDATE matches
           SET home_score = $1, away_score = $2, status = $3
           WHERE match_id = $4`,
          [newHomeScore, newAwayScore, newStatus, dbMatch.match_id]
        );
        console.log(`   [UPDATE] match_id ${dbMatch.match_id}: ${newHomeScore}-${newAwayScore} (${newStatus})`);
      }

      // Step 3: Insert any new goals/cards from goals array
      for (const goal of (match.goals || [])) {
        const eventType  = goal.type === 'OWN' ? 'own_goal' : goal.type === 'PENALTY' ? 'penalty' : 'goal';
        const teamId     = await findTeamId(goal.team?.name);
        const scorerId   = await findPersonId(goal.scorer?.name);
        const assistId   = await findPersonId(goal.assist?.name);
        if (!teamId) continue;

        await pool.query(
          `INSERT INTO match_events (match_id, event_type, team_id, person_id,
                                     related_person_id, minute, description)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT DO NOTHING`,
          [dbMatch.match_id, eventType, teamId, scorerId, assistId,
           goal.minute || 0, goal.type || null]
        );
      }

      // Step 4: Insert cards from bookings array
      for (const booking of (match.bookings || [])) {
        const eventType = mapEventType('CARD', booking.card);
        if (!eventType) continue;
        const teamId   = await findTeamId(booking.team?.name);
        const personId = await findPersonId(booking.player?.name);
        if (!teamId) continue;

        await pool.query(
          `INSERT INTO match_events (match_id, event_type, team_id, person_id, minute)
           VALUES ($1,$2,$3,$4,$5)
           ON CONFLICT DO NOTHING`,
          [dbMatch.match_id, eventType, teamId, personId, booking.minute || 0]
        );
      }
    }

    // Step 5: Also update any matches that just finished
    // (status was live in our DB but API says FINISHED)
    const justFinished = await apiFetch('/matches?status=FINISHED&limit=10');
    for (const match of (justFinished.matches || []).slice(0, 10)) {
      const externalId = `fd-${match.id}`;
      await pool.query(
        `UPDATE matches
         SET status = 'finished',
             home_score = $1,
             away_score = $2
         WHERE external_id = $3 AND status = 'live'`,
        [
          match.score?.fullTime?.home ?? null,
          match.score?.fullTime?.away ?? null,
          externalId,
        ]
      );
    }

  } catch (err) {
    console.error(`   [${now()}] [ERROR] Poll cycle failed: ${err.message}`);
  }
}

// ============================================
// Also update scheduled -> live when match time arrives
// Runs once per poll cycle
// ============================================
async function activateStartingMatches() {
  // Find matches scheduled for now (within 5 minutes of kick off)
  const nowUtc = new Date().toISOString().substring(0, 16); // "2025-10-05T15:00"
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString().substring(0, 16);

  await pool.query(
    `UPDATE matches
     SET status = 'live'
     WHERE status = 'scheduled'
       AND (match_date || ' ' || COALESCE(kick_off_time::text, '00:00:00')) BETWEEN $1 AND $2`,
    [fiveMinsAgo.replace('T', ' '), nowUtc.replace('T', ' ')]
  );
}

// ============================================
// MAIN LOOP
// ============================================
async function main() {
  console.log('\nFootyPulse -- Live Updater');
  console.log('='.repeat(60));
  console.log(`   Poll interval: ${POLL_INTERVAL_MS / 1000}s`);
  console.log(`   Source: football-data.org (current 2025/26 season)`);
  console.log('   Press Ctrl+C to stop\n');
  console.log('='.repeat(60));

  if (!API_KEY) {
    console.error('[ERROR] Missing FOOTBALL_DATA_API_KEY in .env');
    process.exit(1);
  }

  // Run immediately on start, then on interval
  console.log(`\n   [${now()}] Starting first poll...`);
  await pollLiveMatches();
  await activateStartingMatches();

  const interval = setInterval(async () => {
    console.log(`\n   [${now()}] Polling...`);
    await pollLiveMatches();
    await activateStartingMatches();
  }, POLL_INTERVAL_MS);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n   Stopping live updater...');
    clearInterval(interval);
    await pool.end();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    clearInterval(interval);
    await pool.end();
    process.exit(0);
  });
}

main().catch(err => { console.error('[FATAL]', err); pool.end(); process.exit(1); });
