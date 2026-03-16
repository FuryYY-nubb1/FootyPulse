// ============================================
// src/controllers/pollsController.js
// ============================================

const PollModel = require('../models/pollModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    status: req.query.status,
    poll_type: req.query.poll_type,
    featured: req.query.featured,
  };
  const [polls, total] = await Promise.all([
    PollModel.getAll(limit, offset, filters),
    PollModel.getCount(filters),
  ]);
  res.json(paginate(polls, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const poll = await PollModel.getById(req.params.id);
  if (!poll) throw ApiError.notFound('Poll not found');
  res.json({ success: true, data: poll });
});

exports.create = asyncHandler(async (req, res) => {
  const poll = await PollModel.create(req.body);
  res.status(201).json({ success: true, data: poll });
});

exports.update = asyncHandler(async (req, res) => {
  const poll = await PollModel.update(req.params.id, req.body);
  if (!poll) throw ApiError.notFound('Poll not found');
  res.json({ success: true, data: poll });
});

exports.remove = asyncHandler(async (req, res) => {
  const poll = await PollModel.delete(req.params.id);
  if (!poll) throw ApiError.notFound('Poll not found');
  res.json({ success: true, message: 'Poll deleted' });
});
