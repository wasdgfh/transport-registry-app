const Router = require('express');
const router = new Router();
const regDocCrudController = require('../controllers/employee/regDocCrudController');
const ownerController = require('../controllers/employee/ownerController');
const regOpController = require('../controllers/employee/regOpController');
const workController = require('../controllers/employee/workController');
const vehicleController = require('../controllers/employee/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/natural-persons', authMiddleware, roleMiddleware(['EMPLOYEE']), ownerController.getAllNaturalPersons);
router.get('/natural-persons/:passport', authMiddleware, roleMiddleware(['EMPLOYEE', 'OWNER']), ownerController.getNaturalPersonByPassport);
router.put('/natural-persons/:passport', authMiddleware, roleMiddleware(['EMPLOYEE']), ownerController.updateNaturalPerson);
router.patch('/natural-persons/:passport', authMiddleware, roleMiddleware(['EMPLOYEE']), ownerController.patchNaturalPerson);

router.get('/legal-entities', authMiddleware, roleMiddleware(['EMPLOYEE']), ownerController.getAllLegalEntities);
router.get('/legal-entities/:taxNumber', authMiddleware, roleMiddleware(['EMPLOYEE', 'OWNER']), ownerController.getLegalEntitiesByTax);
router.put('/legal-entities/:taxNumber', authMiddleware, roleMiddleware(['EMPLOYEE']), ownerController.updateLegalEntity);
router.patch('/legal-entities/:taxNumber', authMiddleware, roleMiddleware(['EMPLOYEE']), ownerController.patchLegalEntity);

router.get('/reg-docs', authMiddleware, roleMiddleware(['EMPLOYEE']), regDocCrudController.getAllRegDoc);
router.get('/reg-docs/:regNumber', authMiddleware, roleMiddleware(['EMPLOYEE']), regDocCrudController.getRegDocByRegNumber);
router.post('/reg-docs', authMiddleware, roleMiddleware(['EMPLOYEE']), regDocCrudController.createRegDoc);
router.put('/reg-docs/:regNumber', authMiddleware, roleMiddleware(['EMPLOYEE']), regDocCrudController.updateRegDoc);
router.patch('/reg-docs/:regNumber', authMiddleware, roleMiddleware(['EMPLOYEE']), regDocCrudController.patchRegDoc);

router.get('/reg-op', authMiddleware, roleMiddleware(['EMPLOYEE']), regOpController.getAllRegOp);
router.get('/reg-op/:vin', authMiddleware, roleMiddleware(['EMPLOYEE']), regOpController.getRegOpByVin);
router.patch('/reg-op/:id', authMiddleware, roleMiddleware(['EMPLOYEE']), regOpController.patchRegOp);

router.get('/work', authMiddleware, roleMiddleware(['EMPLOYEE']), workController.getAllWork);
router.post('/work', authMiddleware, roleMiddleware(['EMPLOYEE']), workController.createWork);
router.patch('/work/:id', authMiddleware, roleMiddleware(['EMPLOYEE']), workController.patchWork);

router.get('/vehicles', authMiddleware, roleMiddleware(['EMPLOYEE']), vehicleController.getAllTransportVehicle);
router.get('/vehicles/:vin', authMiddleware, roleMiddleware(['EMPLOYEE']), vehicleController.getTransportVehicleByVin);
router.put('/vehicles/:vin', authMiddleware, roleMiddleware(['EMPLOYEE']), vehicleController.updateTransportVehicle);
router.patch('/vehicles/:vin', authMiddleware, roleMiddleware(['EMPLOYEE']), vehicleController.patchTransportVehicle);

module.exports = router;