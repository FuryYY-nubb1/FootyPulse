

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const run = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('Schema created successfully!');
  } catch (err) {
    console.error(' Schema error:', err.message);
  } finally {
    await pool.end();
  }
};

run();
