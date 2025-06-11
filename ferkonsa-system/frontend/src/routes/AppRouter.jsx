import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardAdmin from "../pages/DashboardAdmin";
import InicioAdmin from "../pages/InicioAdmin";

// Usuarios
import UsuariosListar from "../components/admin/UsuariosListar";
import UsuariosAgregar from "../components/admin/UsuariosAgregar";

// Vehículos
import VehiculosAdmin from "../components/admin/VehiculosAdmin";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />

        <Route path="/admin" element={<DashboardAdmin />}>
          <Route index element={<InicioAdmin />} />

          {/* Gestión de usuarios */}
          <Route path="usuarios/listar" element={<UsuariosListar />} />
          <Route path="usuarios/agregar" element={<UsuariosAgregar />} />

          {/* Gestión de vehículos */}
          <Route path="vehiculos/listar" element={<VehiculosAdmin />} />

          {/* Aquí luego agregarás choferes, asignaciones, reportes... */}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </BrowserRouter>
  );
}
