// =====================================================
// Controlador de Multas
// Maneja la lógica de negocio y renderizado de vistas para multas
// =====================================================

const Multa = require('../models/Multa');

class MultaController {

    // Mostrar listado de todas las multas
    async index(req, res) {
        try {
            const multas = await Multa.obtenerTodos();
            res.render('multas/index', {
                title: 'Listado de Multas',
                multas: multas
            });
        } catch (error) {
            console.error('Error al obtener multas:', error);
            res.status(500).send('Error al obtener las multas');
        }
    }

    // Ver detalle de una multa
    async detalle(req, res) {
        try {
            const id = req.params.id;
            const multa = await Multa.obtenerPorId(id);

            if (!multa) {
                return res.status(404).send('Multa no encontrada');
            }

            res.render('multas/detalle', {
                title: 'Detalle de la Multa',
                multa
            });
        } catch (error) {
            console.error('Error al obtener multa:', error);
            res.status(500).send('Error al obtener la multa');
        }
    }

    // Registrar pago de multa
    async registrarPago(req, res) {
        try {
            const id = req.params.id;
            const fechaPago = req.body.fecha_pago || new Date().toISOString().split('T')[0];

            await Multa.registrarPago(id, fechaPago);
            res.redirect('/multas');
        } catch (error) {
            console.error('Error al registrar pago:', error);
            res.status(500).send('Error al registrar el pago');
        }
    }

    // Condonar multa
    async condonar(req, res) {
        try {
            const id = req.params.id;
            await Multa.condonar(id);
            res.redirect('/multas');
        } catch (error) {
            console.error('Error al condonar multa:', error);
            res.status(500).send('Error al condonar la multa');
        }
    }

    // Eliminar multa
    async eliminar(req, res) {
        try {
            const id = req.params.id;
            await Multa.eliminar(id);
            res.redirect('/multas');
        } catch (error) {
            console.error('Error al eliminar multa:', error);
            res.status(500).send('Error al eliminar la multa');
        }
    }
}

module.exports = new MultaController();
