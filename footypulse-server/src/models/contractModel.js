
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
    const values = [];
    const conditions = [];
    let idx = 1;

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
       FROM contracts c
       JOIN persons p ON c.person_id = p.person_id
       JOIN teams t ON c.team_id = t.team_id
       LEFT JOIN teams pt ON c.parent_club_id = pt.team_id
       WHERE c.contract_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const result = await db.query(
      `INSERT INTO contracts (person_id, team_id, contract_type, start_date, end_date,
                              jersey_number, is_current, parent_club_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [fields.person_id, fields.team_id, fields.contract_type, fields.start_date,
       fields.end_date, fields.jersey_number, fields.is_current || false, fields.parent_club_id]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE contracts
       SET person_id = COALESCE($1, person_id), team_id = COALESCE($2, team_id),contract_type = COALESCE($3, contract_type), start_date = COALESCE($4, start_date),  end_date = COALESCE($5, end_date), jersey_number = COALESCE($6, jersey_number),is_current = COALESCE($7, is_current), parent_club_id = COALESCE($8, parent_club_id),matches_managed = COALESCE($9, matches_managed), wins = COALESCE($10, wins), draws = COALESCE($11, draws), losses = COALESCE($12, losses)
       WHERE contract_id = $13 RETURNING *`,
      [fields.person_id, fields.team_id, fields.contract_type, fields.start_date,
       fields.end_date, fields.jersey_number, fields.is_current, fields.parent_club_id,
       fields.matches_managed, fields.wins, fields.draws, fields.losses, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM contracts WHERE contract_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM contracts';
    const values = [];
    const conditions = [];
    let idx = 1;
    if (filters.team_id) { conditions.push(`team_id = $${idx++}`); values.push(filters.team_id); }
    if (filters.is_current !== undefined) { conditions.push(`is_current = $${idx++}`); values.push(filters.is_current); }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },
};

module.exports = ContractModel;
