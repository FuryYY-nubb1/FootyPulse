// ============================================
// src/controllers/matchesController.js
// ============================================
// UPDATED: Added endpoints that use:
//   - Stored Procedure: sp_record_match_result (POST /matches/:id/record-result)
//   - Database Function: fn_get_league_stats (GET /matches/league-stats/:seasonId)
//   - Database Function: fn_get_team_form (GET /matches/team-form/:teamId)
//   - Complex Queries: top scorers, top assisters, team cards
//   - Audit log from shadow table (GET /matches/audit)
// ============================================

const MatchModel = require('../models/matchModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

// ── Standard CRUD ──

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    season_id: req.query.season_id,
    team_id: req.query.team_id,
    status: req.query.status,
    date_from: req.query.date_from,
    date_to: req.query.date_to,
    competition_id: req.query.competition_id,
    matchday: req.query.matchday,
  };
  const [matches, total] = await Promise.all([
    MatchModel.getAll(limit, offset, filters),
    MatchModel.getCount(filters),
  ]);
  res.json(paginate(matches, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const match = await MatchModel.getById(req.params.id);
  if (!match) throw ApiError.notFound('Match not found');
  res.json({ success: true, data: match });
});

exports.getLive = asyncHandler(async (req, res) => {
  const matches = await MatchModel.getLive();
  res.json({ success: true, data: matches });
});

exports.getByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;
  const matches = await MatchModel.getByDate(date);
  res.json({ success: true, data: matches });
});

exports.getHeadToHead = asyncHandler(async (req, res) => {
  const { team1, team2 } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const matches = await MatchModel.getHeadToHead(team1, team2, limit);
  res.json({ success: true, data: matches });
});

exports.create = asyncHandler(async (req, res) => {
  const match = await MatchModel.create(req.body);
  res.status(201).json({ success: true, data: match });
});

exports.update = asyncHandler(async (req, res) => {
  const match = await MatchModel.update(req.params.id, req.body);
  if (!match) throw ApiError.notFound('Match not found');
  res.json({ success: true, data: match });
});

exports.remove = asyncHandler(async (req, res) => {
  const match = await MatchModel.delete(req.params.id);
  if (!match) throw ApiError.notFound('Match not found');
  res.json({ success: true, message: 'Match deleted' });
});

// ════════════════════════════════════════════════════════════════
// NEW: Stored Procedure — Record match result
// POST /matches/:id/record-result
// Uses sp_record_match_result which handles:
//   1. Update match score & status
//   2. Update standings for both teams
//   3. Update manager contract records
// All in one transaction with explicit BEGIN/COMMIT/ROLLBACK
// ════════════════════════════════════════════════════════════════

exports.recordResult = asyncHandler(async (req, res) => {
  const matchId = parseInt(req.params.id);
  const { home_score, away_score, attendance, home_formation, away_formation } = req.body;

  // Validate required fields
  if (home_score === undefined || away_score === undefined) {
    throw ApiError.badRequest('home_score and away_score are required');
  }
  if (home_score < 0 || away_score < 0) {
    throw ApiError.badRequest('Scores cannot be negative');
  }

  const match = await MatchModel.recordResult(
    matchId,
    parseInt(home_score),
    parseInt(away_score),
    attendance ? parseInt(attendance) : null,
    home_formation || null,
    away_formation || null
  );

  res.json({
    success: true,
    message: 'Match result recorded. Standings and manager records updated.',
    data: match,
  });
});

// ════════════════════════════════════════════════════════════════
// NEW: Database Function — League statistics
// GET /matches/league-stats/:seasonId
// Uses fn_get_league_stats to return computed statistics
// ════════════════════════════════════════════════════════════════

exports.getLeagueStats = asyncHandler(async (req, res) => {
  const seasonId = parseInt(req.params.seasonId);
  const stats = await MatchModel.getLeagueStats(seasonId);

  if (!stats) {
    throw ApiError.notFound('No statistics found for this season');
  }

  res.json({ success: true, data: stats });
});

// ════════════════════════════════════════════════════════════════
// NEW: Database Function — Team form
// GET /matches/team-form/:teamId
// Uses fn_get_team_form to return recent match results
// ════════════════════════════════════════════════════════════════

exports.getTeamForm = asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId);
  const limit = parseInt(req.query.limit) || 5;
  const form = await MatchModel.getTeamForm(teamId, limit);
  res.json({ success: true, data: form });
});

// ════════════════════════════════════════════════════════════════
// NEW: Complex Query — Top scorers
// GET /matches/top-scorers/:seasonId
// Multi-table join + aggregation across match_events, persons,
// contracts, teams, matches
// ════════════════════════════════════════════════════════════════

exports.getTopScorers = asyncHandler(async (req, res) => {
  const seasonId = parseInt(req.params.seasonId);
  const limit = parseInt(req.query.limit) || 20;
  const scorers = await MatchModel.getTopScorers(seasonId, limit);
  res.json({ success: true, data: scorers });
});

// ════════════════════════════════════════════════════════════════
// NEW: Complex Query — Top assisters
// GET /matches/top-assists/:seasonId
// Multi-table join + aggregation across match_events, persons,
// contracts, teams, matches
// ════════════════════════════════════════════════════════════════

exports.getTopAssisters = asyncHandler(async (req, res) => {
  const seasonId = parseInt(req.params.seasonId);
  const limit = parseInt(req.query.limit) || 20;
  const assisters = await MatchModel.getTopAssisters(seasonId, limit);
  res.json({ success: true, data: assisters });
});

// ════════════════════════════════════════════════════════════════
// NEW: Complex Query — Team discipline (cards)
// GET /matches/team-cards/:seasonId
// Multi-table join + aggregation across match_events, teams, matches
// ════════════════════════════════════════════════════════════════

exports.getTeamCards = asyncHandler(async (req, res) => {
  const seasonId = parseInt(req.params.seasonId);
  const limit = parseInt(req.query.limit) || 20;
  const cards = await MatchModel.getTeamCards(seasonId, limit);
  res.json({ success: true, data: cards });
});

// ════════════════════════════════════════════════════════════════
// NEW: Audit log from shadow table (populated by trigger)
// GET /matches/audit
// GET /matches/audit/:matchId
// ════════════════════════════════════════════════════════════════

exports.getAuditLog = asyncHandler(async (req, res) => {
  const matchId = req.params.matchId ? parseInt(req.params.matchId) : null;
  const limit = parseInt(req.query.limit) || 50;
  const audit = await MatchModel.getAuditLog(matchId, limit);
  res.json({ success: true, data: audit });
});