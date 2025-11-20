// =====================================================
// Modelo de Editoriales
// Maneja todas las operaciones CRUD para la tabla editoriales
// =====================================================

const { pool } = require('../config/database');

class Editorial {

    // Obtener todas las editoriales
    static async obtenerTodos() {
        try {
            const query = 'SELECT * FROM editoriales ORDER BY nombre ASC';
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener una editorial por ID
    static async obtenerPorId(id) {
        try {
            const query = 'SELECT * FROM editoriales WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Crear una nueva editorial
    static async crear(editorialData) {
        try {
            const query = `
                INSERT INTO editoriales
                (nombre, pais, ciudad, telefono, email, sitio_web)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(query, [
                editorialData.nombre,
                editorialData.pais,
                editorialData.ciudad,
                editorialData.telefono,
                editorialData.email,
                editorialData.sitio_web
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar una editorial
    static async actualizar(id, editorialData) {
        try {
            const query = `
                UPDATE editoriales
                SET nombre = ?, pais = ?, ciudad = ?, telefono = ?, email = ?, sitio_web = ?
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [
                editorialData.nombre,
                editorialData.pais,
                editorialData.ciudad,
                editorialData.telefono,
                editorialData.email,
                editorialData.sitio_web,
                id
            ]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar una editorial
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM editoriales WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Editorial;
