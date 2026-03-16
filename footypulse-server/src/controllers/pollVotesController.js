// ============================================
// src/controllers/pollVotesController.js
// ============================================

const PollVoteModel = require('../models/pollVoteModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getByPoll = asyncHandler(async (req, res) => {
  const votes = await PollVoteModel.getByPoll(req.params.pollId);
  res.json({ success: true, data: votes });
});

exports.vote = asyncHandler(async (req, res) => {
  // Check if user already voted
  const existing = await PollVoteModel.getByUser(req.body.poll_id, req.body.user_id);
  if (existing) {
    throw ApiError.conflict('You have already voted on this poll');
  }
  const vote = await PollVoteModel.create(req.body);
  res.status(201).json({ success: true, data: vote });
});

exports.remove = asyncHandler(async (req, res) => {
  const vote = await PollVoteModel.delete(req.params.id);
  if (!vote) throw ApiError.notFound('Vote not found');
  res.json({ success: true, message: 'Vote deleted' });
});
