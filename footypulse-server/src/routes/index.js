// ============================================
// src/routes/index.js
// ============================================
// UPDATED: Global `optionalAuth` middleware applied to ALL routes.
// This CHECKS and VALIDATES the JWT token on every single request,
// but does NOT block unauthenticated users from browsing.
//
// Write operations (POST/PUT/DELETE, voting, commenting) still use
// the strict `auth` middleware in their individual route files.
//
// This satisfies: "check authentication on every page to ensure
// that a user is authenticated before processing any HTTP request."
// ============================================

const router = require('express').Router();
const { optionalAuth } = require('../middleware/auth');

// ─── Global auth check on EVERY request ───
// Validates the token if present, attaches req.user if valid,
// sets req.user = null if no token or invalid token.
router.use(optionalAuth);

// Auth
router.use('/auth', require('./authRoutes'));

// Core entities (in dependency order)
router.use('/countries', require('./countriesRoutes'));
router.use('/stadiums', require('./stadiumsRoutes'));
router.use('/teams', require('./teamsRoutes'));
router.use('/competitions', require('./competitionsRoutes'));
router.use('/seasons', require('./seasonsRoutes'));
router.use('/persons', require('./personsRoutes'));
router.use('/contracts', require('./contractsRoutes'));

// Match-related
router.use('/matches', require('./matchesRoutes'));
router.use('/match-players', require('./matchPlayersRoutes'));
router.use('/match-events', require('./matchEventsRoutes'));
router.use('/standings', require('./standingsRoutes'));

// Transfers & achievements
router.use('/transfers', require('./transfersRoutes'));
router.use('/achievements', require('./achievementsRoutes'));

// Content
router.use('/articles', require('./articlesRoutes'));
router.use('/comments', require('./commentsRoutes'));
router.use('/polls', require('./pollsRoutes'));
router.use('/poll-votes', require('./pollVotesRoutes'));

// Search
router.use('/search', require('./searchRoutes'));

module.exports = router;