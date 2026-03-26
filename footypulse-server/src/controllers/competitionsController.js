// ============================================
// src/controllers/competitionsController.js
// ============================================
// FIXED: getNews query — uses correct schema column names
//        (media, view_count, author_name) and also finds
//        articles linked via teams in the competition
// ============================================

const CompetitionModel = require('../models/competitionModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');
const db = require('../config/db');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    competition_type: req.query.competition_type,
    country_id: req.query.country_id,
  };
  const [competitions, total] = await Promise.all([
    CompetitionModel.getAll(limit, offset, filters),
    CompetitionModel.getCount(filters),
  ]);
  res.json(paginate(competitions, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const competition = await CompetitionModel.getById(req.params.id);
  if (!competition) throw ApiError.notFound('Competition not found');
  res.json({ success: true, data: competition });
});

// ── GET /competitions/:id/seasons ──
exports.getSeasons = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await db.query(
    `SELECT season_id AS id, name, start_date, end_date, is_current
     FROM seasons WHERE competition_id = $1
     ORDER BY start_date DESC`,
    [id]
  );
  res.json({ success: true, data: result.rows });
});

// ── GET /competitions/:id/matches ──
exports.getMatches = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { seasonId, matchday, status } = req.query;
  const { limit, offset } = getPagination(req.query);

  let query = `
    SELECT m.*,
           ht.name AS home_team_name, ht.short_name AS home_short, ht.logo_url AS home_logo,
           at2.name AS away_team_name, at2.short_name AS away_short, at2.logo_url AS away_logo,
           s.name AS season_name, comp.name AS competition_name,
           st.name AS stadium_name
    FROM matches m
    JOIN teams ht ON m.home_team_id = ht.team_id
    JOIN teams at2 ON m.away_team_id = at2.team_id
    JOIN seasons s ON m.season_id = s.season_id
    JOIN competitions comp ON s.competition_id = comp.competition_id
    LEFT JOIN stadiums st ON m.stadium_id = st.stadium_id
    WHERE comp.competition_id = $1
  `;
  const values = [id];
  let idx = 2;

  if (seasonId) {
    query += ` AND m.season_id = $${idx++}`;
    values.push(seasonId);
  }
  if (matchday) {
    query += ` AND m.matchday = $${idx++}`;
    values.push(matchday);
  }
  if (status) {
    query += ` AND m.status = $${idx++}`;
    values.push(status);
  }

  query += ` ORDER BY m.match_date ASC, m.kick_off_time ASC LIMIT $${idx++} OFFSET $${idx}`;
  values.push(limit, offset);

  const result = await db.query(query, values);

  // Also get available matchdays
  let matchdays = [];
  if (seasonId) {
    const mdResult = await db.query(
      `SELECT DISTINCT m.matchday
       FROM matches m
       JOIN seasons s ON m.season_id = s.season_id
       WHERE s.competition_id = $1 AND m.season_id = $2 AND m.matchday IS NOT NULL
       ORDER BY m.matchday`,
      [id, seasonId]
    );
    matchdays = mdResult.rows.map(r => r.matchday);
  }

  res.json({
    success: true,
    data: result.rows,
    matchdays,
  });
});

