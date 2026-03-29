

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const run = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('\nFOOTYPULSE — Full Season Seed');
    console.log('='.repeat(60));
    console.log('  Loading 2024/25 season data for:');
    console.log('    • Premier League');
    console.log('    • La Liga');
    console.log('    • Bundesliga');
    console.log('    • Serie A');
    console.log('    • Ligue 1');
    console.log('    • UEFA Champions League');
    console.log('='.repeat(60) + '\n');

    const sql = fs.readFileSync(
      path.join(__dirname, 'full-season-seed.sql'),
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

    console.log(`Executing ${statements.length} SQL statements...\n`);

    let executed = 0;
    let errors = 0;

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          executed++;

          if (executed % 20 === 0) {
            console.log(`   ✓ ${executed}/${statements.length} done`);
          }
        } catch (err) {
          errors++;
          console.error(`\n Error on statement ${executed + 1}:`);
          console.error(`      Preview: ${statement.substring(0, 120)}...`);
          console.error(`      Error:   ${err.message}\n`);

          // Continue on non-critical errors
          if (err.message.includes('violates not-null') || 
              err.message.includes('violates foreign key')) {
            console.log(' Skipping and continuing...\n');
            executed++;
          } else {
            throw err;
          }
        }
      }
    }

    console.log(`\n Executed ${executed} statements (${errors} skipped)\n`);

    // ── Verify all tables ──
    console.log('Data Summary:');
    console.log('-'.repeat(40));

    const tables = [
      'users', 'countries', 'stadiums', 'teams', 'competitions',
      'seasons', 'persons', 'contracts', 'matches', 'match_players',
      'match_events', 'standings', 'transfers', 'achievements',
      'articles', 'comments', 'polls', 'poll_votes'
    ];

    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        const count = parseInt(result.rows[0].count);
        const icon = count > 0 ? '' : ' ';
        console.log(`   ${icon} ${table.padEnd(18)} ${String(count).padStart(4)} rows`);
      } catch (err) {
        console.log(`    ${table.padEnd(18)} error: ${err.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('   Full season seed complete!');
    console.log('   Your FootyPulse database is ready.');
    console.log('='.repeat(60) + '\n');

  } catch (err) {
    console.error('\n Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

run();
