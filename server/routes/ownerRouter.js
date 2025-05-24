const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/AuthMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const regDocController = require('../controllers/owner/regDocController');
const vehicleController = require('../controllers/owner/vehicleController');
const ownerController = require('../controllers/owner/ownerController');

// Все маршруты доступны только для пользователей с ролью 'user'
router.use(authMiddleware);
router.use(checkRole(['user']));

router.get('/my/documents', regDocController.getAllRegDoc);
router.post('/my/documents', regDocController.createRegDoc);

router.get('/my/vehicles', vehicleController.getMyVehicles);
router.post('/vehicles', vehicleController.createVehicle);
router.get('/my/vehicles/:id/', vehicleController.getMyVehicleById);


router.get('/my/operations', ownerController.getMyRegOps);
router.post('/depart-info', ownerController.getRegDepart);

module.exports = router;