// =====================================================
// Configuración de la conexión a la base de datos MariaDB
// =====================================================

const mysql = require('mysql2');
require('dotenv').config();

// Crear el pool de conexiones a la base de datos
// Un pool permite reutilizar conexiones y mejorar el rendimiento
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones simultáneas
    queueLimit: 0
});

// Exportar el pool con promesas para usar async/await
const promisePool = pool.promise();

// Función para verificar la conexión a la base de datos
const verificarConexion = async () => {
    try {
        const conexion = await promisePool.getConnection();
        console.log('✓ Conexión exitosa a la base de datos MariaDB');
        conexion.release(); // Liberar la conexión de vuelta al pool
        return true;
    } catch (error) {
        console.error('✗ Error al conectar a la base de datos:', error.message);
        return false;
    }
};

module.exports = {
    pool: promisePool,
    verificarConexion
};
