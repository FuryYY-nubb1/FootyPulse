
const router = require('express').Router();

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
