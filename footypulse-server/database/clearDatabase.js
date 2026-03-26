// ============================================
// database/clearDatabase.js
// ============================================
// PURPOSE: Truncate ALL 17 tables (preserve schema, remove data)
//          Uses CASCADE to handle foreign key constraints
//
// USAGE:   node database/clearDatabase.js
//
// WARNING: This DELETES all data! Schema (tables) stays intact.
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// All 17 tables in reverse-dependency order
const TABLES = [
  'poll_votes',
  'polls',
  'comments',
  'articles',
  'achievements',
  'transfers',
  'standings',
  'match_events',
  'match_players',
  'matches',
  'contracts',
  'persons',
  'seasons',
  'competitions',
  'teams',
  'stadiums',
  'countries',
  // users table is kept — don't wipe auth data
];

async function clearDatabase() {
  console.log('\n⚠️  FOOTYPULSE — DATABASE CLEAR');
  console.log('='.repeat(60));
  console.log('  This will DELETE all data from 17 tables.');
  console.log('  Schema (table structure) will be preserved.');
  console.log('  Users table is NOT touched.\n');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Show current row counts
    console.log('  BEFORE CLEAR:');
    for (const table of TABLES) {
      try {
        const result = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = result.rows[0].count;
        if (parseInt(count) > 0) {
          console.log(`    ${table.padEnd(20)} ${count} rows`);
        }
      } catch (err) {
        console.log(`    ${table.padEnd(20)} [table not found]`);
      }
    }

    console.log('\n  CLEARING...');

    // Use TRUNCATE CASCADE for clean removal
    for (const table of TABLES) {
      try {
        await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
        console.log(`    ✅ ${table}`);
      } catch (err) {
        console.log(`    ❌ ${table}: ${err.message}`);
      }
    }

    await client.query('COMMIT');

    // Verify
    console.log('\n  AFTER CLEAR:');
    let allEmpty = true;
    for (const table of TABLES) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = parseInt(result.rows[0].count);
        if (count > 0) {
          console.log(`    ⚠️  ${table.padEnd(20)} ${count} rows remaining`);
          allEmpty = false;
        }
      } catch (err) { /* skip */ }
    }

    if (allEmpty) {
      console.log('    All 17 tables are empty! ✅');
    }

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ Database cleared successfully!');
    console.log('  Next steps:');
    console.log('    1. node database/fetchTeamsApiFootball.js');
    console.log('    2. node database/fetchAllApiFootball.js');
    console.log('='.repeat(60) + '\n');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Clear failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

clearDatabase();
