// =====================================================
// Controlador de Usuarios
// Maneja la lógica de negocio y renderizado de vistas para usuarios
// =====================================================

const Usuario = require('../models/Usuario');
const Multa = require('../models/Multa');

class UsuarioController {

    // Mostrar listado de todos los usuarios
    async index(req, res) {
        try {
            const usuarios = await Usuario.obtenerTodos();
            res.render('usuarios/index', {
                title: 'Listado de Usuarios',
                usuarios: usuarios
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).send('Error al obtener los usuarios');
        }
    }

    // Mostrar formulario para crear nuevo usuario
    async crear(req, res) {
        try {
            res.render('usuarios/crear', {
                title: 'Agregar Nuevo Usuario'
            });
        } catch (error) {
            console.error('Error al cargar formulario:', error);
            res.status(500).send('Error al cargar el formulario');
        }
    }

    // Guardar nuevo usuario en la base de datos
    async guardar(req, res) {
        try {
            const usuarioData = {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                telefono: req.body.telefono,
                direccion: req.body.direccion,
                fecha_nacimiento: req.body.fecha_nacimiento,
                tipo_usuario: req.body.tipo_usuario,
                estado: req.body.estado || 'activo'
            };

            await Usuario.crear(usuarioData);
            res.redirect('/usuarios');
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).send('Error al crear el usuario');
        }
    }

    // Mostrar formulario para editar usuario
    async editar(req, res) {
        try {
            const id = req.params.id;
            const usuario = await Usuario.obtenerPorId(id);

            if (!usuario) {
                return res.status(404).send('Usuario no encontrado');
            }

            res.render('usuarios/editar', {
                title: 'Editar Usuario',
                usuario
            });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).send('Error al obtener el usuario');
        }
    }

    // Actualizar usuario existente
    async actualizar(req, res) {
        try {
            const id = req.params.id;
            const usuarioData = {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                telefono: req.body.telefono,
                direccion: req.body.direccion,
                fecha_nacimiento: req.body.fecha_nacimiento,
                tipo_usuario: req.body.tipo_usuario,
                estado: req.body.estado
            };

            await Usuario.actualizar(id, usuarioData);
            res.redirect('/usuarios');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).send('Error al actualizar el usuario');
        }
    }

    // Eliminar usuario
    async eliminar(req, res) {
        try {
            const id = req.params.id;
            await Usuario.eliminar(id);
            res.redirect('/usuarios');
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).send('Error al eliminar el usuario');
        }
    }

    // Ver detalle de un usuario
    async detalle(req, res) {
        try {
            const id = req.params.id;
            const usuario = await Usuario.obtenerPorId(id);

            if (!usuario) {
                return res.status(404).send('Usuario no encontrado');
            }

            // Obtener préstamos activos y multas pendientes
            const prestamosActivos = await Usuario.obtenerPrestamosActivos(id);
            const multasPendientes = await Multa.obtenerPendientesPorUsuario(id);
            const totalMultas = await Multa.obtenerTotalPendiente(id);

            res.render('usuarios/detalle', {
                title: 'Detalle del Usuario',
                usuario,
                prestamosActivos,
                multasPendientes,
                totalMultas
            });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).send('Error al obtener el usuario');
        }
    }
}

module.exports = new UsuarioController();
