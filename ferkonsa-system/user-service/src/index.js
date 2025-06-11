const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Esto es clave
app.use("/api/usuarios", require("./routes/user.routes"));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`User service corriendo en el puerto ${PORT}`);
});
