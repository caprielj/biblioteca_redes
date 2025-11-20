// =====================================================
// Rutas Principales
// Define todas las rutas de la aplicación
// =====================================================

const express = require('express');
const router = express.Router();

// Importar controladores
const homeController = require('../controllers/homeController');
const libroController = require('../controllers/libroController');
const usuarioController = require('../controllers/usuarioController');
const prestamoController = require('../controllers/prestamoController');
const devolucionController = require('../controllers/devolucionController');
const multaController = require('../controllers/multaController');

// ========== RUTAS HOME ==========
router.get('/', homeController.index);

// ========== RUTAS DE LIBROS ==========
router.get('/libros', libroController.index);
router.get('/libros/crear', libroController.crear);
router.post('/libros/guardar', libroController.guardar);
router.get('/libros/editar/:id', libroController.editar);
router.post('/libros/actualizar/:id', libroController.actualizar);
router.post('/libros/eliminar/:id', libroController.eliminar);
router.get('/libros/detalle/:id', libroController.detalle);

// ========== RUTAS DE USUARIOS ==========
router.get('/usuarios', usuarioController.index);
router.get('/usuarios/crear', usuarioController.crear);
router.post('/usuarios/guardar', usuarioController.guardar);
router.get('/usuarios/editar/:id', usuarioController.editar);
router.post('/usuarios/actualizar/:id', usuarioController.actualizar);
router.post('/usuarios/eliminar/:id', usuarioController.eliminar);
router.get('/usuarios/detalle/:id', usuarioController.detalle);

// ========== RUTAS DE PRÉSTAMOS ==========
router.get('/prestamos', prestamoController.index);
router.get('/prestamos/crear', prestamoController.crear);
router.post('/prestamos/guardar', prestamoController.guardar);
router.get('/prestamos/activos', prestamoController.activos);
router.get('/prestamos/atrasados', prestamoController.atrasados);
router.get('/prestamos/detalle/:id', prestamoController.detalle);
router.post('/prestamos/eliminar/:id', prestamoController.eliminar);

// ========== RUTAS DE DEVOLUCIONES ==========
router.get('/devoluciones', devolucionController.index);
router.get('/devoluciones/crear', devolucionController.crear);
router.post('/devoluciones/guardar', devolucionController.guardar);
router.get('/devoluciones/detalle/:id', devolucionController.detalle);

// ========== RUTAS DE MULTAS ==========
router.get('/multas', multaController.index);
router.get('/multas/detalle/:id', multaController.detalle);
router.post('/multas/pagar/:id', multaController.registrarPago);
router.post('/multas/condonar/:id', multaController.condonar);
router.post('/multas/eliminar/:id', multaController.eliminar);

module.exports = router;