// ── GET /competitions/:id/scorers ──
exports.getScorers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { seasonId, limit: queryLimit } = req.query;
  const limitVal = parseInt(queryLimit) || 20;

  let sid = seasonId;
  if (!sid) {
    const sRes = await db.query(
      `SELECT season_id FROM seasons WHERE competition_id = $1 AND is_current = true LIMIT 1`,
      [id]
    );
    sid = sRes.rows[0]?.season_id;
  }

  if (!sid) {
    return res.json({ success: true, data: { scorers: [], assists: [], redCards: [] } });
  }

  const scorersQuery = await db.query(
    `SELECT p.person_id AS player_id, p.display_name AS player_name, p.photo_url AS photo,
            t.name AS team_name, t.logo_url AS team_logo,
            COUNT(*) AS goals
     FROM match_events me
     JOIN matches m ON me.match_id = m.match_id
     JOIN persons p ON me.person_id = p.person_id
     JOIN contracts c ON c.person_id = p.person_id AND c.is_current = true
     JOIN teams t ON c.team_id = t.team_id
     WHERE m.season_id = $1
       AND me.event_type IN ('goal', 'penalty')
     GROUP BY p.person_id, p.display_name, p.photo_url, t.name, t.logo_url
     ORDER BY goals DESC
     LIMIT $2`,
    [sid, limitVal]
  );

  const assistsQuery = await db.query(
    `SELECT p.person_id AS player_id, p.display_name AS player_name, p.photo_url AS photo,
            t.name AS team_name, t.logo_url AS team_logo,
            COUNT(*) AS assists
     FROM match_events me
     JOIN matches m ON me.match_id = m.match_id
     JOIN persons p ON me.related_person_id = p.person_id
     JOIN contracts c ON c.person_id = p.person_id AND c.is_current = true
     JOIN teams t ON c.team_id = t.team_id
     WHERE m.season_id = $1
       AND me.event_type IN ('goal', 'penalty')
       AND me.related_person_id IS NOT NULL
     GROUP BY p.person_id, p.display_name, p.photo_url, t.name, t.logo_url
     ORDER BY assists DESC
     LIMIT $2`,
    [sid, limitVal]
  );

  const redCardsQuery = await db.query(
    `SELECT p.person_id AS player_id, p.display_name AS player_name, p.photo_url AS photo,
            t.name AS team_name, t.logo_url AS team_logo,
            COUNT(*) AS red_cards
     FROM match_events me
     JOIN matches m ON me.match_id = m.match_id
     JOIN persons p ON me.person_id = p.person_id
     JOIN contracts c ON c.person_id = p.person_id AND c.is_current = true
     JOIN teams t ON c.team_id = t.team_id
     WHERE m.season_id = $1
       AND me.event_type IN ('red', 'second_yellow')
     GROUP BY p.person_id, p.display_name, p.photo_url, t.name, t.logo_url
     ORDER BY red_cards DESC
     LIMIT $2`,
    [sid, limitVal]
  );

  res.json({
    success: true,
    data: {
      scorers: scorersQuery.rows,
      assists: assistsQuery.rows,
      redCards: redCardsQuery.rows,
    },
  });
});

// ── GET /competitions/:id/news ──
// FIXED: Uses correct schema columns (media, view_count, author_name)
//        Also finds articles linked via teams that play in this competition
exports.getNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit: queryLimit } = req.query;
  const limitVal = parseInt(queryLimit) || 10;

  const result = await db.query(
    `SELECT DISTINCT
            a.article_id AS id,
            a.title,
            a.slug,
            a.excerpt,
            a.media,
            a.media->>'thumbnail' AS cover_image_url,
            a.article_type,
            a.published_at,
            a.created_at,
            a.view_count,
            a.is_featured,
            a.is_breaking,
            a.author_name
     FROM articles a
     LEFT JOIN teams t ON a.team_id = t.team_id
     LEFT JOIN contracts c ON c.team_id = t.team_id AND c.is_current = true
     LEFT JOIN seasons s ON s.competition_id = $1 AND s.is_current = true
     LEFT JOIN matches m ON a.match_id = m.match_id
     WHERE a.status = 'published'
       AND (
         a.competition_id = $1
         OR a.team_id IN (
           SELECT DISTINCT st.team_id FROM standings st
           JOIN seasons s2 ON st.season_id = s2.season_id
           WHERE s2.competition_id = $1
         )
         OR a.match_id IN (
           SELECT m2.match_id FROM matches m2
           JOIN seasons s3 ON m2.season_id = s3.season_id
           WHERE s3.competition_id = $1
         )
       )
     ORDER BY a.is_featured DESC, a.published_at DESC NULLS LAST
     LIMIT $2`,
    [id, limitVal]
  );

  res.json({ success: true, data: result.rows });
});

exports.create = asyncHandler(async (req, res) => {
  const competition = await CompetitionModel.create(req.body);
  res.status(201).json({ success: true, data: competition });
});

exports.update = asyncHandler(async (req, res) => {
  const competition = await CompetitionModel.update(req.params.id, req.body);
  if (!competition) throw ApiError.notFound('Competition not found');
  res.json({ success: true, data: competition });
});

exports.remove = asyncHandler(async (req, res) => {
  const competition = await CompetitionModel.delete(req.params.id);
  if (!competition) throw ApiError.notFound('Competition not found');
  res.json({ success: true, message: 'Competition deleted' });
});