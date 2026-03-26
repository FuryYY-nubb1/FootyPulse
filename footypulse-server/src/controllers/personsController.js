// ============================================
// src/controllers/personsController.js
// ============================================

const PersonModel = require('../models/personModel');
const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    person_type: req.query.person_type,
    primary_position: req.query.position,
    nationality_id: req.query.nationality_id,
    search: req.query.search,
  };
  const [persons, total] = await Promise.all([
    PersonModel.getAll(limit, offset, filters),
    PersonModel.getCount(filters),
  ]);
  res.json(paginate(persons, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const person = await PersonModel.getById(req.params.id);
  if (!person) throw ApiError.notFound('Person not found');
  res.json({ success: true, data: person });
});

exports.getCareer = asyncHandler(async (req, res) => {
  const career = await PersonModel.getCareer(req.params.id);
  res.json({ success: true, data: career });
});

// ── GET /persons/:id/stats ──
// Aggregates stats from match_players and match_events
exports.getStats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { seasonId } = req.query;

  // Get appearance count and aggregate stats from match_players
  let statsQuery = `
    SELECT
      COUNT(DISTINCT mp.match_id) AS appearances,
      COALESCE(SUM(CASE WHEN mp.minute_out IS NOT NULL AND mp.minute_in IS NOT NULL
        THEN mp.minute_out - mp.minute_in
        WHEN mp.is_starter THEN 90
        ELSE 30
      END), 0) AS minutes_played,
      ROUND(AVG(NULLIF((mp.stats->>'rating')::numeric, 0)), 2) AS avg_rating
    FROM match_players mp
    JOIN matches m ON mp.match_id = m.match_id
  `;
  const statsValues = [id];
  let idx = 2;

  if (seasonId) {
    statsQuery += ` WHERE mp.person_id = $1 AND m.season_id = $${idx}`;
    statsValues.push(seasonId);
  } else {
    statsQuery += ` WHERE mp.person_id = $1`;
  }

  const statsResult = await db.query(statsQuery, statsValues);
  const baseStats = statsResult.rows[0] || {};

  // Get goals from match_events
  let goalsQuery = `
    SELECT COUNT(*) AS goals
    FROM match_events me
    JOIN matches m ON me.match_id = m.match_id
    WHERE me.person_id = $1
      AND me.event_type IN ('goal', 'penalty')
  `;
  const goalsValues = [id];
  let gIdx = 2;
  if (seasonId) {
    goalsQuery += ` AND m.season_id = $${gIdx}`;
    goalsValues.push(seasonId);
  }
  const goalsResult = await db.query(goalsQuery, goalsValues);

  // Get assists from match_events (related_person_id for goals)
  let assistsQuery = `
    SELECT COUNT(*) AS assists
    FROM match_events me
    JOIN matches m ON me.match_id = m.match_id
    WHERE me.related_person_id = $1
      AND me.event_type IN ('goal', 'penalty')
  `;
  const assistsValues = [id];
  let aIdx = 2;
  if (seasonId) {
    assistsQuery += ` AND m.season_id = $${aIdx}`;
    assistsValues.push(seasonId);
  }
  const assistsResult = await db.query(assistsQuery, assistsValues);

  // Get cards from match_events
  let cardsQuery = `
    SELECT
      COUNT(*) FILTER (WHERE me.event_type = 'yellow') AS yellow_cards,
      COUNT(*) FILTER (WHERE me.event_type IN ('red', 'second_yellow')) AS red_cards
    FROM match_events me
    JOIN matches m ON me.match_id = m.match_id
    WHERE me.person_id = $1
  `;
  const cardsValues = [id];
  let cIdx = 2;
  if (seasonId) {
    cardsQuery += ` AND m.season_id = $${cIdx}`;
    cardsValues.push(seasonId);
  }
  const cardsResult = await db.query(cardsQuery, cardsValues);

  // Aggregate advanced stats from match_players JSONB stats column
  let advancedQuery = `
    SELECT
      COALESCE(SUM((mp.stats->>'shots')::int), 0) AS shots,
      COALESCE(SUM((mp.stats->>'shots_on_target')::int), 0) AS shots_on_target,
      COALESCE(SUM((mp.stats->>'passes')::int), 0) AS passes,
      ROUND(AVG(NULLIF((mp.stats->>'pass_accuracy')::numeric, 0)), 1) AS pass_accuracy,
      COALESCE(SUM((mp.stats->>'tackles')::int), 0) AS tackles,
      COALESCE(SUM((mp.stats->>'interceptions')::int), 0) AS interceptions,
      COALESCE(SUM((mp.stats->>'saves')::int), 0) AS saves,
      COALESCE(SUM((mp.stats->>'clean_sheets')::int), 0) AS clean_sheets
    FROM match_players mp
    JOIN matches m ON mp.match_id = m.match_id
    WHERE mp.person_id = $1
  `;
  const advValues = [id];
  if (seasonId) {
    advancedQuery += ` AND m.season_id = $2`;
    advValues.push(seasonId);
  }

  let advanced = {};
  try {
    const advResult = await db.query(advancedQuery, advValues);
    advanced = advResult.rows[0] || {};
  } catch (err) {
    // Stats JSON fields may not exist for all players
    console.error('Advanced stats query failed (non-critical):', err.message);
  }

  const data = {
    appearances: parseInt(baseStats.appearances) || 0,
    minutes_played: parseInt(baseStats.minutes_played) || 0,
    avg_rating: parseFloat(baseStats.avg_rating) || 0,
    goals: parseInt(goalsResult.rows[0]?.goals) || 0,
    assists: parseInt(assistsResult.rows[0]?.assists) || 0,
    yellow_cards: parseInt(cardsResult.rows[0]?.yellow_cards) || 0,
    red_cards: parseInt(cardsResult.rows[0]?.red_cards) || 0,
    shots: parseInt(advanced.shots) || 0,
    shots_on_target: parseInt(advanced.shots_on_target) || 0,
    passes: parseInt(advanced.passes) || 0,
    pass_accuracy: parseFloat(advanced.pass_accuracy) || 0,
    tackles: parseInt(advanced.tackles) || 0,
    interceptions: parseInt(advanced.interceptions) || 0,
    saves: parseInt(advanced.saves) || 0,
    clean_sheets: parseInt(advanced.clean_sheets) || 0,
  };

  res.json({ success: true, data });
});

