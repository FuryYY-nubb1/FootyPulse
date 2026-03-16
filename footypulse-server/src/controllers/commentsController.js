// ============================================
// src/controllers/commentsController.js
// ============================================

const CommentModel = require('../models/commentModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getByArticle = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;
  const comments = await CommentModel.getByArticle(req.params.articleId, limit, offset);
  res.json({ success: true, data: comments });
});

exports.getReplies = asyncHandler(async (req, res) => {
  const replies = await CommentModel.getReplies(req.params.commentId);
  res.json({ success: true, data: replies });
});

exports.create = asyncHandler(async (req, res) => {
  const comment = await CommentModel.create(req.body);
  res.status(201).json({ success: true, data: comment });
});

exports.update = asyncHandler(async (req, res) => {
  const comment = await CommentModel.update(req.params.id, req.body);
  if (!comment) throw ApiError.notFound('Comment not found');
  res.json({ success: true, data: comment });
});

exports.like = asyncHandler(async (req, res) => {
  const comment = await CommentModel.like(req.params.id);
  if (!comment) throw ApiError.notFound('Comment not found');
  res.json({ success: true, data: comment });
});

exports.remove = asyncHandler(async (req, res) => {
  const comment = await CommentModel.delete(req.params.id);
  if (!comment) throw ApiError.notFound('Comment not found');
  res.json({ success: true, message: 'Comment deleted' });
});
