import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { obtenerConfiguracionAlertas, actualizarConfiguracionAlertas } from '../Controllers/alertasController.js';

const router = express.Router();

// GET /api/alertas/configuracion - Obtener configuración de alertas
router.get('/configuracion', verifyToken, obtenerConfiguracionAlertas);

// GET /api/alertas/:id - Obtener configuración de alertas por ID de usuario
router.get('/:id', verifyToken, obtenerConfiguracionAlertas);


// POST /api/alertas/configuracion - Actualizar configuración de alertas
router.post('/configuracion', verifyToken, actualizarConfiguracionAlertas);

export default router;
