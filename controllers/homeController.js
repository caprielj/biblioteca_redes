// =====================================================
// Controlador del Home/Inicio
// Maneja la página principal del sistema
// =====================================================

const Libro = require('../models/Libro');
const Usuario = require('../models/Usuario');
const Prestamo = require('../models/Prestamo');
const Multa = require('../models/Multa');

class HomeController {

    // Mostrar página principal con estadísticas
    async index(req, res) {
        try {
            // Obtener estadísticas generales del sistema
            const libros = await Libro.obtenerTodos();
            const usuarios = await Usuario.obtenerTodos();
            const prestamosActivos = await Prestamo.obtenerActivos();
            const prestamosAtrasados = await Prestamo.obtenerAtrasados();
            const multas = await Multa.obtenerTodos();

            // Calcular estadísticas
            const totalLibros = libros.length;
            const totalUsuarios = usuarios.length;
            const totalPrestamosActivos = prestamosActivos.length;
            const totalPrestamosAtrasados = prestamosAtrasados.length;
            const totalMultasPendientes = multas.filter(m => m.estado === 'pendiente').length;

            // Calcular total de libros disponibles
            const librosDisponibles = libros.reduce((sum, libro) => sum + libro.cantidad_disponible, 0);

            res.render('home/index', {
                title: 'Sistema de Gestión de Biblioteca',
                estadisticas: {
                    totalLibros,
                    librosDisponibles,
                    totalUsuarios,
                    totalPrestamosActivos,
                    totalPrestamosAtrasados,
                    totalMultasPendientes
                },
                prestamosRecientes: prestamosActivos.slice(0, 5), // Mostrar solo los 5 más recientes
                prestamosAtrasados: prestamosAtrasados.slice(0, 5) // Mostrar solo los 5 más atrasados
            });
        } catch (error) {
            console.error('Error al cargar página principal:', error);
            res.status(500).send('Error al cargar la página principal');
        }
    }
}

module.exports = new HomeController();
