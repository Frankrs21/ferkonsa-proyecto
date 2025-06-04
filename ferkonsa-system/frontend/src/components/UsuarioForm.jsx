import { useEffect, useState } from "react";
import axios from "axios";

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [rolFiltro, setRolFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const url = `http://localhost:3002/api/usuarios?${rolFiltro ? `rol=${rolFiltro}&` : ""}${estadoFiltro ? `estado=${estadoFiltro}` : ""}`;
      const res = await axios.get(url);
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleBuscar = () => fetchUsuarios();

  const handleEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setMostrarModal(true);
  };

  const handleEliminar = (usuario) => {
    setUsuarioEditando(usuario);
    setModalEliminar(true);
  };

  const confirmarEliminar = async () => {
    try {
      await axios.delete(`http://localhost:3002/api/usuarios/${usuarioEditando.id_usuario}`);
      setModalEliminar(false);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const guardarCambios = async () => {
    try {
      const { id_usuario, ...resto } = usuarioEditando;
      await axios.put(`http://localhost:3002/api/usuarios/${id_usuario}`, resto);
      setMostrarModal(false);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Lista de Usuarios</h2>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <select value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)} className="border p-2 rounded">
          <option value="">Todos los roles</option>
          <option value="1">Administrador</option>
          <option value="2">Chofer</option>
        </select>
        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="border p-2 rounded">
          <option value="">Todos los estados</option>
          <option value="1">Activo</option>
          <option value="2">Pendiente</option>
        </select>
        <button onClick={handleBuscar} className="bg-blue-600 text-white px-4 py-2 rounded">Buscar</button>
      </div>

      {/* Tabla */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Apellido</th>
            <th className="border px-2 py-1">Correo</th>
            <th className="border px-2 py-1">Rol</th>
            <th className="border px-2 py-1">Estado</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id_usuario}>
              <td className="border px-2">{u.id_usuario}</td>
              <td className="border px-2">{u.nombre}</td>
              <td className="border px-2">{u.apellido}</td>
              <td className="border px-2">{u.correo}</td>
              <td className="border px-2">{u.id_rol === 1 ? "Administrador" : "Chofer"}</td>
              <td className="border px-2">{u.id_estado_usuario === 1 ? "Activo" : "Pendiente"}</td>
              <td className="border px-2 flex gap-2 justify-center">
                <button onClick={() => handleEditar(u)} className="text-blue-600">Editar</button>
                <button onClick={() => handleEliminar(u)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal edición */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">¿Guardar cambios?</h3>
            <div className="mb-4">
              <input
                value={usuarioEditando.nombre}
                onChange={(e) => setUsuarioEditando({ ...usuarioEditando, nombre: e.target.value })}
                className="w-full border p-2 rounded mb-2"
                placeholder="Nombre"
              />
              <input
                value={usuarioEditando.apellido}
                onChange={(e) => setUsuarioEditando({ ...usuarioEditando, apellido: e.target.value })}
                className="w-full border p-2 rounded mb-2"
                placeholder="Apellido"
              />
              <select
                value={usuarioEditando.id_rol}
                onChange={(e) => setUsuarioEditando({ ...usuarioEditando, id_rol: e.target.value })}
                className="w-full border p-2 rounded mb-2"
              >
                <option value="1">Administrador</option>
                <option value="2">Chofer</option>
              </select>
              <select
                value={usuarioEditando.id_estado_usuario}
                onChange={(e) => setUsuarioEditando({ ...usuarioEditando, id_estado_usuario: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="1">Activo</option>
                <option value="2">Pendiente</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setMostrarModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
              <button onClick={guardarCambios} className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminación */}
      {modalEliminar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">¿Deseas eliminar este usuario?</h3>
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalEliminar(false)} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
              <button onClick={confirmarEliminar} className="bg-red-600 text-white px-4 py-2 rounded">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuariosAdmin;
