const express = require('express');

const router = express.Router();

const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');

router.use('/',userRoutes);
router.use('/product',productRoutes);

module.exports = router;