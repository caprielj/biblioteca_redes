// =====================================================
// Modelo de Devoluciones
// Maneja todas las operaciones CRUD para la tabla devoluciones
// =====================================================

const { pool } = require('../config/database');

class Devolucion {

    // Obtener todas las devoluciones
    static async obtenerTodos() {
        try {
            const query = `
                SELECT
                    d.id,
                    CONCAT(u.nombre, ' ', u.apellido) as usuario,
                    l.titulo as libro,
                    p.fecha_prestamo,
                    d.fecha_devolucion_real,
                    d.dias_retraso,
                    d.estado_libro
                FROM devoluciones d
                INNER JOIN prestamos p ON d.prestamo_id = p.id
                INNER JOIN usuarios u ON p.usuario_id = u.id
                INNER JOIN libros l ON p.libro_id = l.id
                ORDER BY d.fecha_devolucion_real DESC
            `;
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener una devolución por ID
    static async obtenerPorId(id) {
        try {
            const query = `
                SELECT
                    d.*,
                    p.usuario_id,
                    p.libro_id,
                    CONCAT(u.nombre, ' ', u.apellido) as usuario_nombre,
                    l.titulo as libro_titulo
                FROM devoluciones d
                INNER JOIN prestamos p ON d.prestamo_id = p.id
                INNER JOIN usuarios u ON p.usuario_id = u.id
                INNER JOIN libros l ON p.libro_id = l.id
                WHERE d.id = ?
            `;
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Registrar una devolución
    static async crear(devolucionData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction(); // Iniciar transacción

            // 1. Obtener información del préstamo
            const [prestamo] = await connection.query(
                'SELECT * FROM prestamos WHERE id = ?',
                [devolucionData.prestamo_id]
            );

            if (!prestamo[0]) {
                throw new Error('El préstamo no existe');
            }

            if (prestamo[0].estado === 'devuelto') {
                throw new Error('Este préstamo ya fue devuelto');
            }

            // 2. Calcular días de retraso
            const fechaEsperada = new Date(prestamo[0].fecha_devolucion_esperada);
            const fechaReal = new Date(devolucionData.fecha_devolucion_real);
            const diasRetraso = Math.max(0, Math.floor((fechaReal - fechaEsperada) / (1000 * 60 * 60 * 24)));

            // 3. Registrar la devolución
            const queryDevolucion = `
                INSERT INTO devoluciones
                (prestamo_id, fecha_devolucion_real, dias_retraso, estado_libro, observaciones)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [resultDevolucion] = await connection.query(queryDevolucion, [
                devolucionData.prestamo_id,
                devolucionData.fecha_devolucion_real,
                diasRetraso,
                devolucionData.estado_libro,
                devolucionData.observaciones
            ]);

            // 4. Actualizar el estado del préstamo a 'devuelto'
            await connection.query(
                'UPDATE prestamos SET estado = "devuelto" WHERE id = ?',
                [devolucionData.prestamo_id]
            );

            // 5. Incrementar la cantidad disponible del libro
            await connection.query(
                'UPDATE libros SET cantidad_disponible = cantidad_disponible + 1 WHERE id = ?',
                [prestamo[0].libro_id]
            );

            // 6. Si hay días de retraso, crear una multa automáticamente
            if (diasRetraso > 0) {
                const montoPorDia = 5.00; // Q5.00 por día de retraso
                const montoTotal = diasRetraso * montoPorDia;

                await connection.query(
                    `INSERT INTO multas
                    (devolucion_id, usuario_id, monto, motivo, descripcion, estado, fecha_multa)
                    VALUES (?, ?, ?, 'retraso', ?, 'pendiente', ?)`,
                    [
                        resultDevolucion.insertId,
                        prestamo[0].usuario_id,
                        montoTotal,
                        `Multa por ${diasRetraso} días de retraso`,
                        devolucionData.fecha_devolucion_real
                    ]
                );
            }

            await connection.commit(); // Confirmar transacción
            return { id: resultDevolucion.insertId, dias_retraso: diasRetraso };

        } catch (error) {
            await connection.rollback(); // Revertir cambios si hay error
            throw error;
        } finally {
            connection.release(); // Liberar conexión
        }
    }

    // Obtener devolución por préstamo ID
    static async obtenerPorPrestamoId(prestamoId) {
        try {
            const query = 'SELECT * FROM devoluciones WHERE prestamo_id = ?';
            const [rows] = await pool.query(query, [prestamoId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Devolucion;
