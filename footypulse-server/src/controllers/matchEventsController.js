// ============================================
// src/controllers/matchEventsController.js
// ============================================

const MatchEventModel = require('../models/matchEventModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getByMatch = asyncHandler(async (req, res) => {
  const events = await MatchEventModel.getByMatch(req.params.matchId);
  res.json({ success: true, data: events });
});

exports.getById = asyncHandler(async (req, res) => {
  const event = await MatchEventModel.getById(req.params.id);
  if (!event) throw ApiError.notFound('Match event not found');
  res.json({ success: true, data: event });
});

exports.create = asyncHandler(async (req, res) => {
  const event = await MatchEventModel.create(req.body);
  res.status(201).json({ success: true, data: event });
});

exports.update = asyncHandler(async (req, res) => {
  const event = await MatchEventModel.update(req.params.id, req.body);
  if (!event) throw ApiError.notFound('Match event not found');
  res.json({ success: true, data: event });
});

exports.remove = asyncHandler(async (req, res) => {
  const event = await MatchEventModel.delete(req.params.id);
  if (!event) throw ApiError.notFound('Match event not found');
  res.json({ success: true, message: 'Match event deleted' });
});
