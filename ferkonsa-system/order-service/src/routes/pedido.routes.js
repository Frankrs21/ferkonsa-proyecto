const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/pedido.controller');

router.post('/', registrarPedido);
router.get('/', listarPedidos);
router.put('/:id_pedido', editarPedido);
router.delete('/:id_pedido', eliminarPedido);
router.post('/asignar', asignarPedido); 
router.put('/:id_pedido/estado', actualizarEstadoPedido);
router.put('/asignacion/:id_asignacion', editarAsignacion);
router.delete('/asignacion/:id_asignacion', eliminarAsignacion);
router.get('/historial', obtenerHistorialEntregas);
router.get('/reporte', generarReporte);
router.get('/reporte/pdf', generarReportePDF);



module.exports = router;
