const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vehiculos", require("./routes/vehiculo.routes"));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Logistics service corriendo en el puerto ${PORT}`);
});
