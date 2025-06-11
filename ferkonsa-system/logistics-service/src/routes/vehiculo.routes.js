const express = require("express");
const router = express.Router();
const {
  getVehiculos,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
} = require("../controllers/vehiculo.controller");

// GET /api/vehiculos
router.get("/", getVehiculos);

// POST /api/vehiculos
router.post("/", crearVehiculo);

// PUT /api/vehiculos/:id
router.put("/:id", actualizarVehiculo);

// DELETE /api/vehiculos/:id
router.delete("/:id", eliminarVehiculo);

module.exports = router;

