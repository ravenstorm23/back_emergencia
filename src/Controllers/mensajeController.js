import Mensaje from '../models/Mensaje.js';
import Usuario from '../models/Usuario.js';
import Vinculacion from '../models/Vinculacion.js';

/**
 * Enviar un mensaje
 * POST /api/mensajes
 */
export const enviarMensaje = async (req, res) => {
    try {
        const { destinatarioId, contenido, tipo = 'texto' } = req.body;
        const remitenteId = req.user.id;

        // Validar que existe el destinatario
        const destinatario = await Usuario.findById(destinatarioId);
        if (!destinatario) {
            return res.status(404).json({ msg: 'Destinatario no encontrado' });
        }

        // Verificar que hay una vinculación entre el remitente y destinatario
        const vinculacion = await Vinculacion.findOne({
            $or: [
                { cuidadorId: remitenteId, pacienteId: destinatarioId },
                { cuidadorId: destinatarioId, pacienteId: remitenteId }
            ]
        });

        if (!vinculacion) {
            return res.status(403).json({ msg: 'No tienes permiso para enviar mensajes a este usuario' });
        }

        const nuevoMensaje = new Mensaje({
            remitenteId,
            destinatarioId,
            contenido,
            tipo
        });

        await nuevoMensaje.save();

        // Poblar los datos del remitente antes de enviar la respuesta
        await nuevoMensaje.populate('remitenteId', 'nombre email');
        await nuevoMensaje.populate('destinatarioId', 'nombre email');

        res.status(201).json(nuevoMensaje);
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ msg: 'Error al enviar mensaje', error: error.message });
    }
};

/**
 * Obtener conversación con un usuario específico
 * GET /api/mensajes/:usuarioId
 */
export const obtenerConversacion = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const miId = req.user.id;

        // Obtener mensajes entre los dos usuarios
        const mensajes = await Mensaje.find({
            $or: [
                { remitenteId: miId, destinatarioId: usuarioId },
                { remitenteId: usuarioId, destinatarioId: miId }
            ]
        })
            .populate('remitenteId', 'nombre email')
            .populate('destinatarioId', 'nombre email')
            .sort({ createdAt: 1 });

        res.json(mensajes);
    } catch (error) {
        console.error('Error al obtener conversación:', error);
        res.status(500).json({ msg: 'Error al obtener conversación', error: error.message });
    }
};

/**
 * Obtener lista de conversaciones (usuarios con los que se ha chateado)
 * GET /api/mensajes/conversaciones
 */
export const obtenerConversaciones = async (req, res) => {
    try {
        const miId = req.user.id;

        // Obtener todos los mensajes donde participo
        const mensajes = await Mensaje.find({
            $or: [{ remitenteId: miId }, { destinatarioId: miId }]
        })
            .populate('remitenteId', 'nombre email')
            .populate('destinatarioId', 'nombre email')
            .sort({ createdAt: -1 });

        // Agrupar por usuario (conversaciones)
        const conversacionesMap = new Map();

        mensajes.forEach(mensaje => {
            const otroUsuario = mensaje.remitenteId._id.toString() === miId
                ? mensaje.destinatarioId
                : mensaje.remitenteId;

            const userId = otroUsuario._id.toString();

            if (!conversacionesMap.has(userId)) {
                conversacionesMap.set(userId, {
                    usuario: otroUsuario,
                    ultimoMensaje: mensaje,
                    noLeidos: 0
                });
            }

            // Contar mensajes no leídos recibidos
            if (mensaje.destinatarioId._id.toString() === miId && !mensaje.leido) {
                conversacionesMap.get(userId).noLeidos++;
            }
        });

        const conversaciones = Array.from(conversacionesMap.values());
        res.json(conversaciones);
    } catch (error) {
        console.error('Error al obtener conversaciones:', error);
        res.status(500).json({ msg: 'Error al obtener conversaciones', error: error.message });
    }
};

/**
 * Marcar mensajes como leídos
 * PUT /api/mensajes/marcar-leidos/:usuarioId
 */
export const marcarComoLeido = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const miId = req.user.id;

        await Mensaje.updateMany(
            { remitenteId: usuarioId, destinatarioId: miId, leido: false },
            { leido: true }
        );

        res.json({ msg: 'Mensajes marcados como leídos' });
    } catch (error) {
        console.error('Error al marcar como leído:', error);
        res.status(500).json({ msg: 'Error al marcar como leído', error: error.message });
    }
};
