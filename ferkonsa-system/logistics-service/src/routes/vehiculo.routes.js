const express = require("express");
const router = express.Router();
const {
  getVehiculos,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
} = require("../controllers/vehiculo.controller");

router.get("/", getVehiculos);
router.post("/", crearVehiculo);
router.put("/:id", actualizarVehiculo);
router.delete("/:id", eliminarVehiculo);

module.exports = router;
