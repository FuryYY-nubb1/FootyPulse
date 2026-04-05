

const router = require('express').Router();
const controller = require('../controllers/matchesController');
const matchEventsController = require('../controllers/matchEventsController');
const matchPlayersController = require('../controllers/matchPlayersController');
const { auth } = require('../middleware/auth');
const matchRules = require('../validators/matchValidator');
const validate = require('../middleware/validate');

router.get('/league-stats/:seasonId', controller.getLeagueStats);

router.get('/team-form/:teamId', controller.getTeamForm);

router.get('/top-scorers/:seasonId', controller.getTopScorers);

router.get('/top-assists/:seasonId', controller.getTopAssisters);

router.get('/team-cards/:seasonId', controller.getTeamCards);

router.get('/audit', auth, controller.getAuditLog);
router.get('/audit/:matchId', auth, controller.getAuditLog);

router.get('/live', controller.getLive);
router.get('/date/:date', controller.getByDate);
router.get('/h2h/:team1/:team2', controller.getHeadToHead);

router.get('/:id/events', matchEventsController.getByMatch);
router.get('/:id/players', matchPlayersController.getByMatch);

router.post('/:id/record-result', auth, controller.recordResult);

// ── Standard CRUD ──
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, matchRules.create, validate, controller.create);
router.put('/:id', auth, matchRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;