// ── GET /persons/:id/achievements ──
exports.getAchievements = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await db.query(
    `SELECT a.*, comp.name AS competition_name, s.name AS season_name
     FROM achievements a
     LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
     LEFT JOIN seasons s ON a.season_id = s.season_id
     WHERE a.person_id = $1
     ORDER BY a.year DESC, a.is_major DESC`,
    [id]
  );
  res.json({ success: true, data: result.rows });
});

// ── GET /persons/:id/transfers ──
exports.getTransfers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await db.query(
    `SELECT tr.*,
            ft.name AS from_team_name, ft.logo_url AS from_team_logo,
            tt.name AS to_team_name, tt.logo_url AS to_team_logo
     FROM transfers tr
     LEFT JOIN teams ft ON tr.from_team_id = ft.team_id
     JOIN teams tt ON tr.to_team_id = tt.team_id
     WHERE tr.person_id = $1
     ORDER BY tr.transfer_date DESC NULLS LAST`,
    [id]
  );
  res.json({ success: true, data: result.rows });
});

exports.create = asyncHandler(async (req, res) => {
  const person = await PersonModel.create(req.body);
  res.status(201).json({ success: true, data: person });
});

exports.update = asyncHandler(async (req, res) => {
  const person = await PersonModel.update(req.params.id, req.body);
  if (!person) throw ApiError.notFound('Person not found');
  res.json({ success: true, data: person });
});

exports.remove = asyncHandler(async (req, res) => {
  const person = await PersonModel.delete(req.params.id);
  if (!person) throw ApiError.notFound('Person not found');
  res.json({ success: true, message: 'Person deleted' });
});