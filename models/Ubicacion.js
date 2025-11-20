// =====================================================
// Modelo de Ubicaciones
// Maneja todas las operaciones CRUD para la tabla ubicaciones
// =====================================================

const { pool } = require('../config/database');

class Ubicacion {

    // Obtener todas las ubicaciones
    static async obtenerTodos() {
        try {
            const query = `
                SELECT
                    id,
                    CONCAT(seccion, '-', estante, '-', nivel) as ubicacion_completa,
                    seccion,
                    estante,
                    nivel,
                    descripcion
                FROM ubicaciones
                ORDER BY seccion, estante, nivel ASC
            `;
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener una ubicación por ID
    static async obtenerPorId(id) {
        try {
            const query = 'SELECT * FROM ubicaciones WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Crear una nueva ubicación
    static async crear(ubicacionData) {
        try {
            const query = `
                INSERT INTO ubicaciones
                (seccion, estante, nivel, descripcion)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await pool.query(query, [
                ubicacionData.seccion,
                ubicacionData.estante,
                ubicacionData.nivel,
                ubicacionData.descripcion
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar una ubicación
    static async actualizar(id, ubicacionData) {
        try {
            const query = `
                UPDATE ubicaciones
                SET seccion = ?, estante = ?, nivel = ?, descripcion = ?
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [
                ubicacionData.seccion,
                ubicacionData.estante,
                ubicacionData.nivel,
                ubicacionData.descripcion,
                id
            ]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar una ubicación
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM ubicaciones WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Ubicacion;
