
const db = require('../config/db');

const TeamModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT t.*, c.name AS country_name, s.name AS stadium_name
      FROM teams t
      JOIN countries c ON t.country_id = c.country_id
      LEFT JOIN stadiums s ON t.stadium_id = s.stadium_id
    `;
    const values = [];
    const conditions = [];
    let idx = 1;

    if (filters.country_id) {
      conditions.push(`t.country_id = $${idx++}`);
      values.push(filters.country_id);
    }
    if (filters.team_type) {
      conditions.push(`t.team_type = $${idx++}`);
      values.push(filters.team_type);
    }
    if (filters.search) {
      conditions.push(`(t.name ILIKE $${idx} OR t.short_name ILIKE $${idx})`);
      values.push(`%${filters.search}%`);
      idx++;
    }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY t.name LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT t.*, c.name AS country_name, c.code AS country_code,s.name AS stadium_name, s.capacity AS stadium_capacity
       FROM teams t
       JOIN countries c ON t.country_id = c.country_id
       LEFT JOIN stadiums s ON t.stadium_id = s.stadium_id
       WHERE t.team_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const result = await db.query(
      `INSERT INTO teams (name, short_name, team_type, country_id, city, stadium_id,founded_year, logo_url, primary_color, national_team_level, fifa_ranking)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [fields.name, fields.short_name, fields.team_type, fields.country_id,
       fields.city, fields.stadium_id, fields.founded_year, fields.logo_url,
       fields.primary_color, fields.national_team_level, fields.fifa_ranking]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE teams
       SET name = COALESCE($1, name), short_name = COALESCE($2, short_name),
      team_type = COALESCE($3, team_type), country_id = COALESCE($4, country_id),
      city = COALESCE($5, city), stadium_id = COALESCE($6, stadium_id),
    founded_year = COALESCE($7, founded_year), logo_url = COALESCE($8, logo_url),
      primary_color = COALESCE($9, primary_color),
       national_team_level = COALESCE($10, national_team_level),
      fifa_ranking = COALESCE($11, fifa_ranking)
       WHERE team_id = $12 RETURNING *`,
      [fields.name, fields.short_name, fields.team_type, fields.country_id,
       fields.city, fields.stadium_id, fields.founded_year, fields.logo_url,
       fields.primary_color, fields.national_team_level, fields.fifa_ranking, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM teams WHERE team_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async getSquad(teamId) {
    const result = await db.query(
      `SELECT p.*, c.jersey_number, c.contract_type, c.start_date, c.end_date
       FROM persons p
       JOIN contracts c ON p.person_id = c.person_id
       WHERE c.team_id = $1 AND c.is_current = true AND c.contract_type IN ('player', 'loan')
       ORDER BY p.primary_position, p.last_name`,
      [teamId]
    );
    return result.rows;
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM teams';
    const values = [];
    const conditions = [];
    let idx = 1;
    if (filters.country_id) { conditions.push(`country_id = $${idx++}`); values.push(filters.country_id); }
    if (filters.team_type) { conditions.push(`team_type = $${idx++}`); values.push(filters.team_type); }
    if (filters.search) {
      conditions.push(`(name ILIKE $${idx} OR short_name ILIKE $${idx})`);
      values.push(`%${filters.search}%`);
      idx++;
    }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },
};

module.exports = TeamModel;