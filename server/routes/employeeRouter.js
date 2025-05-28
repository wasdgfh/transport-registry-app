const Router = require('express');
const router = new Router();
const regDocCrudController = require('../controllers/employee/regDocCrudController');
const ownerController = require('../controllers/employee/ownerController');
const regOpController = require('../controllers/employee/regOpController');
const workController = require('../controllers/employee/workController');
const vehicleController = require('../controllers/employee/vehicleController');


router.get('/natural-person/:passport', ownerController.getNaturalPersonByPassport);
router.put('/natural-person/:passport', ownerController.updateNaturalPerson);
router.patch('/natural-person/:passport', ownerController.patchNaturalPerson);
router.get('/legal-entities/:tax', ownerController.getLegalEntitiesByTax);
router.put('/legal-entities/:tax', ownerController.updateLegalEntity);
router.patch('/legal-entities/:tax', ownerController.patchLegalEntity);

router.get('/reg-docs', regDocCrudController.getAllRegDoc);
router.get('/reg-docs/:regNumber', regDocCrudController.getRegDocById);
router.post('/reg-docs', regDocCrudController.createRegDoc);
router.put('/reg-docs/:regNumber', regDocCrudController.updateRegDoc);

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