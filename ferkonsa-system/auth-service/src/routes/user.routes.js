const express = require("express");
const router = express.Router();
const { approveUser } = require("../controllers/user.controller");

router.get("/approve/:id", approveUser);

module.exports = router;
