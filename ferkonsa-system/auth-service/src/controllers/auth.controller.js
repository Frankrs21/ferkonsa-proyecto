const pool = require('../db/db');
const generateToken = require('../utils/generateToken');
const sendApprovalEmail = require('../emails/approvalEmail');

exports.register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña, rol } = req.body;

    const result = await pool.query(
      `INSERT INTO usuario (nombre, apellido, correo, contraseña, id_rol, id_estado_usuario)
       VALUES ($1, $2, $3, crypt($4, gen_salt('bf')),
       (SELECT id_rol FROM rol WHERE LOWER(descripcion) = LOWER($5)),
       (SELECT id_estado_usuario FROM estado_usuario WHERE LOWER(descripcion) = 'pendiente'))
       RETURNING *`,
      [nombre, apellido, correo, contraseña, rol]
    );

    const usuario = result.rows[0];
    const token = generateToken({ id: usuario.id_usuario, rol });
    await sendApprovalEmail(usuario, token);

    res.status(201).json({ mensaje: 'Usuario registrado y correo enviado al superadmin' });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};