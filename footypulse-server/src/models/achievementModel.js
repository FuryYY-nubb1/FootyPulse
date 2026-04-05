
const db = require('../config/db');

const AchievementModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT a.*, t.name AS team_name, p.display_name AS person_name,
             comp.name AS competition_name, s.name AS season_name
      FROM achievements a
      LEFT JOIN teams t ON a.team_id = t.team_id
      LEFT JOIN persons p ON a.person_id = p.person_id
      LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
      LEFT JOIN seasons s ON a.season_id = s.season_id
    `;
    const values = []; const conditions = []; let idx = 1;
    if (filters.team_id) { conditions.push(`a.team_id = $${idx++}`); values.push(filters.team_id); }
    if (filters.person_id) { conditions.push(`a.person_id = $${idx++}`); values.push(filters.person_id); }
    if (filters.achievement_type) { conditions.push(`a.achievement_type = $${idx++}`); values.push(filters.achievement_type); }
    if (filters.is_major !== undefined) { conditions.push(`a.is_major = $${idx++}`); values.push(filters.is_major); }
    if (filters.year) { conditions.push(`a.year = $${idx++}`); values.push(filters.year); }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY a.year DESC, a.month DESC NULLS LAST LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);
    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT a.*, t.name AS team_name, p.display_name AS person_name, comp.name AS competition_name
       FROM achievements a LEFT JOIN teams t ON a.team_id = t.team_id
       LEFT JOIN persons p ON a.person_id = p.person_id
       LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
       WHERE a.achievement_id = $1`, [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO achievements (team_id, person_id, achievement_type, title, description, competition_id, season_id, year, month, position, stats, image_url, is_major)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
        [fields.team_id, fields.person_id, fields.achievement_type, fields.title,
         fields.description, fields.competition_id, fields.season_id, fields.year,
         fields.month, fields.position || 1, fields.stats ? JSON.stringify(fields.stats) : null,
         fields.image_url, fields.is_major || false]
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
        `UPDATE achievements SET achievement_type = COALESCE($1, achievement_type), title = COALESCE($2, title),
         description = COALESCE($3, description), competition_id = COALESCE($4, competition_id),
         season_id = COALESCE($5, season_id), year = COALESCE($6, year), month = COALESCE($7, month),
         position = COALESCE($8, position), stats = COALESCE($9, stats),
         image_url = COALESCE($10, image_url), is_major = COALESCE($11, is_major)
         WHERE achievement_id = $12 RETURNING *`,
        [fields.achievement_type, fields.title, fields.description, fields.competition_id,
         fields.season_id, fields.year, fields.month, fields.position,
         fields.stats ? JSON.stringify(fields.stats) : undefined,
         fields.image_url, fields.is_major, id]
      );
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async delete(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query('DELETE FROM achievements WHERE achievement_id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM achievements';
    const values = []; const conditions = []; let idx = 1;
    if (filters.team_id) { conditions.push(`team_id = $${idx++}`); values.push(filters.team_id); }
    if (filters.person_id) { conditions.push(`person_id = $${idx++}`); values.push(filters.person_id); }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },

  // ── Complex Query: most decorated players and teams ──
  async getMostDecorated(type = 'player', majorOnly = true, limit = 20) {
    if (type === 'team') {
      const result = await db.query(
        `SELECT t.team_id, t.name AS team_name, t.short_name, t.logo_url AS team_logo,
        co.name AS country_name,
        COUNT(*) AS total_achievements,
        COUNT(*) FILTER (WHERE a.is_major) AS major_trophies,
        COUNT(*) FILTER (WHERE a.achievement_type = 'league_title') AS league_titles,
        COUNT(*) FILTER (WHERE a.achievement_type IN ('continental_winner', 'world_club')) AS continental_titles,
        COUNT(*) FILTER (WHERE a.achievement_type IN ('cup_winner', 'supercup', 'shield')) AS cup_wins,
        STRING_AGG(DISTINCT comp.short_name, ', ' ORDER BY comp.short_name) AS competitions_won
         FROM achievements a
         JOIN teams t ON a.team_id = t.team_id
         JOIN countries co ON t.country_id = co.country_id
         LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
         WHERE a.team_id IS NOT NULL ${majorOnly ? 'AND a.is_major = TRUE' : ''}
         GROUP BY t.team_id, t.name, t.short_name, t.logo_url, co.name
         ORDER BY major_trophies DESC, total_achievements DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    }

    // Player achievements
    const result = await db.query(
      `SELECT p.person_id, p.display_name, p.photo_url, p.primary_position,
      co.name AS nationality,
      t.name AS current_team, t.logo_url AS team_logo,
      COUNT(*) AS total_achievements,
      COUNT(*) FILTER (WHERE a.is_major) AS major_awards,
      COUNT(*) FILTER (WHERE a.achievement_type IN ('ballon_dor', 'fifa_best')) AS individual_awards,
      COUNT(*) FILTER (WHERE a.achievement_type IN ('golden_boot', 'top_scorer', 'top_assists')) AS scoring_awards,
      STRING_AGG(DISTINCT a.title, ', ' ORDER BY a.title) AS award_titles
       FROM achievements a
       JOIN persons p ON a.person_id = p.person_id
       LEFT JOIN countries co ON p.nationality_id = co.country_id
       LEFT JOIN contracts ct ON ct.person_id = p.person_id AND ct.is_current = TRUE
       LEFT JOIN teams t ON ct.team_id = t.team_id
       WHERE a.person_id IS NOT NULL ${majorOnly ? 'AND a.is_major = TRUE' : ''}
       GROUP BY p.person_id, p.display_name, p.photo_url, p.primary_position, co.name, t.name, t.logo_url
       ORDER BY major_awards DESC, total_achievements DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },
};

module.exports = AchievementModel;