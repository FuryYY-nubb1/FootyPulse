
const db = require('../config/db');

const PersonModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `SELECT p.*, c.name AS nationality FROM persons p LEFT JOIN countries c ON p.nationality_id = c.country_id`;
    const values = []; const conditions = []; let idx = 1;
    if (filters.person_type) { conditions.push(`p.person_type = $${idx++}`); values.push(filters.person_type); }
    if (filters.primary_position) { conditions.push(`p.primary_position = $${idx++}`); values.push(filters.primary_position); }
    if (filters.nationality_id) { conditions.push(`p.nationality_id = $${idx++}`); values.push(filters.nationality_id); }
    if (filters.search) { conditions.push(`(p.first_name ILIKE $${idx} OR p.last_name ILIKE $${idx})`); values.push(`%${filters.search}%`); idx++; }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY p.last_name, p.first_name LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);
    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT p.*, c.name AS nationality, c.code AS nationality_code
       FROM persons p LEFT JOIN countries c ON p.nationality_id = c.country_id
       WHERE p.person_id = $1`, [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO persons (person_type, first_name, last_name, date_of_birth, nationality_id, photo_url, height_cm, preferred_foot, primary_position, market_value, preferred_formation)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [fields.person_type, fields.first_name, fields.last_name, fields.date_of_birth,
         fields.nationality_id, fields.photo_url, fields.height_cm, fields.preferred_foot,
         fields.primary_position, fields.market_value, fields.preferred_formation]
      );
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async update(id, fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `UPDATE persons SET person_type = COALESCE($1, person_type), first_name = COALESCE($2, first_name),
         last_name = COALESCE($3, last_name), date_of_birth = COALESCE($4, date_of_birth),
         nationality_id = COALESCE($5, nationality_id), photo_url = COALESCE($6, photo_url),
         height_cm = COALESCE($7, height_cm), preferred_foot = COALESCE($8, preferred_foot),
         primary_position = COALESCE($9, primary_position), market_value = COALESCE($10, market_value),
         preferred_formation = COALESCE($11, preferred_formation)
         WHERE person_id = $12 RETURNING *`,
        [fields.person_type, fields.first_name, fields.last_name, fields.date_of_birth,
         fields.nationality_id, fields.photo_url, fields.height_cm, fields.preferred_foot,
         fields.primary_position, fields.market_value, fields.preferred_formation, id]
      );
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async delete(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query('DELETE FROM persons WHERE person_id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async getCareer(personId) {
    const result = await db.query(
      `SELECT c.*, t.name AS team_name, t.logo_url AS team_logo
       FROM contracts c JOIN teams t ON c.team_id = t.team_id
       WHERE c.person_id = $1 ORDER BY c.start_date DESC`, [personId]
    );
    return result.rows;
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM persons';
    const values = []; const conditions = []; let idx = 1;
    if (filters.person_type) { conditions.push(`person_type = $${idx++}`); values.push(filters.person_type); }
    if (filters.search) { conditions.push(`(first_name ILIKE $${idx} OR last_name ILIKE $${idx})`); values.push(`%${filters.search}%`); idx++; }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },

  // ── Function: fn_get_player_career_stats ──
  async getCareerStats(personId) {
    const result = await db.query('SELECT * FROM fn_get_player_career_stats($1)', [personId]);
    return result.rows[0] || null;
  },

  // ── Complex Query: top valued players by position ──
  async getTopValuedByPosition(limit = 10) {
    const result = await db.query(
      `SELECT p.person_id, p.display_name, p.photo_url, p.primary_position, p.market_value,
      p.date_of_birth,
      EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth))::INT AS age,
      c.name AS nationality, c.flag_url,
      t.name AS team_name, t.short_name AS team_short, t.logo_url AS team_logo,
      comp.name AS league_name
       FROM persons p
       LEFT JOIN countries c ON p.nationality_id = c.country_id
       LEFT JOIN contracts ct ON ct.person_id = p.person_id AND ct.is_current = TRUE AND ct.contract_type IN ('player', 'loan')
       LEFT JOIN teams t ON ct.team_id = t.team_id
       LEFT JOIN standings st ON st.team_id = t.team_id
       LEFT JOIN seasons s ON st.season_id = s.season_id AND s.is_current = TRUE
       LEFT JOIN competitions comp ON s.competition_id = comp.competition_id
       WHERE p.person_type = 'player' AND p.market_value IS NOT NULL AND p.market_value > 0
       ORDER BY p.market_value DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },
};

module.exports = PersonModel;