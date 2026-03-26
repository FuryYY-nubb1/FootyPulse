// ============================================
// src/controllers/standingsController.js
// ============================================
// FIXED: Added getByQuery to handle frontend calls:
//        GET /standings?competitionId=1&seasonId=1
// ============================================

const StandingModel = require('../models/standingModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const db = require('../config/db');

// ── GET /standings?competitionId=1&seasonId=1 ──
// This is what the frontend actually calls from standingsApi.getByCompetition()
exports.getByQuery = asyncHandler(async (req, res) => {
  const { competitionId, seasonId, group } = req.query;

  // If seasonId is provided directly, use it
  if (seasonId) {
    const standings = await StandingModel.getBySeason(seasonId, group || null);
    return res.json({ success: true, data: standings });
  }

  // If only competitionId, find the current season and get standings
  if (competitionId) {
    const seasonResult = await db.query(
      `SELECT season_id FROM seasons
       WHERE competition_id = $1 AND is_current = true
       ORDER BY start_date DESC LIMIT 1`,
      [competitionId]
    );

    if (seasonResult.rows.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const standings = await StandingModel.getBySeason(
      seasonResult.rows[0].season_id,
      group || null
    );
    return res.json({ success: true, data: standings });
  }

  // No params — return empty
  res.json({ success: true, data: [] });
});

// ── GET /standings/season/:seasonId ──
exports.getBySeason = asyncHandler(async (req, res) => {
  const standings = await StandingModel.getBySeason(
    req.params.seasonId,
    req.query.group
  );
  res.json({ success: true, data: standings });
});

exports.getById = asyncHandler(async (req, res) => {
  const standing = await StandingModel.getById(req.params.id);
  if (!standing) throw ApiError.notFound('Standing not found');
  res.json({ success: true, data: standing });
});

exports.create = asyncHandler(async (req, res) => {
  const standing = await StandingModel.create(req.body);
  res.status(201).json({ success: true, data: standing });
});

exports.createBulk = asyncHandler(async (req, res) => {
  const { season_id, team_ids, group_name } = req.body;
  const standings = await StandingModel.createBulk(season_id, team_ids, group_name);
  res.status(201).json({ success: true, data: standings });
});

exports.update = asyncHandler(async (req, res) => {
  const standing = await StandingModel.update(req.params.id, req.body);
  if (!standing) throw ApiError.notFound('Standing not found');
  res.json({ success: true, data: standing });
});

exports.remove = asyncHandler(async (req, res) => {
  const standing = await StandingModel.delete(req.params.id);
  if (!standing) throw ApiError.notFound('Standing not found');
  res.json({ success: true, message: 'Standing deleted' });
});