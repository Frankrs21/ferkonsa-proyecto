function ModalConfirmacion({ visible, mensaje, onConfirmar, onCancelar }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-4">{mensaje}</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onCancelar} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
            Cancelar
          </button>
          <button onClick={onConfirmar} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
export default ModalConfirmacion;
