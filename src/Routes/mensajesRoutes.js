import express from 'express';
import {
    enviarMensaje,
    obtenerConversacion,
    obtenerConversaciones,
    marcarComoLeido
} from '../Controllers/mensajeController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.post('/', verifyToken, enviarMensaje);
router.get('/conversaciones', verifyToken, obtenerConversaciones);
router.get('/:usuarioId', verifyToken, obtenerConversacion);
router.put('/marcar-leidos/:usuarioId', verifyToken, marcarComoLeido);

export default router;
