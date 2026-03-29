
const StadiumModel = require('../models/stadiumModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = { country_id: req.query.country_id };
  const [stadiums, total] = await Promise.all([
    StadiumModel.getAll(limit, offset, filters),
    StadiumModel.getCount(filters),
  ]);
  res.json(paginate(stadiums, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const stadium = await StadiumModel.getById(req.params.id);
  if (!stadium) throw ApiError.notFound('Stadium not found');
  res.json({ success: true, data: stadium });
});

exports.create = asyncHandler(async (req, res) => {
  const stadium = await StadiumModel.create(req.body);
  res.status(201).json({ success: true, data: stadium });
});

exports.update = asyncHandler(async (req, res) => {
  const stadium = await StadiumModel.update(req.params.id, req.body);
  if (!stadium) throw ApiError.notFound('Stadium not found');
  res.json({ success: true, data: stadium });
});

exports.remove = asyncHandler(async (req, res) => {
  const stadium = await StadiumModel.delete(req.params.id);
  if (!stadium) throw ApiError.notFound('Stadium not found');
  res.json({ success: true, message: 'Stadium deleted' });
});
