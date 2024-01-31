const express = require('express');
const apiController = require('../controllers/api');
const router = express.Router();

router.post('/login', apiController.loginApi);
router.post('/register', apiController.registerApi);
router.put('/update/:id', apiController.updateApi);
router.delete('/delete/:id', apiController.deleteApi);

module.exports = router;
