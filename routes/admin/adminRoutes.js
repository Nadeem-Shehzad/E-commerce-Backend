const express = require('express');

const router = express.Router();

const {
    getAdmin
} = require('../../controllers/admin/adminController');


router.route('/')
    .get(getAdmin);



module.exports = router;