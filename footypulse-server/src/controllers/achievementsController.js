
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
