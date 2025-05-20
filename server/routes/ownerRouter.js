const Router = require('express');
const router = new Router();
const ownerController = require('../controllers/ownerController');

router.get('/vehicles', ownerController.getMyVehicles);
router.get('/documents', ownerController.getMyDocuments);
router.post('/registration-request', ownerController.createRegistrationRequest);

module.exports = router;