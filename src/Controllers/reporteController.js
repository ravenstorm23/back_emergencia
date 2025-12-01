import Actividad from '../models/Actividad.js';
import Usuario from '../models/Usuario.js';
import Vinculacion from '../models/Vinculacion.js';

export const generarReporte = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const { fechaInicio, fechaFin } = req.query;

        // Verificar vinculación
        const vinculacion = await Vinculacion.findOne({
            cuidadorId: req.user.id,
            pacienteId
        });

        if (!vinculacion) {
            return res.status(403).json({ msg: "No tienes permiso para ver reportes de este paciente" });
        }

        const paciente = await Usuario.findById(pacienteId).select("-password");

        // Filtro de fechas
        let filtro = { pacienteId };
        if (fechaInicio || fechaFin) {
            filtro.fechaHora = {};
            if (fechaInicio) filtro.fechaHora.$gte = new Date(fechaInicio);
            if (fechaFin) filtro.fechaHora.$lte = new Date(fechaFin);
        }

        const actividades = await Actividad.find(filtro).sort({ fechaHora: 1 });

        // Resumen
        const resumen = {
            totalActividades: actividades.length,
            completadas: actividades.filter(a => a.estado === 'completada').length,
            pendientes: actividades.filter(a => a.estado === 'pendiente').length,
            porTipo: actividades.reduce((acc, curr) => {
                acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
                return acc;
            }, {})
        };

        res.json({
            paciente,
            periodo: { inicio: fechaInicio, fin: fechaFin },
            resumen,
            actividades
        });

    } catch (error) {
        console.error("Error al generar reporte:", error);
        res.status(500).json({ msg: "Error al generar reporte", error: error.message });
    }
};
