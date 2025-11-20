// =====================================================
// Controlador de Devoluciones
// Maneja la lógica de negocio y renderizado de vistas para devoluciones
// =====================================================

const Devolucion = require('../models/Devolucion');
const Prestamo = require('../models/Prestamo');

class DevolucionController {

    // Mostrar listado de todas las devoluciones
    async index(req, res) {
        try {
            const devoluciones = await Devolucion.obtenerTodos();
            res.render('devoluciones/index', {
                title: 'Listado de Devoluciones',
                devoluciones: devoluciones
            });
        } catch (error) {
            console.error('Error al obtener devoluciones:', error);
            res.status(500).send('Error al obtener las devoluciones');
        }
    }

    // Mostrar formulario para registrar devolución
    async crear(req, res) {
        try {
            // Obtener solo los préstamos activos
            const prestamosActivos = await Prestamo.obtenerActivos();

            res.render('devoluciones/crear', {
                title: 'Registrar Devolución',
                prestamos: prestamosActivos
            });
        } catch (error) {
            console.error('Error al cargar formulario:', error);
            res.status(500).send('Error al cargar el formulario');
        }
    }

    // Guardar nueva devolución en la base de datos
    async guardar(req, res) {
        try {
            const devolucionData = {
                prestamo_id: req.body.prestamo_id,
                fecha_devolucion_real: req.body.fecha_devolucion_real,
                estado_libro: req.body.estado_libro,
                observaciones: req.body.observaciones
            };

            const resultado = await Devolucion.crear(devolucionData);

            // Mostrar mensaje si se generó una multa
            if (resultado.dias_retraso > 0) {
                console.log(`Se generó una multa por ${resultado.dias_retraso} días de retraso`);
            }

            res.redirect('/devoluciones');
        } catch (error) {
            console.error('Error al registrar devolución:', error);
            res.status(500).send('Error al registrar la devolución: ' + error.message);
        }
    }

    // Ver detalle de una devolución
    async detalle(req, res) {
        try {
            const id = req.params.id;
            const devolucion = await Devolucion.obtenerPorId(id);

            if (!devolucion) {
                return res.status(404).send('Devolución no encontrada');
            }

            res.render('devoluciones/detalle', {
                title: 'Detalle de la Devolución',
                devolucion
            });
        } catch (error) {
            console.error('Error al obtener devolución:', error);
            res.status(500).send('Error al obtener la devolución');
        }
    }
}

module.exports = new DevolucionController();
