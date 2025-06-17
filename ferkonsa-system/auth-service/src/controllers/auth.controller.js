const pool = require('../db/db');
const generateToken = require('../utils/generateToken');
const sendApprovalEmail = require('../emails/approvalEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../emails/sendEmail');

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

exports.recuperarPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    const result = await pool.query(
      'SELECT * FROM usuario WHERE correo = $1',
      [correo]
    );

    const usuario = result.rows[0];

    console.log("📩 Usuario encontrado para recuperación:", usuario); // ✅ Agrega este log

    if (!usuario) {
      return res.status(404).json({ error: 'Correo no registrado' });
    }

    const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const url = `${process.env.RESET_PASSWORD_URL}/${token}`;
    const html = `
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic en el botón para restablecer tu contraseña:</p>
      <a href="${url}" style="padding:10px 20px;background:#ff0400;color:white;text-decoration:none;border-radius:6px;">Restablecer contraseña</a>
      <p>Este enlace es válido por 15 minutos.</p>
    `;

    await sendEmail(usuario.correo, 'Recuperar contraseña', html);
    res.json({ mensaje: 'Se ha enviado un correo para recuperar tu contraseña' });
  } catch (error) {
    console.error('❌ Error al enviar recuperación:', error.message);
    res.status(500).json({ error: 'Error en el proceso de recuperación' });
  }
};

exports.restablecerPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaContrasena } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(nuevaContrasena, 10);

    await pool.query(
      'UPDATE usuario SET contraseña = $1 WHERE id_usuario = $2',
      [hashed, decoded.id]
    );

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al restablecer:', error.message);
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
};