// ============================================
// database/seedPolls.js
// ============================================
// PURPOSE: Seed the polls table with football poll data
// USAGE:   node database/seedPolls.js
// ============================================

require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seedPolls() {
  console.log('🗳️  Seeding polls data...\n');

  try {
    // ── Clear existing polls & votes ──
    await pool.query('DELETE FROM poll_votes');
    await pool.query('DELETE FROM polls');
    await pool.query("SELECT setval('polls_poll_id_seq', 1, false)");
    await pool.query("SELECT setval('poll_votes_vote_id_seq', 1, false)");
    console.log('   🗑️  Cleared existing polls and votes');

    // ── Helper: safe ID lookup (returns null if not found) ──
    const getId = async (table, idCol, nameCol, search) => {
      const r = await pool.query(
        `SELECT ${idCol} FROM ${table} WHERE ${nameCol} ILIKE $1 LIMIT 1`,
        [`%${search}%`]
      );
      return r.rows[0]?.[idCol] || null;
    };

    // Lookup existing IDs
    const liverpoolId   = await getId('teams', 'team_id', 'name', 'Liverpool');
    const arsenalId     = await getId('teams', 'team_id', 'name', 'Arsenal');
    const manCityId     = await getId('teams', 'team_id', 'name', 'Manchester City');
    const realMadridId  = await getId('teams', 'team_id', 'name', 'Real Madrid');
    const plId          = await getId('competitions', 'competition_id', 'name', 'Premier League');
    const clId          = await getId('competitions', 'competition_id', 'name', 'Champions League');
    const salahId       = await getId('persons', 'person_id', 'display_name', 'Salah');
    const haalandId     = await getId('persons', 'person_id', 'display_name', 'Haaland');

    console.log('   🔍 Looked up team/competition/person IDs');

    // ── Date helpers ──
    const now = new Date();
    const daysFromNow = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000).toISOString();

    // ── All polls ──
    const polls = [
      // ═══ FEATURED ACTIVE (3) ═══
      {
        question: 'Who will win the Premier League 2024/25?',
        description: 'The title race is heating up! Cast your vote for who you think will lift the trophy.',
        poll_type: 'single',
        options: JSON.stringify([
          { id: 0, text: 'Liverpool', votes: 3421 },
          { id: 1, text: 'Arsenal', votes: 2876 },
          { id: 2, text: 'Manchester City', votes: 2543 },
          { id: 3, text: 'Chelsea', votes: 412 },
          { id: 4, text: 'Other', votes: 234 },
        ]),
        start_date: daysFromNow(-7), end_date: daysFromNow(30),
        status: 'active', total_votes: 9486, featured: true,
        team_id: null, competition_id: plId, person_id: null,
      },
      {
        question: 'Who is the best player in the world right now?',
        description: 'Incredible performances across all leagues — who deserves the crown?',
        poll_type: 'single',
        options: JSON.stringify([
          { id: 0, text: 'Erling Haaland', votes: 4521 },
          { id: 1, text: 'Kylian Mbappe', votes: 3987 },
          { id: 2, text: 'Vinicius Jr', votes: 3654 },
          { id: 3, text: 'Mohamed Salah', votes: 2890 },
          { id: 4, text: 'Rodri', votes: 2145 },
        ]),
        start_date: daysFromNow(-7), end_date: daysFromNow(14),
        status: 'active', total_votes: 17197, featured: true,
        team_id: null, competition_id: null, person_id: null,
      },
      {
        question: 'Who will win the Champions League?',
        description: 'The road to the final is set. Which club will be crowned kings of Europe?',
        poll_type: 'single',
        options: JSON.stringify([
          { id: 0, text: 'Real Madrid', votes: 5230 },
          { id: 1, text: 'Manchester City', votes: 3412 },
          { id: 2, text: 'Barcelona', votes: 2987 },
          { id: 3, text: 'Bayern Munich', votes: 2654 },
          { id: 4, text: 'Arsenal', votes: 2201 },
          { id: 5, text: 'Inter Milan', votes: 1876 },
        ]),
        start_date: daysFromNow(-7), end_date: daysFromNow(30),
        status: 'active', total_votes: 18360, featured: true,
        team_id: null, competition_id: clId, person_id: null,
      },

      // ═══ REGULAR ACTIVE (6) ═══
      {
        question: 'Should Mohamed Salah stay at Liverpool?',
        description: 'With his contract situation unresolved, what should the Egyptian King do?',
        poll_type: 'single',
        options: JSON.stringify([
          { id: 0, text: 'Yes - sign a new deal', votes: 6721 },
          { id: 1, text: 'No - time for a new challenge', votes: 1234 },
          { id: 2, text: 'Only if the money is right', votes: 2890 },
        ]),
        start_date: daysFromNow(-3), end_date: daysFromNow(7),
        status: 'active', total_votes: 10845, featured: false,
        team_id: liverpoolId, competition_id: null, person_id: salahId,
      },
      {
        question: 'Best signing of the transfer window?',
        description: 'Which new arrival has impressed you the most this season?',
        poll_type: 'single',
        options: JSON.stringify([
          { id: 0, text: 'Zirkzee to Man Utd', votes: 876 },
          { id: 1, text: 'Solanke to Spurs', votes: 1234 },
          { id: 2, text: 'Merino to Arsenal', votes: 2145 },
          { id: 3, text: 'Savinho to Man City', votes: 987 },
          { id: 4, text: 'Chiesa to Liverpool', votes: 1543 },
        ]),
        start_date: daysFromNow(-7), end_date: daysFromNow(14),
        status: 'active', total_votes: 6785, featured: false,
        team_id: null, competition_id: null, person_id: null,
      },
      {
        question: 'What formation works best for Arsenal?',
        description: 'Arteta has been experimenting — which shape works best?',
        poll_type: 'single',
        options: JSON.stringify([
          { id: 0, text: '4-3-3', votes: 3421 },
          { id: 1, text: '4-2-3-1', votes: 2567 },
          { id: 2, text: '3-4-3', votes: 1234 },
          { id: 3, text: '4-4-2', votes: 654 },
        ]),
        start_date: daysFromNow(-3), end_date: daysFromNow(7),
        status: 'active', total_votes: 7876, featured: false,
        team_id: arsenalId, competition_id: null, person_id: null,
      },
      {
        question: 'Predict: Liverpool vs Arsenal — who wins?',
        description: 'The biggest clash of the Premier League weekend. Make your prediction!',
        poll_type: 'prediction',
        options: JSON.stringify([
          { id: 0, text: 'Liverpool Win', votes: 4567 },
          { id: 1, text: 'Draw', votes: 1890 },
          { id: 2, text: 'Arsenal Win', votes: 3421 },
        ]),
        start_date: daysFromNow(0), end_date: daysFromNow(7),
        status: 'active', total_votes: 9878, featured: false,
        team_id: liverpoolId, competition_id: plId, person_id: null,
      },
      {
        question: 'Which young player will be the next big star?',
        description: 'The next generation is here. Who has the brightest future?',
        poll_type: 'single',
        options: JSON.stringify([
          { id: 0, text: 'Lamine Yamal (Barcelona)', votes: 5678 },
          { id: 1, text: 'Kobbie Mainoo (Man Utd)', votes: 2345 },
          { id: 2, text: 'Warren Zaire-Emery (PSG)', votes: 1987 },
          { id: 3, text: 'Florian Wirtz (Leverkusen)', votes: 3456 },
          { id: 4, text: 'Alejandro Garnacho (Man Utd)', votes: 1234 },
        ]),
        start_date: daysFromNow(-3), end_date: daysFromNow(14),
        status: 'active', total_votes: 14700, featured: false,
        team_id: null, competition_id: null, person_id: null,
      },
      {
        question: 'Rate Haaland\'s season so far (1-5)',
        description: 'How would you rate the Norwegian machine\'s overall contribution?',
        poll_type: 'rating',
        options: JSON.stringify([
          { id: 0, text: '1 - Poor', votes: 45 },
          { id: 1, text: '2 - Below Average', votes: 123 },
          { id: 2, text: '3 - Average', votes: 567 },
          { id: 3, text: '4 - Good', votes: 2345 },
          { id: 4, text: '5 - Excellent', votes: 4567 },
        ]),
        start_date: daysFromNow(-7), end_date: daysFromNow(7),
        status: 'active', total_votes: 7647, featured: false,
        team_id: manCityId, competition_id: null, person_id: haalandId,
      },

      // ═══ CLOSED POLLS (3) ═══
      {
        question: 'Who won the Ballon d\'Or 2024?',
        description: 'The votes are in! Who took home the biggest individual prize?',
        poll_type: 'single',
        options: JSON.stringify([
          { id: 0, text: 'Vinicius Jr', votes: 8765 },
          { id: 1, text: 'Rodri', votes: 7654 },
          { id: 2, text: 'Jude Bellingham', votes: 4321 },
          { id: 3, text: 'Dani Carvajal', votes: 2345 },
        ]),
        start_date: '2024-10-01T00:00:00.000Z', end_date: '2024-10-28T23:59:59.000Z',
        status: 'closed', total_votes: 23085, featured: false,
        team_id: null, competition_id: null, person_id: null,
      },
      {
        question: 'Was the VAR decision correct in El Clasico?',
        description: 'The controversial penalty call — was it the right call?',
        poll_type: 'single',
        options: JSON.stringify([
          { id: 0, text: 'Yes - clear penalty', votes: 4567 },
          { id: 1, text: 'No - terrible decision', votes: 7890 },
          { id: 2, text: 'Too close to call', votes: 2345 },
        ]),
        start_date: '2024-10-26T00:00:00.000Z', end_date: '2024-11-02T23:59:59.000Z',
        status: 'closed', total_votes: 14802, featured: false,
        team_id: realMadridId, competition_id: null, person_id: null,
      },
      {
        question: 'Greatest Premier League team of all time?',
        description: 'Across all eras — which squad is the greatest ever?',
        poll_type: 'single',
        options: JSON.stringify([
          { id: 0, text: 'Man Utd 1999 (Treble Winners)', votes: 6543 },
          { id: 1, text: 'Arsenal 2004 (Invincibles)', votes: 8765 },
          { id: 2, text: 'Man City 2023 (Treble Winners)', votes: 5432 },
          { id: 3, text: 'Chelsea 2005 (Record Points)', votes: 2345 },
          { id: 4, text: 'Liverpool 2020 (Title Winners)', votes: 4567 },
        ]),
        start_date: '2024-12-01T00:00:00.000Z', end_date: '2024-12-31T23:59:59.000Z',
        status: 'closed', total_votes: 27652, featured: false,
        team_id: null, competition_id: plId, person_id: null,
      },
    ];

    // ── Insert all polls ──
    let count = 0;
    for (const p of polls) {
      await pool.query(
        `INSERT INTO polls (question, description, poll_type, options, start_date, end_date,
                            status, total_votes, results, team_id, competition_id, person_id, featured)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [p.question, p.description, p.poll_type, p.options, p.start_date, p.end_date,
         p.status, p.total_votes, '{}', p.team_id, p.competition_id, p.person_id, p.featured]
      );
      count++;
    }
    console.log(`   ✅ Inserted ${count} polls`);

    // ── Insert sample votes ──
    const votes = [
      [1, 'user_101', '[0]', 'hash_a1'],
      [1, 'user_102', '[1]', 'hash_a2'],
      [1, 'user_103', '[0]', 'hash_a3'],
      [2, 'user_101', '[3]', 'hash_b1'],
      [2, 'user_104', '[0]', 'hash_b2'],
      [3, 'user_102', '[0]', 'hash_c1'],
      [3, 'user_105', '[4]', 'hash_c2'],
      [4, 'user_103', '[0]', 'hash_d1'],
      [5, 'user_106', '[2]', 'hash_e1'],
      [7, 'user_101', '[0]', 'hash_f1'],
      [8, 'user_107', '[0]', 'hash_g1'],
      [9, 'user_108', '[4]', 'hash_h1'],
    ];

    for (const [pollId, userId, selected, hash] of votes) {
      await pool.query(
        'INSERT INTO poll_votes (poll_id, user_id, selected_options, ip_hash) VALUES ($1,$2,$3,$4)',
        [pollId, userId, selected, hash]
      );
    }
    console.log(`   ✅ Inserted ${votes.length} sample votes`);

    // ── Verify ──
    const result = await pool.query(
      'SELECT poll_id, LEFT(question, 45) AS question, status, total_votes, featured FROM polls ORDER BY featured DESC, status, poll_id'
    );
    console.log('\n   📊 Polls in database:');
    console.log('   ─────────────────────────────────────────────────────────────');
    for (const r of result.rows) {
      const badge = r.featured ? '⭐' : '  ';
      const statusIcon = r.status === 'active' ? '🟢' : '🔴';
      console.log(`   ${badge} ${statusIcon} #${r.poll_id}  ${r.question.padEnd(45)}  ${String(r.total_votes).padStart(6)} votes`);
    }
    console.log('   ─────────────────────────────────────────────────────────────');
    console.log(`\n✅ Done! ${count} polls seeded successfully.\n`);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

seedPolls();
