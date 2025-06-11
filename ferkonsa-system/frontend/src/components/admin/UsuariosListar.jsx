import { useState, useEffect } from "react";
import {
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} from "../../services/apiUsuarios";

export default function UsuariosListar() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({ rol: "", estado: "" });
  const [busqueda, setBusqueda] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Solo se ejecuta al montar el componente
  useEffect(() => {
    cargarUsuarios(); // opcional si deseas precargar todo
  }, []);

  // Función que ejecuta la búsqueda cuando haces clic en "Buscar"
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
    cargarUsuarios();
  };

  const handleEliminar = async (id) => {
    await eliminarUsuario(id);
    cargarUsuarios();
  };

  return (
    <div className="p-6 font-roboto bg-gray-100 min-h-screen">
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
          className="bg-[#ff0400] text-white px-4 py-2 rounded"
        >
          Buscar
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
            <th className="p-2">Acciones</th>
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

                <td className="p-2 flex gap-2">
                  {usuarioEditando?.id_usuario === u.id_usuario ? (
                    <>
                      <button
                        onClick={handleGuardar}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setUsuarioEditando(null)}
                        className="bg-gray-300 px-2 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setUsuarioEditando(u)}
                        className="bg-yellow-400 px-2 py-1 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(u.id_usuario)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
