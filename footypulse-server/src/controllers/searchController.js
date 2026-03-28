// ============================================
// src/controllers/searchController.js
// ============================================
// PURPOSE: Global search across teams, persons, competitions, articles
// ROUTES: GET /api/v1/search?q=messi&type=all
// ============================================

const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.search = asyncHandler(async (req, res) => {
  const { q, type = 'all' } = req.query;
  const limit = parseInt(req.query.limit) || 10;

  if (!q || q.trim().length < 2) {
    throw ApiError.badRequest('Search query must be at least 2 characters');
  }

  const searchTerm = `%${q.trim()}%`;
  const results = {};

  if (type === 'all' || type === 'teams') {
    const teams = await db.query(
      `SELECT team_id, name, short_name, logo_url, team_type, 'team' AS result_type
       FROM teams WHERE name ILIKE $1 OR short_name ILIKE $1 LIMIT $2`,
      [searchTerm, limit]
    );
    results.teams = teams.rows;
  }

  if (type === 'all' || type === 'persons') {
    const persons = await db.query(
      `SELECT person_id, display_name, person_type, primary_position, photo_url, 'person' AS result_type
       FROM persons WHERE first_name ILIKE $1 OR last_name ILIKE $1 LIMIT $2`,
      [searchTerm, limit]
    );
    results.persons = persons.rows;
  }

  if (type === 'all' || type === 'competitions') {
    const competitions = await db.query(
      `SELECT competition_id, name, short_name, competition_type, logo_url, 'competition' AS result_type
       FROM competitions WHERE name ILIKE $1 OR short_name ILIKE $1 LIMIT $2`,
      [searchTerm, limit]
    );
    results.competitions = competitions.rows;
  }

  if (type === 'all' || type === 'articles') {
    const articles = await db.query(
      `SELECT article_id, title, slug, excerpt, article_type, created_at, published_at, 'article' AS result_type
        FROM articles WHERE status = 'published'
        AND (title ILIKE $1 OR excerpt ILIKE $1) LIMIT $2`,
      [searchTerm, limit]
    );
    results.articles = articles.rows;
  }

  res.json({ success: true, query: q, data: results });
});