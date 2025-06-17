const Router = require('express');
const router = new Router();
const employeeCrudController = require('../controllers/admin/employeeCrudController');
const regDepartCrudController = require('../controllers/admin/regDepartCrudController');
const userCrudController = require('../controllers/admin/userCrudController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/employees', authMiddleware, roleMiddleware(['ADMIN']), employeeCrudController.getAllEmployees);
router.get('/employees/search', authMiddleware, roleMiddleware(['ADMIN', 'EMPLOYEE']), employeeCrudController.getEmployeeByField);
router.post('/employees', authMiddleware, roleMiddleware(['ADMIN']), employeeCrudController.createEmployee);
router.put('/employees/:badgeNumber', authMiddleware, roleMiddleware(['ADMIN']), employeeCrudController.updateEmployee);
router.patch('/employees/:badgeNumber', authMiddleware, roleMiddleware(['ADMIN']), employeeCrudController.patchEmployee);
router.delete('/employees/:badgeNumber', authMiddleware, roleMiddleware(['ADMIN']), employeeCrudController.deleteEmployee);

router.get('/reg-depart', authMiddleware, roleMiddleware(['ADMIN', 'EMPLOYEE', 'OWNER']), regDepartCrudController.getAllRegDepart);
router.get('/reg-depart/search', authMiddleware, roleMiddleware(['ADMIN']), regDepartCrudController.getRegDepartByField);
router.post('/reg-depart', authMiddleware, roleMiddleware(['ADMIN']), regDepartCrudController.createRegDepart);
router.put('/reg-depart/:unitCode', authMiddleware, roleMiddleware(['ADMIN']), regDepartCrudController.updateRegDepart);
router.patch('/reg-depart/:unitCode', authMiddleware, roleMiddleware(['ADMIN']), regDepartCrudController.patchRegDepart);
router.delete('/reg-depart/:unitCode', authMiddleware, roleMiddleware(['ADMIN']), regDepartCrudController.deleteRegDepart);

router.get('/users', authMiddleware, roleMiddleware(['ADMIN']), userCrudController.getAllUser);
router.get('/users/search', authMiddleware, roleMiddleware(['ADMIN']), userCrudController.getUserByField);
router.post('/users', authMiddleware, roleMiddleware(['ADMIN']), userCrudController.createUser);
router.patch('/users/:id', authMiddleware, roleMiddleware(['ADMIN']), userCrudController.patchUser);
router.delete('/users/:id', authMiddleware, roleMiddleware(['ADMIN']), userCrudController.deleteUser);

module.exports = router;