// =====================================================
// Servidor Principal - Sistema de Gestión de Biblioteca
// Aplicación desarrollada con Node.js y arquitectura MVC
// =====================================================

// Importar dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

// Importar configuración de base de datos
const { verificarConexion } = require('./config/database');

// Importar rutas
const routes = require('./routes/index');

// Crear instancia de Express
const app = express();

// Configurar puerto desde variables de entorno o usar 3000 por defecto
const PORT = process.env.PORT || 3000;

// ===== CONFIGURACIÓN DE MIDDLEWARES =====

// Configurar motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear el body de las peticiones
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para permitir métodos PUT y DELETE en formularios
app.use(methodOverride('_method'));

// Servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para logging de peticiones (desarrollo)
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString('es-GT')}] ${req.method} ${req.url}`);
    next();
});

// ===== CONFIGURACIÓN DE RUTAS =====

// Usar las rutas definidas en routes/index.js
app.use('/', routes);

// ===== MANEJO DE ERRORES =====

// Ruta para manejar 404 - Página no encontrada
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Página no encontrada</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 50px;
                    background-color: #f4f6f9;
                }
                h1 { color: #e74c3c; font-size: 3rem; }
                p { color: #7f8c8d; font-size: 1.2rem; }
                a { color: #3498db; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>404</h1>
            <p>Página no encontrada</p>
            <a href="/">Volver al inicio</a>
        </body>
        </html>
    `);
});

// Middleware para manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Error del Servidor</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 50px;
                    background-color: #f4f6f9;
                }
                h1 { color: #e74c3c; font-size: 3rem; }
                p { color: #7f8c8d; font-size: 1.2rem; }
                a { color: #3498db; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>Error del Servidor</h1>
            <p>Ha ocurrido un error. Por favor, intente nuevamente.</p>
            <a href="/">Volver al inicio</a>
        </body>
        </html>
    `);
});

// ===== INICIAR SERVIDOR =====

// Función para iniciar el servidor
const iniciarServidor = async () => {
    try {
        // Verificar conexión a la base de datos
        console.log('\n========================================');
        console.log('Sistema de Gestión de Biblioteca');
        console.log('========================================\n');
        console.log('Verificando conexión a la base de datos...');

        const conexionExitosa = await verificarConexion();

        if (!conexionExitosa) {
            console.error('\n⚠️  ADVERTENCIA: No se pudo conectar a la base de datos.');
            console.error('Asegúrese de que MariaDB esté ejecutándose y las credenciales en .env sean correctas.\n');
        }

        // Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log('\n========================================');
            console.log(`✓ Servidor ejecutándose en http://localhost:${PORT}`);
            console.log('========================================');
            console.log('\nPresione Ctrl+C para detener el servidor\n');
        });

    } catch (error) {
        console.error('\n✗ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

// Ejecutar la función para iniciar el servidor
iniciarServidor();

// ===== MANEJO DE SEÑALES DE TERMINACIÓN =====

// Manejar cierre graceful del servidor
process.on('SIGINT', () => {
    console.log('\n\n========================================');
    console.log('Cerrando servidor...');
    console.log('========================================\n');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n========================================');
    console.log('Cerrando servidor...');
    console.log('========================================\n');
    process.exit(0);
});

// Exportar la aplicación (útil para testing)
module.exports = app;
