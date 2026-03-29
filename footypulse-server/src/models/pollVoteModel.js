
const db = require('../config/db');

const PollVoteModel = {
  async getByPoll(pollId) {
    const result = await db.query(
      'SELECT * FROM poll_votes WHERE poll_id = $1 ORDER BY voted_at DESC',
      [pollId]
    );
    return result.rows;
  },

  async getByUser(pollId, userId) {
    const result = await db.query(
      'SELECT * FROM poll_votes WHERE poll_id = $1 AND user_id = $2',
      [pollId, userId]
    );
    return result.rows[0];
  },

  async create(fields) {
    // Use a transaction to create vote and increment poll count atomically
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO poll_votes (poll_id, user_id, selected_options, ip_hash)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [fields.poll_id, fields.user_id, JSON.stringify(fields.selected_options), fields.ip_hash]
      );

      await client.query(
        'UPDATE polls SET total_votes = total_votes + 1 WHERE poll_id = $1',
        [fields.poll_id]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async delete(id) {
    const result = await db.query('DELETE FROM poll_votes WHERE vote_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = PollVoteModel;