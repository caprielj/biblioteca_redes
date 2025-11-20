// =====================================================
// Modelo de Libros
// Maneja todas las operaciones CRUD para la tabla libros
// =====================================================

const { pool } = require('../config/database');

class Libro {

    // Obtener todos los libros con información relacionada (JOIN)
    static async obtenerTodos() {
        try {
            const query = `
                SELECT
                    l.id,
                    l.titulo,
                    l.isbn,
                    l.año_publicacion,
                    l.numero_paginas,
                    l.cantidad_total,
                    l.cantidad_disponible,
                    l.estado,
                    CONCAT(a.nombre, ' ', a.apellido) as autor,
                    e.nombre as editorial,
                    c.nombre as categoria,
                    i.nombre as idioma,
                    CONCAT(u.seccion, '-', u.estante, '-', u.nivel) as ubicacion
                FROM libros l
                INNER JOIN autores a ON l.autor_id = a.id
                INNER JOIN editoriales e ON l.editorial_id = e.id
                INNER JOIN categorias c ON l.categoria_id = c.id
                INNER JOIN idiomas i ON l.idioma_id = i.id
                LEFT JOIN ubicaciones u ON l.ubicacion_id = u.id
                ORDER BY l.titulo ASC
            `;
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener un libro por ID
    static async obtenerPorId(id) {
        try {
            const query = `
                SELECT
                    l.*,
                    CONCAT(a.nombre, ' ', a.apellido) as autor_nombre,
                    e.nombre as editorial_nombre,
                    c.nombre as categoria_nombre,
                    i.nombre as idioma_nombre,
                    CONCAT(u.seccion, '-', u.estante, '-', u.nivel) as ubicacion_nombre
                FROM libros l
                INNER JOIN autores a ON l.autor_id = a.id
                INNER JOIN editoriales e ON l.editorial_id = e.id
                INNER JOIN categorias c ON l.categoria_id = c.id
                INNER JOIN idiomas i ON l.idioma_id = i.id
                LEFT JOIN ubicaciones u ON l.ubicacion_id = u.id
                WHERE l.id = ?
            `;
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Crear un nuevo libro
    static async crear(libroData) {
        try {
            const query = `
                INSERT INTO libros
                (titulo, isbn, autor_id, editorial_id, categoria_id, idioma_id,
                ubicacion_id, año_publicacion, numero_paginas, cantidad_total,
                cantidad_disponible, descripcion, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(query, [
                libroData.titulo,
                libroData.isbn,
                libroData.autor_id,
                libroData.editorial_id,
                libroData.categoria_id,
                libroData.idioma_id,
                libroData.ubicacion_id,
                libroData.año_publicacion,
                libroData.numero_paginas,
                libroData.cantidad_total,
                libroData.cantidad_disponible,
                libroData.descripcion,
                libroData.estado
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar un libro
    static async actualizar(id, libroData) {
        try {
            const query = `
                UPDATE libros
                SET titulo = ?, isbn = ?, autor_id = ?, editorial_id = ?,
                    categoria_id = ?, idioma_id = ?, ubicacion_id = ?,
                    año_publicacion = ?, numero_paginas = ?, cantidad_total = ?,
                    cantidad_disponible = ?, descripcion = ?, estado = ?
                WHERE id = ?
            `;
            const [result] = await pool.query(query, [
                libroData.titulo,
                libroData.isbn,
                libroData.autor_id,
                libroData.editorial_id,
                libroData.categoria_id,
                libroData.idioma_id,
                libroData.ubicacion_id,
                libroData.año_publicacion,
                libroData.numero_paginas,
                libroData.cantidad_total,
                libroData.cantidad_disponible,
                libroData.descripcion,
                libroData.estado,
                id
            ]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un libro
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM libros WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Buscar libros por título
    static async buscarPorTitulo(titulo) {
        try {
            const query = `
                SELECT
                    l.id,
                    l.titulo,
                    l.isbn,
                    CONCAT(a.nombre, ' ', a.apellido) as autor,
                    e.nombre as editorial,
                    l.cantidad_disponible
                FROM libros l
                INNER JOIN autores a ON l.autor_id = a.id
                INNER JOIN editoriales e ON l.editorial_id = e.id
                WHERE l.titulo LIKE ?
            `;
            const [rows] = await pool.query(query, [`%${titulo}%`]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar disponibilidad del libro (cuando se presta o devuelve)
    static async actualizarDisponibilidad(id, cantidad) {
        try {
            const query = 'UPDATE libros SET cantidad_disponible = ? WHERE id = ?';
            const [result] = await pool.query(query, [cantidad, id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Libro;
