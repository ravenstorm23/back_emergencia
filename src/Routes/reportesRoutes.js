import express from 'express';
import { generarReporte } from '../Controllers/reporteController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:pacienteId', verifyToken, generarReporte);

export default router;
