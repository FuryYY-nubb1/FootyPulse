
const db = require('../config/db');

const TransferModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT tr.*, p.display_name AS player_name, p.photo_url AS player_photo,
             p.primary_position,
             ft.name AS from_team_name, ft.logo_url AS from_team_logo,
             tt.name AS to_team_name, tt.logo_url AS to_team_logo
      FROM transfers tr
      JOIN persons p ON tr.person_id = p.person_id
      LEFT JOIN teams ft ON tr.from_team_id = ft.team_id
      JOIN teams tt ON tr.to_team_id = tt.team_id
    `;
    const values = [];
    const conditions = [];
    let idx = 1;

    if (filters.person_id) { conditions.push(`tr.person_id = $${idx++}`); values.push(filters.person_id); }
    if (filters.team_id) {
      conditions.push(`(tr.from_team_id = $${idx} OR tr.to_team_id = $${idx})`);
      values.push(filters.team_id); idx++;
    }
    if (filters.transfer_type) { conditions.push(`tr.transfer_type = $${idx++}`); values.push(filters.transfer_type); }
    if (filters.status) { conditions.push(`tr.status = $${idx++}`); values.push(filters.status); }
    if (filters.window_year) { conditions.push(`tr.window_year = $${idx++}`); values.push(filters.window_year); }
    if (filters.window_type) { conditions.push(`tr.window_type = $${idx++}`); values.push(filters.window_type); }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY tr.transfer_date DESC NULLS LAST LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT tr.*, p.display_name AS player_name, p.photo_url AS player_photo,
              ft.name AS from_team_name, tt.name AS to_team_name
       FROM transfers tr
       JOIN persons p ON tr.person_id = p.person_id
       LEFT JOIN teams ft ON tr.from_team_id = ft.team_id
       JOIN teams tt ON tr.to_team_id = tt.team_id
       WHERE tr.transfer_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const result = await db.query(
      `INSERT INTO transfers (person_id, from_team_id, to_team_id, transfer_type,
                              status, fee, fee_currency, transfer_date, window_year, window_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [fields.person_id, fields.from_team_id, fields.to_team_id, fields.transfer_type,
       fields.status || 'official', fields.fee, fields.fee_currency || 'EUR',
       fields.transfer_date, fields.window_year, fields.window_type]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE transfers
       SET person_id = COALESCE($1, person_id), from_team_id = COALESCE($2, from_team_id),
           to_team_id = COALESCE($3, to_team_id), transfer_type = COALESCE($4, transfer_type),
           status = COALESCE($5, status), fee = COALESCE($6, fee),
           fee_currency = COALESCE($7, fee_currency), transfer_date = COALESCE($8, transfer_date),
           window_year = COALESCE($9, window_year), window_type = COALESCE($10, window_type)
       WHERE transfer_id = $11 RETURNING *`,
      [fields.person_id, fields.from_team_id, fields.to_team_id, fields.transfer_type,
       fields.status, fields.fee, fields.fee_currency, fields.transfer_date,
       fields.window_year, fields.window_type, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM transfers WHERE transfer_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM transfers';
    const values = [];
    const conditions = [];
    let idx = 1;
    if (filters.status) { conditions.push(`status = $${idx++}`); values.push(filters.status); }
    if (filters.window_year) { conditions.push(`window_year = $${idx++}`); values.push(filters.window_year); }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },
};

module.exports = TransferModel;
