
const router = require('express').Router();
const controller = require('../controllers/standingsController');
const { auth } = require('../middleware/auth');

router.get('/', controller.getByQuery);                   

router.get('/season/:seasonId', controller.getBySeason);
router.get('/:id', controller.getById);

router.post('/', auth, controller.create);
router.post('/bulk', auth, controller.createBulk);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;