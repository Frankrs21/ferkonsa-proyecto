const jwt = require('jsonwebtoken');
const pool = require('../db/db');

exports.approveUser = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, rol } = decoded;

    const estadoActivo = await pool.query(`SELECT id_estado_usuario FROM estado_usuario WHERE LOWER(descripcion) = 'activo'`);
    await pool.query(`UPDATE usuario SET id_estado_usuario = $1 WHERE id_usuario = $2`, [estadoActivo.rows[0].id_estado_usuario, id]);

    if (rol.toLowerCase() === 'chofer') {
      const estadoChofer = await pool.query(`SELECT id_estado_general FROM estado_general WHERE LOWER(descripcion) = 'disponible'`);
      await pool.query(`INSERT INTO chofer (id_usuario, id_estado_general) VALUES ($1, $2)`, [id, estadoChofer.rows[0].id_estado_general]);
    }

    return res.send('<h2 style="color:green;">✅ Usuario aprobado correctamente</h2>');
  } catch (err) {
    console.error('❌ Error en aprobación:', err.message);
    return res.send('<h2 style="color:red;">❌ Token inválido o expirado</h2>');
  }
};