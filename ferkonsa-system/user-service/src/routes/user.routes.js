const express = require('express');
const router = express.Router();
const {
  agregarUsuario,
  getUsuarios,
  deleteUsuario,
  updateUsuario,
  getUsuariosFiltrados,
  buscarUsuariosPorNombreApellido
} = require('../controllers/user.controller');


router.get('/', getUsuarios);                     // GET /api/usuarios
router.get('/filtrar', getUsuariosFiltrados);     // GET /api/usuarios/filtrar
router.get('/buscar', buscarUsuariosPorNombreApellido); // GET /api/usuarios/buscar
router.post('/', agregarUsuario);                 // POST /api/usuarios
router.put('/:id', updateUsuario);                // PUT /api/usuarios/:id
router.delete('/:id', deleteUsuario);             // DELETE /api/usuarios/:id

module.exports = router;
