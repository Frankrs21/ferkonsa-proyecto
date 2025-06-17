const express = require('express');
const router = express.Router();
//const { register } = require('../controllers/auth.controller');
const { login, register, recuperarPassword, restablecerPassword } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/recuperar', recuperarPassword);
router.post('/restablecer/:token', restablecerPassword);
module.exports = router;
