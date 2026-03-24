// ============================================
// src/controllers/teamsController.js
// ============================================

const TeamModel = require('../models/teamModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    country_id: req.query.country_id,
    team_type: req.query.team_type,
    search: req.query.search,
  };
  const [teams, total] = await Promise.all([
    TeamModel.getAll(limit, offset, filters),
    TeamModel.getCount(filters),
  ]);
  res.json(paginate(teams, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const team = await TeamModel.getById(req.params.id);
  if (!team) throw ApiError.notFound('Team not found');
  res.json({ success: true, data: team });
});

exports.getSquad = asyncHandler(async (req, res) => {
  const squad = await TeamModel.getSquad(req.params.id);
  res.json({ success: true, data: squad });
});

exports.create = asyncHandler(async (req, res) => {
  const team = await TeamModel.create(req.body);
  res.status(201).json({ success: true, data: team });
});

exports.update = asyncHandler(async (req, res) => {
  const team = await TeamModel.update(req.params.id, req.body);
  if (!team) throw ApiError.notFound('Team not found');
  res.json({ success: true, data: team });
});

exports.remove = asyncHandler(async (req, res) => {
  const team = await TeamModel.delete(req.params.id);
  if (!team) throw ApiError.notFound('Team not found');
  res.json({ success: true, message: 'Team deleted' });
});