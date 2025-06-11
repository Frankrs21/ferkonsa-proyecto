const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Rutas de choferes
app.use("/api/choferes", require("./routes/chofer.routes"));

// Rutas de vehículos
app.use("/api/vehiculos", require("./routes/vehiculo.routes")); // ✅ IMPORTANTE

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Logistics service corriendo en el puerto ${PORT}`);
});
