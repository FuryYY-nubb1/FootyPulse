// ============================================
// src/models/articleModel.js
// ============================================
// UPDATED: All DML operations (create, update, delete) use
//          explicit transaction control (BEGIN/COMMIT/ROLLBACK).
//          Added publishArticle() that calls sp_publish_article procedure.
//          Added getArticleStats() that calls fn_get_article_stats function.
//          Added complex queries for analytics endpoints.
// ============================================

const db = require('../config/db');

const ArticleModel = {
  // ── READ operations (no transaction needed) ──

  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT a.*, t.name AS team_name, comp.name AS competition_name, p.display_name AS person_name
      FROM articles a
      LEFT JOIN teams t ON a.team_id = t.team_id
      LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
      LEFT JOIN persons p ON a.person_id = p.person_id
    `;
    const values = [];
    const conditions = [];
    let idx = 1;

    if (filters.status) { conditions.push(`a.status = $${idx++}`); values.push(filters.status); }
    if (filters.article_type) { conditions.push(`a.article_type = $${idx++}`); values.push(filters.article_type); }
    if (filters.team_id) { conditions.push(`a.team_id = $${idx++}`); values.push(filters.team_id); }
    if (filters.competition_id) { conditions.push(`a.competition_id = $${idx++}`); values.push(filters.competition_id); }
    if (filters.is_featured !== undefined) { conditions.push(`a.is_featured = $${idx++}`); values.push(filters.is_featured); }
    if (filters.is_breaking !== undefined) { conditions.push(`a.is_breaking = $${idx++}`); values.push(filters.is_breaking); }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY a.published_at DESC NULLS LAST LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  },

  async getBySlug(slug) {
    const result = await db.query(
      `SELECT a.*, t.name AS team_name, comp.name AS competition_name, p.display_name AS person_name
       FROM articles a
       LEFT JOIN teams t ON a.team_id = t.team_id
       LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
       LEFT JOIN persons p ON a.person_id = p.person_id
       WHERE a.slug = $1`,
      [slug]
    );
    return result.rows[0];
  },

  async getById(id) {
    const result = await db.query(
      `SELECT a.*, t.name AS team_name, comp.name AS competition_name, p.display_name AS person_name
       FROM articles a
       LEFT JOIN teams t ON a.team_id = t.team_id
       LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
       LEFT JOIN persons p ON a.person_id = p.person_id
       WHERE a.article_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // ════════════════════════════════════════════════════════════════
  // DML OPERATIONS — All use explicit transaction control
  // ════════════════════════════════════════════════════════════════

  /**
   * Create an article with explicit transaction control.
   * BEGIN → INSERT article → COMMIT / ROLLBACK
   */
  async create(fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media,
                               author_name, author_id, published_at, status, is_featured, is_breaking,
                               tags, team_id, competition_id, person_id, match_id, meta_description)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
        [fields.slug, fields.title, fields.subtitle, fields.excerpt, fields.content,
         fields.article_type || 'news', fields.media ? JSON.stringify(fields.media) : '{}',
         fields.author_name, fields.author_id, fields.published_at, fields.status || 'draft',
         fields.is_featured || false, fields.is_breaking || false,
         fields.tags ? JSON.stringify(fields.tags) : '[]',
         fields.team_id, fields.competition_id, fields.person_id, fields.match_id,
         fields.meta_description]
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

  /**
   * Update an article with explicit transaction control.
   * BEGIN → UPDATE article → COMMIT / ROLLBACK
   */
  async update(id, fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE articles
         SET title = COALESCE($1, title), subtitle = COALESCE($2, subtitle),
             excerpt = COALESCE($3, excerpt), content = COALESCE($4, content),
             article_type = COALESCE($5, article_type), media = COALESCE($6, media),
             published_at = COALESCE($7, published_at), status = COALESCE($8, status),
             is_featured = COALESCE($9, is_featured), is_breaking = COALESCE($10, is_breaking),
             tags = COALESCE($11, tags), team_id = COALESCE($12, team_id),
             competition_id = COALESCE($13, competition_id), person_id = COALESCE($14, person_id),
             match_id = COALESCE($15, match_id), meta_description = COALESCE($16, meta_description)
         WHERE article_id = $17 RETURNING *`,
        [fields.title, fields.subtitle, fields.excerpt, fields.content,
         fields.article_type, fields.media ? JSON.stringify(fields.media) : undefined,
         fields.published_at, fields.status, fields.is_featured, fields.is_breaking,
         fields.tags ? JSON.stringify(fields.tags) : undefined,
         fields.team_id, fields.competition_id, fields.person_id, fields.match_id,
         fields.meta_description, id]
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

  /**
   * Delete an article with explicit transaction control.
   * BEGIN → DELETE article → COMMIT / ROLLBACK
   */
  async delete(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        'DELETE FROM articles WHERE article_id = $1 RETURNING *',
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

  /**
   * Increment view count with explicit transaction control.
   */
  async incrementViews(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query(
        'UPDATE articles SET view_count = view_count + 1 WHERE article_id = $1',
        [id]
      );
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM articles';
    const values = [];
    const conditions = [];
    let idx = 1;
    if (filters.status) { conditions.push(`status = $${idx++}`); values.push(filters.status); }
    if (filters.article_type) { conditions.push(`article_type = $${idx++}`); values.push(filters.article_type); }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },

  // ════════════════════════════════════════════════════════════════
  // PROCEDURE CALL — sp_publish_article
  // Multi-step: validate → publish → manage breaking/featured limits
  // ════════════════════════════════════════════════════════════════

  /**
   * Publish an article using the stored procedure sp_publish_article.
   * Uses explicit transaction control: BEGIN → CALL procedure → COMMIT / ROLLBACK.
   * The procedure handles:
   *   1. Validate article exists and is in draft status
   *   2. Set status to 'published' and set published_at timestamp
   *   3. If breaking, un-break all other breaking articles
   *   4. If featured, limit featured articles to max 5
   */
  async publishArticle(articleId, isFeatured = false, isBreaking = false) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      await client.query(
        'CALL sp_publish_article($1, $2, $3)',
        [articleId, isFeatured, isBreaking]
      );

      await client.query('COMMIT');

      // Return the updated article
      const article = await this.getById(articleId);
      return article;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // ════════════════════════════════════════════════════════════════
  // FUNCTION CALL — fn_get_article_stats
  // ════════════════════════════════════════════════════════════════

  /**
   * Get article statistics using the database function fn_get_article_stats.
   * Can filter by competition_id and/or team_id.
   */
  async getArticleStats(competitionId = null, teamId = null) {
    const result = await db.query(
      'SELECT * FROM fn_get_article_stats($1, $2)',
      [competitionId, teamId]
    );
    return result.rows[0] || null;
  },

  // ════════════════════════════════════════════════════════════════
  // COMPLEX QUERIES — Multi-table joins + aggregations
  // ════════════════════════════════════════════════════════════════

  /**
   * COMPLEX QUERY 1: Trending articles
   * Joins: articles → teams → competitions → persons
   * Aggregation: ranks by view_count + comment_count weighted formula
   * across multiple tables, filtered by recent timeframe
   */
  async getTrending(days = 7, limit = 10) {
    const result = await db.query(
      `SELECT a.article_id, a.title, a.slug, a.excerpt, a.article_type,
              a.published_at, a.view_count, a.comment_count,
              a.media->>'featured_image' AS cover_image,
              a.is_featured, a.is_breaking, a.author_name,
              t.name AS team_name, t.short_name AS team_short, t.logo_url AS team_logo,
              comp.name AS competition_name, comp.logo_url AS competition_logo,
              p.display_name AS person_name,
              (a.view_count + a.comment_count * 10) AS trending_score
       FROM articles a
       LEFT JOIN teams t ON a.team_id = t.team_id
       LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
       LEFT JOIN persons p ON a.person_id = p.person_id
       WHERE a.status = 'published'
         AND a.published_at >= CURRENT_TIMESTAMP - ($1 || ' days')::INTERVAL
       ORDER BY trending_score DESC, a.published_at DESC
       LIMIT $2`,
      [days, limit]
    );
    return result.rows;
  },

  /**
   * COMPLEX QUERY 2: Author leaderboard
   * Aggregation: groups articles by author, counts articles + sums views/comments
   * across articles, teams, competitions
   */
  async getAuthorLeaderboard(limit = 10) {
    const result = await db.query(
      `SELECT a.author_name,
              a.author_id,
              COUNT(*) AS total_articles,
              SUM(a.view_count) AS total_views,
              SUM(a.comment_count) AS total_comments,
              ROUND(AVG(a.view_count), 0) AS avg_views,
              COUNT(DISTINCT a.competition_id) AS competitions_covered,
              COUNT(DISTINCT a.team_id) AS teams_covered,
              MAX(a.published_at) AS last_published
       FROM articles a
       WHERE a.status = 'published'
       GROUP BY a.author_name, a.author_id
       ORDER BY total_articles DESC, total_views DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  /**
   * COMPLEX QUERY 3: Articles per competition with engagement metrics
   * Joins: articles → competitions → countries
   * Aggregation: counts articles, sums views/comments per competition
   */
  async getArticlesByCompetition(limit = 20) {
    const result = await db.query(
      `SELECT comp.competition_id,
              comp.name AS competition_name,
              comp.short_name,
              comp.logo_url AS competition_logo,
              c.name AS country_name,
              COUNT(a.article_id) AS article_count,
              COALESCE(SUM(a.view_count), 0) AS total_views,
              COALESCE(SUM(a.comment_count), 0) AS total_comments,
              ROUND(AVG(a.view_count), 0) AS avg_views,
              COUNT(*) FILTER (WHERE a.article_type = 'match_report') AS match_reports,
              COUNT(*) FILTER (WHERE a.article_type = 'transfer') AS transfer_articles,
              MAX(a.published_at) AS latest_article
       FROM competitions comp
       LEFT JOIN countries c ON comp.country_id = c.country_id
       LEFT JOIN articles a ON a.competition_id = comp.competition_id AND a.status = 'published'
       GROUP BY comp.competition_id, comp.name, comp.short_name, comp.logo_url, c.name
       HAVING COUNT(a.article_id) > 0
       ORDER BY article_count DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  /**
   * Get article audit log (from shadow table populated by trigger)
   */
  async getAuditLog(articleId = null, limit = 50) {
    let query = 'SELECT * FROM article_audit';
    const values = [];
    if (articleId) {
      query += ' WHERE article_id = $1';
      values.push(articleId);
    }
    query += ' ORDER BY performed_at DESC LIMIT $' + (values.length + 1);
    values.push(limit);
    const result = await db.query(query, values);
    return result.rows;
  },
};

module.exports = ArticleModel;