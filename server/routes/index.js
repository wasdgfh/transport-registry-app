const Router = require('express');
const router = new Router();
const authRouter = require('./authRouter');
const ownerRouter = require('./ownerRouter');
const employeeRouter = require('./employeeRouter');
const adminRouter = require('./adminRouter');
const profileRouter = require('./profileRouter');

router.use('/auth', authRouter);
router.use('/owner', ownerRouter);
router.use('/employee', employeeRouter);
router.use('/admin', adminRouter);
router.use('/profile', profileRouter);

module.exports = router;