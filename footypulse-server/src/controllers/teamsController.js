
const TeamModel = require('../models/teamModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');
const db = require('../config/db');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    country_id: req.query.country_id,
    team_type: req.query.team_type,
    search: req.query.search,
  };
  const [teams, total] = await Promise.all([
    TeamModel.getAll(limit, offset, filters),
    TeamModel.getCount(filters),
  ]);
  res.json(paginate(teams, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const team = await TeamModel.getById(req.params.id);
  if (!team) throw ApiError.notFound('Team not found');
  res.json({ success: true, data: team });
});

exports.getSquad = asyncHandler(async (req, res) => {
  const squad = await TeamModel.getSquad(req.params.id);
  res.json({ success: true, data: squad });
});


exports.getMatches = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, limit: queryLimit } = req.query;
  const limitVal = parseInt(queryLimit) || 50;

  let query = `
    SELECT m.*, ht.name AS home_team_name, ht.short_name AS home_short, ht.logo_url AS home_logo,
    at2.name AS away_team_name, at2.short_name AS away_short, at2.logo_url AS away_logo,
    s.name AS season_name,comp.name AS competition_name, comp.short_name AS competition_short, comp.logo_url AS competition_logo,
    st.name AS stadium_name
    FROM matches m
    JOIN teams ht ON m.home_team_id = ht.team_id
    JOIN teams at2 ON m.away_team_id = at2.team_id
    JOIN seasons s ON m.season_id = s.season_id
    JOIN competitions comp ON s.competition_id = comp.competition_id
    LEFT JOIN stadiums st ON m.stadium_id = st.stadium_id
    WHERE (m.home_team_id = $1 OR m.away_team_id = $1)
  `;
  const values = [id];
  let idx = 2;

  if (status) {
    query += ` AND m.status = $${idx++}`;
    values.push(status);
  }

  query += ` ORDER BY m.match_date DESC, m.kick_off_time DESC LIMIT $${idx}`;
  values.push(limitVal);

  const result = await db.query(query, values);
  res.json({ success: true, data: result.rows });
});


exports.getTransfers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit: queryLimit } = req.query;
  const limitVal = parseInt(queryLimit) || 30;

  const result = await db.query(
    `SELECT tr.*,
    p.display_name AS player_name, p.photo_url AS player_photo, p.primary_position,ft.name AS from_team_name, ft.logo_url AS from_team_logo,tt.name AS to_team_name, tt.logo_url AS to_team_logo
     FROM transfers tr
     JOIN persons p ON tr.person_id = p.person_id
     LEFT JOIN teams ft ON tr.from_team_id = ft.team_id
     JOIN teams tt ON tr.to_team_id = tt.team_id
     WHERE tr.from_team_id = $1 OR tr.to_team_id = $1
     ORDER BY tr.transfer_date DESC NULLS LAST
     LIMIT $2`,
    [id, limitVal]
  );
  res.json({ success: true, data: result.rows });
});

// ── GET /teams/:id/stats ──
// Returns team stats from current season standings
exports.getStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await db.query(
    `SELECT st.*, s.name AS season_name, comp.name AS competition_name
     FROM standings st
     JOIN seasons s ON st.season_id = s.season_id
     JOIN competitions comp ON s.competition_id = comp.competition_id
     WHERE st.team_id = $1 AND s.is_current = true
     ORDER BY comp.name`,
    [id]
  );
  res.json({ success: true, data: result.rows });
});

exports.create = asyncHandler(async (req, res) => {
  const team = await TeamModel.create(req.body);
  res.status(201).json({ success: true, data: team });
});

exports.update = asyncHandler(async (req, res) => {
  const team = await TeamModel.update(req.params.id, req.body);
  if (!team) throw ApiError.notFound('Team not found');
  res.json({ success: true, data: team });
});

exports.remove = asyncHandler(async (req, res) => {
  const team = await TeamModel.delete(req.params.id);
  if (!team) throw ApiError.notFound('Team not found');
  res.json({ success: true, message: 'Team deleted' });
});