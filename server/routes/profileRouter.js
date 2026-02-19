const Router = require('express');
const router = new Router();
const profileController = require('../controllers/ProfileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, profileController.getProfile);

module.exports = router;