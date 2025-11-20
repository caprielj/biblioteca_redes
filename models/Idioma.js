// =====================================================
// Modelo de Idiomas
// Maneja todas las operaciones CRUD para la tabla idiomas
// =====================================================

const { pool } = require('../config/database');

class Idioma {

    // Obtener todos los idiomas
    static async obtenerTodos() {
        try {
            const query = 'SELECT * FROM idiomas ORDER BY nombre ASC';
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener un idioma por ID
    static async obtenerPorId(id) {
        try {
            const query = 'SELECT * FROM idiomas WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Crear un nuevo idioma
    static async crear(idiomaData) {
        try {
            const query = `
                INSERT INTO idiomas
                (nombre, codigo_iso)
                VALUES (?, ?)
            `;
            const [result] = await pool.query(query, [
                idiomaData.nombre,
                idiomaData.codigo_iso
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar un idioma
    static async actualizar(id, idiomaData) {
        try {
            const query = `
                UPDATE idiomas
                SET nombre = ?, codigo_iso = ?
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [
                idiomaData.nombre,
                idiomaData.codigo_iso,
                id
            ]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un idioma
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM idiomas WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Idioma;
