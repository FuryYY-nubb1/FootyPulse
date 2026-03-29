

const db = require('../config/db');

const MatchPlayerModel = {
  async getByMatch(matchId) {
    const result = await db.query(
      `SELECT mp.*, p.display_name, p.photo_url, p.primary_position AS default_position, t.name AS team_name
       FROM match_players mp
       JOIN persons p ON mp.person_id = p.person_id
       JOIN teams t ON mp.team_id = t.team_id
       WHERE mp.match_id = $1
       ORDER BY mp.team_id, mp.is_starter DESC, mp.position`,
      [matchId]
    );
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT mp.*, p.display_name, t.name AS team_name
       FROM match_players mp
       JOIN persons p ON mp.person_id = p.person_id
       JOIN teams t ON mp.team_id = t.team_id
       WHERE mp.match_player_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const result = await db.query(
      `INSERT INTO match_players (match_id, person_id, team_id, is_starter, position,jersey_number, minute_in, minute_out, stats)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [fields.match_id, fields.person_id, fields.team_id, fields.is_starter || false,
       fields.position, fields.jersey_number, fields.minute_in, fields.minute_out,
       fields.stats ? JSON.stringify(fields.stats) : null]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE match_players
       SET is_starter = COALESCE($1, is_starter), position = COALESCE($2, position),jersey_number = COALESCE($3, jersey_number), minute_in = COALESCE($4, minute_in), minute_out = COALESCE($5, minute_out), stats = COALESCE($6, stats)
       WHERE match_player_id = $7 RETURNING *`,
      [fields.is_starter, fields.position, fields.jersey_number,
       fields.minute_in, fields.minute_out,
       fields.stats ? JSON.stringify(fields.stats) : undefined, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM match_players WHERE match_player_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // Bulk insert lineup for a match
  async createBulk(matchId, players) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const results = [];
      for (const p of players) {
        const result = await client.query(
          `INSERT INTO match_players (match_id, person_id, team_id, is_starter, position, jersey_number, minute_in)
           VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
          [matchId, p.person_id, p.team_id, p.is_starter, p.position, p.jersey_number, p.minute_in || 0]
        );
        results.push(result.rows[0]);
      }
      await client.query('COMMIT');
      return results;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};

module.exports = MatchPlayerModel;
