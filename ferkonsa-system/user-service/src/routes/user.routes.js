const express = require("express");
const router = express.Router();
const {
  getUsuarios,
  deleteUsuario,
  updateUsuario,
  getUsuariosFiltrados,
  agregarUsuario,
} = require("../controllers/user.controller");

router.get("/", getUsuariosFiltrados); 
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);
router.post("/", agregarUsuario);

module.exports = router;