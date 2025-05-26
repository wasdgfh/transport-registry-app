const Router = require('express');
const router = new Router();
const employeeCrudController = require('../controllers/admin/employeeCrudController');
const regDepartCrudController = require('../controllers/admin/regDepartCrudController');
const userCrudController = require('../controllers/admin/userCrudController');

router.get('/employees', employeeCrudController.getAllEmployees);
router.post('/employees', employeeCrudController.createEmployee);
router.put('/employees/:id', employeeCrudController.updateEmployee);
router.delete('/employees/:id', employeeCrudController.deleteEmployee);

router.get('/reg-depart', regDepartCrudController.getAllRegDepart);
router.post('/reg-depart', regDepartCrudController.createRegDepart);
router.put('/reg-depart/:id', regDepartCrudController.updateRegDepart);
router.patch('/reg-depart/:id', regDepartCrudController.patchRegDepart);
router.delete('/reg-depart/:id', regDepartCrudController.deleteRegDepart);

router.get('/users', userCrudController.getAllUser);
router.post('/users', userCrudController.createUser);
router.put('/users/:id', userCrudController.updateUser);
router.delete('/users/:id', userCrudController.deleteUser);

module.exports = router;