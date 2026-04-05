
const db = require('../config/db');

const CommentModel = {
  async getByArticle(articleId, limit = 50, offset = 0) {
    const result = await db.query(
      `SELECT c.*,
      (SELECT COUNT(*) FROM comments r WHERE r.parent_id = c.comment_id AND r.status = 'approved') AS reply_count
       FROM comments c
       WHERE c.article_id = $1 AND c.parent_id IS NULL AND c.status = 'approved'
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET $3`,
      [articleId, limit, offset]
    );
    return result.rows;
  },

  async getReplies(commentId) {
    const result = await db.query(
      `SELECT * FROM comments
       WHERE parent_id = $1 AND status = 'approved'
       ORDER BY created_at ASC`,
      [commentId]
    );
    return result.rows;
  },

  async getById(id) {
    const result = await db.query('SELECT * FROM comments WHERE comment_id = $1', [id]);
    return result.rows[0];
  },

  // Explicit transaction control: insert comment + update article count
  async create(fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO comments (article_id, parent_id, user_id, user_name, content, status)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [fields.article_id, fields.parent_id || null, fields.user_id, fields.user_name,
         fields.content, fields.status || 'approved']
      );

      await client.query(
        'UPDATE articles SET comment_count = comment_count + 1 WHERE article_id = $1',
        [fields.article_id]
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

  async update(id, fields) {
    const result = await db.query(
      `UPDATE comments
       SET content = COALESCE($1, content), status = COALESCE($2, status)
       WHERE comment_id = $3 RETURNING *`,
      [fields.content, fields.status, id]
    );
    return result.rows[0];
  },

  // Explicit transaction control: delete comment + decrement article count
  async delete(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const comment = await client.query(
        'SELECT article_id FROM comments WHERE comment_id = $1', [id]
      );
      const result = await client.query(
        'DELETE FROM comments WHERE comment_id = $1 RETURNING *', [id]
      );

      if (result.rows[0] && comment.rows[0]) {
        await client.query(
          'UPDATE articles SET comment_count = GREATEST(0, comment_count - 1) WHERE article_id = $1',
          [comment.rows[0].article_id]
        );
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async like(id) {
    const result = await db.query(
      'UPDATE comments SET likes_count = likes_count + 1 WHERE comment_id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  async getCount(articleId) {
    const result = await db.query(
      "SELECT COUNT(*) FROM comments WHERE article_id = $1 AND status = 'approved'",
      [articleId]
    );
    return parseInt(result.rows[0].count);
  },
};

module.exports = CommentModel;