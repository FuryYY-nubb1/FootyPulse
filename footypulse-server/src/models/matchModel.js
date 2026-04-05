
const db = require('../config/db');

const MatchModel = {
  // ── READ operations (no transaction needed) ──

  async getAll(limit = 20, offset = 0, filters = {}) {
    let query = `
      SELECT m.*,
    ht.name AS home_team_name, ht.short_name AS home_short, ht.logo_url AS home_logo,
    at.name AS away_team_name, at.short_name AS away_short, at.logo_url AS away_logo,
    s.name AS season_name, comp.name AS competition_name, comp.competition_id,
    comp.logo_url AS competition_logo,
    st.name AS stadium_name,
    ref.display_name AS referee_name
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.team_id
      JOIN teams at ON m.away_team_id = at.team_id
      JOIN seasons s ON m.season_id = s.season_id
      JOIN competitions comp ON s.competition_id = comp.competition_id
      LEFT JOIN stadiums st ON m.stadium_id = st.stadium_id
      LEFT JOIN persons ref ON m.referee_id = ref.person_id
    `;
    const values = [];
    const conditions = [];
    let idx = 1;

    if (filters.season_id) { conditions.push(`m.season_id = $${idx++}`); values.push(filters.season_id); }
    if (filters.team_id) {
      conditions.push(`(m.home_team_id = $${idx} OR m.away_team_id = $${idx})`);
      values.push(filters.team_id); idx++;
    }
    if (filters.status) { conditions.push(`m.status = $${idx++}`); values.push(filters.status); }
    if (filters.date_from) { conditions.push(`m.match_date >= $${idx++}`); values.push(filters.date_from); }
    if (filters.date_to) { conditions.push(`m.match_date <= $${idx++}`); values.push(filters.date_to); }
    if (filters.competition_id) { conditions.push(`comp.competition_id = $${idx++}`); values.push(filters.competition_id); }
    if (filters.matchday) { conditions.push(`m.matchday = $${idx++}`); values.push(filters.matchday); }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY m.match_date DESC, m.kick_off_time DESC LIMIT $${idx++} OFFSET $${idx}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT m.*,
      ht.name AS home_team_name, ht.short_name AS home_short, ht.logo_url AS home_logo,
      at.name AS away_team_name, at.short_name AS away_short, at.logo_url AS away_logo,
      s.name AS season_name,
      comp.name AS competition_name, comp.competition_id,
      comp.logo_url AS competition_logo, comp.short_name AS competition_short,
      st.name AS stadium_name, st.city AS stadium_city,
      ref.display_name AS referee_name
       FROM matches m
       JOIN teams ht ON m.home_team_id = ht.team_id
       JOIN teams at ON m.away_team_id = at.team_id
       JOIN seasons s ON m.season_id = s.season_id
       JOIN competitions comp ON s.competition_id = comp.competition_id
       LEFT JOIN stadiums st ON m.stadium_id = st.stadium_id
       LEFT JOIN persons ref ON m.referee_id = ref.person_id
       WHERE m.match_id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async getLive() {
    const result = await db.query(
      `SELECT m.*,
      ht.name AS home_team_name, ht.short_name AS home_short, ht.logo_url AS home_logo,
      at.name AS away_team_name, at.short_name AS away_short, at.logo_url AS away_logo,
      s.name AS season_name, comp.name AS competition_name, comp.competition_id,
      comp.logo_url AS competition_logo
       FROM matches m
       JOIN teams ht ON m.home_team_id = ht.team_id
       JOIN teams at ON m.away_team_id = at.team_id
       JOIN seasons s ON m.season_id = s.season_id
       JOIN competitions comp ON s.competition_id = comp.competition_id
       WHERE m.status = 'live'
       ORDER BY m.match_date, m.kick_off_time`
    );
    return result.rows;
  },

  async getByDate(date) {
    const result = await db.query(
      `SELECT m.*,
      ht.name AS home_team_name, ht.short_name AS home_short, ht.logo_url AS home_logo,
      at.name AS away_team_name, at.short_name AS away_short, at.logo_url AS away_logo,
      comp.name AS competition_name, comp.competition_id, comp.logo_url AS competition_logo
       FROM matches m
       JOIN teams ht ON m.home_team_id = ht.team_id
       JOIN teams at ON m.away_team_id = at.team_id
       JOIN seasons s ON m.season_id = s.season_id
       JOIN competitions comp ON s.competition_id = comp.competition_id
       WHERE m.match_date = $1
       ORDER BY comp.name, m.kick_off_time`,
      [date]
    );
    return result.rows;
  },

  async getHeadToHead(team1Id, team2Id, limit = 10) {
    const result = await db.query(
      `SELECT m.*,
      ht.name AS home_team_name, ht.short_name AS home_short, ht.logo_url AS home_logo,
      at.name AS away_team_name, at.short_name AS away_short, at.logo_url AS away_logo,
      comp.name AS competition_name
       FROM matches m
       JOIN teams ht ON m.home_team_id = ht.team_id
       JOIN teams at ON m.away_team_id = at.team_id
       JOIN seasons s ON m.season_id = s.season_id
       JOIN competitions comp ON s.competition_id = comp.competition_id
       WHERE ((m.home_team_id = $1 AND m.away_team_id = $2) OR
              (m.home_team_id = $2 AND m.away_team_id = $1))
         AND m.status = 'finished'
       ORDER BY m.match_date DESC LIMIT $3`,
      [team1Id, team2Id, limit]
    );
    return result.rows;
  },

  async getCount(filters = {}) {
    let query = `
      SELECT COUNT(*) FROM matches m
      JOIN seasons s ON m.season_id = s.season_id
      JOIN competitions comp ON s.competition_id = comp.competition_id
    `;
    const values = [];
    const conditions = [];
    let idx = 1;
    if (filters.season_id) { conditions.push(`m.season_id = $${idx++}`); values.push(filters.season_id); }
    if (filters.team_id) {
      conditions.push(`(m.home_team_id = $${idx} OR m.away_team_id = $${idx})`);
      values.push(filters.team_id); idx++;
    }
    if (filters.status) { conditions.push(`m.status = $${idx++}`); values.push(filters.status); }
    if (filters.competition_id) { conditions.push(`comp.competition_id = $${idx++}`); values.push(filters.competition_id); }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },

  async create(fields) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO matches (season_id, stage_name, group_name, matchday, home_team_id,
        away_team_id, home_score, away_score, home_penalties, away_penalties,
        match_date, kick_off_time, stadium_id, referee_id, status,
        attendance, home_formation, away_formation, home_stats, away_stats)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *`,
        [fields.season_id, fields.stage_name, fields.group_name, fields.matchday,
         fields.home_team_id, fields.away_team_id, fields.home_score, fields.away_score,
         fields.home_penalties, fields.away_penalties, fields.match_date, fields.kick_off_time,
         fields.stadium_id, fields.referee_id, fields.status || 'scheduled',
         fields.attendance, fields.home_formation, fields.away_formation,
         fields.home_stats ? JSON.stringify(fields.home_stats) : null,
         fields.away_stats ? JSON.stringify(fields.away_stats) : null]
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
        `UPDATE matches
         SET season_id = COALESCE($1, season_id), stage_name = COALESCE($2, stage_name),
        group_name = COALESCE($3, group_name), matchday = COALESCE($4, matchday),
        home_team_id = COALESCE($5, home_team_id), away_team_id = COALESCE($6, away_team_id),
        home_score = COALESCE($7, home_score), away_score = COALESCE($8, away_score),
        home_penalties = COALESCE($9, home_penalties), away_penalties = COALESCE($10, away_penalties),
        match_date = COALESCE($11, match_date), kick_off_time = COALESCE($12, kick_off_time),
        stadium_id = COALESCE($13, stadium_id), referee_id = COALESCE($14, referee_id),
        status = COALESCE($15, status), attendance = COALESCE($16, attendance),
        home_formation = COALESCE($17, home_formation), away_formation = COALESCE($18, away_formation),
        home_stats = COALESCE($19, home_stats), away_stats = COALESCE($20, away_stats)
         WHERE match_id = $21 RETURNING *`,
        [fields.season_id, fields.stage_name, fields.group_name, fields.matchday,
         fields.home_team_id, fields.away_team_id, fields.home_score, fields.away_score,
         fields.home_penalties, fields.away_penalties, fields.match_date, fields.kick_off_time,
         fields.stadium_id, fields.referee_id, fields.status, fields.attendance,
         fields.home_formation, fields.away_formation,
         fields.home_stats ? JSON.stringify(fields.home_stats) : undefined,
         fields.away_stats ? JSON.stringify(fields.away_stats) : undefined, id]
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
        'DELETE FROM matches WHERE match_id = $1 RETURNING *',
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

  async recordResult(matchId, homeScore, awayScore, attendance = null, homeFormation = null, awayFormation = null) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      await client.query(
        'CALL sp_record_match_result($1, $2, $3, $4, $5, $6)',
        [matchId, homeScore, awayScore, attendance, homeFormation, awayFormation]
      );

      await client.query('COMMIT');

      // Return the updated match
      const match = await this.getById(matchId);
      return match;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async getLeagueStats(seasonId) {
    const result = await db.query(
      'SELECT * FROM fn_get_league_stats($1)',
      [seasonId]
    );
    return result.rows[0] || null;
  },

  async getTeamForm(teamId, limit = 5) {
    const result = await db.query(
      'SELECT * FROM fn_get_team_form($1, $2)',
      [teamId, limit]
    );
    return result.rows;
  },

  async getTopScorers(seasonId, limit = 20) {
    const result = await db.query(
      `SELECT
      p.person_id,
      p.display_name,
      p.photo_url,
      p.primary_position,
      t.name AS team_name,
      t.short_name AS team_short,
      t.logo_url AS team_logo,
      COUNT(*) FILTER (WHERE me.event_type = 'goal') AS goals,
      COUNT(*) FILTER (WHERE me.event_type = 'penalty') AS penalties,
      COUNT(*) FILTER (WHERE me.event_type IN ('goal', 'penalty')) AS total_goals,
      COUNT(DISTINCT me.match_id) AS matches_scored_in
       FROM match_events me
       JOIN matches m ON me.match_id = m.match_id
       JOIN persons p ON me.person_id = p.person_id
       JOIN contracts c ON c.person_id = p.person_id AND c.is_current = true AND c.contract_type = 'player'
       JOIN teams t ON c.team_id = t.team_id
       WHERE m.season_id = $1
         AND me.event_type IN ('goal', 'penalty')
       GROUP BY p.person_id, p.display_name, p.photo_url, p.primary_position,
                t.name, t.short_name, t.logo_url
       ORDER BY total_goals DESC, goals DESC
       LIMIT $2`,
      [seasonId, limit]
    );
    return result.rows;
  },

  async getTopAssisters(seasonId, limit = 20) {
    const result = await db.query(
      `SELECT
          p.person_id,
          p.display_name,
          p.photo_url,
          p.primary_position,
          t.name AS team_name,
          t.short_name AS team_short,
          t.logo_url AS team_logo,
          COUNT(*) AS assists
       FROM match_events me
       JOIN matches m ON me.match_id = m.match_id
       JOIN persons p ON me.related_person_id = p.person_id
       JOIN contracts c ON c.person_id = p.person_id AND c.is_current = true AND c.contract_type = 'player'
       JOIN teams t ON c.team_id = t.team_id
       WHERE m.season_id = $1
         AND me.event_type IN ('goal', 'penalty')
         AND me.related_person_id IS NOT NULL
       GROUP BY p.person_id, p.display_name, p.photo_url, p.primary_position,
                t.name, t.short_name, t.logo_url
       ORDER BY assists DESC
       LIMIT $2`,
      [seasonId, limit]
    );
    return result.rows;
  },

  async getTeamCards(seasonId, limit = 20) {
    const result = await db.query(
      `SELECT
        t.team_id,
        t.name AS team_name,
        t.short_name,
        t.logo_url AS team_logo,
        COUNT(*) FILTER (WHERE me.event_type = 'yellow') AS yellow_cards,
        COUNT(*) FILTER (WHERE me.event_type = 'red') AS red_cards,
        COUNT(*) FILTER (WHERE me.event_type = 'second_yellow') AS second_yellows,
        COUNT(*) AS total_cards
       FROM match_events me
       JOIN matches m ON me.match_id = m.match_id
       JOIN teams t ON me.team_id = t.team_id
       WHERE m.season_id = $1
         AND me.event_type IN ('yellow', 'red', 'second_yellow')
       GROUP BY t.team_id, t.name, t.short_name, t.logo_url
       ORDER BY total_cards DESC
       LIMIT $2`,
      [seasonId, limit]
    );
    return result.rows;
  },

  async getAuditLog(matchId = null, limit = 50) {
    let query = 'SELECT * FROM match_audit';
    const values = [];
    if (matchId) {
      query += ' WHERE match_id = $1';
      values.push(matchId);
    }
    query += ' ORDER BY performed_at DESC LIMIT $' + (values.length + 1);
    values.push(limit);
    const result = await db.query(query, values);
    return result.rows;
  },
};

module.exports = MatchModel;