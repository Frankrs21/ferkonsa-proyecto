const API = "http://localhost:3003/api/vehiculos";

export const obtenerVehiculos = async (estado = "") => {
  const url = estado ? `${API}?estado=${estado}` : API;
  const res = await fetch(url);
  return await res.json();
};

export const crearVehiculo = async (vehiculo) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehiculo),
  });
  return await res.json();
};

export const actualizarVehiculo = async (id, vehiculo) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehiculo),
  });
  return await res.json();
};

export const eliminarVehiculo = async (id) => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  return await res.json();
};
