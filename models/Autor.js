// =====================================================
// Modelo de Autores
// Maneja todas las operaciones CRUD para la tabla autores
// =====================================================

const { pool } = require('../config/database');

class Autor {

    // Obtener todos los autores
    static async obtenerTodos() {
        try {
            const query = `
                SELECT
                    id,
                    CONCAT(nombre, ' ', apellido) as nombre_completo,
                    nacionalidad,
                    fecha_nacimiento
                FROM autores
                ORDER BY apellido ASC
            `;
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener un autor por ID
    static async obtenerPorId(id) {
        try {
            const query = 'SELECT * FROM autores WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Crear un nuevo autor
    static async crear(autorData) {
        try {
            const query = `
                INSERT INTO autores
                (nombre, apellido, nacionalidad, biografia, fecha_nacimiento)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(query, [
                autorData.nombre,
                autorData.apellido,
                autorData.nacionalidad,
                autorData.biografia,
                autorData.fecha_nacimiento
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar un autor
    static async actualizar(id, autorData) {
        try {
            const query = `
                UPDATE autores
                SET nombre = ?, apellido = ?, nacionalidad = ?, biografia = ?, fecha_nacimiento = ?
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [
                autorData.nombre,
                autorData.apellido,
                autorData.nacionalidad,
                autorData.biografia,
                autorData.fecha_nacimiento,
                id
            ]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un autor
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM autores WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Autor;
