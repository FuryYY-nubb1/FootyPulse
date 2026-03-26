// ============================================
// src/controllers/pollsController.js
// ============================================

const PollModel = require('../models/pollModel');
const PollVoteModel = require('../models/pollVoteModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    status: req.query.status,
    poll_type: req.query.poll_type,
    featured: req.query.featured,
    match_id: req.query.match_id || undefined,
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

// ── Vote on a poll (POST /polls/:id/votes) ──
exports.vote = asyncHandler(async (req, res) => {
  const pollId = parseInt(req.params.id);
  const { user_id, selected_options, ip_hash } = req.body;

  if (!user_id) throw ApiError.badRequest('user_id is required');
  if (!selected_options || !Array.isArray(selected_options) || selected_options.length === 0) {
    throw ApiError.badRequest('At least 1 option must be selected');
  }

  // Check poll exists and is active
  const poll = await PollModel.getById(pollId);
  if (!poll) throw ApiError.notFound('Poll not found');
  if (poll.status !== 'active') throw ApiError.badRequest('This poll is no longer active');

  // Check end_date
  if (poll.end_date && new Date(poll.end_date) < new Date()) {
    throw ApiError.badRequest('This poll has expired');
  }

  // Check if user already voted
  const existing = await PollVoteModel.getByUser(pollId, user_id);
  if (existing) throw ApiError.conflict('You have already voted on this poll');

  // Validate selected options exist in poll options
  const pollOptions = poll.options || [];
  for (const sel of selected_options) {
    const found = pollOptions.some((o, idx) => (o.id !== undefined ? o.id === sel : idx === sel));
    if (!found) throw ApiError.badRequest(`Invalid option: ${sel}`);
  }

  // For single-choice polls, ensure only 1 option selected
  if (poll.poll_type === 'single' && selected_options.length > 1) {
    throw ApiError.badRequest('This poll allows only 1 selection');
  }

  // Create the vote
  const vote = await PollVoteModel.create({
    poll_id: pollId,
    user_id,
    selected_options,
    ip_hash: ip_hash || null,
  });

  // Update option vote counts in the poll's options JSONB
  await PollModel.incrementOptionVotes(pollId, selected_options);

  // Fetch the updated poll to return fresh data
  const updatedPoll = await PollModel.getById(pollId);

  res.status(201).json({ success: true, data: { vote, poll: updatedPoll } });
});

// ── Get poll results (GET /polls/:id/results) ──
exports.getResults = asyncHandler(async (req, res) => {
  const poll = await PollModel.getById(req.params.id);
  if (!poll) throw ApiError.notFound('Poll not found');

  const votes = await PollVoteModel.getByPoll(req.params.id);
  const options = poll.options || [];
  const totalVotes = poll.total_votes || 0;

  // Calculate results per option
  const results = options.map((option, idx) => {
    const optionId = option.id !== undefined ? option.id : idx;
    const optionVotes = option.votes || 0;
    const percent = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
    return {
      ...option,
      id: optionId,
      votes: optionVotes,
      percent,
    };
  });

  res.json({
    success: true,
    data: {
      poll_id: poll.poll_id,
      question: poll.question,
      description: poll.description,
      poll_type: poll.poll_type,
      status: poll.status,
      total_votes: totalVotes,
      options: results,
      start_date: poll.start_date,
      end_date: poll.end_date,
    },
  });
});

// ── Check if user voted (GET /polls/:id/user-vote/:userId) ──
exports.getUserVote = asyncHandler(async (req, res) => {
  const vote = await PollVoteModel.getByUser(req.params.id, req.params.userId);
  res.json({
    success: true,
    data: {
      has_voted: !!vote,
      vote: vote || null,
    },
  });
});