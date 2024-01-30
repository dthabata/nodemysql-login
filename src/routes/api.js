const express = require('express');
const apiController = require('../controllers/api');
const router = express.Router();

router.post('/login', apiController.loginApi);
router.post('/register', apiController.registerApi);

module.exports = router;
