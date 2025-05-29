const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/check', userController.check);


router.post('/register/natural-person', userController.createNaturalPerson);
router.post('/register/legal-entity', userController.createLegalEntity);
router.delete('/natural-persons/:passportData', userController.deleteNaturalPerson);
router.delete('/legal-entities/:taxNumber', userController.deleteLegalEntity);

module.exports = router;