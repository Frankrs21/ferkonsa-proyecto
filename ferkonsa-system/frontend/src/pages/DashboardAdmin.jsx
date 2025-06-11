import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardAdmin() {
  return (
    <div className="flex font-roboto">
      {/* Menú lateral */}
      <Sidebar />

      {/* Contenido del panel */}
      <div className="ml-64 w-full min-h-screen bg-gray-100 p-6">
        <Outlet />
      </div>
    </div>
  );
}
