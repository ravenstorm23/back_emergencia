import Actividad from '../models/Actividad.js';

export const crearActividad = async (req, res) => {
    try {
        const { pacienteId, tipo, titulo, descripcion, fechaHora, recordatorio, duracion, prioridad } = req.body;

        if (!pacienteId || !tipo || !titulo) {
            return res.status(400).json({ msg: "Faltan campos obligatorios: pacienteId, tipo y titulo son requeridos" });
        }

        const nuevaActividad = new Actividad({
            cuidadorId: req.user.id,
            pacienteId,
            tipo,
            titulo,
            descripcion: descripcion || "",
            fechaHora: fechaHora || new Date(),
            recordatorio: recordatorio || false,
            duracion: duracion || "",
            prioridad: prioridad || "media",
        });

        await nuevaActividad.save();
        res.status(201).json({ msg: "Actividad creada con éxito", actividad: nuevaActividad });
    } catch (error) {
        console.error("Error al crear actividad:", error);
        res.status(500).json({ msg: "Error al crear la actividad", error: error.message });
    }
};

export const obtenerActividades = async (req, res) => {
    try {
        const { pacienteId } = req.query;
        const filtro = { cuidadorId: req.user.id };
        if (pacienteId) filtro.pacienteId = pacienteId;

        const actividades = await Actividad.find(filtro).sort({ fechaHora: 1 });
        res.json(actividades);
    } catch (error) {
        console.error("Error al obtener actividades:", error);
        res.status(500).json({ msg: "Error al obtener actividades", error: error.message });
    }
};

export const eliminarActividad = async (req, res) => {
    try {
        const actividad = await Actividad.findById(req.params.id);

        if (!actividad) {
            return res.status(404).json({ msg: "Actividad no encontrada" });
        }

        if (actividad.cuidadorId.toString() !== req.user.id) {
            return res.status(403).json({ msg: "No autorizado para eliminar esta actividad" });
        }

        await actividad.deleteOne();
        res.json({ msg: "Actividad eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar actividad:", error);
        res.status(500).json({ msg: "Error al eliminar la actividad", error: error.message });
    }
};
export const actualizarActividad = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, titulo, descripcion, fechaHora, recordatorio, duracion, prioridad, estado } = req.body;

        let actividad = await Actividad.findById(id);

        if (!actividad) {
            return res.status(404).json({ msg: "Actividad no encontrada" });
        }

        if (actividad.cuidadorId.toString() !== req.user.id) {
            return res.status(403).json({ msg: "No autorizado para editar esta actividad" });
        }

        actividad.tipo = tipo || actividad.tipo;
        actividad.titulo = titulo || actividad.titulo;
        actividad.descripcion = descripcion || actividad.descripcion;
        actividad.fechaHora = fechaHora || actividad.fechaHora;
        actividad.recordatorio = recordatorio !== undefined ? recordatorio : actividad.recordatorio;
        actividad.duracion = duracion || actividad.duracion;
        actividad.prioridad = prioridad || actividad.prioridad;
        actividad.estado = estado || actividad.estado;
        actividad.actualizadoEn = Date.now();

        await actividad.save();
        res.json({ msg: "Actividad actualizada con éxito", actividad });
    } catch (error) {
        console.error("Error al actualizar actividad:", error);
        res.status(500).json({ msg: "Error al actualizar la actividad", error: error.message });
    }
};
