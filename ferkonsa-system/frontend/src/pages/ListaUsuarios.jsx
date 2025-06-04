import { useEffect, useState } from "react";
import axios from "axios";
import ModalConfirmacion from "../components/ModalConfirmacion";
import UsuarioForm from "../components/UsuarioForm";

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({ rol: "", estado: "" });
  const [editando, setEditando] = useState(null);
  const [modal, setModal] = useState({ visible: false, mensaje: "", accion: null });

  // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
  const cargarUsuarios = useCallback(async () => {
    const params = {};
    if (filtros.rol) params.rol = filtros.rol;
    if (filtros.estado) params.estado = filtros.estado;
    const res = await axios.get("http://localhost:3002/api/usuarios", { params });
    setUsuarios(res.data);
  });

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  function handleEditar(usuario) {
        setEditando({ ...usuario });
    }

  const handleGuardar = async () => {
    await axios.put(`http://localhost:3002/api/usuarios/${editando.id_usuario}`, editando);
    setEditando(null);
    cargarUsuarios();
  };

  const handleEliminar = (id_usuario) => {
    setModal({
      visible: true,
      mensaje: "¿Estás seguro de eliminar este usuario?",
      accion: async () => {
        await axios.delete(`http://localhost:3002/api/usuarios/${id_usuario}`);
        setModal({ visible: false, mensaje: "", accion: null });
        cargarUsuarios();
      }
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>

      <div className="flex space-x-4 mb-4">
        <select value={filtros.rol} onChange={(e) => setFiltros({ ...filtros, rol: e.target.value })} className="p-2 border rounded">
          <option value="">Todos los roles</option>
          <option value="1">Administrador</option>
          <option value="2">Chofer</option>
        </select>
        <select value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })} className="p-2 border rounded">
          <option value="">Todos los estados</option>
          <option value="1">Activo</option>
          <option value="2">Pendiente</option>
        </select>
        <button onClick={cargarUsuarios} className="bg-blue-600 text-white px-4 py-2 rounded">Buscar</button>
      </div>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id_usuario} className="border-t">
              <td>{u.id_usuario}</td>
              <td>{u.nombre} {u.apellido}</td>
              <td>{u.correo}</td>
              <td>{u.id_rol == 1 ? "Administrador" : "Chofer"}</td>
              <td>{u.id_estado_usuario == 1 ? "Activo" : "Pendiente"}</td>
              <td className="flex space-x-2">
                <button onClick={() => handleEditar(u)} className="bg-yellow-500 px-2 py-1 rounded text-white">Editar</button>
                <button onClick={() => handleEliminar(u.id_usuario)} className="bg-red-600 px-2 py-1 rounded text-white">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <UsuarioForm
              usuario={editando}
              onChange={(e) => setEditando({ ...editando, [e.target.name]: e.target.value })}
              onGuardar={handleGuardar}
              onCancelar={() => setEditando(null)}
            />
          </div>
        </div>
      )}

      <ModalConfirmacion
        visible={modal.visible}
        mensaje={modal.mensaje}
        onConfirmar={modal.accion}
        onCancelar={() => setModal({ visible: false })}
      />
    </div>
  );
}
export default UsuariosAdmin;
