import Contacto from '../models/Contacto.js';

export const obtenerContactos = async (req, res) => {
    try {
        // Obtener contactos donde el usuario autenticado es el adulto mayor o el cuidador
        const contactos = await Contacto.find({
            $or: [
                { usuario_mayor: req.user.id },
                { usuario_cuidador: req.user.id }
            ]
        })
            .populate('usuario_mayor', 'nombre email telefono')
            .populate('usuario_cuidador', 'nombre email telefono')
            .sort({ fecha_vinculacion: -1 });

        res.json(contactos);
    } catch (error) {
        console.error("Error al obtener contactos:", error);
        res.status(500).json({ msg: "Error al obtener contactos", error: error.message });
    }
};

export const crearContacto = async (req, res) => {
    try {
        const { usuario_mayor, usuario_cuidador, relacion } = req.body;

        if (!usuario_mayor || !usuario_cuidador) {
            return res.status(400).json({ msg: "usuario_mayor y usuario_cuidador son campos obligatorios" });
        }

        const nuevoContacto = new Contacto({
            usuario_mayor,
            usuario_cuidador,
            relacion: relacion || 'otro'
        });

        await nuevoContacto.save();

        const contactoPopulado = await Contacto.findById(nuevoContacto._id)
            .populate('usuario_mayor', 'nombre email telefono')
            .populate('usuario_cuidador', 'nombre email telefono');

        res.status(201).json({
            msg: "Contacto creado con éxito",
            contacto: contactoPopulado
        });
    } catch (error) {
        console.error("Error al crear contacto:", error);
        res.status(500).json({ msg: "Error al crear el contacto", error: error.message });
    }
};
