export default function ModalConfirmar({ mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 font-roboto">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full border-t-4 border-[#ff0400]">
        <h2 className="text-2xl font-bold text-[#ff0400] mb-2">Confirmación</h2>
        <p className="text-gray-700 mb-4">{mensaje}</p>
        <div className="text-right space-x-2">
          <button
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 bg-[#ff0400] text-white rounded hover:bg-[#e30300]"
          >
            Sí, registrar
          </button>
        </div>
      </div>
    </div>
  );
}
