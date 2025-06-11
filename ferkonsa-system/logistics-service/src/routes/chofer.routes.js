const express = require("express");
const router = express.Router();

const {
  getChoferes,
  actualizarChofer,
  buscarChoferes
} = require("../controllers/chofer.controller");

// Ruta para listar todos los choferes
router.get("/", getChoferes);

// Ruta para actualizar estado del chofer
router.put("/:id", actualizarChofer);

// Ruta para buscar choferes por nombre o apellido
router.get("/buscar", buscarChoferes);

module.exports = router;

