const pool = require("../db/db");

const approveUser = async (req, res) => {
  const { id } = req.params;
  console.log("⚡ Ruta /approve ejecutada para ID:", id);

  try {
    await pool.query(
      "UPDATE usuario SET id_estado_usuario = 1 WHERE id_usuario = $1",
      [id]
    );

    // Puedes responderse con html también
    res.send("✅ Usuario aprobado con éxito. Ya puede iniciar sesión.");

  } catch (error) {
    console.error("Error al aprobar usuario:", error);
    res.status(500).send("❌ Error al aprobar el usuario.");
  }
};

module.exports = { approveUser };
