// ============================================
// src/models/contractModel.js
// ============================================
// UPDATED: All DML operations use explicit transaction control.
//   Added getExpiring() → complex query for expiring contracts.
//   Trigger trg_validate_contract handles overlap validation in PostgreSQL.
// ============================================

const db = require('../config/db');

const ContractModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT c.*, p.display_name AS person_name, p.person_type,
             t.name AS team_name, pt.name AS parent_club_name
      FROM contracts c
      JOIN persons p ON c.person_id = p.person_id
      JOIN teams t ON c.team_id = t.team_id
      LEFT JOIN teams pt ON c.parent_club_id = pt.team_id
    `;
    const values = []; const conditions = []; let idx = 1;
    if (filters.team_id) { conditions.push(`c.team_id = $${idx++}`); values.push(filters.team_id); }
    if (filters.person_id) { conditions.push(`c.person_id = $${idx++}`); values.push(filters.person_id); }
    if (filters.is_current !== undefined) { conditions.push(`c.is_current = $${idx++}`); values.push(filters.is_current); }
    if (filters.contract_type) { conditions.push(`c.contract_type = $${idx++}`); values.push(filters.contract_type); }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY c.start_date DESC LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);
    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT c.*, p.display_name AS person_name, t.name AS team_name, pt.name AS parent_club_name
       FROM contracts c JOIN persons p ON c.person_id = p.person_id
       JOIN teams t ON c.team_id = t.team_id LEFT JOIN teams pt ON c.parent_club_id = pt.team_id
       WHERE c.contract_id = $1`, [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO contracts (person_id, team_id, contract_type, start_date, end_date, jersey_number, is_current, parent_club_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [fields.person_id, fields.team_id, fields.contract_type, fields.start_date,
         fields.end_date, fields.jersey_number, fields.is_current || false, fields.parent_club_id]
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
        `UPDATE contracts SET person_id = COALESCE($1, person_id), team_id = COALESCE($2, team_id),
         contract_type = COALESCE($3, contract_type), start_date = COALESCE($4, start_date),
         end_date = COALESCE($5, end_date), jersey_number = COALESCE($6, jersey_number),
         is_current = COALESCE($7, is_current), parent_club_id = COALESCE($8, parent_club_id),
         matches_managed = COALESCE($9, matches_managed), wins = COALESCE($10, wins),
         draws = COALESCE($11, draws), losses = COALESCE($12, losses)
         WHERE contract_id = $13 RETURNING *`,
        [fields.person_id, fields.team_id, fields.contract_type, fields.start_date,
         fields.end_date, fields.jersey_number, fields.is_current, fields.parent_club_id,
         fields.matches_managed, fields.wins, fields.draws, fields.losses, id]
      );
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async delete(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query('DELETE FROM contracts WHERE contract_id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM contracts';
    const values = []; const conditions = []; let idx = 1;
    if (filters.team_id) { conditions.push(`team_id = $${idx++}`); values.push(filters.team_id); }
    if (filters.is_current !== undefined) { conditions.push(`is_current = $${idx++}`); values.push(filters.is_current); }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },

  // ── Complex Query: expiring contracts within N months ──
  async getExpiring(months = 6, limit = 50) {
    const result = await db.query(
      `SELECT c.contract_id, c.contract_type, c.start_date, c.end_date, c.jersey_number,
              p.person_id, p.display_name, p.photo_url, p.primary_position, p.market_value,
              t.team_id, t.name AS team_name, t.short_name AS team_short, t.logo_url AS team_logo,
              co.name AS nationality,
              EXTRACT(DAY FROM c.end_date - CURRENT_DATE) AS days_remaining
       FROM contracts c
       JOIN persons p ON c.person_id = p.person_id
       JOIN teams t ON c.team_id = t.team_id
       LEFT JOIN countries co ON p.nationality_id = co.country_id
       WHERE c.is_current = TRUE
         AND c.end_date IS NOT NULL
         AND c.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + ($1 || ' months')::INTERVAL
       ORDER BY c.end_date ASC
       LIMIT $2`,
      [months, limit]
    );
    return result.rows;
  },
};

module.exports = ContractModel;