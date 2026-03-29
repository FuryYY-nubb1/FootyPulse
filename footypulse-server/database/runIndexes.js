// database/runIndexes.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const run = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'indexes.sql'), 'utf8');
    await pool.query(sql);
    console.log(' Indexes created successfully!');
  } catch (err) {
    console.error(' Index error:', err.message);
  } finally {
    await pool.end();
  }
};
run();
