// =====================================================
// Controlador de Libros
// Maneja la lógica de negocio y renderizado de vistas para libros
// =====================================================

const Libro = require('../models/Libro');
const Autor = require('../models/Autor');
const Editorial = require('../models/Editorial');
const Categoria = require('../models/Categoria');
const Idioma = require('../models/Idioma');
const Ubicacion = require('../models/Ubicacion');

class LibroController {

    // Mostrar listado de todos los libros
    async index(req, res) {
        try {
            const libros = await Libro.obtenerTodos();
            res.render('libros/index', {
                title: 'Listado de Libros',
                libros: libros
            });
        } catch (error) {
            console.error('Error al obtener libros:', error);
            res.status(500).send('Error al obtener los libros');
        }
    }

    // Mostrar formulario para crear nuevo libro
    async crear(req, res) {
        try {
            // Obtener datos necesarios para los selects del formulario
            const autores = await Autor.obtenerTodos();
            const editoriales = await Editorial.obtenerTodos();
            const categorias = await Categoria.obtenerTodos();
            const idiomas = await Idioma.obtenerTodos();
            const ubicaciones = await Ubicacion.obtenerTodos();

            res.render('libros/crear', {
                title: 'Agregar Nuevo Libro',
                autores,
                editoriales,
                categorias,
                idiomas,
                ubicaciones
            });
        } catch (error) {
            console.error('Error al cargar formulario:', error);
            res.status(500).send('Error al cargar el formulario');
        }
    }

    // Guardar nuevo libro en la base de datos
    async guardar(req, res) {
        try {
            const libroData = {
                titulo: req.body.titulo,
                isbn: req.body.isbn,
                autor_id: req.body.autor_id,
                editorial_id: req.body.editorial_id,
                categoria_id: req.body.categoria_id,
                idioma_id: req.body.idioma_id,
                ubicacion_id: req.body.ubicacion_id || null,
                año_publicacion: req.body.año_publicacion,
                numero_paginas: req.body.numero_paginas,
                cantidad_total: req.body.cantidad_total,
                cantidad_disponible: req.body.cantidad_total, // Inicialmente todas disponibles
                descripcion: req.body.descripcion,
                estado: req.body.estado
            };

            await Libro.crear(libroData);
            res.redirect('/libros');
        } catch (error) {
            console.error('Error al crear libro:', error);
            res.status(500).send('Error al crear el libro');
        }
    }

    // Mostrar formulario para editar libro
    async editar(req, res) {
        try {
            const id = req.params.id;
            const libro = await Libro.obtenerPorId(id);

            if (!libro) {
                return res.status(404).send('Libro no encontrado');
            }

            // Obtener datos para los selects
            const autores = await Autor.obtenerTodos();
            const editoriales = await Editorial.obtenerTodos();
            const categorias = await Categoria.obtenerTodos();
            const idiomas = await Idioma.obtenerTodos();
            const ubicaciones = await Ubicacion.obtenerTodos();

            res.render('libros/editar', {
                title: 'Editar Libro',
                libro,
                autores,
                editoriales,
                categorias,
                idiomas,
                ubicaciones
            });
        } catch (error) {
            console.error('Error al obtener libro:', error);
            res.status(500).send('Error al obtener el libro');
        }
    }

    // Actualizar libro existente
    async actualizar(req, res) {
        try {
            const id = req.params.id;
            const libroData = {
                titulo: req.body.titulo,
                isbn: req.body.isbn,
                autor_id: req.body.autor_id,
                editorial_id: req.body.editorial_id,
                categoria_id: req.body.categoria_id,
                idioma_id: req.body.idioma_id,
                ubicacion_id: req.body.ubicacion_id || null,
                año_publicacion: req.body.año_publicacion,
                numero_paginas: req.body.numero_paginas,
                cantidad_total: req.body.cantidad_total,
                cantidad_disponible: req.body.cantidad_disponible,
                descripcion: req.body.descripcion,
                estado: req.body.estado
            };

            await Libro.actualizar(id, libroData);
            res.redirect('/libros');
        } catch (error) {
            console.error('Error al actualizar libro:', error);
            res.status(500).send('Error al actualizar el libro');
        }
    }

    // Eliminar libro
    async eliminar(req, res) {
        try {
            const id = req.params.id;
            await Libro.eliminar(id);
            res.redirect('/libros');
        } catch (error) {
            console.error('Error al eliminar libro:', error);
            res.status(500).send('Error al eliminar el libro');
        }
    }

    // Ver detalle de un libro
    async detalle(req, res) {
        try {
            const id = req.params.id;
            const libro = await Libro.obtenerPorId(id);

            if (!libro) {
                return res.status(404).send('Libro no encontrado');
            }

            res.render('libros/detalle', {
                title: 'Detalle del Libro',
                libro
            });
        } catch (error) {
            console.error('Error al obtener libro:', error);
            res.status(500).send('Error al obtener el libro');
        }
    }
}

module.exports = new LibroController();
