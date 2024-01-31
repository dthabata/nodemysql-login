const express = require('express');
const apiAnimalController = require('../controllers/api-animal');
const router = express.Router();

router.post('/create', apiAnimalController.createAnimalApi);
router.get('/get/:id', apiAnimalController.getAnimalByIdApi);

module.exports = router;
