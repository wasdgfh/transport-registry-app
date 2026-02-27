const Router = require('express');
const router = new Router();
const authController = require('../controllers/auth/authController');
const ownerRegistrationController = require('../controllers/auth/ownerRegistrationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register/owner', authController.registerOwner);

router.post('/register/employee', authController.registerEmployee);

router.post('/login', authController.login);

router.get('/check', authMiddleware, authController.check);

router.post('/register/natural-person', ownerRegistrationController.createNaturalPerson);
router.post('/register/legal-entity', ownerRegistrationController.createLegalEntity);
<<<<<<< HEAD
router.delete('/natural-persons/:passportData', ownerRegistrationController.deleteNaturalPerson);
router.delete('/legal-entities/:taxNumber', ownerRegistrationController.deleteLegalEntity);
=======
>>>>>>> develop

module.exports = router;