import { useState } from "react";

export default function ModalAgregarVehiculo({ onCerrar, onConfirmar }) {
  const [vehiculo, setVehiculo] = useState({
    placa: "",
    modelo: "",
    id_estado_general: "1",
  });

  const handleChange = (e) => {
    setVehiculo({ ...vehiculo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmar(vehiculo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#ff0400]">Nuevo Vehículo</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="placa"
            value={vehiculo.placa}
            onChange={handleChange}
            placeholder="Placa"
            required
            className="border p-2 rounded"
          />
          <input
            name="modelo"
            value={vehiculo.modelo}
            onChange={handleChange}
            placeholder="Modelo"
            required
            className="border p-2 rounded"
          />
          <select
            name="id_estado_general"
            value={vehiculo.id_estado_general}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="1">Disponible</option>
            <option value="2">Ocupado</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#ff0400] hover:bg-[#e60000] text-white"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
