const express = require('express');
const apiController = require('../controllers/api-user');
const authApiMiddleware = require('../controllers/auth-api');
const router = express.Router();

router.post('/login', apiController.loginApi);
router.post('/loginSync', apiController.loginApiSync);
router.post('/register', apiController.registerApi);
router.put('/update/:id', authApiMiddleware.isLoggedIn, apiController.updateApi);
router.delete('/delete/:id', authApiMiddleware.isLoggedIn, apiController.deleteApi);

module.exports = router;
