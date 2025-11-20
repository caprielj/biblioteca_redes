-- =====================================================
-- Base de datos para Sistema de Gestión de Biblioteca
-- Motor: MariaDB
-- =====================================================

CREATE DATABASE IF NOT EXISTS biblioteca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE biblioteca;

-- =====================================================
-- TABLAS CATÁLOGO (Tablas de referencia)
-- =====================================================

-- Tabla de Autores
CREATE TABLE autores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(50),
    biografia TEXT,
    fecha_nacimiento DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de Editoriales
CREATE TABLE editoriales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    pais VARCHAR(50),
    ciudad VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    sitio_web VARCHAR(200),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de Categorías
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de Idiomas
CREATE TABLE idiomas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    codigo_iso VARCHAR(5) NOT NULL UNIQUE, -- Ejemplo: 'es', 'en', 'fr'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de Ubicaciones (Estantes/Secciones de la biblioteca)
CREATE TABLE ubicaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seccion VARCHAR(50) NOT NULL,
    estante VARCHAR(50) NOT NULL,
    nivel VARCHAR(20),
    descripcion VARCHAR(200),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY ubicacion_unica (seccion, estante, nivel)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA PRINCIPAL DE LIBROS
-- =====================================================

-- Tabla de Libros
CREATE TABLE libros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(250) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    autor_id INT NOT NULL,
    editorial_id INT NOT NULL,
    categoria_id INT NOT NULL,
    idioma_id INT NOT NULL,
    ubicacion_id INT,
    año_publicacion YEAR,
    numero_paginas INT,
    cantidad_total INT DEFAULT 1,
    cantidad_disponible INT DEFAULT 1,
    descripcion TEXT,
    estado ENUM('excelente', 'bueno', 'regular', 'malo') DEFAULT 'bueno',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Llaves foráneas
    FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE RESTRICT,
    FOREIGN KEY (editorial_id) REFERENCES editoriales(id) ON DELETE RESTRICT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (idioma_id) REFERENCES idiomas(id) ON DELETE RESTRICT,
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- TABLA DE USUARIOS
-- =====================================================

-- Tabla de Usuarios/Miembros
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(250),
    fecha_nacimiento DATE,
    tipo_usuario ENUM('estudiante', 'profesor', 'publico_general') DEFAULT 'publico_general',
    estado ENUM('activo', 'suspendido', 'inactivo') DEFAULT 'activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- TABLAS DE OPERACIONES
-- =====================================================

-- Tabla de Préstamos
CREATE TABLE prestamos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion_esperada DATE NOT NULL,
    estado ENUM('activo', 'devuelto', 'atrasado') DEFAULT 'activo',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Llaves foráneas
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de Devoluciones
CREATE TABLE devoluciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prestamo_id INT NOT NULL UNIQUE,
    fecha_devolucion_real DATE NOT NULL,
    dias_retraso INT DEFAULT 0,
    estado_libro ENUM('excelente', 'bueno', 'regular', 'malo', 'dañado') DEFAULT 'bueno',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Llave foránea
    FOREIGN KEY (prestamo_id) REFERENCES prestamos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de Multas
CREATE TABLE multas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    devolucion_id INT NOT NULL,
    usuario_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    motivo ENUM('retraso', 'daño', 'perdida', 'otro') NOT NULL,
    descripcion TEXT,
    estado ENUM('pendiente', 'pagada', 'condonada') DEFAULT 'pendiente',
    fecha_multa DATE NOT NULL,
    fecha_pago DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Llaves foráneas
    FOREIGN KEY (devolucion_id) REFERENCES devoluciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

CREATE INDEX idx_libros_titulo ON libros(titulo);
CREATE INDEX idx_libros_isbn ON libros(isbn);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_prestamos_estado ON prestamos(estado);
CREATE INDEX idx_multas_estado ON multas(estado);

-- =====================================================
-- DATOS DE EJEMPLO
-- =====================================================

-- Insertar Autores
INSERT INTO autores (nombre, apellido, nacionalidad, fecha_nacimiento) VALUES
('Gabriel', 'García Márquez', 'Colombiana', '1927-03-06'),
('Miguel', 'de Cervantes', 'Española', '1547-09-29'),
('George', 'Orwell', 'Británica', '1903-06-25'),
('Isabel', 'Allende', 'Chilena', '1942-08-02'),
('Mario', 'Vargas Llosa', 'Peruana', '1936-03-28');

-- Insertar Editoriales
INSERT INTO editoriales (nombre, pais, ciudad) VALUES
('Editorial Sudamericana', 'Argentina', 'Buenos Aires'),
('Penguin Random House', 'España', 'Barcelona'),
('Alfaguara', 'España', 'Madrid'),
('Planeta', 'España', 'Barcelona'),
('Editorial Norma', 'Colombia', 'Bogotá');

-- Insertar Categorías
INSERT INTO categorias (nombre, descripcion) VALUES
('Ficción', 'Novelas y relatos de ficción literaria'),
('Clásicos', 'Obras literarias clásicas'),
('Ciencia Ficción', 'Narrativa de ciencia ficción y fantasía'),
('Historia', 'Libros sobre historia y biografías'),
('Poesía', 'Colecciones de poesía'),
('Ensayo', 'Ensayos literarios y filosóficos');

-- Insertar Idiomas
INSERT INTO idiomas (nombre, codigo_iso) VALUES
('Español', 'es'),
('Inglés', 'en'),
('Francés', 'fr'),
('Portugués', 'pt'),
('Alemán', 'de');

-- Insertar Ubicaciones
INSERT INTO ubicaciones (seccion, estante, nivel) VALUES
('A', 'A1', 'Superior'),
('A', 'A2', 'Medio'),
('A', 'A3', 'Inferior'),
('B', 'B1', 'Superior'),
('B', 'B2', 'Medio'),
('C', 'C1', 'Superior');

-- Insertar Libros
INSERT INTO libros (titulo, isbn, autor_id, editorial_id, categoria_id, idioma_id, ubicacion_id, año_publicacion, numero_paginas, cantidad_total, cantidad_disponible) VALUES
('Cien Años de Soledad', '978-0307474728', 1, 1, 1, 1, 1, 1967, 471, 3, 3),
('Don Quijote de la Mancha', '978-8424936464', 2, 2, 2, 1, 2, 1605, 863, 2, 2),
('1984', '978-0451524935', 3, 3, 3, 1, 3, 1949, 328, 2, 2),
('La Casa de los Espíritus', '978-1501117015', 4, 4, 1, 1, 4, 1982, 433, 2, 2),
('La Ciudad y los Perros', '978-8420471839', 5, 3, 1, 1, 5, 1963, 408, 1, 1);

-- Insertar Usuarios
INSERT INTO usuarios (nombre, apellido, email, telefono, direccion, tipo_usuario) VALUES
('Juan', 'Pérez López', 'juan.perez@email.com', '555-0101', 'Calle Principal 123', 'estudiante'),
('María', 'González Martínez', 'maria.gonzalez@email.com', '555-0102', 'Avenida Central 456', 'profesor'),
('Carlos', 'Ramírez Santos', 'carlos.ramirez@email.com', '555-0103', 'Boulevard Norte 789', 'publico_general');

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

SELECT 'Base de datos creada exitosamente!' as Mensaje;
