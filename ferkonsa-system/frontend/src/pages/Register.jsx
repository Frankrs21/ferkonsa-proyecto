import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    id_rol: "2", // valor por defecto: chofer
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", formData);
      setMensaje(res.data.mensaje);
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        contraseña: "",
        id_rol: "2",
      });
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al registrar usuario.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">Registro</h2>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <select
          name="id_rol"
          value={formData.id_rol}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="1">Administrador</option>
          <option value="2">Chofer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Registrarse
        </button>

        {mensaje && <p className="text-green-600 text-center">{mensaje}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default Register;
