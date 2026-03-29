// database/runSeed.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const run = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🌱 Starting database seed...');
    
    const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    
    // Split by semicolons but be careful with semicolons inside strings
    // Remove comments and empty lines
    const statements = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    let executed = 0;
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          executed++;
          
          // Show progress for every 10 statements
          if (executed % 10 === 0) {
            console.log(`   Executed ${executed}/${statements.length} statements...`);
          }
        } catch (err) {
          console.error(`\nError executing statement ${executed + 1}:`);
          console.error(`Statement preview: ${statement.substring(0, 100)}...`);
          console.error(`Error: ${err.message}\n`);
          throw err;
        }
      }
    }
    
    console.log(` Successfully executed ${executed} statements!`);
    
    // Verify the data
    console.log('\n Verifying data...');
    const counts = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM countries'),
      pool.query('SELECT COUNT(*) FROM stadiums'),
      pool.query('SELECT COUNT(*) FROM teams'),
      pool.query('SELECT COUNT(*) FROM competitions'),
      pool.query('SELECT COUNT(*) FROM seasons'),
      pool.query('SELECT COUNT(*) FROM persons'),
      pool.query('SELECT COUNT(*) FROM contracts'),
      pool.query('SELECT COUNT(*) FROM matches'),
      pool.query('SELECT COUNT(*) FROM match_players'),
      pool.query('SELECT COUNT(*) FROM match_events'),
      pool.query('SELECT COUNT(*) FROM standings'),
      pool.query('SELECT COUNT(*) FROM transfers'),
      pool.query('SELECT COUNT(*) FROM achievements'),
      pool.query('SELECT COUNT(*) FROM articles'),
      pool.query('SELECT COUNT(*) FROM comments'),
      pool.query('SELECT COUNT(*) FROM polls'),
      pool.query('SELECT COUNT(*) FROM poll_votes')
    ]);
    
    console.log('\nData Summary:');
    console.log(`   Users: ${counts[0].rows[0].count}`);
    console.log(`   Countries: ${counts[1].rows[0].count}`);
    console.log(`   Stadiums: ${counts[2].rows[0].count}`);
    console.log(`   Teams: ${counts[3].rows[0].count}`);
    console.log(`   Competitions: ${counts[4].rows[0].count}`);
    console.log(`   Seasons: ${counts[5].rows[0].count}`);
    console.log(`   Persons: ${counts[6].rows[0].count}`);
    console.log(`   Contracts: ${counts[7].rows[0].count}`);
    console.log(`   Matches: ${counts[8].rows[0].count}`);
    console.log(`   Match Players: ${counts[9].rows[0].count}`);
    console.log(`   Match Events: ${counts[10].rows[0].count}`);
    console.log(`   Standings: ${counts[11].rows[0].count}`);
    console.log(`   Transfers: ${counts[12].rows[0].count}`);
    console.log(`   Achievements: ${counts[13].rows[0].count}`);
    console.log(`   Articles: ${counts[14].rows[0].count}`);
    console.log(`   Comments: ${counts[15].rows[0].count}`);
    console.log(`   Polls: ${counts[16].rows[0].count}`);
    console.log(`   Poll Votes: ${counts[17].rows[0].count}`);
    console.log('\n✨ Database seeding complete!\n');
    
  } catch (err) {
    console.error('\n Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

run();