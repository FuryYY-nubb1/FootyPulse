const db = require('../config/db');

const CompetitionModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT comp.*, c.name AS country_name
      FROM competitions comp
      LEFT JOIN countries c ON comp.country_id = c.country_id
    `;
    const values = [];
    const conditions = [];
    let idx = 1;

    if (filters.competition_type) {
      conditions.push(`comp.competition_type = $${idx++}`);
      values.push(filters.competition_type);
    }
    if (filters.country_id) {
      conditions.push(`comp.country_id = $${idx++}`);
      values.push(filters.country_id);
    }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY comp.name LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT comp.*, c.name AS country_name
       FROM competitions comp
       LEFT JOIN countries c ON comp.country_id = c.country_id
       WHERE comp.competition_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO competitions (name, short_name, competition_type, country_id, level, season_format, logo_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [fields.name, fields.short_name, fields.competition_type, fields.country_id,
         fields.level, fields.season_format, fields.logo_url]
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
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE competitions
         SET name = COALESCE($1, name), short_name = COALESCE($2, short_name),
             competition_type = COALESCE($3, competition_type), country_id = COALESCE($4, country_id),
             level = COALESCE($5, level), season_format = COALESCE($6, season_format),
             logo_url = COALESCE($7, logo_url)
         WHERE competition_id = $8 RETURNING *`,
        [fields.name, fields.short_name, fields.competition_type, fields.country_id,
         fields.level, fields.season_format, fields.logo_url, id]
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
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        'DELETE FROM competitions WHERE competition_id = $1 RETURNING *',
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

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM competitions';
    const values = [];
    if (filters.competition_type) { query += ' WHERE competition_type = $1'; values.push(filters.competition_type); }
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },

  async setupSeason(competitionId, seasonName, startDate, endDate, teamIds, groupName = null) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      await client.query(
        'CALL sp_setup_competition_season($1, $2, $3, $4, $5, $6)',
        [competitionId, seasonName, startDate, endDate, teamIds, groupName]
      );

      await client.query('COMMIT');

      // Return the newly created season with standings
      const seasonResult = await db.query(
        `SELECT s.*, comp.name AS competition_name
         FROM seasons s
         JOIN competitions comp ON s.competition_id = comp.competition_id
         WHERE s.competition_id = $1 AND s.is_current = true
         ORDER BY s.start_date DESC LIMIT 1`,
        [competitionId]
      );

      const season = seasonResult.rows[0];

      if (season) {
        const standingsResult = await db.query(
          `SELECT st.*, t.name AS team_name, t.short_name, t.logo_url AS team_logo
           FROM standings st
           JOIN teams t ON st.team_id = t.team_id
           WHERE st.season_id = $1
           ORDER BY st.position`,
          [season.season_id]
        );
        season.standings = standingsResult.rows;
      }

      return season;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },


  async getOverview(competitionId) {
    const result = await db.query(
      'SELECT * FROM fn_get_competition_overview($1)',
      [competitionId]
    );
    return result.rows[0] || null;
  },

  async getAuditLog(competitionId = null, limit = 50) {
    let query = 'SELECT * FROM competition_audit';
    const values = [];
    if (competitionId) {
      query += ' WHERE competition_id = $1';
      values.push(competitionId);
    }
    query += ' ORDER BY performed_at DESC LIMIT $' + (values.length + 1);
    values.push(limit);
    const result = await db.query(query, values);
    return result.rows;
  },
};

module.exports = CompetitionModel;