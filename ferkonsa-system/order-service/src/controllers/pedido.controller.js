const pool = require('../db/db');
const PDFDocument = require('pdfkit');

// Registrar pedido completo (cabecera + detalle)
const registrarPedido = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      direccion,
      cliente,
      productos, // [{ producto, cantidad }]
      precio_pedido,
      precio_entrega
    } = req.body;

    const total = Number(precio_pedido) + Number(precio_entrega || 0);

    await client.query('BEGIN');

    // Insertar pedido
    const result = await client.query(
      `INSERT INTO pedido (direccion, cliente, precio_pedido, precio_entrega, total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [direccion, cliente, precio_pedido, precio_entrega, total]
    );

    const pedido = result.rows[0];

    // Insertar cada detalle de producto
    for (const item of productos) {
      await client.query(
        `INSERT INTO detalle_pedido (id_pedido, producto, cantidad)
         VALUES ($1, $2, $3)`,
        [pedido.id_pedido, item.producto, item.cantidad]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ pedido });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el pedido', detalle: error.message });
  } finally {
    client.release();
  }
};

// Listar pedidos con sus detalles
const listarPedidos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             json_agg(json_build_object('producto', d.producto, 'cantidad', d.cantidad)) AS detalles
      FROM pedido p
      LEFT JOIN detalle_pedido d ON p.id_pedido = d.id_pedido
      GROUP BY p.id_pedido
      ORDER BY p.fecha_registro DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar pedidos', detalle: error.message });
  }
};

// Editar pedido completo 
const editarPedido = async (req, res) => {
  const { id_pedido } = req.params;
  const { direccion, cliente, precio_pedido, precio_entrega } = req.body;

  const total = Number(precio_pedido) + Number(precio_entrega || 0);

  try {
    await pool.query(
      `UPDATE pedido
       SET direccion = $1,
           cliente = $2,
           precio_pedido = $3,
           precio_entrega = $4,
           total = $5
       WHERE id_pedido = $6`,
      [direccion, cliente, precio_pedido, precio_entrega, total, id_pedido]
    );

    res.json({ mensaje: `Pedido ${id_pedido} actualizado correctamente.` });
  } catch (error) {
    res.status(500).json({ error: 'Error al editar el pedido', detalle: error.message });
  }
};

// Eliminar pedido
const eliminarPedido = async (req, res) => {
  const { id_pedido } = req.params;

  try {
    // Validar estado del pedido
    const pedido = await pool.query(
      `SELECT estado FROM pedido WHERE id_pedido = $1`,
      [id_pedido]
    );

    if (pedido.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (pedido.rows[0].estado === 'entregado') {
      return res.status(400).json({ error: 'No se puede eliminar un pedido entregado' });
    }

    await pool.query(
      `DELETE FROM pedido WHERE id_pedido = $1`,
      [id_pedido]
    );

    res.json({ mensaje: `Pedido ${id_pedido} eliminado correctamente.` });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el pedido', detalle: error.message });
  }
};

//asignar pedido a un vehículo y chofer
const asignarPedido = async (req, res) => {
  const { id_pedido, id_vehiculo, id_chofer } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO asignacion (id_pedido, id_vehiculo, id_chofer)
       VALUES ($1, $2, $3) RETURNING *`,
      [id_pedido, id_vehiculo, id_chofer]
    );

    await pool.query(
      `UPDATE pedido SET estado = 'asignado' WHERE id_pedido = $1`,
      [id_pedido]
    );

    res.status(201).json({ asignacion: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar el pedido', detalle: error.message });
  }
};

// Actualizar estado del pedido
const actualizarEstadoPedido = async (req, res) => {
  const { id_pedido } = req.params;
  const { nuevo_estado } = req.body;

  try {
    await pool.query(
      `UPDATE pedido SET estado = $1 WHERE id_pedido = $2`,
      [nuevo_estado, id_pedido]
    );
    res.json({ mensaje: `Pedido ${id_pedido} actualizado a '${nuevo_estado}'` });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado', detalle: error.message });
  }
};

