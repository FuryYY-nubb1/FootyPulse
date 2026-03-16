// ============================================
// src/controllers/competitionsController.js
// ============================================

const CompetitionModel = require('../models/competitionModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    competition_type: req.query.competition_type,
    country_id: req.query.country_id,
  };
  const [competitions, total] = await Promise.all([
    CompetitionModel.getAll(limit, offset, filters),
    CompetitionModel.getCount(filters),
  ]);
  res.json(paginate(competitions, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const competition = await CompetitionModel.getById(req.params.id);
  if (!competition) throw ApiError.notFound('Competition not found');
  res.json({ success: true, data: competition });
});

exports.create = asyncHandler(async (req, res) => {
  const competition = await CompetitionModel.create(req.body);
  res.status(201).json({ success: true, data: competition });
});

exports.update = asyncHandler(async (req, res) => {
  const competition = await CompetitionModel.update(req.params.id, req.body);
  if (!competition) throw ApiError.notFound('Competition not found');
  res.json({ success: true, data: competition });
});

exports.remove = asyncHandler(async (req, res) => {
  const competition = await CompetitionModel.delete(req.params.id);
  if (!competition) throw ApiError.notFound('Competition not found');
  res.json({ success: true, message: 'Competition deleted' });
});
