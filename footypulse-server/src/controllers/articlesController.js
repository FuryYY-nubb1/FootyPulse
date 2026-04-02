// ============================================
// src/controllers/articlesController.js
// ============================================
// UPDATED: Added endpoints that use:
//   - Stored Procedure: sp_publish_article (POST /articles/:id/publish)
//   - Database Function: fn_get_article_stats (GET /articles/stats)
//   - Complex Queries: trending articles, author leaderboard, articles by competition
//   - Audit log from shadow table (GET /articles/audit)
// ============================================

const ArticleModel = require('../models/articleModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');
const { createSlug } = require('../utils/slugify');

// ── Standard CRUD ──

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

// ════════════════════════════════════════════════════════════════
// NEW: Stored Procedure — Publish article
// POST /articles/:id/publish
// Uses sp_publish_article which handles:
//   1. Validate article exists and is in draft status
//   2. Set status → 'published', set published_at timestamp
//   3. If breaking → un-break all other breaking articles
//   4. If featured → limit featured articles to max 5
// All in one transaction with explicit BEGIN/COMMIT/ROLLBACK
// ════════════════════════════════════════════════════════════════

exports.publish = asyncHandler(async (req, res) => {
  const articleId = parseInt(req.params.id);
  const { is_featured, is_breaking } = req.body;

  const article = await ArticleModel.publishArticle(
    articleId,
    is_featured || false,
    is_breaking || false
  );

  res.json({
    success: true,
    message: 'Article published successfully.' +
      (is_breaking ? ' All other breaking articles have been un-marked.' : '') +
      (is_featured ? ' Featured articles limited to 5.' : ''),
    data: article,
  });
});

// ════════════════════════════════════════════════════════════════
// NEW: Database Function — Article statistics
// GET /articles/stats
// GET /articles/stats?competition_id=1&team_id=2
// Uses fn_get_article_stats to return computed statistics
// ════════════════════════════════════════════════════════════════

exports.getStats = asyncHandler(async (req, res) => {
  const competitionId = req.query.competition_id ? parseInt(req.query.competition_id) : null;
  const teamId = req.query.team_id ? parseInt(req.query.team_id) : null;

  const stats = await ArticleModel.getArticleStats(competitionId, teamId);

  if (!stats) {
    return res.json({ success: true, data: null, message: 'No article statistics available' });
  }

  res.json({ success: true, data: stats });
});

// ════════════════════════════════════════════════════════════════
// NEW: Complex Query — Trending articles
// GET /articles/trending?days=7&limit=10
// Multi-table join + computed trending score formula
// ════════════════════════════════════════════════════════════════

exports.getTrending = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const limit = parseInt(req.query.limit) || 10;
  const articles = await ArticleModel.getTrending(days, limit);
  res.json({ success: true, data: articles });
});

// ════════════════════════════════════════════════════════════════
// NEW: Complex Query — Author leaderboard
// GET /articles/authors
// Aggregation: groups by author, counts articles + sums views
// ════════════════════════════════════════════════════════════════

exports.getAuthorLeaderboard = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const authors = await ArticleModel.getAuthorLeaderboard(limit);
  res.json({ success: true, data: authors });
});

// ════════════════════════════════════════════════════════════════
// NEW: Complex Query — Articles grouped by competition
// GET /articles/by-competition
// Joins: articles → competitions → countries with aggregation
// ════════════════════════════════════════════════════════════════

exports.getByCompetition = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const results = await ArticleModel.getArticlesByCompetition(limit);
  res.json({ success: true, data: results });
});

// ════════════════════════════════════════════════════════════════
// NEW: Audit log from shadow table (populated by trigger)
// GET /articles/audit
// GET /articles/audit/:articleId
// ════════════════════════════════════════════════════════════════

exports.getAuditLog = asyncHandler(async (req, res) => {
  const articleId = req.params.articleId ? parseInt(req.params.articleId) : null;
  const limit = parseInt(req.query.limit) || 50;
  const audit = await ArticleModel.getAuditLog(articleId, limit);
  res.json({ success: true, data: audit });
});