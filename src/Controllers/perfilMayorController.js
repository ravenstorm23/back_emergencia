import Usuario from '../models/Usuario.js';

export const actualizarPerfilMayor = async (req, res) => {
    try {
        const { edad, enfermedades, contactoEmergencia } = req.body;

        // Buscar usuario actual
        const user = await Usuario.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Solo adultos mayores pueden crear este perfil
        if (user.rol !== "adulto mayor") {
            return res.status(403).json({ msg: "Solo usuarios con rol 'adulto mayor' pueden actualizar este perfil" });
        }

        // Guardar datos extra en el mismo documento
        user.edad = edad;
        user.enfermedades = enfermedades;
        user.contactoEmergencia = contactoEmergencia;
        await user.save();

        res.status(200).json({
            msg: "Perfil de adulto mayor actualizado correctamente",
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                edad: user.edad,
                enfermedades: user.enfermedades,
                contactoEmergencia: user.contactoEmergencia
            }
        });
    } catch (error) {
        console.error("Error en actualizarPerfilMayor:", error);
        res.status(500).json({ msg: "Error al actualizar el perfil", error: error.message });
    }
};

export const generarCodigo = async (req, res) => {
    try {
        // Buscar usuario actual
        const user = await Usuario.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Solo adultos mayores pueden generar código
        if (user.rol !== "adulto mayor") {
            return res.status(403).json({ msg: "Solo usuarios con rol 'adulto mayor' pueden generar códigos de vinculación" });
        }

        // Si ya tiene código, retornarlo
        if (user.codigo_vinculacion) {
            return res.status(200).json({
                msg: "Ya tienes un código de vinculación",
                codigo: user.codigo_vinculacion
            });
        }

        // Generar código único
        let codigoUnico;
        let codigoExiste = true;

        while (codigoExiste) {
            // Formato: AM-XXXX (AM = Adulto Mayor, XXXX = 4 caracteres alfanuméricos)
            const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let codigo = 'AM-';
            for (let i = 0; i < 6; i++) {
                codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }

            codigoUnico = codigo;

            // Verificar que no exista
            const usuarioExistente = await Usuario.findOne({ codigo_vinculacion: codigoUnico });
            codigoExiste = !!usuarioExistente;
        }

        // Guardar código
        user.codigo_vinculacion = codigoUnico;
        await user.save();

        res.status(201).json({
            msg: "Código de vinculación generado exitosamente",
            codigo: codigoUnico,
            instrucciones: "Comparte este código con tu cuidador para que pueda vincularse contigo"
        });
    } catch (error) {
        console.error("Error al generar código:", error);
        res.status(500).json({ msg: "Error al generar código de vinculación", error: error.message });
    }
};

export const obtenerCodigo = async (req, res) => {
    try {
        const user = await Usuario.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        if (user.rol !== "adulto mayor") {
            return res.status(403).json({ msg: "Solo adultos mayores tienen códigos de vinculación" });
        }

        if (!user.codigo_vinculacion) {
            return res.status(404).json({
                msg: "No tienes un código de vinculación generado",
                sugerencia: "Usa POST /api/perfil-mayor/generar-codigo para crear uno"
            });
        }

        res.status(200).json({
            codigo: user.codigo_vinculacion
        });
    } catch (error) {
        console.error("Error al obtener código:", error);
        res.status(500).json({ msg: "Error al obtener código", error: error.message });
    }
};

export const obtenerCuidadoresVinculados = async (req, res) => {
    try {
        const user = await Usuario.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        if (user.rol !== "adulto mayor") {
            return res.status(403).json({ msg: "Solo adultos mayores pueden ver sus cuidadores vinculados" });
        }

        if (!user.codigo_vinculacion) {
            return res.status(200).json({
                msg: "No tienes cuidadores vinculados aún",
                cuidadores: []
            });
        }

        // Buscar vinculaciones usando el código del adulto mayor
        const Vinculacion = (await import('../models/Vinculacion.js')).default;
        const vinculaciones = await Vinculacion.find({
            codigo_adulto_mayor: user.codigo_vinculacion
        }).populate('cuidadorId', 'nombre email telefono direccion');

        const cuidadores = vinculaciones.map(vinc => ({
            id: vinc.cuidadorId._id,
            nombre: vinc.cuidadorId.nombre,
            email: vinc.cuidadorId.email,
            telefono: vinc.cuidadorId.telefono,
            direccion: vinc.cuidadorId.direccion,
            tipo_relacion: vinc.tipo_relacion,
            es_contacto_principal: vinc.es_contacto_principal,
            permisos: {
                puede_ver_ubicacion: vinc.puede_ver_ubicacion,
                puede_recibir_alertas: vinc.puede_recibir_alertas,
                puede_gestionar_medicamentos: vinc.puede_gestionar_medicamentos
            },
            fecha_vinculacion: vinc.createdAt
        }));

        res.status(200).json({
            cuidadores,
            total: cuidadores.length
        });
    } catch (error) {
        console.error("Error al obtener cuidadores:", error);
        res.status(500).json({ msg: "Error al obtener cuidadores vinculados", error: error.message });
    }
};
