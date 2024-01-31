const express = require('express');
const apiAnimalController = require('../controllers/api-animal');
const router = express.Router();

router.post('/create', apiAnimalController.createAnimalApi);
router.get('/get/:id', apiAnimalController.getAnimalByIdApi);
router.put('/update/:id', apiAnimalController.updateAnimalApi);
router.delete('/delete/:id', apiAnimalController.deleteAnimalByIdApi);

module.exports = router;
