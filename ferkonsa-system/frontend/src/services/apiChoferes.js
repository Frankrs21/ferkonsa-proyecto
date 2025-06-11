const API = "http://localhost:3003/api/choferes";

export const obtenerChoferes = async () => {
  const res = await fetch(API);
  return await res.json();
};

export const buscarChoferes = async (nombre) => {
  const res = await fetch(`http://localhost:3003/api/choferes/buscar?query=${nombre}`);
  return await res.json();
};

export const actualizarChofer = async (id, datos) => {
  await fetch(`http://localhost:3003/api/choferes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
};