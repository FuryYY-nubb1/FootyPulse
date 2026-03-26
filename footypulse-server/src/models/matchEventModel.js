// ============================================
// src/models/matchEventModel.js
// ============================================
// TABLE: match_events → references: matches, teams, persons
// USED BY: src/controllers/matchEventsController.js
// ============================================

const db = require('../config/db');

const MatchEventModel = {
  async getByMatch(matchId) {
    const result = await db.query(
      `SELECT me.*,
              p.display_name AS player_name,
              rp.display_name AS related_player_name,
              rp.display_name AS assist_name,
              t.name AS team_name,
              t.short_name AS team_short,
              CASE
                WHEN me.team_id = m.home_team_id THEN 'home'
                WHEN me.team_id = m.away_team_id THEN 'away'
                ELSE 'unknown'
              END AS team_side,
              CASE
                WHEN me.team_id = m.home_team_id THEN true
                ELSE false
              END AS is_home
       FROM match_events me
       JOIN matches m ON me.match_id = m.match_id
       LEFT JOIN persons p ON me.person_id = p.person_id
       LEFT JOIN persons rp ON me.related_person_id = rp.person_id
       JOIN teams t ON me.team_id = t.team_id
       WHERE me.match_id = $1
       ORDER BY me.minute, me.added_time`,
      [matchId]
    );
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT me.*,
              p.display_name AS player_name,
              rp.display_name AS related_player_name,
              rp.display_name AS assist_name,
              t.name AS team_name,
              t.short_name AS team_short,
              CASE
                WHEN me.team_id = m.home_team_id THEN 'home'
                WHEN me.team_id = m.away_team_id THEN 'away'
                ELSE 'unknown'
              END AS team_side,
              CASE
                WHEN me.team_id = m.home_team_id THEN true
                ELSE false
              END AS is_home
       FROM match_events me
       JOIN matches m ON me.match_id = m.match_id
       LEFT JOIN persons p ON me.person_id = p.person_id
       LEFT JOIN persons rp ON me.related_person_id = rp.person_id
       JOIN teams t ON me.team_id = t.team_id
       WHERE me.event_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create(fields) {
    const result = await db.query(
      `INSERT INTO match_events (match_id, event_type, team_id, person_id,
                                  related_person_id, minute, added_time, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [fields.match_id, fields.event_type, fields.team_id, fields.person_id,
       fields.related_person_id, fields.minute, fields.added_time, fields.description]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const result = await db.query(
      `UPDATE match_events
       SET event_type = COALESCE($1, event_type), team_id = COALESCE($2, team_id),
           person_id = COALESCE($3, person_id), related_person_id = COALESCE($4, related_person_id),
           minute = COALESCE($5, minute), added_time = COALESCE($6, added_time),
           description = COALESCE($7, description)
       WHERE event_id = $8 RETURNING *`,
      [fields.event_type, fields.team_id, fields.person_id, fields.related_person_id,
       fields.minute, fields.added_time, fields.description, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM match_events WHERE event_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = MatchEventModel;