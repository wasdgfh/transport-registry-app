const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const ownerRouter = require('./ownerRouter');
const employeeRouter = require('./employeeRouter');
const adminRouter = require('./adminRouter');

router.use('/user', userRouter);
router.use('/owner', ownerRouter);
router.use('/employee', employeeRouter);
router.use('/admin', adminRouter);

module.exports = router;