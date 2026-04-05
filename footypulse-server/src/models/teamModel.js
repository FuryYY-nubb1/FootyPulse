const db = require('../config/db');

const TeamModel = {
  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `SELECT t.*, c.name AS country_name, s.name AS stadium_name
      FROM teams t JOIN countries c ON t.country_id = c.country_id LEFT JOIN stadiums s ON t.stadium_id = s.stadium_id`;
    const values = []; const conditions = []; let idx = 1;
    if (filters.country_id) { conditions.push(`t.country_id = $${idx++}`); values.push(filters.country_id); }
    if (filters.team_type) { conditions.push(`t.team_type = $${idx++}`); values.push(filters.team_type); }
    if (filters.search) { conditions.push(`(t.name ILIKE $${idx} OR t.short_name ILIKE $${idx})`); values.push(`%${filters.search}%`); idx++; }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY t.name LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);
    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT t.*, c.name AS country_name, c.code AS country_code, s.name AS stadium_name, s.capacity AS stadium_capacity
       FROM teams t JOIN countries c ON t.country_id = c.country_id LEFT JOIN stadiums s ON t.stadium_id = s.stadium_id
       WHERE t.team_id = $1`, [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO teams (name, short_name, team_type, country_id, city, stadium_id, founded_year, logo_url, primary_color, national_team_level, fifa_ranking)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [fields.name, fields.short_name, fields.team_type, fields.country_id,
         fields.city, fields.stadium_id, fields.founded_year, fields.logo_url,
         fields.primary_color, fields.national_team_level, fields.fifa_ranking]
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
        `UPDATE teams SET name = COALESCE($1, name), short_name = COALESCE($2, short_name),
         team_type = COALESCE($3, team_type), country_id = COALESCE($4, country_id),
         city = COALESCE($5, city), stadium_id = COALESCE($6, stadium_id),
         founded_year = COALESCE($7, founded_year), logo_url = COALESCE($8, logo_url),
         primary_color = COALESCE($9, primary_color), national_team_level = COALESCE($10, national_team_level),
         fifa_ranking = COALESCE($11, fifa_ranking)
         WHERE team_id = $12 RETURNING *`,
        [fields.name, fields.short_name, fields.team_type, fields.country_id,
         fields.city, fields.stadium_id, fields.founded_year, fields.logo_url,
         fields.primary_color, fields.national_team_level, fields.fifa_ranking, id]
      );
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async delete(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query('DELETE FROM teams WHERE team_id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  },

  async getSquad(teamId) {
    const result = await db.query(
      `SELECT p.*, c.jersey_number, c.contract_type, c.start_date, c.end_date
       FROM persons p JOIN contracts c ON p.person_id = c.person_id
       WHERE c.team_id = $1 AND c.is_current = true AND c.contract_type IN ('player', 'loan')
       ORDER BY p.primary_position, p.last_name`, [teamId]
    );
    return result.rows;
  },

  async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) FROM teams';
    const values = []; const conditions = []; let idx = 1;
    if (filters.country_id) { conditions.push(`country_id = $${idx++}`); values.push(filters.country_id); }
    if (filters.team_type) { conditions.push(`team_type = $${idx++}`); values.push(filters.team_type); }
    if (filters.search) { conditions.push(`(name ILIKE $${idx} OR short_name ILIKE $${idx})`); values.push(`%${filters.search}%`); idx++; }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },

  async getSquadValueRanking(limit = 20) {
    const result = await db.query(
      `SELECT t.team_id, t.name AS team_name, t.short_name, t.logo_url AS team_logo,
      co.name AS country_name,
      COUNT(p.person_id) AS squad_size,
      COALESCE(SUM(p.market_value), 0) AS total_squad_value,
      ROUND(AVG(p.market_value) FILTER (WHERE p.market_value > 0), 2) AS avg_player_value,
      MAX(p.market_value) AS highest_valued_player,
      (SELECT p2.display_name FROM persons p2
        JOIN contracts c2 ON p2.person_id = c2.person_id
        WHERE c2.team_id = t.team_id AND c2.is_current = TRUE
        ORDER BY p2.market_value DESC NULLS LAST LIMIT 1) AS top_player_name
       FROM teams t
       JOIN countries co ON t.country_id = co.country_id
       JOIN contracts c ON c.team_id = t.team_id AND c.is_current = TRUE AND c.contract_type IN ('player', 'loan')
       JOIN persons p ON c.person_id = p.person_id
       WHERE t.team_type = 'club'
       GROUP BY t.team_id, t.name, t.short_name, t.logo_url, co.name
       ORDER BY total_squad_value DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },
};

module.exports = TeamModel;