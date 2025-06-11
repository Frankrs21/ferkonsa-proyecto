import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  Users,
  Truck,
  UserCog,
  ClipboardList,
  Clock,
  BarChart,
  ChevronDown
} from "lucide-react";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside className="w-64 h-screen bg-white border-r shadow font-roboto text-sm fixed">
      <div className="bg-[#ff0400] text-white py-6 px-4 text-center text-2xl font-bold tracking-wide">
        FERKONSA
      </div>

      <nav className="flex flex-col p-3 gap-1">

        {/* USUARIOS */}
        <div>
          <button
            onClick={() => toggleMenu("usuarios")}
            className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-gray-700 hover:bg-[#ff0400]/10 ${
              openMenu === "usuarios" ? "bg-[#ff0400]/10" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <Users size={18} /> Usuarios
            </span>
            <ChevronDown size={16} className={openMenu === "usuarios" ? "rotate-180 transition" : "transition"} />
          </button>
          {openMenu === "usuarios" && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <NavLink to="/admin/usuarios/agregar" className="text-gray-600 hover:text-[#ff0400]">Agregar</NavLink>
              <NavLink to="/admin/usuarios/listar" className="text-gray-600 hover:text-[#ff0400]">Listar</NavLink>
            </div>
          )}
        </div>

        {/* VEHICULOS */}
        <div>
          <button
            onClick={() => toggleMenu("vehiculos")}
            className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-gray-700 hover:bg-[#ff0400]/10 ${
              openMenu === "vehiculos" ? "bg-[#ff0400]/10" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <Truck size={18} /> Vehículos
            </span>
            <ChevronDown size={16} className={openMenu === "vehiculos" ? "rotate-180 transition" : "transition"} />
          </button>
          {openMenu === "vehiculos" && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <NavLink to="/admin/vehiculos/agregar" className="text-gray-600 hover:text-[#ff0400]">Agregar</NavLink>
              <NavLink to="/admin/vehiculos/listar" className="text-gray-600 hover:text-[#ff0400]">Listar</NavLink>
            </div>
          )}
        </div>

        {/* CHOFERES */}
        <div>
          <button
            onClick={() => toggleMenu("choferes")}
            className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-gray-700 hover:bg-[#ff0400]/10 ${
              openMenu === "choferes" ? "bg-[#ff0400]/10" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <UserCog size={18} /> Choferes
            </span>
            <ChevronDown size={16} className={openMenu === "choferes" ? "rotate-180 transition" : "transition"} />
          </button>
          {openMenu === "choferes" && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
               <NavLink to="/admin/vehiculos/listar" className="block px-4 py-2 hover:bg-[#ff0400]/10">Listar</NavLink>
            </div>
          )}
        </div>

        {/* OTRAS SECCIONES */}
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
