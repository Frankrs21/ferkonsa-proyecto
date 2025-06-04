function UsuarioForm({ usuario, onGuardar, onCancelar, onChange }) {
  return (
    <div className="space-y-2">
      <input className="w-full p-1 border rounded" name="nombre" value={usuario.nombre} onChange={onChange} />
      <input className="w-full p-1 border rounded" name="apellido" value={usuario.apellido} onChange={onChange} />
      <input className="w-full p-1 border rounded" name="correo" value={usuario.correo} onChange={onChange} />
      <select className="w-full p-1 border rounded" name="id_rol" value={usuario.id_rol} onChange={onChange}>
        <option value="">Rol</option>
        <option value="1">Administrador</option>
        <option value="2">Chofer</option>
      </select>
      <select className="w-full p-1 border rounded" name="id_estado_usuario" value={usuario.id_estado_usuario} onChange={onChange}>
        <option value="">Estado</option>
        <option value="1">Activo</option>
        <option value="2">Pendiente</option>
      </select>
      <div className="flex justify-end space-x-3">
        <button onClick={onCancelar} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
        <button onClick={onGuardar} className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
      </div>
    </div>
  );
}
export default UsuarioForm;
