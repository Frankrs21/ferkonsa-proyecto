import { useState, useEffect } from "react";
import axios from "axios";
import ModalConfirmacion from "../../src/components/ModalConfirmacion";

function VehiculosAdmin() {
  const [vehiculos, setVehiculos] = useState([]);
  const [formData, setFormData] = useState({ placa: "", marca: "", modelo: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [modal, setModal] = useState({ mostrar: false, accion: "", id: null });

  const fetchVehiculos = async () => {
    const res = await axios.get("http://localhost:3003/api/vehiculos"); 
    setVehiculos(res.data);
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion && vehiculoSeleccionado) {
        await axios.put(`http://localhost:3003/api/vehiculos/${vehiculoSeleccionado}`, formData);
      } else {
        await axios.post("http://localhost:3003/api/vehiculos", formData);
      }
      setFormData({ placa: "", marca: "", modelo: "" });
      setModoEdicion(false);
      fetchVehiculos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditar = (vehiculo) => {
    setModoEdicion(true);
    setVehiculoSeleccionado(vehiculo.id_vehiculo);
    setFormData({
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
    });
  };

  const confirmarEliminar = (id) => {
    setModal({ mostrar: true, accion: "eliminar", id });
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:3003/api/vehiculos/${id}`);
      fetchVehiculos();
      setModal({ mostrar: false, accion: "", id: null });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Gestión de Vehículos</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-6 max-w-md mx-auto">
        <input
          name="placa"
          placeholder="Placa"
          value={formData.placa}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="marca"
          placeholder="Marca"
          value={formData.marca}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="modelo"
          placeholder="Modelo"
          value={formData.modelo}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          {modoEdicion ? "Guardar Cambios" : "Registrar Vehículo"}
        </button>
      </form>

      <table className="w-full border text-sm text-center">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id_vehiculo}>
              <td>{v.id_vehiculo}</td>
              <td>{v.placa}</td>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>
                <button onClick={() => handleEditar(v)} className="mr-2 text-blue-600">Editar</button>
                <button onClick={() => confirmarEliminar(v.id_vehiculo)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal.mostrar && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de eliminar este vehículo?"
          onConfirm={() => handleEliminar(modal.id)}
          onCancel={() => setModal({ mostrar: false, accion: "", id: null })}
        />
      )}
    </div>
  );
}

export default VehiculosAdmin;
