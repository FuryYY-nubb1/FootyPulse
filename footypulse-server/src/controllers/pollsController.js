
const PollModel = require('../models/pollModel');
const PollVoteModel = require('../models/pollVoteModel');
const db = require('../config/db');
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

//checking the authintaction here
exports.vote = asyncHandler(async (req, res) => {
  const pollId = parseInt(req.params.id);
  const userId = String(req.user.user_id); // from auth middleware
  const { selected_options, ip_hash } = req.body;

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

  const existing = await PollVoteModel.getByUser(pollId, userId);
  if (existing) throw ApiError.conflict('You have already voted on this poll');

  const pollOptions = poll.options || [];
  for (const sel of selected_options) {
    const found = pollOptions.some((o, idx) => (o.id !== undefined ? o.id === sel : idx === sel));
    if (!found) throw ApiError.badRequest(`Invalid option: ${sel}`);
  }

  if (poll.poll_type === 'single' && selected_options.length > 1) {
    throw ApiError.badRequest('This poll allows only 1 selection');
  }
  const vote = await PollVoteModel.create({
    poll_id: pollId,
    user_id: userId,
    selected_options,
    ip_hash: ip_hash || null,
  });

  // Fetch the updated poll to return fresh data
  const updatedPoll = await PollModel.getById(pollId);

  res.status(201).json({ success: true, data: { vote, poll: updatedPoll } });
});

exports.getResults = asyncHandler(async (req, res) => {
  const pollId = parseInt(req.params.id);

  const statsResult = await db.query('SELECT * FROM fn_get_poll_stats($1)', [pollId]);

  if (statsResult.rows.length === 0) {
    throw ApiError.notFound('Poll not found');
  }

  const firstRow = statsResult.rows[0];
  const options = statsResult.rows.map(row => ({
    id: row.option_id,
    text: row.option_text,
    votes: row.option_votes,
    percent: parseFloat(row.vote_percent),
  }));

  res.json({
    success: true,
    data: {
      poll_id: firstRow.poll_id,
      question: firstRow.question,
      total_votes: firstRow.total_votes,
      options,
    },
  });
});

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