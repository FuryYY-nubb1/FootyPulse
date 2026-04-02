// ============================================
// src/controllers/achievementsController.js
// ============================================
// UPDATED: Added getMostDecorated() → complex query
// ============================================

const AchievementModel = require('../models/achievementModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    team_id: req.query.team_id,
    person_id: req.query.person_id,
    achievement_type: req.query.achievement_type,
    is_major: req.query.is_major,
    year: req.query.year,
  };
  const [achievements, total] = await Promise.all([
    AchievementModel.getAll(limit, offset, filters),
    AchievementModel.getCount(filters),
  ]);
  res.json(paginate(achievements, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const achievement = await AchievementModel.getById(req.params.id);
  if (!achievement) throw ApiError.notFound('Achievement not found');
  res.json({ success: true, data: achievement });
});

exports.create = asyncHandler(async (req, res) => {
  const achievement = await AchievementModel.create(req.body);
  res.status(201).json({ success: true, data: achievement });
});

exports.update = asyncHandler(async (req, res) => {
  const achievement = await AchievementModel.update(req.params.id, req.body);
  if (!achievement) throw ApiError.notFound('Achievement not found');
  res.json({ success: true, data: achievement });
});

exports.remove = asyncHandler(async (req, res) => {
  const achievement = await AchievementModel.delete(req.params.id);
  if (!achievement) throw ApiError.notFound('Achievement not found');
  res.json({ success: true, message: 'Achievement deleted' });
});

// ════════════════════════════════════════════════════════════════
// NEW: Complex Query — Most decorated players or teams
// GET /achievements/most-decorated?type=player&major_only=true&limit=20
// GET /achievements/most-decorated?type=team&major_only=true&limit=20
// Multi-table join + aggregation across achievements, persons/teams, competitions
// ════════════════════════════════════════════════════════════════

exports.getMostDecorated = asyncHandler(async (req, res) => {
  const type = req.query.type || 'player';
  const majorOnly = req.query.major_only !== 'false';
  const limit = parseInt(req.query.limit) || 20;

  if (!['player', 'team'].includes(type)) {
    throw ApiError.badRequest('type must be "player" or "team"');
  }

  const decorated = await AchievementModel.getMostDecorated(type, majorOnly, limit);
  res.json({ success: true, data: decorated });
});