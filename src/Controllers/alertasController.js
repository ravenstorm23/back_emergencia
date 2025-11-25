import Usuario from '../models/Usuario.js';

// Configuración de alertas por usuario
export const obtenerConfiguracionAlertas = async (req, res) => {
    try {
        const user = await Usuario.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Configuración por defecto si no existe
        const configuracion = user.configuracion_alertas || {
            notificaciones_push: true,
            notificaciones_email: true,
            notificaciones_sms: false,
            alertas_emergencia: true,
            alertas_medicamentos: true,
            alertas_citas: true,
            sonido_activado: true,
            vibracion_activada: true
        };

        res.status(200).json({ configuracion });
    } catch (error) {
        console.error("Error al obtener configuración de alertas:", error);
        res.status(500).json({ msg: "Error al obtener configuración", error: error.message });
    }
};

export const actualizarConfiguracionAlertas = async (req, res) => {
    try {
        const user = await Usuario.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        const {
            notificaciones_push,
            notificaciones_email,
            notificaciones_sms,
            alertas_emergencia,
            alertas_medicamentos,
            alertas_citas,
            sonido_activado,
            vibracion_activada
        } = req.body;

        // Actualizar configuración
        user.configuracion_alertas = {
            notificaciones_push: notificaciones_push !== undefined ? notificaciones_push : true,
            notificaciones_email: notificaciones_email !== undefined ? notificaciones_email : true,
            notificaciones_sms: notificaciones_sms !== undefined ? notificaciones_sms : false,
            alertas_emergencia: alertas_emergencia !== undefined ? alertas_emergencia : true,
            alertas_medicamentos: alertas_medicamentos !== undefined ? alertas_medicamentos : true,
            alertas_citas: alertas_citas !== undefined ? alertas_citas : true,
            sonido_activado: sonido_activado !== undefined ? sonido_activado : true,
            vibracion_activada: vibracion_activada !== undefined ? vibracion_activada : true
        };

        await user.save();

        res.status(200).json({
            msg: "Configuración de alertas actualizada",
            configuracion: user.configuracion_alertas
        });
    } catch (error) {
        console.error("Error al actualizar configuración de alertas:", error);
        res.status(500).json({ msg: "Error al actualizar configuración", error: error.message });
    }
};
