import { useEffect, useState } from "react";
import {
  obtenerVehiculos,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
} from "../../services/apiVehiculos";
import ModalExito from "../ui/ModalExito";
import ModalConfirmar from "../ui/ModalConfirmar";

export default function VehiculosAdmin() {
  const [vehiculos, setVehiculos] = useState([]);
  const [estado, setEstado] = useState("");
  const [editando, setEditando] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [form, setForm] = useState({ placa: "", modelo: "", id_estado_general: "" });
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  const cargarVehiculos = async () => {
    const data = await obtenerVehiculos(estado);
    setVehiculos(data);
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const handleGuardar = async () => {
    await actualizarVehiculo(editando.id_vehiculo, editando);
    setEditando(null);
    cargarVehiculos();
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Deseas eliminar este vehículo?")) {
      await eliminarVehiculo(id);
      cargarVehiculos();
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegistrar = () => {
    if (!form.placa || !form.modelo || !form.id_estado_general) return;
    setMostrarConfirmacion(true);
  };

  const confirmarRegistro = async () => {
    await crearVehiculo(form);
    setMostrarConfirmacion(false);
    setMostrarExito(true);
    setForm({ placa: "", modelo: "", id_estado_general: "" });
    cargarVehiculos();
  };

  return (
    <div className="p-6 font-roboto bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-[#ff0400] mb-6">Gestión de Vehículos</h1>

      <div className="flex gap-4 mb-4">
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
          className="bg-[#ff0400] text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {mostrarFormulario ? "Ocultar" : "Ingresar Vehículo"}
        </button>
      </div>

      {/* Formulario de ingreso */}
      {mostrarFormulario && (
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded shadow">
          <input
            type="text"
            name="placa"
            placeholder="Placa"
            value={form.placa}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="modelo"
            placeholder="Modelo"
            value={form.modelo}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="id_estado_general"
            value={form.id_estado_general}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Seleccione Estado</option>
            <option value="1">Disponible</option>
            <option value="2">Ocupado</option>
          </select>
          <button
            type="button"
            onClick={handleRegistrar}
            className="bg-[#ff0400] text-white py-2 rounded col-span-full"
          >
            Registrar
          </button>
        </form>
      )}

      {/* Tabla */}
      <table className="w-full border bg-white">
        <thead className="bg-[#ff0400] text-white">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Placa</th>
            <th className="p-2">Modelo</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
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
                {editando?.id_vehiculo === v.id_vehiculo ? (
                  <select
                    value={editando.id_estado_general}
                    onChange={(e) =>
                      setEditando({
                        ...editando,
                        id_estado_general: e.target.value,
                      })
                    }
                    className="border p-1 rounded"
                  >
                    <option value="1">Disponible</option>
                    <option value="2">Ocupado</option>
                  </select>
                ) : v.id_estado_general === 1 ? (
                  "Disponible"
                ) : (
                  "Ocupado"
                )}
              </td>
              <td className="p-2 flex gap-2">
                {editando?.id_vehiculo === v.id_vehiculo ? (
                  <>
                    <button
                      onClick={handleGuardar}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditando(null)}
                      className="bg-gray-300 px-2 py-1 rounded"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditando(v)}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(v.id_vehiculo)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODALES */}
      {mostrarConfirmacion && (
        <ModalConfirmar
          mensaje="¿Deseas registrar este vehículo?"
          onConfirmar={confirmarRegistro}
          onCancelar={() => setMostrarConfirmacion(false)}
        />
      )}
      {mostrarExito && (
        <ModalExito
          mensaje="Vehículo registrado correctamente."
          onClose={() => setMostrarExito(false)}
        />
      )}
    </div>
  );
}
