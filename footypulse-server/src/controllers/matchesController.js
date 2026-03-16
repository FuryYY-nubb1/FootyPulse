// ============================================
// src/controllers/matchesController.js
// ============================================

const MatchModel = require('../models/matchModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

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
  const { date } = req.params; // YYYY-MM-DD
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
