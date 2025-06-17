const Router = require('express');
const router = new Router();
const regDocController = require('../controllers/owner/regDocController');
const vehicleController = require('../controllers/owner/vehicleController');
const regDepartController = require('../controllers/owner/regDepartController');
const regOpController = require('../controllers/owner/regOpController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/reg-docs', authMiddleware, roleMiddleware(['OWNER']), regDocController.getAllRegDoc);
router.get('/reg-docs/:regNumber', authMiddleware, roleMiddleware(['OWNER']), regDocController.getRegDocByRegNumber);

router.get('/reg-op', authMiddleware, roleMiddleware(['OWNER']), regOpController.getAllRegOp);
router.get('/reg-op/:vin', authMiddleware, roleMiddleware(['OWNER']), regOpController.getRegOpByVin);
router.post('/reg-op', authMiddleware, roleMiddleware(['EMPLOYEE', 'OWNER']), regOpController.createRegOp);

router.get('/vehicles', authMiddleware, roleMiddleware(['OWNER']), vehicleController.getMyVehicles);
router.get('/vehicles/:vin/', authMiddleware, roleMiddleware(['OWNER']), vehicleController.getMyVehicleByVin);
router.post('/vehicles', authMiddleware, roleMiddleware(['EMPLOYEE', 'OWNER']), vehicleController.createVehicle);

router.get('/depart-info', authMiddleware, roleMiddleware(['OWNER']), regDepartController.getRegDepart);

module.exports = router;