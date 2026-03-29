// ============================================
// database/fetchPlayerPhotos.js
// ============================================
// PURPOSE: Fetch player photo URLs from TheSportsDB (free, no key needed)
//          Updates persons.photo_url for all players missing a photo
//
// TheSportsDB API: https://www.thesportsdb.com/api.php
// No API key required for free tier
//
// USAGE:   node database/fetchPlayerPhotos.js
// RATE LIMIT: Be polite -- script waits 1s between requests
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// How many players to process per run
const PLAYERS_PER_RUN = 150;

// ============================================
// Helpers
// ============================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiFetch(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// ============================================
// MAIN FETCH
// ============================================
async function fetchPhotos() {
  console.log('\n' + '='.repeat(60));
  console.log('  Fetching Player Photos from TheSportsDB');
  console.log('='.repeat(60));

  // Get players without a photo
  const players = await pool.query(
    `SELECT person_id, display_name, first_name, last_name
     FROM persons
     WHERE person_type = 'player'
       AND (photo_url IS NULL OR photo_url = '')
     ORDER BY person_id
     LIMIT $1`,
    [PLAYERS_PER_RUN]
  );

  console.log(`   Found ${players.rows.length} players without photos\n`);

  let updated = 0;
  let notFound = 0;

  for (const player of players.rows) {
    try {
      const searchName = encodeURIComponent(player.display_name);
      const url = `${BASE_URL}/searchplayers.php?p=${searchName}`;
      const data = await apiFetch(url);

      const results = data.player || [];

      if (results.length === 0) {
        notFound++;
        await sleep(500);
        continue;
      }

      // Pick the best match -- prefer exact name match
      const best = results.find(r =>
        r.strPlayer?.toLowerCase() === player.display_name.toLowerCase()
      ) || results[0];

      // TheSportsDB provides strThumb (small) and strCutout (transparent bg)
      // Prefer cutout, fallback to thumb
      const photoUrl = best.strCutout || best.strThumb || null;

      if (!photoUrl) {
        notFound++;
        await sleep(500);
        continue;
      }

      await pool.query(
        'UPDATE persons SET photo_url = $1 WHERE person_id = $2',
        [photoUrl, player.person_id]
      );
      updated++;
      console.log(`   [OK] ${player.display_name}`);

      await sleep(1000); // be polite to TheSportsDB

    } catch (err) {
      console.log(`   [ERROR] ${player.display_name}: ${err.message}`);
      await sleep(1000);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`   Photos updated: ${updated}`);
  console.log(`   Not found:      ${notFound}`);
  console.log('='.repeat(60));
}

// ============================================
// BONUS: Fetch team logos too while we are here
// ============================================
async function fetchTeamLogos() {
  console.log('\n' + '='.repeat(60));
  console.log('  Fetching Team Logos from TheSportsDB');
  console.log('='.repeat(60));

  const teams = await pool.query(
    `SELECT team_id, name FROM teams
     WHERE logo_url IS NULL OR logo_url = ''
     ORDER BY team_id`
  );

  console.log(`   Found ${teams.rows.length} teams without logos\n`);

  let updated = 0;

  for (const team of teams.rows) {
    try {
      const searchName = encodeURIComponent(team.name);
      const url = `${BASE_URL}/searchteams.php?t=${searchName}`;
      const data = await apiFetch(url);

      const results = data.teams || [];
      if (results.length === 0) { await sleep(500); continue; }

      const best = results.find(r =>
        r.strTeam?.toLowerCase() === team.name.toLowerCase()
      ) || results[0];

      const logoUrl = best.strTeamBadge || null;
      if (!logoUrl) { await sleep(500); continue; }

      await pool.query(
        'UPDATE teams SET logo_url = $1 WHERE team_id = $2',
        [logoUrl, team.team_id]
      );
      updated++;
      console.log(`   [OK] ${team.name}`);
      await sleep(1000);

    } catch (err) {
      console.log(`   [ERROR] ${team.name}: ${err.message}`);
      await sleep(1000);
    }
  }

  console.log(`\n   Team logos updated: ${updated}`);
}

async function main() {
  console.log('\nFootyPulse -- Fetch Photos from TheSportsDB (free, no key)');
  console.log('='.repeat(60));
  console.log(`   Processing up to ${PLAYERS_PER_RUN} players\n`);

  await fetchPhotos();
  await fetchTeamLogos();

  const withPhoto = await pool.query("SELECT COUNT(*) as c FROM persons WHERE photo_url IS NOT NULL AND photo_url != ''");
  const withLogo  = await pool.query("SELECT COUNT(*) as c FROM teams WHERE logo_url IS NOT NULL AND logo_url != ''");

  console.log('\n  DATABASE SUMMARY');
  console.log('='.repeat(60));
  console.log(`   Players with photos: ${withPhoto.rows[0].c}`);
  console.log(`   Teams with logos:    ${withLogo.rows[0].c}`);
  console.log('='.repeat(60));

  await pool.end();
  console.log('\nDone.\n');
}

main().catch(err => { console.error('[FATAL]', err); pool.end(); process.exit(1); });
