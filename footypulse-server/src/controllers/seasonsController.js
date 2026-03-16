// ============================================
// src/controllers/seasonsController.js
// ============================================

const SeasonModel = require('../models/seasonModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    competition_id: req.query.competition_id,
    is_current: req.query.is_current,
  };
  const [seasons, total] = await Promise.all([
    SeasonModel.getAll(limit, offset, filters),
    SeasonModel.getCount(filters),
  ]);
  res.json(paginate(seasons, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const season = await SeasonModel.getById(req.params.id);
  if (!season) throw ApiError.notFound('Season not found');
  res.json({ success: true, data: season });
});

exports.create = asyncHandler(async (req, res) => {
  const season = await SeasonModel.create(req.body);
  res.status(201).json({ success: true, data: season });
});

exports.update = asyncHandler(async (req, res) => {
  const season = await SeasonModel.update(req.params.id, req.body);
  if (!season) throw ApiError.notFound('Season not found');
  res.json({ success: true, data: season });
});

exports.remove = asyncHandler(async (req, res) => {
  const season = await SeasonModel.delete(req.params.id);
  if (!season) throw ApiError.notFound('Season not found');
  res.json({ success: true, message: 'Season deleted' });
});
