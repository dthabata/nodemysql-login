const express = require('express');
const apiController = require('../controllers/api');
const router = express.Router();

router.post('/login', apiController.loginApi);

module.exports = router;
