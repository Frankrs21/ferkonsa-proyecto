import { useState } from "react";
import AdmUserForm from "./AdmUser"; // Formulario de registro
import UsuariosAdmin from "./ListaUsuarios"; // Lista + editar + eliminar

function AdminDashboard() {
  const [vista, setVista] = useState("registro");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestion de Usuario</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${vista === "registro" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setVista("registro")}
        >
          Ingresar Usuario
        </button>
        <button
          className={`px-4 py-2 rounded ${vista === "lista" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setVista("lista")}
        >
          Editar/Eliminar Usuario
        </button>
      </div>

      <div className="bg-white shadow-md rounded p-4">
        {vista === "registro" && <AdmUserForm />}
        {vista === "lista" && <UsuariosAdmin />}
      </div>
    </div>
  );
}

export default AdminDashboard;
