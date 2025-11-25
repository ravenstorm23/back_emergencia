import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { crearEmergencia, obtenerEmergencias, actualizarEstadoEmergencia } from '../Controllers/emergenciaController.js';

const router = express.Router();

// POST /api/emergencias - Crear emergencia
router.post('/', verifyToken, crearEmergencia);

// GET /api/emergencias - Obtener emergencias
router.get('/', verifyToken, obtenerEmergencias);

// PATCH /api/emergencias/:id - Actualizar estado de emergencia
router.patch('/:id', verifyToken, actualizarEstadoEmergencia);

export default router;
