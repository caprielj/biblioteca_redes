// =====================================================
// Modelo de Multas
// Maneja todas las operaciones CRUD para la tabla multas
// =====================================================

const { pool } = require('../config/database');

class Multa {

    // Obtener todas las multas
    static async obtenerTodos() {
        try {
            const query = `
                SELECT
                    m.id,
                    CONCAT(u.nombre, ' ', u.apellido) as usuario,
                    m.monto,
                    m.motivo,
                    m.estado,
                    m.fecha_multa,
                    m.fecha_pago
                FROM multas m
                INNER JOIN usuarios u ON m.usuario_id = u.id
                ORDER BY m.fecha_multa DESC
            `;
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener una multa por ID
    static async obtenerPorId(id) {
        try {
            const query = `
                SELECT
                    m.*,
                    CONCAT(u.nombre, ' ', u.apellido) as usuario_nombre,
                    u.email as usuario_email
                FROM multas m
                INNER JOIN usuarios u ON m.usuario_id = u.id
                WHERE m.id = ?
            `;
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Crear una nueva multa
    static async crear(multaData) {
        try {
            const query = `
                INSERT INTO multas
                (devolucion_id, usuario_id, monto, motivo, descripcion, estado, fecha_multa)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(query, [
                multaData.devolucion_id,
                multaData.usuario_id,
                multaData.monto,
                multaData.motivo,
                multaData.descripcion,
                multaData.estado || 'pendiente',
                multaData.fecha_multa
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Registrar pago de multa
    static async registrarPago(id, fechaPago) {
        try {
            const query = `
                UPDATE multas
                SET estado = 'pagada', fecha_pago = ?
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [fechaPago, id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Condonar multa
    static async condonar(id) {
        try {
            const query = `
                UPDATE multas
                SET estado = 'condonada'
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener multas pendientes de un usuario
    static async obtenerPendientesPorUsuario(usuarioId) {
        try {
            const query = `
                SELECT
                    m.id,
                    m.monto,
                    m.motivo,
                    m.descripcion,
                    m.fecha_multa
                FROM multas m
                WHERE m.usuario_id = ? AND m.estado = 'pendiente'
                ORDER BY m.fecha_multa ASC
            `;
            const [rows] = await pool.query(query, [usuarioId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener total de multas pendientes de un usuario
    static async obtenerTotalPendiente(usuarioId) {
        try {
            const query = `
                SELECT COALESCE(SUM(monto), 0) as total
                FROM multas
                WHERE usuario_id = ? AND estado = 'pendiente'
            `;
            const [rows] = await pool.query(query, [usuarioId]);
            return rows[0].total;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar una multa
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM multas WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Multa;
