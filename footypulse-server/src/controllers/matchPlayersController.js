// ============================================
// src/controllers/matchPlayersController.js
// ============================================

const MatchPlayerModel = require('../models/matchPlayerModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getByMatch = asyncHandler(async (req, res) => {
  const players = await MatchPlayerModel.getByMatch(req.params.matchId);
  res.json({ success: true, data: players });
});

exports.getById = asyncHandler(async (req, res) => {
  const player = await MatchPlayerModel.getById(req.params.id);
  if (!player) throw ApiError.notFound('Match player not found');
  res.json({ success: true, data: player });
});

exports.create = asyncHandler(async (req, res) => {
  const player = await MatchPlayerModel.create(req.body);
  res.status(201).json({ success: true, data: player });
});

exports.createBulk = asyncHandler(async (req, res) => {
  const { match_id, players } = req.body;
  const result = await MatchPlayerModel.createBulk(match_id, players);
  res.status(201).json({ success: true, data: result });
});

exports.update = asyncHandler(async (req, res) => {
  const player = await MatchPlayerModel.update(req.params.id, req.body);
  if (!player) throw ApiError.notFound('Match player not found');
  res.json({ success: true, data: player });
});

exports.remove = asyncHandler(async (req, res) => {
  const player = await MatchPlayerModel.delete(req.params.id);
  if (!player) throw ApiError.notFound('Match player not found');
  res.json({ success: true, message: 'Match player deleted' });
});
