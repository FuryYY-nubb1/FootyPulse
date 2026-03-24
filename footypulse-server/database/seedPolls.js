// ============================================
// database/seedPolls.js
// ============================================
// PURPOSE: Seeds ONLY the polls + poll_votes tables
// USAGE:   node database/seedPolls.js
//
// This is safe to run independently — it does NOT
// truncate or touch any other tables.
// ============================================

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const run = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🗳️  Seeding polls data...\n');

    const sql = fs.readFileSync(path.join(__dirname, 'seedPolls.sql'), 'utf8');

    // Split by semicolons, filter empty/comments
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
        } catch (err) {
          console.error(`❌ Error on statement ${executed + 1}:`);
          console.error(`   Preview: ${statement.substring(0, 120)}...`);
          console.error(`   Error: ${err.message}\n`);
          throw err;
        }
      }
    }

    // Verify
    const pollCount = await pool.query('SELECT COUNT(*) FROM polls');
    const voteCount = await pool.query('SELECT COUNT(*) FROM poll_votes');

    console.log(`✅ Done! Executed ${executed} statements.`);
    console.log(`   Polls:      ${pollCount.rows[0].count}`);
    console.log(`   Poll Votes: ${voteCount.rows[0].count}`);

    // Show poll summary
    const polls = await pool.query(
      'SELECT poll_id, question, status, total_votes, featured FROM polls ORDER BY poll_id'
    );
    console.log('\n📊 Poll Summary:');
    polls.rows.forEach(p => {
      const icon = p.status === 'active' ? '🟢' : '🔴';
      const star = p.featured ? '⭐' : '  ';
      console.log(`   ${icon} ${star} #${p.poll_id}: "${p.question}" (${p.total_votes} votes)`);
    });

    console.log('\n🎉 Polls seeded successfully!\n');

  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

run();