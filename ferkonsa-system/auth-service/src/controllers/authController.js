const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const sendApprovalEmail = require('../emails/approvalEmail');

exports.register = async (req, res) => {
  try {
    const { nombre, apellido, correo, password, rol } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuario (nombre, apellido, correo, password, rol, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, apellido, correo, hashedPassword, rol, 'pendiente']
    );

    const usuario = result.rows[0];
    const token = generateToken({ id: usuario.id_usuario, rol: usuario.rol });

    await sendApprovalEmail(usuario, token);
    res.status(201).json({ message: 'Usuario registrado. Esperando aprobación.' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro' });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const result = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    const usuario = result.rows[0];
    if (usuario.estado !== 'activo') return res.status(403).json({ message: 'Usuario no aprobado' });

    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = generateToken({ id: usuario.id_usuario, rol: usuario.rol });
    res.status(200).json({ token, usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login' });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await pool.query('UPDATE usuario SET estado = $1 WHERE id_usuario = $2', ['activo', decoded.id]);

    if (decoded.rol === 'chofer') {
      await pool.query('INSERT INTO chofer (id_usuario, estado) VALUES ($1, $2)', [decoded.id, 'disponible']);
    }

    res.send('<h2>✅ Usuario aprobado correctamente</h2>');
  } catch (error) {
    res.status(400).send('<h2>❌ Token inválido o expirado</h2>');
  }
};
