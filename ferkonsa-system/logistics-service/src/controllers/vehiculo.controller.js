const pool = require("../db/db");

// Obtener todos los vehículos o filtrar por estado o texto
const getVehiculos = async (req, res) => {
  const { estado, query } = req.query;

  try {
    let result;

    if (query) {
      result = await pool.query(
        `SELECT * FROM vehiculo
         WHERE LOWER(placa) LIKE LOWER($1) OR LOWER(modelo) LIKE LOWER($1)
         ORDER BY id_vehiculo ASC`,
        [`%${query}%`]
      );
    } else if (estado) {
      result = await pool.query(
        "SELECT * FROM vehiculo WHERE id_estado_general = $1 ORDER BY id_vehiculo ASC",
        [estado]
      );
    } else {
      result = await pool.query("SELECT * FROM vehiculo ORDER BY id_vehiculo ASC");
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener vehículos:", err);
    res.status(500).json({ error: "Error al obtener vehículos" });
  }
};

// Crear nuevo vehículo
const crearVehiculo = async (req, res) => {
  const { placa, modelo, id_estado_general } = req.body;

  try {
    await pool.query(
      "INSERT INTO vehiculo (placa, modelo, id_estado_general) VALUES ($1, $2, $3)",
      [placa, modelo, id_estado_general]
    );
    res.status(201).json({ mensaje: "Vehículo registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar vehículo:", err);
    res.status(500).json({ error: "Error al registrar vehículo" });
  }
};

// Actualizar vehículo
const actualizarVehiculo = async (req, res) => {
  const { id } = req.params;
  const { placa, modelo, id_estado_general } = req.body;

  try {
    await pool.query(
      "UPDATE vehiculo SET placa = $1, modelo = $2, id_estado_general = $3 WHERE id_vehiculo = $4",
      [placa, modelo, id_estado_general, id]
    );
    res.json({ mensaje: "Vehículo actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar vehículo:", err);
    res.status(500).json({ error: "Error al actualizar vehículo" });
  }
};

// Eliminar vehículo
const eliminarVehiculo = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM vehiculo WHERE id_vehiculo = $1", [id]);
    res.json({ mensaje: "Vehículo eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar vehículo:", err);
    res.status(500).json({ error: "Error al eliminar vehículo" });
  }
};

module.exports = {
  getVehiculos,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
};

