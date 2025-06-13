const express = require('express');
const router = express.Router();
const { approveUser } = require('../controllers/approve.controller');

router.get('/:token', approveUser);
module.exports = router;