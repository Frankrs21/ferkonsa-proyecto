import { NavLink } from "react-router-dom";
import {
  Users,
  Truck,
  UserCog,
  ClipboardList,
  Clock,
  BarChart,
  Home,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r shadow font-roboto text-sm fixed">
      <div className="bg-[#ff0400] text-white py-6 px-4 text-center text-2xl font-bold tracking-wide">
        FERKONSA
      </div>

      <nav className="flex flex-col p-3 gap-1">
        <NavLink
          to="/admin"
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#ff0400]/10 rounded-md text-gray-700"
        >
          <Home size={18} /> Inicio
        </NavLink>

        <NavLink
          to="/admin/usuarios/listar"
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#ff0400]/10 rounded-md text-gray-700"
        >
          <Users size={18} /> Usuarios
        </NavLink>

        <NavLink
          to="/admin/vehiculos/listar"
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#ff0400]/10 rounded-md text-gray-700"
        >
          <Truck size={18} /> Vehículos
        </NavLink>

        <NavLink
          to="/admin/choferes/listar"
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#ff0400]/10 rounded-md text-gray-700"
        >
          <UserCog size={18} /> Choferes
        </NavLink>

        <NavLink
          to="/admin/asignaciones"
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#ff0400]/10 rounded-md text-gray-700"
        >
          <ClipboardList size={18} /> Asignaciones
        </NavLink>

        <NavLink
          to="/admin/historial"
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#ff0400]/10 rounded-md text-gray-700"
        >
          <Clock size={18} /> Historial
        </NavLink>

        <NavLink
          to="/admin/reportes"
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#ff0400]/10 rounded-md text-gray-700"
        >
          <BarChart size={18} /> Reportes
        </NavLink>
      </nav>

      <footer className="text-center p-4 text-xs text-[#b5b5b5] mt-auto">
        © 2025 FERKONSA S.A.
      </footer>
    </aside>
  );
}
