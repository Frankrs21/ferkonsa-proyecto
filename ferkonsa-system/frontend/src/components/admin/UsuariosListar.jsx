import { useState, useEffect } from "react";
import {
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} from "../../services/apiUsuarios";
import ModalConfirmar from "../ui/ModalConfirmar";
import ModalExito from "../ui/ModalExito";
import BotonRegresar from "../ui/BotonRegresar";
import { Pencil, Trash2, Search } from "lucide-react";

export default function UsuariosListar() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({ rol: "", estado: "" });
  const [busqueda, setBusqueda] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mostrarModalConfirmar, setMostrarModalConfirmar] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const filtrosCompletos = {};

    if (filtros.rol !== "") filtrosCompletos.rol = filtros.rol;
    if (filtros.estado !== "") filtrosCompletos.estado = filtros.estado;
    if (busqueda.trim() !== "") filtrosCompletos.query = busqueda.trim();

    try {
      const data = await obtenerUsuarios(filtrosCompletos);
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleGuardar = async () => {
    await actualizarUsuario(usuarioEditando.id_usuario, usuarioEditando);
    setUsuarioEditando(null);
    setMostrarModalExito(true);
    cargarUsuarios();
  };

  const handleEliminar = async () => {
    await eliminarUsuario(usuarioAEliminar);
    setMostrarModalConfirmar(false);
    setMostrarModalExito(true);
    cargarUsuarios();
  };

  return (
    <div className="p-6 font-roboto bg-gray-100 min-h-screen">
      <BotonRegresar />
      <h1 className="text-3xl font-bold text-[#ff0400] mb-6">Gestión de Usuarios</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={filtros.rol}
          onChange={(e) => setFiltros({ ...filtros, rol: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Todos los roles</option>
          <option value="1">Administrador</option>
          <option value="2">Chofer</option>
        </select>

        <select
          value={filtros.estado}
          onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Todos los estados</option>
          <option value="1">Pendiente</option>
          <option value="2">Activo</option>
        </select>

        <button
          onClick={cargarUsuarios}
          title="Buscar"
          className="bg-[#ff0400] hover:bg-[#e60000] text-white p-2 rounded flex items-center justify-center"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Tabla */}
      <table className="w-full text-sm bg-white shadow border">
        <thead className="bg-[#ff0400] text-white">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Apellido</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Estado</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                No se encontraron usuarios con esos criterios.
              </td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.id_usuario} className="border-b">
                <td className="p-2">{u.id_usuario}</td>

                <td className="p-2">
                  {usuarioEditando?.id_usuario === u.id_usuario ? (
                    <input
                      value={usuarioEditando.nombre}
                      onChange={(e) =>
                        setUsuarioEditando({
                          ...usuarioEditando,
                          nombre: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    />
                  ) : (
                    u.nombre
                  )}
                </td>

                <td className="p-2">
                  {usuarioEditando?.id_usuario === u.id_usuario ? (
                    <input
                      value={usuarioEditando.apellido}
                      onChange={(e) =>
                        setUsuarioEditando({
                          ...usuarioEditando,
                          apellido: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    />
                  ) : (
                    u.apellido
                  )}
                </td>

                <td className="p-2">{u.correo}</td>
                <td className="p-2">{u.id_rol === 1 ? "Admin" : "Chofer"}</td>
                <td className="p-2">
                  {u.id_estado_usuario === 1 ? "Pendiente" : "Activo"}
                </td>

                <td className="p-2 flex gap-2 justify-center">
                  {usuarioEditando?.id_usuario === u.id_usuario ? (
                    <>
                      <button
                        onClick={handleGuardar}
                        className="text-green-600 hover:text-green-800"
                        title="Guardar"
                      >
                        ✔️
                      </button>
                      <button
                        onClick={() => setUsuarioEditando(null)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Cancelar"
                      >
                        ❌
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setUsuarioEditando(u)}
                        className="text-yellow-500 hover:text-yellow-700"
                        title="Editar"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setUsuarioAEliminar(u.id_usuario);
                          setMostrarModalConfirmar(true);
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODALES */}
      {mostrarModalConfirmar && (
        <ModalConfirmar
          mensaje="¿Deseas eliminar este usuario?"
          onConfirmar={handleEliminar}
          onCancelar={() => setMostrarModalConfirmar(false)}
        />
      )}

      {mostrarModalExito && (
        <ModalExito
          mensaje="Operación realizada exitosamente"
          onClose={() => setMostrarModalExito(false)}
        />
      )}
    </div>
  );
}
