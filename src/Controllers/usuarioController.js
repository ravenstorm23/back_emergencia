import Usuario from '../models/Usuario.js';

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un usuario específico por ID
export const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('-password');

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ msg: 'Error al obtener usuario', error: error.message });
    }
};

// Actualizar perfil de usuario
export const actualizarUsuario = async (req, res) => {
    try {
        const {
            nombre,
            telefono,
            direccion,
            medicamentos,
            enfermedades,
            nombreFamiliar,
            telefonoFamiliar,
            configuracion_alertas
        } = req.body;

        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Actualizar solo los campos que se enviaron
        if (nombre !== undefined) usuario.nombre = nombre;
        if (telefono !== undefined) usuario.telefono = telefono;
        if (direccion !== undefined) usuario.direccion = direccion;
        if (medicamentos !== undefined) usuario.medicamentos = medicamentos;
        if (enfermedades !== undefined) usuario.enfermedades = enfermedades;
        if (nombreFamiliar !== undefined) usuario.nombreFamiliar = nombreFamiliar;
        if (telefonoFamiliar !== undefined) usuario.telefonoFamiliar = telefonoFamiliar;
        if (configuracion_alertas !== undefined) {
            usuario.configuracion_alertas = {
                ...usuario.configuracion_alertas,
                ...configuracion_alertas
            };
        }

        await usuario.save();

        // Retornar usuario sin password
        const usuarioActualizado = usuario.toObject();
        delete usuarioActualizado.password;

        res.json({
            msg: 'Usuario actualizado con éxito',
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ msg: 'Error al actualizar usuario', error: error.message });
    }
};
