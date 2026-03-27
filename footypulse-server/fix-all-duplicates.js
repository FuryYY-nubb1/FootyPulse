// fix-all-duplicates.js
require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  await pool.query('SELECT 1');
  console.log('Connected!\n');

  // ============================================================
  // STEP 1: Fix duplicate PERSONS
  // Keep the one with the most data (photo_url, market_value etc)
  // ============================================================
  console.log('=== STEP 1: Fix duplicate persons ===');

  const dupPersons = await pool.query(`
    SELECT display_name, date_of_birth, array_agg(person_id ORDER BY person_id) as ids
    FROM persons
    GROUP BY display_name, date_of_birth
    HAVING COUNT(*) > 1
    ORDER BY display_name
  `);
  console.log('Duplicate person groups: ' + dupPersons.rows.length);

  const personRefs = [
    ['contracts',     'person_id'],
    ['match_players', 'person_id'],
    ['match_events',  'person_id'],
    ['match_events',  'related_person_id'],
    ['transfers',     'person_id'],
    ['achievements',  'person_id'],
    ['articles',      'person_id'],
    ['polls',         'person_id'],
    ['matches',       'referee_id'],
  ];

  let personsMerged = 0;
  for (const row of dupPersons.rows) {
    const ids = row.ids;

    // Pick canonical: prefer the one with photo_url (most complete data)
    const details = await pool.query(
      'SELECT person_id, photo_url, market_value FROM persons WHERE person_id = ANY($1) ORDER BY photo_url NULLS LAST, market_value DESC NULLS LAST, person_id ASC LIMIT 1',
      [ids]
    );
    const canonical = details.rows[0].person_id;
    const dups = ids.filter(function(id) { return id !== canonical; });

    for (let d = 0; d < dups.length; d++) {
      const dupId = dups[d];
      for (let r = 0; r < personRefs.length; r++) {
        const table = personRefs[r][0];
        const col   = personRefs[r][1];
        try {
          await pool.query('UPDATE ' + table + ' SET ' + col + ' = ' + canonical + ' WHERE ' + col + ' = ' + dupId);
        } catch (e) {
          if (e.code === '23505') {
            await pool.query('DELETE FROM ' + table + ' WHERE ' + col + ' = ' + dupId).catch(function() {});
          }
        }
      }
      try {
        await pool.query('DELETE FROM persons WHERE person_id = ' + dupId);
        personsMerged++;
      } catch (e) {
        console.log('  Cannot delete person ' + dupId + ': ' + e.message.slice(0, 80));
      }
    }
  }
  console.log('Persons removed: ' + personsMerged + '\n');

  // ============================================================
  // STEP 2: Fix duplicate TEAMS
  // Keep the one with the most players
  // ============================================================
  console.log('=== STEP 2: Fix duplicate teams ===');

  const dupTeams = await pool.query(`
    SELECT name, array_agg(team_id ORDER BY team_id) as ids
    FROM teams
    GROUP BY name
    HAVING COUNT(*) > 1
    ORDER BY name
  `);
  console.log('Duplicate team groups: ' + dupTeams.rows.length);

  const teamRefs = [
    ['contracts',     'team_id'],
    ['contracts',     'parent_club_id'],
    ['matches',       'home_team_id'],
    ['matches',       'away_team_id'],
    ['match_players', 'team_id'],
    ['match_events',  'team_id'],
    ['standings',     'team_id'],
    ['transfers',     'from_team_id'],
    ['transfers',     'to_team_id'],
    ['achievements',  'team_id'],
    ['articles',      'team_id'],
    ['polls',         'team_id'],
  ];

  let teamsMerged = 0;
  for (const row of dupTeams.rows) {
    const ids = row.ids;

    // Pick canonical: most players
    const counts = await pool.query(
      'SELECT t.team_id, COUNT(c.contract_id) as cnt FROM teams t LEFT JOIN contracts c ON t.team_id = c.team_id AND c.contract_type = \'player\' WHERE t.team_id = ANY($1) GROUP BY t.team_id ORDER BY cnt DESC, team_id ASC LIMIT 1',
      [ids]
    );
    const canonical = counts.rows[0].team_id;
    const dups = ids.filter(function(id) { return id !== canonical; });

    for (let d = 0; d < dups.length; d++) {
      const dupId = dups[d];
      for (let r = 0; r < teamRefs.length; r++) {
        const table = teamRefs[r][0];
        const col   = teamRefs[r][1];
        try {
          await pool.query('UPDATE ' + table + ' SET ' + col + ' = ' + canonical + ' WHERE ' + col + ' = ' + dupId);
        } catch (e) {
          if (e.code === '23505') {
            await pool.query('DELETE FROM ' + table + ' WHERE ' + col + ' = ' + dupId).catch(function() {});
          }
        }
      }
      try {
        await pool.query('DELETE FROM teams WHERE team_id = ' + dupId);
        teamsMerged++;
      } catch (e) {
        console.log('  Cannot delete team ' + dupId + ': ' + e.message.slice(0, 80));
      }
    }
  }
  console.log('Teams removed: ' + teamsMerged + '\n');

  // ============================================================
  // STEP 3: Summary
  // ============================================================
  console.log('=== FINAL STATE ===');
  const tc = await pool.query('SELECT COUNT(*) as c FROM teams');
  const pc = await pool.query("SELECT COUNT(*) as c FROM persons WHERE person_type = 'player'");
  const cc = await pool.query("SELECT COUNT(*) as c FROM contracts WHERE contract_type = 'player' AND is_current = true");
  console.log('Teams   : ' + tc.rows[0].c);
  console.log('Players : ' + pc.rows[0].c);
  console.log('Contracts: ' + cc.rows[0].c);

  const rm = await pool.query(
    "SELECT t.team_id, t.name, COUNT(c.contract_id) as players FROM teams t LEFT JOIN contracts c ON t.team_id = c.team_id AND c.contract_type = 'player' WHERE t.name ILIKE '%real madrid%' GROUP BY t.team_id, t.name"
  );
  console.log('\nReal Madrid entries:');
  rm.rows.forEach(function(r) { console.log('  id=' + r.team_id + '  players=' + r.players); });

  await pool.end();
  console.log('\nDone! Refresh your app.');
}

run().catch(function(e) {
  console.error('ERROR: ' + e.message);
  console.error(e.stack);
  pool.end();
});
