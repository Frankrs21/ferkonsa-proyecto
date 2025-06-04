import { useState } from "react";
import axios from "axios";

function AdmUserForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    id_rol: "",
  });

  const [errores, setErrores] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const validar = () => {
    const nuevosErrores = {};
    if (!formData.nombre) nuevosErrores.nombre = "Nombre requerido";
    if (!formData.apellido) nuevosErrores.apellido = "Apellido requerido";
    if (!formData.correo || !/\S+@\S+\.\S+/.test(formData.correo)) nuevosErrores.correo = "Correo no válido";
    if (!formData.contraseña) nuevosErrores.contraseña = "Contraseña requerida";
    if (!formData.id_rol) nuevosErrores.id_rol = "Seleccione un rol";
    return nuevosErrores;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
    setMensajeExito("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    setMostrarModal(true);
  };

  const confirmarEnvio = async () => {
    try {
      await axios.post("http://localhost:3002/api/usuarios", {
        ...formData,
        id_estado_usuario: 1, // Aprobado automáticamente
      });
      setMensajeExito("✅ Usuario agregado correctamente");
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        contraseña: "",
        id_rol: "",
      });
    } catch (error) {
      console.error(error);
      setMensajeExito("❌ Error al agregar usuario");
    }
    setMostrarModal(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Registrar Usuario</h2>

      {mensajeExito && <div className="mb-4 text-center text-green-600">{mensajeExito}</div>}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" />
        {errores.nombre && <p className="text-sm text-red-500">{errores.nombre}</p>}

        <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" className="border p-2 rounded" />
        {errores.apellido && <p className="text-sm text-red-500">{errores.apellido}</p>}

        <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo" className="border p-2 rounded" />
        {errores.correo && <p className="text-sm text-red-500">{errores.correo}</p>}

        <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} placeholder="Contraseña" className="border p-2 rounded" />
        {errores.contraseña && <p className="text-sm text-red-500">{errores.contraseña}</p>}

        <select name="id_rol" value={formData.id_rol} onChange={handleChange} className="border p-2 rounded">
          <option value="">Seleccionar rol</option>
          <option value="1">Administrador</option>
          <option value="2">Chofer</option>
        </select>
        {errores.id_rol && <p className="text-sm text-red-500">{errores.id_rol}</p>}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Registrar
        </button>
      </form>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4">¿Confirmar registro?</h3>
            <div className="flex justify-end gap-4">
              <button onClick={() => setMostrarModal(false)} className="bg-gray-300 px-4 py-2 rounded">
                Cancelar
              </button>
              <button onClick={confirmarEnvio} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdmUserForm;
