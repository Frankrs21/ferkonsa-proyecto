const pool = require('../db/db');
const generateToken = require('../utils/generateToken');
const sendApprovalEmail = require('../emails/approvalEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

// Obtener la descripción del rol desde la tabla
    const rolDescripcion = await pool.query(
      `SELECT descripcion FROM rol WHERE id_rol = $1`,
      [usuario.id_rol]
    );

    const rolTexto = rolDescripcion.rows[0]?.descripcion || 'desconocido';

    // Generar token con rol descriptivo
    const token = generateToken({ id: usuario.id_usuario, rol: rolTexto });

    // Enviar el correo con el rol incluido
    await sendApprovalEmail({ ...usuario, rol: rolTexto }, token);


        res.status(201).json({ mensaje: 'Usuario registrado y correo enviado al superadmin' });
      } catch (error) {
        console.error('❌ Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
      }
};

exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const result = await pool.query(
      `SELECT u.*, r.descripcion as rol_desc, e.descripcion as estado_desc
       FROM usuario u
       JOIN rol r ON u.id_rol = r.id_rol
       JOIN estado_usuario e ON u.id_estado_usuario = e.id_estado_usuario
       WHERE correo = $1`,
      [correo]
    );

    const usuario = result.rows[0];
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    if (usuario.estado_desc.toLowerCase() !== 'activo') {
      return res.status(403).json({ error: 'Usuario no aprobado aún' });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol_desc
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, usuario: {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol_desc
    } });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error en login' });
  }
};