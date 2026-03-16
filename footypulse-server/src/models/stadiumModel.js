// ============================================
// src/models/stadiumModel.js
// ============================================
// TABLE: stadiums → references: countries
// USED BY: src/controllers/stadiumsController.js
// ============================================

const db = require('../config/db');

const StadiumModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT s.*, c.name AS country_name
      FROM stadiums s
      JOIN countries c ON s.country_id = c.country_id
    `;
    const values = [];
    const conditions = [];
    let paramIndex = 1;

    if (filters.country_id) {
      conditions.push(`s.country_id = $${paramIndex++}`);
      values.push(filters.country_id);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY s.name LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT s.*, c.name AS country_name
       FROM stadiums s
       JOIN countries c ON s.country_id = c.country_id
       WHERE s.stadium_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create({ name, city, country_id, capacity, opened_year, surface_type }) {
    const result = await db.query(
      `INSERT INTO stadiums (name, city, country_id, capacity, opened_year, surface_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, city, country_id, capacity, opened_year, surface_type]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE stadiums
       SET name = COALESCE($1, name),
           city = COALESCE($2, city),
           country_id = COALESCE($3, country_id),
           capacity = COALESCE($4, capacity),
           opened_year = COALESCE($5, opened_year),
           surface_type = COALESCE($6, surface_type)
       WHERE stadium_id = $7 RETURNING *`,
      [fields.name, fields.city, fields.country_id, fields.capacity, fields.opened_year, fields.surface_type, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query(
      'DELETE FROM stadiums WHERE stadium_id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM stadiums';
    const values = [];
    if (filters.country_id) {
      query += ' WHERE country_id = $1';
      values.push(filters.country_id);
    }
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },
};

module.exports = StadiumModel;
