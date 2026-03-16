
// src/models/seasonModel.js
// TABLE: seasons → references: competitions
// USED BY: src/controllers/seasonsController.js


const db = require('../config/db');

const SeasonModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT s.*, comp.name AS competition_name
      FROM seasons s
      JOIN competitions comp ON s.competition_id = comp.competition_id
    `;
    const values = [];
    const conditions = [];
    let idx = 1;

    if (filters.competition_id) {
      conditions.push(`s.competition_id = $${idx++}`);
      values.push(filters.competition_id);
    }
    if (filters.is_current !== undefined) {
      conditions.push(`s.is_current = $${idx++}`);
      values.push(filters.is_current);
    }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY s.start_date DESC LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT s.*, comp.name AS competition_name
       FROM seasons s
       JOIN competitions comp ON s.competition_id = comp.competition_id
       WHERE s.season_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const result = await db.query(
      `INSERT INTO seasons (competition_id, name, start_date, end_date, is_current, stages)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [fields.competition_id, fields.name, fields.start_date, fields.end_date,
       fields.is_current || false, fields.stages || '[]']
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE seasons
       SET competition_id = COALESCE($1, competition_id), name = COALESCE($2, name),
           start_date = COALESCE($3, start_date), end_date = COALESCE($4, end_date),
           is_current = COALESCE($5, is_current), stages = COALESCE($6, stages)
       WHERE season_id = $7 RETURNING *`,
      [fields.competition_id, fields.name, fields.start_date, fields.end_date,
       fields.is_current, fields.stages, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM seasons WHERE season_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM seasons';
    const values = [];
    if (filters.competition_id) { query += ' WHERE competition_id = $1'; values.push(filters.competition_id); }
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },
};

module.exports = SeasonModel;
