import { useEffect, useState } from "react";
import {
  actualizarVehiculo,
  eliminarVehiculo,
} from "../../services/apiVehiculos";
import ModalConfirmar from "../ui/ModalConfirmar";
import ModalExito from "../ui/ModalExito";
import BotonRegresar from "../ui/BotonRegresar";
import ModalAgregarVehiculo from "./ModalAgregarVehiculo";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";

export default function VehiculosAdmin() {
  const [vehiculos, setVehiculos] = useState([]);
  const [estado, setEstado] = useState("");
  const [editando, setEditando] = useState(null);

  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState(null);

  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [vehiculoNuevo, setVehiculoNuevo] = useState(null);

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    const query = estado ? `?estado=${estado}` : "";
    const res = await fetch(`http://localhost:3003/api/vehiculos${query}`);
    const data = await res.json();
    setVehiculos(data);
  };

  const handleGuardar = async () => {
    await actualizarVehiculo(editando.id_vehiculo, editando);
    setEditando(null);
    setMostrarExito(true);
    cargarVehiculos();
  };

  const handleEliminar = async () => {
    await eliminarVehiculo(vehiculoAEliminar);
    setMostrarConfirmar(false);
    setMostrarExito(true);
    cargarVehiculos();
  };

  const handleAgregarVehiculo = async () => {
    const res = await fetch("http://localhost:3003/api/vehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehiculoNuevo),
    });

    if (res.ok) {
      setMostrarConfirmar(false);
      setMostrarModalAgregar(false);
      setMostrarExito(true);
      cargarVehiculos();
    }
  };

  return (
    <div className="p-6 font-roboto bg-gray-100 min-h-screen">
      <BotonRegresar />
      <h1 className="text-3xl font-bold text-[#ff0400] mb-6">Gestión de Vehículos</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos los estados</option>
          <option value="1">Disponible</option>
          <option value="2">Ocupado</option>
        </select>

        <button
          onClick={cargarVehiculos}
          title="Buscar"
          className="bg-[#ff0400] text-white p-2 rounded hover:bg-[#e60000] flex items-center justify-center"
        >
          <Search size={20} />
        </button>

        <button
          onClick={() => setMostrarModalAgregar(true)}
          title="Ingresar vehículo"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Ingresar Vehículo</span>
        </button>
      </div>

      {/* Tabla */}
      <table className="w-full text-sm bg-white shadow border">
        <thead className="bg-[#ff0400] text-white">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Placa</th>
            <th className="p-2">Modelo</th>
            <th className="p-2">Estado</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No se encontraron vehículos.
              </td>
            </tr>
          ) : (
            vehiculos.map((v) => (
              <tr key={v.id_vehiculo} className="border-b">
                <td className="p-2">{v.id_vehiculo}</td>
                <td className="p-2">
                  {editando?.id_vehiculo === v.id_vehiculo ? (
                    <input
                      value={editando.placa}
                      onChange={(e) =>
                        setEditando({ ...editando, placa: e.target.value })
                      }
                      className="border p-1 rounded"
                    />
                  ) : (
                    v.placa
                  )}
                </td>
                <td className="p-2">
                  {editando?.id_vehiculo === v.id_vehiculo ? (
                    <input
                      value={editando.modelo}
                      onChange={(e) =>
                        setEditando({ ...editando, modelo: e.target.value })
                      }
                      className="border p-1 rounded"
                    />
                  ) : (
                    v.modelo
                  )}
                </td>
                <td className="p-2">
                  {v.id_estado_general === 1 ? "Disponible" : "Ocupado"}
                </td>
                <td className="p-2 flex gap-2 justify-center">
                  {editando?.id_vehiculo === v.id_vehiculo ? (
                    <>
                      <button
                        onClick={handleGuardar}
                        className="text-green-600 hover:text-green-800"
                        title="Guardar"
                      >
                        ✔️
                      </button>
                      <button
                        onClick={() => setEditando(null)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Cancelar"
                      >
                        ❌
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditando(v)}
                        className="text-yellow-500 hover:text-yellow-700"
                        title="Editar"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setVehiculoAEliminar(v.id_vehiculo);
                          setMostrarConfirmar(true);
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
      {mostrarModalAgregar && (
        <ModalAgregarVehiculo
          onCerrar={() => setMostrarModalAgregar(false)}
          onConfirmar={(vehiculo) => {
            setVehiculoNuevo(vehiculo);
            setMostrarConfirmar(true);
          }}
        />
      )}

      {mostrarConfirmar && (
        <ModalConfirmar
          mensaje={
            vehiculoAEliminar
              ? "¿Deseas eliminar este vehículo?"
              : "¿Deseas registrar este vehículo?"
          }
          onConfirmar={
            vehiculoAEliminar ? handleEliminar : handleAgregarVehiculo
          }
          onCancelar={() => {
            setMostrarConfirmar(false);
            setVehiculoAEliminar(null);
            setVehiculoNuevo(null);
          }}
        />
      )}

      {mostrarExito && (
        <ModalExito
          mensaje="Operación realizada exitosamente"
          onClose={() => setMostrarExito(false)}
        />
      )}
    </div>
  );
}
