
const router = require('express').Router();
const controller = require('../controllers/authController');
const authRules = require('../validators/authValidator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');

router.post('/register', authRules.register, validate, controller.register);
router.post('/login', authRules.login, validate, controller.login);
router.get('/me', auth, controller.me);

module.exports = router;