//Editar pedido
const editarAsignacion = async (req, res) => {
  const { id_asignacion } = req.params;
  const { id_vehiculo, id_chofer } = req.body;

  try {
    const result = await pool.query(
      `UPDATE asignacion
       SET id_vehiculo = $1,
           id_chofer = $2
       WHERE id_asignacion = $3
       RETURNING *`,
      [id_vehiculo, id_chofer, id_asignacion]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    res.json({ mensaje: `Asignación actualizada correctamente`, asignacion: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al editar la asignación', detalle: error.message });
  }
};
// Eliminar asignación de pedido
const eliminarAsignacion = async (req, res) => {
  const { id_asignacion } = req.params;

  try {
    // Obtener el id del pedido relacionado
    const result = await pool.query(
      `SELECT id_pedido FROM asignacion WHERE id_asignacion = $1`,
      [id_asignacion]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    const id_pedido = result.rows[0].id_pedido;

    // Eliminar asignación
    await pool.query(`DELETE FROM asignacion WHERE id_asignacion = $1`, [id_asignacion]);

    // Revertir estado del pedido
    await pool.query(`UPDATE pedido SET estado = 'pendiente' WHERE id_pedido = $1`, [id_pedido]);

    res.json({ mensaje: `Asignación eliminada y pedido ${id_pedido} marcado como pendiente.` });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la asignación', detalle: error.message });
  }
};

// Obtener historial de entregas con filtros
const obtenerHistorialEntregas = async (req, res) => {
  const { estado, desde, hasta, id_chofer } = req.query;

  let query = `
    SELECT p.*, 
           a.id_chofer,
           a.id_vehiculo,
           json_agg(json_build_object('producto', d.producto, 'cantidad', d.cantidad)) AS detalles
    FROM pedido p
    LEFT JOIN asignacion a ON p.id_pedido = a.id_pedido
    LEFT JOIN detalle_pedido d ON p.id_pedido = d.id_pedido
    WHERE 1=1
  `;

  const params = [];
  let index = 1;

  if (estado) {
    query += ` AND p.estado = $${index++}`;
    params.push(estado);
  }

  if (desde) {
    query += ` AND p.fecha_registro >= $${index++}`;
    params.push(desde);
  }

  if (hasta) {
    query += ` AND p.fecha_registro <= $${index++}`;
    params.push(hasta);
  }

  if (id_chofer) {
    query += ` AND a.id_chofer = $${index++}`;
    params.push(id_chofer);
  }

  query += ` GROUP BY p.id_pedido, a.id_chofer, a.id_vehiculo
             ORDER BY p.fecha_registro DESC`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial', detalle: error.message });
  }
};

// Generar reporte de pedidos con filtros
const generarReporte = async (req, res) => {
  const { estado, desde, hasta, id_chofer, id_vehiculo } = req.query;

  let query = `
    SELECT p.*,
           a.id_vehiculo,
           a.id_chofer,
           json_agg(json_build_object('producto', d.producto, 'cantidad', d.cantidad)) AS detalles
    FROM pedido p
    LEFT JOIN asignacion a ON p.id_pedido = a.id_pedido
    LEFT JOIN detalle_pedido d ON p.id_pedido = d.id_pedido
    WHERE 1=1
  `;

  const params = [];
  let index = 1;

  if (estado) {
    query += ` AND p.estado = $${index++}`;
    params.push(estado);
  }

  if (desde) {
    query += ` AND p.fecha_registro >= $${index++}`;
    params.push(desde);
  }

  if (hasta) {
    query += ` AND p.fecha_registro <= $${index++}`;
    params.push(hasta);
  }

  if (id_chofer) {
    query += ` AND a.id_chofer = $${index++}`;
    params.push(id_chofer);
  }

  if (id_vehiculo) {
    query += ` AND a.id_vehiculo = $${index++}`;
    params.push(id_vehiculo);
  }

  query += `
    GROUP BY p.id_pedido, a.id_chofer, a.id_vehiculo
    ORDER BY p.fecha_registro DESC
  `;

  try {
    const result = await pool.query(query, params);
    res.json({ reporte: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el reporte', detalle: error.message });
  }
};

// Generar reporte PDF de pedidos
const generarReportePDF = async (req, res) => {
  const { estado, desde, hasta, id_chofer, id_vehiculo } = req.query;

  let query = `
    SELECT p.*, 
           a.id_chofer,
           a.id_vehiculo
    FROM pedido p
    LEFT JOIN asignacion a ON p.id_pedido = a.id_pedido
    WHERE 1=1
  `;

  const params = [];
  let index = 1;

  if (estado) {
    query += ` AND p.estado = $${index++}`;
    params.push(estado);
  }

  if (desde) {
    query += ` AND p.fecha_registro >= $${index++}`;
    params.push(desde);
  }

  if (hasta) {
    query += ` AND p.fecha_registro <= $${index++}`;
    params.push(hasta);
  }

  if (id_chofer) {
    query += ` AND a.id_chofer = $${index++}`;
    params.push(id_chofer);
  }

  if (id_vehiculo) {
    query += ` AND a.id_vehiculo = $${index++}`;
    params.push(id_vehiculo);
  }

  query += ` ORDER BY p.fecha_registro DESC`;

  try {
    const result = await pool.query(query, params);
    const pedidos = result.rows;

    // Crear PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-pedidos.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Reporte de Pedidos', { align: 'center' });
    doc.moveDown();

    pedidos.forEach((p, index) => {
      doc.fontSize(12).text(`Pedido #${p.id_pedido}`);
      doc.text(`Cliente: ${p.cliente}`);
      doc.text(`Dirección: ${p.direccion}`);
      doc.text(`Fecha: ${new Date(p.fecha_registro).toLocaleString()}`);
      doc.text(`Estado: ${p.estado}`);
      doc.text(`Chofer: ${p.id_chofer || 'No asignado'}`);
      doc.text(`Camión: ${p.id_vehiculo || 'No asignado'}`);
      doc.text(`Total a pagar: $${p.total}`);
      doc.moveDown();
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar PDF', detalle: error.message });
  }
};


module.exports = {
  registrarPedido,
  listarPedidos,
  editarPedido,
  eliminarPedido,
  asignarPedido,
  actualizarEstadoPedido,
  editarAsignacion,
  eliminarAsignacion,
  obtenerHistorialEntregas,
  generarReporte,
  generarReportePDF
};
