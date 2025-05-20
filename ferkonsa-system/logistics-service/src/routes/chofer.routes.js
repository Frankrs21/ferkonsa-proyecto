const express = require("express");
const router = express.Router();
const {
  getChoferes,
  crearChofer,
  actualizarChofer,
  eliminarChofer
} = require("../controllers/chofer.controller");

router.get("/", getChoferes);
router.post("/", crearChofer);
router.put("/:id", actualizarChofer);
router.delete("/:id", eliminarChofer);

module.exports = router;
