import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardAdmin from "../pages/DashboardAdmin";
import InicioAdmin from "../pages/InicioAdmin";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<DashboardAdmin />}>
          <Route index element={<InicioAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
