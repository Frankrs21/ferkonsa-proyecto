const pool = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendApprovalEmail } = require("../utils/mailer");
const { sendRecoveryEmail } = require("../utils/mailer");


// REGISTRO DE USUARIO
const register = async (req, res) => {
  const { nombre, apellido, correo, contraseña, id_rol } = req.body;

  try {
    // Validar campos obligatorios
    if (!nombre || !apellido || !correo || !contraseña || !id_rol) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

    // Verificar si el correo ya está registrado
    const existeCorreo = await pool.query("SELECT * FROM usuario WHERE correo = $1", [correo]);
    if (existeCorreo.rows.length > 0) {
      return res.status(409).json({ mensaje: "Este correo ya está registrado." });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar nuevo usuario (estado 2 = Inactivo)
    const resultado = await pool.query(
      `INSERT INTO usuario (nombre, apellido, correo, contraseña, id_rol, id_estado_usuario)
       VALUES ($1, $2, $3, $4, $5, 2) RETURNING id_usuario`,
      [nombre, apellido, correo, hashedPassword, id_rol]
    );

    await sendApprovalEmail("mr.yauale@gmail.com", resultado.rows[0].id_usuario); //aqui agrege 0000000000000000000000000000000000000000000000000000000000


    return res.status(201).json({
      mensaje: "Usuario registrado correctamente. Esperando aprobación del superadministrador.",
      id_usuario: resultado.rows[0].id_usuario,
    });

  } catch (error) {
  console.error("Error en register:", error); // muestra el error completo
  return res.status(500).json({ error: error.message });
}
};

// LOGIN DE USUARIO
const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    if (!correo || !contraseña) {
      return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios." });
    }

    const resultado = await pool.query("SELECT * FROM usuario WHERE correo = $1", [correo]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(404).json({ mensaje: "Correo no registrado." });
    }

    if (usuario.id_estado_usuario !== 1) {
      return res.status(403).json({ mensaje: "Cuenta no aprobada por el superadministrador." });
    }

    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.status(200).json({ mensaje: "Inicio de sesión exitoso.", token });

  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ error: "Error interno al iniciar sesión." });
  }
};

const recuperarPassword = async (req, res) => {
  const { correo } = req.body;

  try {
    const resultado = await pool.query("SELECT * FROM usuario WHERE correo = $1", [correo]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(404).json({ mensaje: "Correo no encontrado." });
    }

    const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: "15m" });

    await sendRecoveryEmail(correo, token);

    res.status(200).json({ mensaje: "Correo de recuperación enviado." });

  } catch (error) {
    console.error("Error en recuperación:", error.message);
    res.status(500).json({ error: "Error al procesar recuperación." });
  }
};

module.exports = { register, login, recuperarPassword };

