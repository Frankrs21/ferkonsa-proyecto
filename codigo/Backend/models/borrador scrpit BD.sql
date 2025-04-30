-- Tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL -- Cliente, Chofer, Administrador
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena_hash TEXT NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    aprobado BOOLEAN DEFAULT FALSE,
    rol_id INT REFERENCES roles(id),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de camiones
CREATE TABLE camiones (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    disponible BOOLEAN DEFAULT TRUE
);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES usuarios(id),
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    direccion_entrega TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, en camino, entregado, no entregado
    observaciones TEXT
);

-- Detalles de pedido (productos)
CREATE TABLE detalle_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    producto VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL
);

-- Asignación de camión y chofer al pedido
CREATE TABLE asignaciones (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id),
    chofer_id INT REFERENCES usuarios(id),
    camion_id INT REFERENCES camiones(id),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historial de entregas
CREATE TABLE historial_entregas (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id),
    chofer_id INT REFERENCES usuarios(id),
    camion_id INT REFERENCES camiones(id),
    fecha_entrega TIMESTAMP,
    estado_final VARCHAR(20) -- entregado, no entregado
);

-- Reportes financieros por pedido
CREATE TABLE reportes_envio (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id),
    distancia_km DECIMAL(10,2),
    valor_envio DECIMAL(10,2),
    envio_gratis BOOLEAN DEFAULT FALSE
);

-- Tabla de logs de recuperación de contraseña (opcional)
CREATE TABLE recuperacion_password (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    token VARCHAR(255) NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usado BOOLEAN DEFAULT FALSE
);