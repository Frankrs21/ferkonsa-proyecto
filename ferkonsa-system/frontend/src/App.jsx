import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recuperar from "./pages/Recuperar";
import Restablecer from "./pages/Restablecer";
import AdminUsuarios from "./pages/AdmUser";
import ListaUsuarios from "./pages/ListaUsuarios";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/restablecer/:token" element={<Restablecer />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />      
        <Route path="/admin/listar" element={<ListaUsuarios />} />
      </Routes>
    </Router>
  );
}

export default App;

