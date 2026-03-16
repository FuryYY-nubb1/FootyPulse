// ============================================
// src/controllers/articlesController.js
// ============================================

const ArticleModel = require('../models/articleModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');
const { createSlug } = require('../utils/slugify');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    status: req.query.status || 'published',
    article_type: req.query.article_type,
    team_id: req.query.team_id,
    competition_id: req.query.competition_id,
    is_featured: req.query.is_featured,
    is_breaking: req.query.is_breaking,
  };
  const [articles, total] = await Promise.all([
    ArticleModel.getAll(limit, offset, filters),
    ArticleModel.getCount(filters),
  ]);
  res.json(paginate(articles, total, { page, limit }));
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const article = await ArticleModel.getBySlug(req.params.slug);
  if (!article) throw ApiError.notFound('Article not found');
  // Increment view count (fire and forget)
  ArticleModel.incrementViews(article.article_id).catch(() => {});
  res.json({ success: true, data: article });
});

exports.getById = asyncHandler(async (req, res) => {
  const article = await ArticleModel.getById(req.params.id);
  if (!article) throw ApiError.notFound('Article not found');
  res.json({ success: true, data: article });
});

exports.create = asyncHandler(async (req, res) => {
  // Auto-generate slug from title
  req.body.slug = createSlug(req.body.title);
  const article = await ArticleModel.create(req.body);
  res.status(201).json({ success: true, data: article });
});

exports.update = asyncHandler(async (req, res) => {
  const article = await ArticleModel.update(req.params.id, req.body);
  if (!article) throw ApiError.notFound('Article not found');
  res.json({ success: true, data: article });
});

exports.remove = asyncHandler(async (req, res) => {
  const article = await ArticleModel.delete(req.params.id);
  if (!article) throw ApiError.notFound('Article not found');
  res.json({ success: true, message: 'Article deleted' });
});
