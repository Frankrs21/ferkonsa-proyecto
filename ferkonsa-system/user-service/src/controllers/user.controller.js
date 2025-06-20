const pool = require("../db/db");
const bcrypt = require("bcryptjs");

// Agregar un nuevo usuario
const agregarUsuario = async (req, res) => {
  const { nombre, apellido, correo, contraseña, id_rol, id_estado_usuario } = req.body;

  try {
    const existe = await pool.query("SELECT 1 FROM usuario WHERE correo = $1", [correo]);
    if (existe.rowCount > 0) {
      return res.status(409).json({ error: "Este correo ya está registrado" });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const result = await pool.query(
      `INSERT INTO usuario (nombre, apellido, correo, contraseña, id_rol, id_estado_usuario)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario`,
      [nombre, apellido, correo, hash, id_rol, id_estado_usuario]
    );

    const id_usuario = result.rows[0].id_usuario;

    // Si el rol es chofer (2), crear en tabla chofer con estado disponible (1)
    if (id_rol == 2) {
      await pool.query(
        `INSERT INTO chofer (id_usuario, id_estado_general) VALUES ($1, 1)`,
        [id_usuario]
      );
    }

    res.status(201).json({ mensaje: "Usuario creado exitosamente" });

  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ error: err.message });
  }
};

// Listar todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuario ORDER BY id_usuario ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM chofer WHERE id_usuario = $1", [id]);
    await pool.query("DELETE FROM usuario WHERE id_usuario = $1", [id]);
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

// Editar un usuario
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, id_rol, id_estado_usuario } = req.body;

  try {
    await pool.query(
      `UPDATE usuario 
       SET nombre = $1, apellido = $2, correo = $3, id_rol = $4, id_estado_usuario = $5 
       WHERE id_usuario = $6`,
      [nombre, apellido, correo, id_rol, id_estado_usuario, id]
    );

    const esChofer = await pool.query("SELECT 1 FROM chofer WHERE id_usuario = $1", [id]);

    if (id_rol == 2) {
      if (esChofer.rowCount === 0) {
        await pool.query(
          `INSERT INTO chofer (id_usuario, id_estado_general) VALUES ($1, 1)`,
          [id]
        );
      }
    } else {
      if (esChofer.rowCount > 0) {
        await pool.query("DELETE FROM chofer WHERE id_usuario = $1", [id]);
      }
    }

    res.json({ mensaje: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Filtrar usuarios por rol y/o estado
const getUsuariosFiltrados = async (req, res) => {
  const { rol, estado, query } = req.query;
  const condiciones = [];
  const valores = [];

  let sql = "SELECT * FROM usuario";

  if (rol) {
    condiciones.push(`id_rol = $${valores.length + 1}`);
    valores.push(rol);
  }

  if (estado) {
    condiciones.push(`id_estado_usuario = $${valores.length + 1}`);
    valores.push(estado);
  }

  if (query && query.trim() !== "") {
    condiciones.push(`(LOWER(nombre) LIKE $${valores.length + 1} OR LOWER(apellido) LIKE $${valores.length + 1})`);
    valores.push(`%${query.toLowerCase()}%`);
  }

  if (condiciones.length > 0) {
    sql += " WHERE " + condiciones.join(" AND ");
  }

  sql += " ORDER BY id_usuario ASC";

  try {
    const result = await pool.query(sql, valores);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al filtrar/buscar usuarios:", err);
    res.status(500).json({ error: "Error al filtrar/buscar usuarios" });
  }
};

module.exports = {
  agregarUsuario,
  getUsuarios,
  deleteUsuario,
  updateUsuario,
  getUsuariosFiltrados
};