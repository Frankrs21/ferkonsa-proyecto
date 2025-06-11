import { useEffect, useState } from "react";
import {
  obtenerChoferes,
  buscarChoferes,
  actualizarChofer,
} from "../../services/apiChoferes";
import BotonRegresar from "../ui/BotonRegresar";
import { Search } from "lucide-react";

export default function ChoferesAdmin() {
  const [choferes, setChoferes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultadosVacios, setResultadosVacios] = useState(false);

  // Cargar todos los choferes al entrar
  useEffect(() => {
    const cargar = async () => {
      const data = await obtenerChoferes();
      setChoferes(data);
      setResultadosVacios(data.length === 0);
    };
    cargar();
  }, []);

  const buscar = async () => {
    const query = busqueda.trim();

    if (query === "") {
      const data = await obtenerChoferes();
      setChoferes(data);
      setResultadosVacios(data.length === 0);
    } else {
      const data = await buscarChoferes(query);
      setChoferes(data);
      setResultadosVacios(data.length === 0);
    }
  };

  const cambiarEstado = async (id_chofer, nuevoEstado) => {
    try {
      await actualizarChofer(id_chofer, { id_estado_general: nuevoEstado });
      buscar(); // recargar
    } catch (err) {
      console.error("Error al cambiar estado del chofer:", err);
    }
  };

  return (
    <div className="p-6 font-roboto bg-gray-100 min-h-screen">
      <BotonRegresar />
      <h1 className="text-3xl font-bold text-[#ff0400] mb-6">Gestión de Choferes</h1>

      {/* Buscador */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border p-2 rounded w-72"
        />
        <button
          onClick={buscar}
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
            <th className="p-2">ID Chofer</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Apellido</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Estado</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resultadosVacios ? (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No se encontraron choferes con el nombre/apellido.
              </td>
            </tr>
          ) : (
            choferes.map((c) => (
              <tr key={c.id_chofer} className="border-b">
                <td className="p-2">{c.id_chofer}</td>
                <td className="p-2">{c.nombre}</td>
                <td className="p-2">{c.apellido}</td>
                <td className="p-2">{c.correo}</td>
                <td className="p-2">
                  {c.id_estado_general === 1 ? "Disponible" : "Ocupado"}
                </td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    disabled={c.id_estado_general === 1}
                    onClick={() => cambiarEstado(c.id_chofer, 1)}
                    className={`px-3 py-1 rounded text-white ${
                      c.id_estado_general === 1
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    Disponible
                  </button>
                  <button
                    disabled={c.id_estado_general === 2}
                    onClick={() => cambiarEstado(c.id_chofer, 2)}
                    className={`px-3 py-1 rounded text-white ${
                      c.id_estado_general === 2
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Ocupado
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
