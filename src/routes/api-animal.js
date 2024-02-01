const express = require('express');
const apiAnimalController = require('../controllers/api-animal');
const authApiMiddleware = require('../controllers/auth-api');
const router = express.Router();

router.post('/create', authApiMiddleware.isLoggedIn, apiAnimalController.createAnimalApi);
router.get('/get', authApiMiddleware.isLoggedIn, apiAnimalController.getAnimalApi);
router.get('/getById/:id', authApiMiddleware.isLoggedIn, apiAnimalController.getAnimalByIdApi);
router.put('/update/:id', authApiMiddleware.isLoggedIn, apiAnimalController.updateAnimalApi);
router.delete('/delete/:id', authApiMiddleware.isLoggedIn, apiAnimalController.deleteAnimalByIdApi);

// TODO:
// CRIAR UM METODO PARA LISTAR TODOS OS ANIMAIS DO BANCO DE DADOS SEM paginação
// CRIAR UM METODO PARA LISTAR TODOS OS ANIMAIS DO BANCO DE DADOS COM paginação sendo 2 itens por pagina 0, 2
// https://blog.thiagobelem.net/entendendo-a-paginacao-de-registros-no-mysql

// paginação
// pagina = 1
// [0, 2]
// pagina = 2
// [3, 5]
// pagina = 3
// [(pagina * 2) - 1, 6 + 2]
// SELECT * FROM `animal` ORDER by id DESC limit 0, 3

module.exports = router;
