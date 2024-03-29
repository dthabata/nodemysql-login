const express = require('express');
const apiController = require('../controllers/api-user');
const authApiMiddleware = require('../controllers/auth-api');
const router = express.Router();

router.post('/login', apiController.loginApi);
router.post('/loginSync', apiController.loginApiSync);
router.post('/register', apiController.registerApi);
router.post('/registerSync', apiController.registerApiSync);
router.put('/update/:id', authApiMiddleware.isLoggedIn, apiController.updateApi);
router.put('/updateSync/:id', authApiMiddleware.isLoggedIn, apiController.updateApiSync);
router.delete('/delete/:id', authApiMiddleware.isLoggedIn, apiController.deleteApi);
router.delete('/deleteSync/:id', authApiMiddleware.isLoggedIn, apiController.deleteApiSync);

module.exports = router;
