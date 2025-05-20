import { useState } from "react";
import axios from "axios";

function CrearUsuario() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    id_rol: "2",
    id_estado_usuario: "1"
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await axios.post("http://localhost:3002/api/usuarios", form);
      setMensaje(res.data.mensaje);
      setForm({
        nombre: "",
        apellido: "",
        correo: "",
        contraseña: "",
        id_rol: "2",
        id_estado_usuario: "1"
      });
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear usuario.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">Agregar Usuario</h2>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={form.correo}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={form.contraseña}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <select
          name="id_rol"
          value={form.id_rol}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="1">Administrador</option>
          <option value="2">Chofer</option>
        </select>

        <select
          name="id_estado_usuario"
          value={form.id_estado_usuario}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="1">Activo</option>
          <option value="2">Inactivo</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Crear usuario
        </button>

        {mensaje && <p className="text-green-600 text-center">{mensaje}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default CrearUsuario;
