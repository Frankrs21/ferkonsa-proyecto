import { useNavigate } from "react-router-dom";
import {
  Users,
  Truck,
  UserCog,
  ClipboardList,
  Clock,
  BarChart
} from "lucide-react";

export default function InicioAdmin() {
  const navigate = useNavigate();

  const opciones = [
    {
      titulo: "Gestión de Usuarios",
      descripcion: "Registrar, editar o eliminar usuarios.",
      ruta: "/admin/usuarios/listar",
      icono: <Users size={40} />
    },
    {
      titulo: "Gestión de Vehículos",
      descripcion: "Administrar vehículos disponibles.",
      ruta: "/admin/vehiculos/listar",
      icono: <Truck size={40} />
    },
    {
      titulo: "Gestión de Choferes",
      descripcion: "Ver choferes y controlar disponibilidad.",
      ruta: "/admin/usuarios/listar?rol=2",
      icono: <UserCog size={40} />
    },
    {
      titulo: "Asignaciones",
      descripcion: "Asignar pedidos a choferes y vehículos.",
      ruta: "/admin/asignaciones",
      icono: <ClipboardList size={40} />
    },
    {
      titulo: "Historial de Entregas",
      descripcion: "Consultar entregas realizadas.",
      ruta: "/admin/historial",
      icono: <Clock size={40} />
    },
    {
      titulo: "Reportes",
      descripcion: "Generar reportes PDF por fecha o filtros.",
      ruta: "/admin/reportes",
      icono: <BarChart size={40} />
    }
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-10 font-roboto">
      <h1 className="text-4xl font-bold text-[#ff0400] mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {opciones.map((op, index) => (
          <div
            key={index}
            onClick={() => navigate(op.ruta)}
            className="cursor-pointer bg-white border-2 border-[#ff0400] rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-300 hover:bg-[#ff0400]/10"
          >
            <div className="text-[#ff0400] mb-4">{op.icono}</div>
            <h2 className="text-xl font-semibold text-[#ff0400]">{op.titulo}</h2>
            <p className="text-sm text-[#b5b5b5] mt-2">{op.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
