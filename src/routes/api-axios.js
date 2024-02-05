const express = require('express');
const apiAxios = require('../controllers/api-axios');
const router = express.Router();

router.get('/axios', apiAxios.getAxiosApi);

module.exports = router;
