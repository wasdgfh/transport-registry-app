const Router = require('express');
const router = new Router();
const authController = require('../controllers/authController');

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.get('/check', authController.check);

router.post('/register/natural-person', authController.createNaturalPerson);
router.post('/register/legal-entity', authController.createLegalEntity);
router.delete('/natural-persons/:passportData', authController.deleteNaturalPerson);
router.delete('/legal-entities/:taxNumber', authController.deleteLegalEntity);

module.exports = router;