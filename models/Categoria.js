// =====================================================
// Modelo de Categorías
// Maneja todas las operaciones CRUD para la tabla categorias
// =====================================================

const { pool } = require('../config/database');

class Categoria {

    // Obtener todas las categorías
    static async obtenerTodos() {
        try {
            const query = 'SELECT * FROM categorias ORDER BY nombre ASC';
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener una categoría por ID
    static async obtenerPorId(id) {
        try {
            const query = 'SELECT * FROM categorias WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Crear una nueva categoría
    static async crear(categoriaData) {
        try {
            const query = `
                INSERT INTO categorias
                (nombre, descripcion)
                VALUES (?, ?)
            `;
            const [result] = await pool.query(query, [
                categoriaData.nombre,
                categoriaData.descripcion
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar una categoría
    static async actualizar(id, categoriaData) {
        try {
            const query = `
                UPDATE categorias
                SET nombre = ?, descripcion = ?
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [
                categoriaData.nombre,
                categoriaData.descripcion,
                id
            ]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar una categoría
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM categorias WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Categoria;
