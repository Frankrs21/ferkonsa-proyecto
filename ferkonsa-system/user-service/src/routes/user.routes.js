const express = require("express");
const router = express.Router();
const {
  agregarUsuario,
  getUsuarios,
  deleteUsuario,
  updateUsuario,
  getUsuariosFiltrados
} = require("../controllers/user.controller");

router.get("/", getUsuariosFiltrados); // búsqueda y filtros combinados
router.get("/all", getUsuarios);       // obtener todos sin filtro
router.post("/", agregarUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

module.exports = router;
