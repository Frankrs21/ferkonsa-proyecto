const express = require('express');
const router = express.Router();
const { register, login, approveUser } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/approve/:token', approveUser);

module.exports = router;
