const express = require('express');

const router = express.Router();

const productRoutes = require('./productRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/', adminRoutes);
router.use('/product', productRoutes);

module.exports = router;