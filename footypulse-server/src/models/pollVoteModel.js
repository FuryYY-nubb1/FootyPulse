// ============================================
// src/models/pollVoteModel.js
// ============================================
// UPDATED: Uses stored procedure sp_cast_poll_vote for voting
//          with explicit transaction control (BEGIN/COMMIT/ROLLBACK)
// ============================================

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

  /**
   * Cast a vote using the stored procedure sp_cast_poll_vote.
   * Uses explicit transaction control: BEGIN → CALL → COMMIT / ROLLBACK.
   * The procedure handles: validation, duplicate check, vote insert,
   * option vote count update, and total_votes increment.
   */
  async create(fields) {
    const client = await db.getClient();
    try {
      // Explicit transaction control
      await client.query('BEGIN');

      // Call the stored procedure
      await client.query(
        'CALL sp_cast_poll_vote($1, $2, $3, $4)',
        [
          fields.poll_id,
          fields.user_id,
          JSON.stringify(fields.selected_options),
          fields.ip_hash || null,
        ]
      );

      await client.query('COMMIT');

      // Fetch the newly created vote to return it
      const voteResult = await db.query(
        'SELECT * FROM poll_votes WHERE poll_id = $1 AND user_id = $2',
        [fields.poll_id, fields.user_id]
      );

      return voteResult.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async delete(id) {
    // Explicit transaction control for DELETE DML
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        'DELETE FROM poll_votes WHERE vote_id = $1 RETURNING *',
        [id]
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
};

module.exports = PollVoteModel;