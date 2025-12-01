import Vinculacion from '../models/Vinculacion.js';
import Usuario from '../models/Usuario.js';

export const crearVinculacion = async (req, res) => {
    try {
        const {
            codigo_adulto_mayor,
            tipo_relacion,
            es_contacto_principal,
            puede_ver_ubicacion,
            puede_recibir_alertas,
            puede_gestionar_medicamentos,
            notas
        } = req.body;

        if (!codigo_adulto_mayor || !tipo_relacion) {
            return res.status(400).json({ msg: "codigo_adulto_mayor y tipo_relacion son campos obligatorios" });
        }

        // Validar que el código existe y pertenece a un adulto mayor
        const adultoMayor = await Usuario.findOne({
            codigo_vinculacion: codigo_adulto_mayor,
            rol: "adulto mayor"
        });

        if (!adultoMayor) {
            return res.status(404).json({
                msg: "Código de vinculación inválido o no existe",
                sugerencia: "Verifica que el adulto mayor haya generado su código correctamente"
            });
        }

        // Verificar que no exista una vinculación previa
        const vinculacionExistente = await Vinculacion.findOne({
            cuidadorId: req.user.id,
            codigo_adulto_mayor
        });

        if (vinculacionExistente) {
            return res.status(400).json({
                msg: "Ya estás vinculado con este adulto mayor",
                vinculacion: vinculacionExistente
            });
        }

        const nuevaVinculacion = new Vinculacion({
            cuidadorId: req.user.id,
            codigo_adulto_mayor,
            tipo_relacion,
            es_contacto_principal: es_contacto_principal || false,
            puede_ver_ubicacion: puede_ver_ubicacion !== undefined ? puede_ver_ubicacion : true,
            puede_recibir_alertas: puede_recibir_alertas !== undefined ? puede_recibir_alertas : true,
            puede_gestionar_medicamentos: puede_gestionar_medicamentos || false,
            notas: notas || "",
            pacienteId: adultoMayor._id
        });

        await nuevaVinculacion.save();
        res.status(201).json({
            msg: "Vinculación registrada con éxito",
            vinculacion: nuevaVinculacion,
            adultoMayor: {
                nombre: adultoMayor.nombre,
                email: adultoMayor.email
            }
        });
    } catch (error) {
        console.error("Error al registrar vinculación:", error);
        res.status(500).json({ msg: "Error al crear la vinculación", error: error.message });
    }
};

export const obtenerVinculaciones = async (req, res) => {
    try {
        const vinculaciones = await Vinculacion.find({ cuidadorId: req.user.id })
            .populate('pacienteId', 'nombre email telefono direccion')
            .sort({ createdAt: -1 });

        res.json(vinculaciones);
    } catch (error) {
        console.error("Error al obtener vinculaciones:", error);
        res.status(500).json({ msg: "Error al obtener vinculaciones", error: error.message });
    }
};
