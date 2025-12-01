import express from 'express';
import { obtenerNotificaciones, crearNotificacion, marcarLeida } from '../Controllers/notificacionController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, obtenerNotificaciones);
router.post('/', verifyToken, crearNotificacion); // Opcional: si el front puede crear notificaciones
router.put('/:id/leida', verifyToken, marcarLeida);

export default router;
