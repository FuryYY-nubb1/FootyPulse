// ============================================
// src/models/personModel.js
// ============================================
// TABLE: persons → references: countries (nationality)
// USED BY: src/controllers/personsController.js
// ============================================

const db = require('../config/db');

const PersonModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT p.*, c.name AS nationality
      FROM persons p
      LEFT JOIN countries c ON p.nationality_id = c.country_id
    `;
    const values = [];
    const conditions = [];
    let idx = 1;

    if (filters.person_type) {
      conditions.push(`p.person_type = $${idx++}`);
      values.push(filters.person_type);
    }
    if (filters.primary_position) {
      conditions.push(`p.primary_position = $${idx++}`);
      values.push(filters.primary_position);
    }
    if (filters.nationality_id) {
      conditions.push(`p.nationality_id = $${idx++}`);
      values.push(filters.nationality_id);
    }
    if (filters.search) {
      conditions.push(`(p.first_name ILIKE $${idx} OR p.last_name ILIKE $${idx})`);
      values.push(`%${filters.search}%`);
      idx++;
    }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY p.last_name, p.first_name LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT p.*, c.name AS nationality, c.code AS nationality_code
       FROM persons p
       LEFT JOIN countries c ON p.nationality_id = c.country_id
       WHERE p.person_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const result = await db.query(
      `INSERT INTO persons (person_type, first_name, last_name, date_of_birth,
                            nationality_id, photo_url, height_cm, preferred_foot,
                            primary_position, market_value, preferred_formation)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [fields.person_type, fields.first_name, fields.last_name, fields.date_of_birth,
       fields.nationality_id, fields.photo_url, fields.height_cm, fields.preferred_foot,
       fields.primary_position, fields.market_value, fields.preferred_formation]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE persons
       SET person_type = COALESCE($1, person_type), first_name = COALESCE($2, first_name),
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
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM persons WHERE person_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async getCareer(personId) {
    const result = await db.query(
      `SELECT c.*, t.name AS team_name, t.logo_url AS team_logo
       FROM contracts c
       JOIN teams t ON c.team_id = t.team_id
       WHERE c.person_id = $1
       ORDER BY c.start_date DESC`,
      [personId]
    );
    return result.rows;
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM persons';
    const values = [];
    const conditions = [];
    let idx = 1;
    if (filters.person_type) { conditions.push(`person_type = $${idx++}`); values.push(filters.person_type); }
    if (filters.search) {
      conditions.push(`(first_name ILIKE $${idx} OR last_name ILIKE $${idx})`);
      values.push(`%${filters.search}%`); idx++;
    }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },
};

module.exports = PersonModel;
