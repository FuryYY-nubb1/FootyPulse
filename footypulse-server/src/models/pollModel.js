const db = require('../config/db');

const PollModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `SELECT * FROM polls`;
    const values = []; const conditions = []; let idx = 1;
    if (filters.status) { conditions.push(`status = $${idx++}`); values.push(filters.status); }
    if (filters.poll_type) { conditions.push(`poll_type = $${idx++}`); values.push(filters.poll_type); }
    if (filters.featured !== undefined) { conditions.push(`featured = $${idx++}`); values.push(filters.featured); }
    if (filters.match_id) { conditions.push(`match_id = $${idx++}`); values.push(filters.match_id); }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY featured DESC, created_at DESC LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);
    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query('SELECT * FROM polls WHERE poll_id = $1', [id]);
    return result.rows[0];
  },

  async getByMatch(matchId) {
    const result = await db.query('SELECT * FROM polls WHERE match_id = $1 ORDER BY featured DESC, created_at DESC', [matchId]);
    return result.rows;
  },

  async create(fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const options = (fields.options || []).map((opt, idx) => ({
        id: opt.id !== undefined ? opt.id : idx,
        text: opt.text || opt.label || opt,
        votes: opt.votes || 0,
      }));
      const result = await client.query(
        `INSERT INTO polls (question, description, poll_type, options, start_date, end_date, status, team_id, competition_id, person_id, match_id, article_id, featured)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
        [fields.question, fields.description, fields.poll_type || 'single',
         JSON.stringify(options), fields.start_date || new Date().toISOString(),
         fields.end_date, fields.status || 'active', fields.team_id, fields.competition_id,
         fields.person_id, fields.match_id, fields.article_id, fields.featured || false]
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
        `UPDATE polls SET question = COALESCE($1, question), description = COALESCE($2, description),
         poll_type = COALESCE($3, poll_type), options = COALESCE($4, options),
         end_date = COALESCE($5, end_date), status = COALESCE($6, status),
         featured = COALESCE($7, featured), results = COALESCE($8, results)
         WHERE poll_id = $9 RETURNING *`,
        [fields.question, fields.description, fields.poll_type,
         fields.options ? JSON.stringify(fields.options) : undefined,
         fields.end_date, fields.status, fields.featured,
         fields.results ? JSON.stringify(fields.results) : undefined, id]
      );
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async delete(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query('DELETE FROM polls WHERE poll_id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async incrementVotes(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE polls SET total_votes = total_votes + 1 WHERE poll_id = $1', [id]);
      await client.query('COMMIT');
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async incrementOptionVotes(pollId, selectedOptions) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const poll = await this.getById(pollId);
      if (!poll) { await client.query('ROLLBACK'); return; }
      const options = poll.options || [];
      const updatedOptions = options.map((opt, idx) => {
        const optionId = opt.id !== undefined ? opt.id : idx;
        if (selectedOptions.includes(optionId)) return { ...opt, votes: (opt.votes || 0) + 1 };
        return opt;
      });
      await client.query('UPDATE polls SET options = $1 WHERE poll_id = $2', [JSON.stringify(updatedOptions), pollId]);
      await client.query('COMMIT');
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM polls';
    const values = []; const conditions = []; let idx = 1;
    if (filters.status) { conditions.push(`status = $${idx++}`); values.push(filters.status); }
    if (filters.poll_type) { conditions.push(`poll_type = $${idx++}`); values.push(filters.poll_type); }
    if (filters.featured !== undefined) { conditions.push(`featured = $${idx++}`); values.push(filters.featured); }
    if (filters.match_id) { conditions.push(`match_id = $${idx++}`); values.push(filters.match_id); }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },
};

module.exports = PollModel;