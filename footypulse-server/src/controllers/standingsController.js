// ============================================
// src/controllers/standingsController.js
// ============================================

const StandingModel = require('../models/standingModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getBySeason = asyncHandler(async (req, res) => {
  const standings = await StandingModel.getBySeason(
    req.params.seasonId,
    req.query.group
  );
  res.json({ success: true, data: standings });
});

exports.getById = asyncHandler(async (req, res) => {
  const standing = await StandingModel.getById(req.params.id);
  if (!standing) throw ApiError.notFound('Standing not found');
  res.json({ success: true, data: standing });
});

exports.create = asyncHandler(async (req, res) => {
  const standing = await StandingModel.create(req.body);
  res.status(201).json({ success: true, data: standing });
});

exports.createBulk = asyncHandler(async (req, res) => {
  const { season_id, team_ids, group_name } = req.body;
  const standings = await StandingModel.createBulk(season_id, team_ids, group_name);
  res.status(201).json({ success: true, data: standings });
});

exports.update = asyncHandler(async (req, res) => {
  const standing = await StandingModel.update(req.params.id, req.body);
  if (!standing) throw ApiError.notFound('Standing not found');
  res.json({ success: true, data: standing });
});

exports.remove = asyncHandler(async (req, res) => {
  const standing = await StandingModel.delete(req.params.id);
  if (!standing) throw ApiError.notFound('Standing not found');
  res.json({ success: true, message: 'Standing deleted' });
});
