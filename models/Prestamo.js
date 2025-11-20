// =====================================================
// Modelo de Préstamos
// Maneja todas las operaciones CRUD para la tabla prestamos
// =====================================================

const { pool } = require('../config/database');

class Prestamo {

    // Obtener todos los préstamos con información relacionada
    static async obtenerTodos() {
        try {
            const query = `
                SELECT
                    p.id,
                    CONCAT(u.nombre, ' ', u.apellido) as usuario,
                    l.titulo as libro,
                    p.fecha_prestamo,
                    p.fecha_devolucion_esperada,
                    p.estado,
                    DATEDIFF(CURDATE(), p.fecha_devolucion_esperada) as dias_retraso
                FROM prestamos p
                INNER JOIN usuarios u ON p.usuario_id = u.id
                INNER JOIN libros l ON p.libro_id = l.id
                ORDER BY p.fecha_prestamo DESC
            `;
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener un préstamo por ID
    static async obtenerPorId(id) {
        try {
            const query = `
                SELECT
                    p.*,
                    CONCAT(u.nombre, ' ', u.apellido) as usuario_nombre,
                    u.email as usuario_email,
                    l.titulo as libro_titulo,
                    l.isbn as libro_isbn
                FROM prestamos p
                INNER JOIN usuarios u ON p.usuario_id = u.id
                INNER JOIN libros l ON p.libro_id = l.id
                WHERE p.id = ?
            `;
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Crear un nuevo préstamo
    static async crear(prestamoData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction(); // Iniciar transacción

            // 1. Verificar disponibilidad del libro
            const [libro] = await connection.query(
                'SELECT cantidad_disponible FROM libros WHERE id = ?',
                [prestamoData.libro_id]
            );

            if (!libro[0] || libro[0].cantidad_disponible <= 0) {
                throw new Error('El libro no está disponible para préstamo');
            }

            // 2. Crear el préstamo
            const query = `
                INSERT INTO prestamos
                (usuario_id, libro_id, fecha_prestamo, fecha_devolucion_esperada, estado, observaciones)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [result] = await connection.query(query, [
                prestamoData.usuario_id,
                prestamoData.libro_id,
                prestamoData.fecha_prestamo,
                prestamoData.fecha_devolucion_esperada,
                'activo',
                prestamoData.observaciones
            ]);

            // 3. Reducir la cantidad disponible del libro
            await connection.query(
                'UPDATE libros SET cantidad_disponible = cantidad_disponible - 1 WHERE id = ?',
                [prestamoData.libro_id]
            );

            await connection.commit(); // Confirmar transacción
            return result.insertId;

        } catch (error) {
            await connection.rollback(); // Revertir cambios si hay error
            throw error;
        } finally {
            connection.release(); // Liberar conexión
        }
    }

    // Actualizar estado del préstamo
    static async actualizarEstado(id, estado) {
        try {
            const query = 'UPDATE prestamos SET estado = ? WHERE id = ?';
            const [result] = await pool.query(query, [estado, id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener préstamos activos
    static async obtenerActivos() {
        try {
            const query = `
                SELECT
                    p.id,
                    CONCAT(u.nombre, ' ', u.apellido) as usuario,
                    l.titulo as libro,
                    p.fecha_prestamo,
                    p.fecha_devolucion_esperada,
                    DATEDIFF(CURDATE(), p.fecha_devolucion_esperada) as dias_retraso
                FROM prestamos p
                INNER JOIN usuarios u ON p.usuario_id = u.id
                INNER JOIN libros l ON p.libro_id = l.id
                WHERE p.estado = 'activo'
                ORDER BY p.fecha_devolucion_esperada ASC
            `;
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener préstamos atrasados
    static async obtenerAtrasados() {
        try {
            const query = `
                SELECT
                    p.id,
                    CONCAT(u.nombre, ' ', u.apellido) as usuario,
                    l.titulo as libro,
                    p.fecha_prestamo,
                    p.fecha_devolucion_esperada,
                    DATEDIFF(CURDATE(), p.fecha_devolucion_esperada) as dias_retraso
                FROM prestamos p
                INNER JOIN usuarios u ON p.usuario_id = u.id
                INNER JOIN libros l ON p.libro_id = l.id
                WHERE p.estado = 'activo' AND p.fecha_devolucion_esperada < CURDATE()
                ORDER BY p.fecha_devolucion_esperada ASC
            `;
            const [rows] = await pool.query(query);

            // Actualizar estado a 'atrasado'
            if (rows.length > 0) {
                await pool.query(
                    'UPDATE prestamos SET estado = "atrasado" WHERE estado = "activo" AND fecha_devolucion_esperada < CURDATE()'
                );
            }

            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un préstamo
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM prestamos WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Prestamo;
