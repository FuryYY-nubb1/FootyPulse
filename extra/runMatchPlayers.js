// ============================================
// database/runMatchPlayers.js
// ============================================
// PURPOSE: Seeds match_players table for all 36 matches
// USAGE:   node database/runMatchPlayers.js
// NOTE:    Run AFTER full-season-seed.sql
// ============================================

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const run = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('\n⚽ FOOTYPULSE — Match Players Seed');
    console.log('='.repeat(50));

    const sql = fs.readFileSync(
      path.join(__dirname, 'match-players-seed.sql'),
      'utf8'
    );

    const statements = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 Executing ${statements.length} statements...\n`);

    let executed = 0;
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          executed++;
        } catch (err) {
          console.error(`❌ Error: ${err.message}`);
          console.error(`   Preview: ${statement.substring(0, 100)}...`);
          throw err;
        }
      }
    }

    // Verify
    const count = await pool.query('SELECT COUNT(*) FROM match_players');
    const matchCoverage = await pool.query(
      'SELECT COUNT(DISTINCT match_id) FROM match_players'
    );

    console.log(`\n✅ Done!`);
    console.log(`   Match players: ${count.rows[0].count} rows`);
    console.log(`   Matches covered: ${matchCoverage.rows[0].count}/36`);
    console.log('='.repeat(50) + '\n');

  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

run();
