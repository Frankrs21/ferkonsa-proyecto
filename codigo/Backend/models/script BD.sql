-- 1. Tabla rol
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

-- 2. Tabla estado_usuario
CREATE TABLE estado_usuario (
    id_estado_usuario SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

-- 3. Tabla usuario
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    id_rol INT NOT NULL REFERENCES rol(id_rol) ON DELETE RESTRICT,
    id_estado_usuario INT NOT NULL REFERENCES estado_usuario(id_estado_usuario) ON DELETE RESTRICT
);

-- 4. Tabla estado_general
CREATE TABLE estado_general (
    id_estado_general SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

-- 5. Tabla chofer
CREATE TABLE chofer (
    id_chofer SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_estado_general INT NOT NULL REFERENCES estado_general(id_estado_general) ON DELETE SET NULL
);

-- 6. Tabla vehiculo
CREATE TABLE vehiculo (
    id_vehiculo SERIAL PRIMARY KEY,
    placa VARCHAR(20) UNIQUE NOT NULL,
    modelo VARCHAR(100),
    id_estado_general INT NOT NULL REFERENCES estado_general(id_estado_general) ON DELETE SET NULL
);

-- 7. Tabla pedido
CREATE TABLE pedido (
    id_pedido SERIAL PRIMARY KEY,
    direccion TEXT NOT NULL,
    valor_pagar NUMERIC(10,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabla producto
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    stock INT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla detalle_pedido
CREATE TABLE detalle_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    id_producto INT NOT NULL REFERENCES producto(id_producto) ON DELETE RESTRICT,
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL
);

-- 10. Tabla asignacion
CREATE TABLE asignacion (
    id_asignacion SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    id_vehiculo INT NOT NULL REFERENCES vehiculo(id_vehiculo) ON DELETE SET NULL,
    id_chofer INT NOT NULL REFERENCES chofer(id_chofer) ON DELETE SET NULL,
    fecha_asignacion DATE NOT NULL
);

-- 11. Tabla estado_entrega
CREATE TABLE estado_entrega (
    id_estado_entrega SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

-- 12. Tabla entrega
CREATE TABLE entrega (
    id_entrega SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    id_chofer INT NOT NULL REFERENCES chofer(id_chofer) ON DELETE SET NULL,
    observacion TEXT,
    id_estado_entrega INT NOT NULL REFERENCES estado_entrega(id_estado_entrega) ON DELETE SET NULL,
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Tabla reportes
CREATE TABLE reportes (
    id_reporte SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    distancia NUMERIC(10,2),
    valor NUMERIC(10,2),
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Índices recomendados
-- Este índice ya lo incluye la restricción UNIQUE (no lo dupliques)
-- CREATE INDEX idx_usuario_correo ON usuario(correo);

-- Este sí lo puedes mantener si se busca por nombre de producto
CREATE INDEX idx_producto_nombre ON producto(nombre);

-- Este solo si se hace búsqueda frecuente por dirección del pedido
-- CREATE INDEX idx_pedido_direccion ON pedido(direccion);
CREATE INDEX idx_usuario_id_rol ON usuario(id_rol);
CREATE INDEX idx_usuario_id_estado_usuario ON usuario(id_estado_usuario);
CREATE INDEX idx_pedido_id ON pedido(id_pedido); -- si haces muchos joins con pedido
CREATE INDEX idx_detalle_pedido_id_pedido ON detalle_pedido(id_pedido);
