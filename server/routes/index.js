const Router = require('express');
const router = new Router();
const authRouter = require('./authRouter');
const ownerRouter = require('./ownerRouter');
const employeeRouter = require('./employeeRouter');
const adminRouter = require('./adminRouter');

router.use('/auth', authRouter);
router.use('/owner', ownerRouter);
router.use('/employee', employeeRouter);
router.use('/admin', adminRouter);

module.exports = router;