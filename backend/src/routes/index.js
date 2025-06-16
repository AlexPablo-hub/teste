const express = require('express');
const authMiddleware = require('../middleware/auth');
const userRoutes = require('./userRoutes');
const vehicleRoutes = require('./vehicleRoutes');

const router = express.Router();

router.use(authMiddleware);

router.use('/users', userRoutes);
router.use('/vehicles', vehicleRoutes);

module.exports = router;