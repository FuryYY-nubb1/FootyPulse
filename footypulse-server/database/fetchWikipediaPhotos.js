// ============================================
// database/fetchWikipediaPhotos.js
// ============================================
// PURPOSE: Fetch player & manager photo URLs from Wikipedia
//          Updates persons.photo_url for all persons missing a photo
//
// API:     Wikipedia REST API (free, no key needed, no rate limit issues)
// USAGE:   node database/fetchWikipediaPhotos.js
//
// HOW IT WORKS:
//   1. Gets all persons without a photo_url from the DB
//   2. Searches Wikipedia for each person's name + "footballer"
//   3. Extracts the main page image (thumbnail) via the API
//   4. Updates persons.photo_url with the Wikipedia image URL
//
// SAFE TO RUN MULTIPLE TIMES — only updates persons with NULL/empty photo_url
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// How many persons to process per run
const BATCH_SIZE = 200;

// Delay between requests (ms) — be polite to Wikipedia
const DELAY_MS = 600;

// ============================================
// Helpers
// ============================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiFetch(url) {
  const response = await fetch(url, {
    headers: {
      // Wikipedia asks for a descriptive User-Agent
      'User-Agent': 'FootyPulse/1.0 (student project; fetching footballer photos)',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// ============================================
// Wikipedia Search → Get page image
// ============================================

/**
 * Search Wikipedia for a footballer and return their page image URL.
 * Uses two API calls:
 *   1. Search for the page title
 *   2. Get the page's main image (original or thumbnail)
 */
async function getWikipediaPhoto(playerName) {
  // Step 1: Search for the Wikipedia page
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(playerName + ' footballer')}&srlimit=3&format=json`;
  const searchData = await apiFetch(searchUrl);

  const results = searchData?.query?.search || [];
  if (results.length === 0) return null;

  // Pick the best match — prefer exact name in title
  const nameLower = playerName.toLowerCase();
  const bestMatch = results.find(r =>
    r.title.toLowerCase().includes(nameLower) ||
    nameLower.includes(r.title.toLowerCase().split('(')[0].trim())
  ) || results[0];

  const pageTitle = bestMatch.title;

  // Step 2: Get the page's main image (thumbnail)
  const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&pithumbsize=400&format=json`;
  const imageData = await apiFetch(imageUrl);

  const pages = imageData?.query?.pages || {};
  const page = Object.values(pages)[0];

  if (!page || !page.thumbnail) return null;

  return page.thumbnail.source || null;
}

/**
 * Alternative: Use Wikipedia REST API (cleaner, returns larger images)
 */
async function getWikipediaPhotoREST(playerName) {
  try {
    // Use Wikipedia's REST summary endpoint which includes an image
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(playerName.replace(/ /g, '_'))}`;
    const data = await apiFetch(summaryUrl);

    // Check if we got a relevant page (not a disambiguation)
    if (data.type === 'disambiguation' || !data.thumbnail) {
      return null;
    }

    // Use the original image for better quality, fallback to thumbnail
    return data.originalimage?.source || data.thumbnail?.source || null;
  } catch (err) {
    // REST API returns 404 for pages that don't exist — that's expected
    return null;
  }
}

// ============================================
// MAIN: Fetch photos for all persons
// ============================================
async function fetchPhotos() {
  console.log('\n' + '='.repeat(60));
  console.log('  FootyPulse — Fetch Photos from Wikipedia');
  console.log('  (Free, no API key needed)');
  console.log('='.repeat(60));

  // Get persons without a photo
  const persons = await pool.query(
    `SELECT person_id, display_name, person_type
     FROM persons
     WHERE photo_url IS NULL OR photo_url = ''
     ORDER BY
       CASE person_type
         WHEN 'player' THEN 1
         WHEN 'manager' THEN 2
         ELSE 3
       END,
       person_id
     LIMIT $1`,
    [BATCH_SIZE]
  );

  const total = persons.rows.length;
  console.log(`\n   Found ${total} persons without photos\n`);

  if (total === 0) {
    console.log('   Nothing to do — all persons have photos!');
    await pool.end();
    return;
  }

  let updated = 0;
  let notFound = 0;
  let errors = 0;

  for (let i = 0; i < persons.rows.length; i++) {
    const person = persons.rows[i];
    const progress = `[${i + 1}/${total}]`;

    try {
      // Try REST API first (cleaner, better images)
      let photoUrl = await getWikipediaPhotoREST(person.display_name);

      // If REST API fails, try the search-based approach
      if (!photoUrl) {
        await sleep(300);
        photoUrl = await getWikipediaPhoto(person.display_name);
      }

      if (!photoUrl) {
        // Try with just last name + "footballer" for common names
        const lastName = person.display_name.split(' ').slice(-1)[0];
        if (lastName.length > 3) {
          await sleep(300);
          photoUrl = await getWikipediaPhoto(person.display_name);
        }
      }

      if (photoUrl) {
        await pool.query(
          'UPDATE persons SET photo_url = $1 WHERE person_id = $2',
          [photoUrl, person.person_id]
        );
        updated++;
        console.log(`   ${progress} ✅ ${person.display_name} (${person.person_type})`);
      } else {
        notFound++;
        console.log(`   ${progress} ⚠️  ${person.display_name} — no image found`);
      }

      await sleep(DELAY_MS);

    } catch (err) {
      errors++;
      console.log(`   ${progress} ❌ ${person.display_name} — ${err.message}`);
      await sleep(1000); // extra wait on error
    }
  }

  // ── Summary ──
  console.log('\n' + '='.repeat(60));
  console.log('  RESULTS');
  console.log('-'.repeat(60));
  console.log(`   ✅ Photos updated:  ${updated}`);
  console.log(`   ⚠️  Not found:      ${notFound}`);
  console.log(`   ❌ Errors:          ${errors}`);
  console.log('='.repeat(60));

  // Show overall DB stats
  const withPhoto = await pool.query(
    "SELECT COUNT(*) as c FROM persons WHERE photo_url IS NOT NULL AND photo_url != ''"
  );
  const withoutPhoto = await pool.query(
    "SELECT COUNT(*) as c FROM persons WHERE photo_url IS NULL OR photo_url = ''"
  );

  console.log(`\n  DATABASE SUMMARY`);
  console.log(`   Persons WITH photo:    ${withPhoto.rows[0].c}`);
  console.log(`   Persons WITHOUT photo: ${withoutPhoto.rows[0].c}`);
  console.log('='.repeat(60));

  if (parseInt(withoutPhoto.rows[0].c) > 0) {
    console.log(`\n  💡 Run again to process more: node database/fetchWikipediaPhotos.js`);
  }

  await pool.end();
  console.log('\nDone.\n');
}

fetchPhotos().catch(err => {
  console.error('\n[FATAL]', err);
  pool.end();
  process.exit(1);
});