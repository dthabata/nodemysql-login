const express = require('express');
const apiAnimalController = require('../controllers/api-animal');
const router = express.Router();

router.post('/register', apiAnimalController.registerApi);

module.exports = router;
