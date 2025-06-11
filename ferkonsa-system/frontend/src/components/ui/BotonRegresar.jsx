import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

export default function BotonRegresar() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)} // 🔄 volver a la página anterior real
      title="Regresar"
      className="mb-4 text-[#ff0400] hover:text-[#e60000] transition"
    >
      <ArrowLeftCircle size={36} />
    </button>
  );
}
