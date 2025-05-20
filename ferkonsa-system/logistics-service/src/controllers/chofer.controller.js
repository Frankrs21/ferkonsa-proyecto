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

// Crear nuevo chofer
const crearChofer = async (req, res) => {
  const { id_usuario, id_estado_general } = req.body;
  try {
    await pool.query(
      "INSERT INTO chofer (id_usuario, id_estado_general) VALUES ($1, $2)",
      [id_usuario, id_estado_general]
    );
    res.status(201).json({ mensaje: "Chofer creado correctamente" });
  } catch (err) {
    console.error("Error al crear chofer:", err);
    res.status(500).json({ error: "Error al crear chofer" });
  }
};

// Actualizar chofer
const actualizarChofer = async (req, res) => {
  const { id } = req.params;
  const { id_estado_general } = req.body;
  try {
    await pool.query(
      "UPDATE chofer SET id_estado_general = $1 WHERE id_chofer = $2",
      [id_estado_general, id]
    );
    res.json({ mensaje: "Chofer actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar chofer:", err);
    res.status(500).json({ error: "Error al actualizar chofer" });
  }
};

// Eliminar chofer
const eliminarChofer = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM chofer WHERE id_chofer = $1", [id]);
    res.json({ mensaje: "Chofer eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar chofer:", err);
    res.status(500).json({ error: "Error al eliminar chofer" });
  }
};

module.exports = {
  getChoferes,
  crearChofer,
  actualizarChofer,
  eliminarChofer
};
