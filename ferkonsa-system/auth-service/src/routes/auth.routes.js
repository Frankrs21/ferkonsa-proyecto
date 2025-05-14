const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const { register, login, recuperarPassword } = require("../controllers/auth.controller");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db/db");

const {
  register,
  login,
  recuperarPassword
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/recuperar", recuperarPassword);

//Ruta para el cambio de contraseña mediante el token por correo
router.post("/restablecer/:token", async (req, res) => {
  const { token } = req.params;
  const { nuevaContraseña } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(nuevaContraseña, 10);

    await pool.query(
      "UPDATE usuario SET contraseña = $1 WHERE id_usuario = $2",
      [hashed, decoded.id]
    );

    res.send("✅ Contraseña actualizada correctamente.");
  } catch (err) {
    console.error("Token inválido o expirado:", err.message);
    res.status(400).send("❌ Enlace inválido o expirado.");
  }
});

module.exports = router;
