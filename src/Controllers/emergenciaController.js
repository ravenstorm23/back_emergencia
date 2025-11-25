import Emergencia from '../models/Emergencia.js';

export const crearEmergencia = async (req, res) => {
    try {
        const { tipo, descripcion, ubicacion } = req.body;

        if (!descripcion || !ubicacion) {
            return res.status(400).json({ msg: "descripcion y ubicacion son campos obligatorios" });
        }

        const nuevaEmergencia = new Emergencia({
            usuario: req.user.id,
            tipo: tipo || 'otro',
            descripcion,
            ubicacion,
            estado: 'pendiente'
        });

        await nuevaEmergencia.save();
        res.status(201).json({
            msg: "Emergencia registrada con éxito",
            emergencia: nuevaEmergencia
        });
    } catch (error) {
        console.error("Error al crear emergencia:", error);
        res.status(500).json({ msg: "Error al registrar la emergencia", error: error.message });
    }
};

export const obtenerEmergencias = async (req, res) => {
    try {
        const { estado } = req.query;
        const filtro = { usuario: req.user.id };

        if (estado) {
            filtro.estado = estado;
        }

        const emergencias = await Emergencia.find(filtro)
            .sort({ fecha: -1 })
            .populate('usuario', 'nombre email');

        res.json(emergencias);
    } catch (error) {
        console.error("Error al obtener emergencias:", error);
        res.status(500).json({ msg: "Error al obtener emergencias", error: error.message });
    }
};

export const actualizarEstadoEmergencia = async (req, res) => {
    try {
        const { estado } = req.body;
        const { id } = req.params;

        if (!estado || !['pendiente', 'en proceso', 'resuelta'].includes(estado)) {
            return res.status(400).json({ msg: "Estado inválido. Debe ser: pendiente, en proceso, o resuelta" });
        }

        const emergencia = await Emergencia.findById(id);

        if (!emergencia) {
            return res.status(404).json({ msg: "Emergencia no encontrada" });
        }

        if (emergencia.usuario.toString() !== req.user.id) {
            return res.status(403).json({ msg: "No autorizado para modificar esta emergencia" });
        }

        emergencia.estado = estado;
        await emergencia.save();

        res.json({
            msg: "Estado de emergencia actualizado",
            emergencia
        });
    } catch (error) {
        console.error("Error al actualizar emergencia:", error);
        res.status(500).json({ msg: "Error al actualizar la emergencia", error: error.message });
    }
};
