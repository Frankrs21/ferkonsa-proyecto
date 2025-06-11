import { useState } from "react";
import ModalExito from "../ui/ModalExito";

export default function UsuariosAgregar() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    id_rol: "",
    id_estado_usuario: "",
  });

  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.apellido ||
      !form.correo ||
      !form.contraseña ||
      !form.id_rol ||
      !form.id_estado_usuario
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("http://localhost:3002/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMostrarModal(true);
        setError(null);
        setForm({
          nombre: "",
          apellido: "",
          correo: "",
          contraseña: "",
          id_rol: "",
          id_estado_usuario: "",
        });
      } else {
        const data = await res.json();
        setError(data.error || "Error al registrar usuario");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="p-6 font-roboto bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-[#ff0400] mb-6">Registrar Nuevo Usuario</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Modal de confirmación */}
      {mostrarModal && (
        <ModalExito
          mensaje="Usuario registrado correctamente."
          onClose={() => setMostrarModal(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={form.correo}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={form.contraseña}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="id_rol"
          value={form.id_rol}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccione Rol</option>
          <option value="1">Administrador</option>
          <option value="2">Chofer</option>
        </select>
        <select
          name="id_estado_usuario"
          value={form.id_estado_usuario}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccione Estado</option>
          <option value="1">Pendiente</option>
          <option value="2">Activo</option>
        </select>

        <button
          type="submit"
          className="bg-[#ff0400] text-white font-semibold py-2 rounded col-span-full"
        >
          Guardar Usuario
        </button>
      </form>
    </div>
  );
}
