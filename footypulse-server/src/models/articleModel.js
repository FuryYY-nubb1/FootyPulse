


const db = require('../config/db');

const ArticleModel = {
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

  async create(fields) {
    const result = await db.query(
      `INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, tags, team_id, competition_id,person_id, match_id, meta_description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
      [fields.slug, fields.title, fields.subtitle, fields.excerpt, fields.content,
       fields.article_type || 'news', fields.media ? JSON.stringify(fields.media) : '{}',
       fields.author_name, fields.author_id, fields.published_at, fields.status || 'draft',
       fields.is_featured || false, fields.is_breaking || false,
       fields.tags ? JSON.stringify(fields.tags) : '[]',
       fields.team_id, fields.competition_id, fields.person_id, fields.match_id,
       fields.meta_description]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
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
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM articles WHERE article_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async incrementViews(id) {
    await db.query('UPDATE articles SET view_count = view_count + 1 WHERE article_id = $1', [id]);
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
};

module.exports = ArticleModel;
