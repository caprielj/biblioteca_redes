// =====================================================
// Controlador de Préstamos
// Maneja la lógica de negocio y renderizado de vistas para préstamos
// =====================================================

const Prestamo = require('../models/Prestamo');
const Usuario = require('../models/Usuario');
const Libro = require('../models/Libro');

class PrestamoController {

    // Mostrar listado de todos los préstamos
    async index(req, res) {
        try {
            const prestamos = await Prestamo.obtenerTodos();
            res.render('prestamos/index', {
                title: 'Listado de Préstamos',
                prestamos: prestamos
            });
        } catch (error) {
            console.error('Error al obtener préstamos:', error);
            res.status(500).send('Error al obtener los préstamos');
        }
    }

    // Mostrar formulario para crear nuevo préstamo
    async crear(req, res) {
        try {
            const usuarios = await Usuario.obtenerTodos();
            const libros = await Libro.obtenerTodos();

            res.render('prestamos/crear', {
                title: 'Registrar Nuevo Préstamo',
                usuarios,
                libros
            });
        } catch (error) {
            console.error('Error al cargar formulario:', error);
            res.status(500).send('Error al cargar el formulario');
        }
    }

    // Guardar nuevo préstamo en la base de datos
    async guardar(req, res) {
        try {
            const prestamoData = {
                usuario_id: req.body.usuario_id,
                libro_id: req.body.libro_id,
                fecha_prestamo: req.body.fecha_prestamo,
                fecha_devolucion_esperada: req.body.fecha_devolucion_esperada,
                observaciones: req.body.observaciones
            };

            await Prestamo.crear(prestamoData);
            res.redirect('/prestamos');
        } catch (error) {
            console.error('Error al crear préstamo:', error);
            res.status(500).send('Error al crear el préstamo: ' + error.message);
        }
    }

    // Ver préstamos activos
    async activos(req, res) {
        try {
            const prestamosActivos = await Prestamo.obtenerActivos();
            res.render('prestamos/activos', {
                title: 'Préstamos Activos',
                prestamos: prestamosActivos
            });
        } catch (error) {
            console.error('Error al obtener préstamos activos:', error);
            res.status(500).send('Error al obtener los préstamos activos');
        }
    }

    // Ver préstamos atrasados
    async atrasados(req, res) {
        try {
            const prestamosAtrasados = await Prestamo.obtenerAtrasados();
            res.render('prestamos/atrasados', {
                title: 'Préstamos Atrasados',
                prestamos: prestamosAtrasados
            });
        } catch (error) {
            console.error('Error al obtener préstamos atrasados:', error);
            res.status(500).send('Error al obtener los préstamos atrasados');
        }
    }

    // Ver detalle de un préstamo
    async detalle(req, res) {
        try {
            const id = req.params.id;
            const prestamo = await Prestamo.obtenerPorId(id);

            if (!prestamo) {
                return res.status(404).send('Préstamo no encontrado');
            }

            res.render('prestamos/detalle', {
                title: 'Detalle del Préstamo',
                prestamo
            });
        } catch (error) {
            console.error('Error al obtener préstamo:', error);
            res.status(500).send('Error al obtener el préstamo');
        }
    }

    // Eliminar préstamo
    async eliminar(req, res) {
        try {
            const id = req.params.id;
            await Prestamo.eliminar(id);
            res.redirect('/prestamos');
        } catch (error) {
            console.error('Error al eliminar préstamo:', error);
            res.status(500).send('Error al eliminar el préstamo');
        }
    }
}

module.exports = new PrestamoController();
