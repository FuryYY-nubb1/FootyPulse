

const router = require('express').Router();
const controller = require('../controllers/matchEventsController');
const { auth } = require('../middleware/auth');

router.get('/match/:matchId', controller.getByMatch);   
router.get('/:id', controller.getById);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
