
const db = require('../config/db');

const StandingModel = {
  async getBySeason(seasonId, groupName = null) {
    let query = `
      SELECT st.*, t.name AS team_name,t.short_name,t.logo_url AS team_logo,comp.name AS competition_name
      FROM standings st
      JOIN teams t ON st.team_id = t.team_id
      JOIN seasons s ON st.season_id = s.season_id
      JOIN competitions comp ON s.competition_id = comp.competition_id
      WHERE st.season_id = $1
    `;
    const values = [seasonId];

    if (groupName) {
      query += ` AND st.group_name = $2`;
      values.push(groupName);
    }

    query += ` ORDER BY st.group_name, st.position`;
    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT st.*,
              t.name AS team_name,
              t.logo_url AS team_logo
       FROM standings st
       JOIN teams t ON st.team_id = t.team_id
       WHERE st.standing_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const result = await db.query(
      `INSERT INTO standings (season_id, group_name, team_id, position, played,
                              won, drawn, lost, goals_for, goals_against, points, form)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [fields.season_id, fields.group_name, fields.team_id, fields.position,
       fields.played || 0, fields.won || 0, fields.drawn || 0, fields.lost || 0,
       fields.goals_for || 0, fields.goals_against || 0, fields.points || 0, fields.form]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE standings
       SET position = COALESCE($1, position), played = COALESCE($2, played),
           won = COALESCE($3, won), drawn = COALESCE($4, drawn),
           lost = COALESCE($5, lost), goals_for = COALESCE($6, goals_for),
           goals_against = COALESCE($7, goals_against), points = COALESCE($8, points),
           form = COALESCE($9, form)
       WHERE standing_id = $10
       RETURNING *`,
      [fields.position, fields.played, fields.won, fields.drawn,
       fields.lost, fields.goals_for, fields.goals_against, fields.points,
       fields.form, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query(
      'DELETE FROM standings WHERE standing_id = $1 RETURNING *', [id]
    );
    return result.rows[0];
  },

  async createBulk(seasonId, teamIds, groupName) {
    const results = [];
    for (let i = 0; i < teamIds.length; i++) {
      const r = await db.query(
        `INSERT INTO standings (season_id, group_name, team_id, position, played, won, drawn, lost, goals_for, goals_against, points)
         VALUES ($1, $2, $3, $4, 0, 0, 0, 0, 0, 0, 0)
         ON CONFLICT (season_id, group_name, team_id) DO NOTHING
         RETURNING *`,
        [seasonId, groupName || null, teamIds[i], i + 1]
      );
      if (r.rows[0]) results.push(r.rows[0]);
    }
    return results;
  },
};

module.exports = StandingModel;