const express = require('express');
const apiAnimalController = require('../controllers/api-animal');
const router = express.Router();

router.post('/create', apiAnimalController.createAnimalApi);

module.exports = router;
