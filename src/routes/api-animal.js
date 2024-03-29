const express = require('express');
const apiAnimalController = require('../controllers/api-animal');
const authApiMiddleware = require('../controllers/auth-api');
const router = express.Router();

router.post('/create', authApiMiddleware.isLoggedIn, apiAnimalController.createAnimalApi);
router.post('/createSync', authApiMiddleware.isLoggedIn, apiAnimalController.createAnimalApiSync);
router.get('/getList', authApiMiddleware.isLoggedIn, apiAnimalController.getAnimalListApi);
router.get('/getListSync', authApiMiddleware.isLoggedIn, apiAnimalController.getAnimalListApiSync);
router.get('/getPaginatedList', authApiMiddleware.isLoggedIn, apiAnimalController.getAnimalPaginatedListApi);
router.get('/getPaginatedListSync', authApiMiddleware.isLoggedIn, apiAnimalController.getAnimalPaginatedListApiSync);
router.get('/getById/:id', authApiMiddleware.isLoggedIn, apiAnimalController.getAnimalByIdApi);
router.get('/getByIdSync/:id', authApiMiddleware.isLoggedIn, apiAnimalController.getAnimalByIdApiSync);
router.put('/update/:id', authApiMiddleware.isLoggedIn, apiAnimalController.updateAnimalApi);
router.put('/updateSync/:id', authApiMiddleware.isLoggedIn, apiAnimalController.updateAnimalApiSync);
router.delete('/delete/:id', authApiMiddleware.isLoggedIn, apiAnimalController.deleteAnimalByIdApi);
router.delete('/deleteSync/:id', authApiMiddleware.isLoggedIn, apiAnimalController.deleteAnimalByIdApiSync);

module.exports = router;
