const express = require('express');
const apiController = require('../controllers/api-user');
const router = express.Router();

router.post('/login', apiController.loginApi);
router.post('/register', apiController.registerApi);
router.put('/update/:id', apiController.updateApi); // aqui
router.delete('/delete/:id', apiController.deleteApi); // aqui

module.exports = router;
