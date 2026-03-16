// ============================================
// src/models/countryModel.js
// ============================================
// TABLE: countries (no foreign keys — base table)
// USED BY: src/controllers/countriesController.js
// ============================================

const db = require('../config/db');

const CountryModel = {
  async getAll() {
    const result = await db.query(
      'SELECT * FROM countries ORDER BY name'
    );
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      'SELECT * FROM countries WHERE country_id = $1',
      [id]
    );
    return result.rows[0];
  },

  async getByCode(code) {
    const result = await db.query(
      'SELECT * FROM countries WHERE code = $1',
      [code]
    );
    return result.rows[0];
  },

  async create({ name, code, flag_url, confederation }) {
    const result = await db.query(
      `INSERT INTO countries (name, code, flag_url, confederation)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, code, flag_url, confederation]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE countries
       SET name = COALESCE($1, name),
           code = COALESCE($2, code),
           flag_url = COALESCE($3, flag_url),
           confederation = COALESCE($4, confederation)
       WHERE country_id = $5 RETURNING *`,
      [fields.name, fields.code, fields.flag_url, fields.confederation, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query(
      'DELETE FROM countries WHERE country_id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  async getCount() {
    const result = await db.query('SELECT COUNT(*) FROM countries');
    return parseInt(result.rows[0].count);
  },
};

module.exports = CountryModel;
