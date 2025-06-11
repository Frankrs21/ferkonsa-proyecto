const BASE_URL = "http://localhost:3002/api/usuarios";

// Obtener usuarios con filtros y búsqueda
export const obtenerUsuarios = async (filtros = {}) => {
  const query = new URLSearchParams(filtros).toString();
  const res = await fetch(`${BASE_URL}?${query}`);
  return await res.json();
};

// Actualizar usuario
export const actualizarUsuario = async (id, usuario) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return await res.json();
};

// Eliminar usuario
export const eliminarUsuario = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return await res.json();
};
