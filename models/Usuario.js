// =====================================================
// Modelo de Usuarios
// Maneja todas las operaciones CRUD para la tabla usuarios
// =====================================================

const { pool } = require('../config/database');

class Usuario {

    // Obtener todos los usuarios
    static async obtenerTodos() {
        try {
            const query = `
                SELECT
                    id,
                    CONCAT(nombre, ' ', apellido) as nombre_completo,
                    email,
                    telefono,
                    tipo_usuario,
                    estado,
                    fecha_registro
                FROM usuarios
                ORDER BY nombre ASC
            `;
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener un usuario por ID
    static async obtenerPorId(id) {
        try {
            const query = 'SELECT * FROM usuarios WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Crear un nuevo usuario
    static async crear(usuarioData) {
        try {
            const query = `
                INSERT INTO usuarios
                (nombre, apellido, email, telefono, direccion, fecha_nacimiento, tipo_usuario, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(query, [
                usuarioData.nombre,
                usuarioData.apellido,
                usuarioData.email,
                usuarioData.telefono,
                usuarioData.direccion,
                usuarioData.fecha_nacimiento,
                usuarioData.tipo_usuario,
                usuarioData.estado || 'activo'
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar un usuario
    static async actualizar(id, usuarioData) {
        try {
            const query = `
                UPDATE usuarios
                SET nombre = ?, apellido = ?, email = ?, telefono = ?,
                    direccion = ?, fecha_nacimiento = ?, tipo_usuario = ?, estado = ?
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [
                usuarioData.nombre,
                usuarioData.apellido,
                usuarioData.email,
                usuarioData.telefono,
                usuarioData.direccion,
                usuarioData.fecha_nacimiento,
                usuarioData.tipo_usuario,
                usuarioData.estado,
                id
            ]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un usuario
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM usuarios WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Buscar usuario por email
    static async buscarPorEmail(email) {
        try {
            const query = 'SELECT * FROM usuarios WHERE email = ?';
            const [rows] = await pool.query(query, [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Obtener préstamos activos de un usuario
    static async obtenerPrestamosActivos(id) {
        try {
            const query = `
                SELECT
                    p.id,
                    l.titulo,
                    p.fecha_prestamo,
                    p.fecha_devolucion_esperada,
                    p.estado
                FROM prestamos p
                INNER JOIN libros l ON p.libro_id = l.id
                WHERE p.usuario_id = ? AND p.estado = 'activo'
            `;
            const [rows] = await pool.query(query, [id]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Usuario;
