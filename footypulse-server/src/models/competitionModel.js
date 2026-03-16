// ============================================
// src/models/competitionModel.js
// ============================================
// TABLE: competitions → references: countries
// USED BY: src/controllers/competitionsController.js
// ============================================

const db = require('../config/db');

const CompetitionModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT comp.*, c.name AS country_name
      FROM competitions comp
      LEFT JOIN countries c ON comp.country_id = c.country_id
    `;
    const values = [];
    const conditions = [];
    let idx = 1;

    if (filters.competition_type) {
      conditions.push(`comp.competition_type = $${idx++}`);
      values.push(filters.competition_type);
    }
    if (filters.country_id) {
      conditions.push(`comp.country_id = $${idx++}`);
      values.push(filters.country_id);
    }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY comp.name LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT comp.*, c.name AS country_name
       FROM competitions comp
       LEFT JOIN countries c ON comp.country_id = c.country_id
       WHERE comp.competition_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const result = await db.query(
      `INSERT INTO competitions (name, short_name, competition_type, country_id, level, season_format, logo_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [fields.name, fields.short_name, fields.competition_type, fields.country_id,
       fields.level, fields.season_format, fields.logo_url]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE competitions
       SET name = COALESCE($1, name), short_name = COALESCE($2, short_name),
           competition_type = COALESCE($3, competition_type), country_id = COALESCE($4, country_id),
           level = COALESCE($5, level), season_format = COALESCE($6, season_format),
           logo_url = COALESCE($7, logo_url)
       WHERE competition_id = $8 RETURNING *`,
      [fields.name, fields.short_name, fields.competition_type, fields.country_id,
       fields.level, fields.season_format, fields.logo_url, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM competitions WHERE competition_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM competitions';
    const values = [];
    if (filters.competition_type) { query += ' WHERE competition_type = $1'; values.push(filters.competition_type); }
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },
};

module.exports = CompetitionModel;
