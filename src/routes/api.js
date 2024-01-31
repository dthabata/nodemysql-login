const express = require('express');
const apiController = require('../controllers/api');
const router = express.Router();

router.post('/login', apiController.loginApi);
router.post('/register', apiController.registerApi);
router.post('/update', apiController.updateApi);

module.exports = router;