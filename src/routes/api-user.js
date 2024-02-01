const express = require('express');
const apiController = require('../controllers/api-user');
const authApiMiddleware = require('../controllers/auth-api');
const router = express.Router();

router.post('/login', apiController.loginApi);
router.post('/register', apiController.registerApi);
router.put('/update/:id', authApiMiddleware.isLoggedIn, apiController.updateApi);
router.delete('/delete/:id', apiController.deleteApi); // aqui

module.exports = router;
