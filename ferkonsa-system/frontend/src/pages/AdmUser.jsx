import { useState } from "react";
import axios from "axios";

function AdminUsuarios() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    id_rol: "",
    id_estado_usuario: "1" // activo por defecto
  });

  const [errores, setErrores] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");

  const validar = () => {
    const nuevosErrores = {};
    if (!formData.nombre) nuevosErrores.nombre = "Nombre requerido";
    if (!formData.apellido) nuevosErrores.apellido = "Apellido requerido";
    if (!formData.correo) {
      nuevosErrores.correo = "Correo requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      nuevosErrores.correo = "Correo no válido";
    }
    if (!formData.contraseña) nuevosErrores.contraseña = "Contraseña requerida";
    if (!formData.id_rol) nuevosErrores.id_rol = "Seleccione un rol";
    return nuevosErrores;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  const handleConfirmarRegistro = async () => {
    try {
      await axios.post("http://localhost:3002/api/usuarios", formData);
      setModalMensaje("✅ Usuario agregado correctamente");
      setShowSuccessModal(true);
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        contraseña: "",
        id_rol: "",
        id_estado_usuario: "1"
      });
    } catch (error) {
      console.error(error);
      setModalMensaje("❌ Error al agregar usuario");
      setShowSuccessModal(true);
    }
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6 relative">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar Usuario</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="w-full border p-2 rounded" />
        {errores.nombre && <p className="text-sm text-red-500">{errores.nombre}</p>}

        <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" className="w-full border p-2 rounded" />
        {errores.apellido && <p className="text-sm text-red-500">{errores.apellido}</p>}

        <input name="correo" type="email" value={formData.correo} onChange={handleChange} placeholder="Correo" className="w-full border p-2 rounded" />
        {errores.correo && <p className="text-sm text-red-500">{errores.correo}</p>}

        <input name="contraseña" type="password" value={formData.contraseña} onChange={handleChange} placeholder="Contraseña" className="w-full border p-2 rounded" />
        {errores.contraseña && <p className="text-sm text-red-500">{errores.contraseña}</p>}

        <select name="id_rol" value={formData.id_rol} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Seleccionar Rol</option>
          <option value="1">Administrador</option>
          <option value="2">Chofer</option>
        </select>
        {errores.id_rol && <p className="text-sm text-red-500">{errores.id_rol}</p>}

        <p className="text-sm text-gray-500">Este usuario se registrará como <strong>activo</strong> por defecto.</p>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Registrar
        </button>
      </form>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">¿Confirmar registro?</h3>
            <p className="text-sm mb-4">
              ¿Deseas registrar al usuario <strong>{formData.nombre} {formData.apellido}</strong> con rol <strong>{formData.id_rol === "1" ? "Administrador" : "Chofer"}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleConfirmarRegistro}>
                Sí
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => setShowModal(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de resultado */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
            <p className="text-lg font-semibold mb-4">{modalMensaje}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowSuccessModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
