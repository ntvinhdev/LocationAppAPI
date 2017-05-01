const express = require('express');
const demoRouter = require('./demo');
const authRouter = require('./auth');
const newfeedRouter = require('./newfeed');
const commentRouter = require('./comment');
const userRouter = require('./user');
const friendRouter = require('./friend');
const groupRouter = require('./group');
const gpsRouter = require('./gps');

const router = express.Router();

router.use('/demo', demoRouter);
router.use('/auth', authRouter);
router.use('/newfeed', newfeedRouter);
router.use('/comment', commentRouter);
router.use('/user', userRouter);
router.use('/friend', friendRouter);
router.use('/group', groupRouter);
router.use('/gps', gpsRouter);

module.exports = router;