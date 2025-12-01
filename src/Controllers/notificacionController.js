import Notificacion from '../models/Notificacion.js';

export const obtenerNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.find({ usuarioDestinoId: req.user.id })
            .sort({ fechaCreacion: -1 })
            .limit(50);
        res.json(notificaciones);
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        res.status(500).json({ msg: "Error al obtener notificaciones", error: error.message });
    }
};

export const crearNotificacion = async (req, res) => {
    try {
        const { usuarioDestinoId, titulo, mensaje, tipo } = req.body;

        const nuevaNotificacion = new Notificacion({
            usuarioDestinoId,
            titulo,
            mensaje,
            tipo: tipo || 'info'
        });

        await nuevaNotificacion.save();
        res.status(201).json(nuevaNotificacion);
    } catch (error) {
        console.error("Error al crear notificación:", error);
        res.status(500).json({ msg: "Error al crear notificación", error: error.message });
    }
};

export const marcarLeida = async (req, res) => {
    try {
        const { id } = req.params;
        const notificacion = await Notificacion.findById(id);

        if (!notificacion) {
            return res.status(404).json({ msg: "Notificación no encontrada" });
        }

        if (notificacion.usuarioDestinoId.toString() !== req.user.id) {
            return res.status(403).json({ msg: "No autorizado" });
        }

        notificacion.leida = true;
        await notificacion.save();
        res.json({ msg: "Notificación marcada como leída" });
    } catch (error) {
        console.error("Error al marcar notificación:", error);
        res.status(500).json({ msg: "Error al actualizar notificación", error: error.message });
    }
};
