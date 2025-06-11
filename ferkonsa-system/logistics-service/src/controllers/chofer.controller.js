const pool = require("../db/db");

// Obtener todos los choferes
const getChoferes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ch.id_chofer, us.nombre, us.apellido, us.correo, ch.id_estado_general
      FROM chofer ch
      JOIN usuario us ON ch.id_usuario = us.id_usuario
      ORDER BY ch.id_chofer ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener choferes:", err);
    res.status(500).json({ error: "Error al obtener choferes" });
  }
};

// Actualizar estado del chofer (disponible/ocupado)
const actualizarChofer = async (req, res) => {
  const { id } = req.params;
  const { id_estado_general } = req.body;

  try {
    await pool.query(
      "UPDATE chofer SET id_estado_general = $1 WHERE id_chofer = $2",
      [id_estado_general, id]
    );
    res.json({ mensaje: "Estado del chofer actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar chofer:", err);
    res.status(500).json({ error: "Error al actualizar chofer" });
  }
};

// Buscar chofer por nombre o apellido
const buscarChoferes = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "El parámetro 'query' es requerido." });
  }

  try {
    const result = await pool.query(`
      SELECT ch.id_chofer, us.nombre, us.apellido, us.correo, ch.id_estado_general
      FROM chofer ch
      JOIN usuario us ON ch.id_usuario = us.id_usuario
      WHERE LOWER(us.nombre) LIKE LOWER($1) OR LOWER(us.apellido) LIKE LOWER($1)
      ORDER BY ch.id_chofer ASC
    `, [`%${query}%`]);

    res.json(result.rows);
  } catch (err) {
    console.error("Error al buscar choferes:", err);
    res.status(500).json({ error: "Error al buscar choferes" });
  }
};

module.exports = {
  getChoferes,
  actualizarChofer,
  buscarChoferes
};
