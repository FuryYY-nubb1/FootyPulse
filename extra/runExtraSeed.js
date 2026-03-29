// ============================================
// database/runExtraSeed.js
// ============================================
// PURPOSE: Runs the expanded transfers & news seed file
//          against your Neon database.
//
// USAGE:   node database/runExtraSeed.js
//
// NOTE:    Run this AFTER seed.sql (npm run db:seed)
//          so all referenced person/team IDs exist.
// ============================================

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const run = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('⚽ Starting expanded transfers & news seed...\n');

    const sql = fs.readFileSync(
      path.join(__dirname, 'seed-transfers-and-news.sql'),
      'utf8'
    );

    // Split into individual statements (skip comments & empty lines)
    const statements = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);

    let executed = 0;
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          executed++;
          if (executed % 5 === 0) {
            console.log(`   ✓ ${executed}/${statements.length} done`);
          }
        } catch (err) {
          console.error(`\n❌ Error on statement ${executed + 1}:`);
          console.error(`   Preview: ${statement.substring(0, 120)}...`);
          console.error(`   Error:   ${err.message}\n`);
          throw err;
        }
      }
    }

    console.log(`\n✅ Executed ${executed} statements successfully!\n`);

    // Verify counts
    const transfers = await pool.query('SELECT COUNT(*) FROM transfers');
    const articles  = await pool.query('SELECT COUNT(*) FROM articles');
    const comments  = await pool.query('SELECT COUNT(*) FROM comments');

    console.log('📊 Verification:');
    console.log(`   Transfers: ${transfers.rows[0].count}`);
    console.log(`   Articles:  ${articles.rows[0].count}`);
    console.log(`   Comments:  ${comments.rows[0].count}`);
    console.log('\n✨ Expanded seed complete!\n');

  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

run();
