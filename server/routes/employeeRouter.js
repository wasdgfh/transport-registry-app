const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/AuthMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const regDocCrudController = require('../controllers/employee/regDocCrudController');
const ownerController = require('../controllers/employee/ownerController');
const regOpController = require('../controllers/employee/regOpController');
const workController = require('../controllers/employee/workController');
const vehicleController = require('../controllers/employee/vehicleController');

// Все маршруты доступны только для пользователей с ролью 'employee'
router.use(authMiddleware);
router.use(checkRole(['employee']));

router.get('/reg-docs', regDocCrudController.getAllRegDoc);
router.get('/reg-docs/:id', regDocCrudController.getRegDocById);
router.post('/reg-docs', regDocCrudController.createRegDoc);
router.put('/reg-docs/:id', regDocCrudController.updateRegDoc);

router.get('/natural-person/:id', ownerController.getNaturalPersonById);
router.put('/natural-person/:id', ownerController.updateNaturalPerson);
router.get('/legal-entities/:id', ownerController.getLegalEntitiesById);
router.put('/legal-entities/:id', ownerController.updateLegalEntities);

router.get('/reg-op', regOpController.getAllRegOp);
router.get('/reg-op/:id', regOpController.getRegOpById);
router.put('/reg-op/:id', regOpController.updateRegOp);

router.get('/work', workController.getAllWork);
router.post('/work', workController.createWork);
router.put('/work/:id', workController.updateWork);

router.get('/vehicles', vehicleController.getAllTransportVehicle);
router.get('/vehicles/:id', vehicleController.getTransportVehicleById);
router.put('/vehicles/:id', vehicleController.updateTransportVehicle);

module.exports = router;