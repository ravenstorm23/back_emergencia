import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { obtenerContactos, crearContacto } from '../Controllers/contactoController.js';

const router = express.Router();

// GET /api/contactos - Obtener contactos
router.get('/', verifyToken, obtenerContactos);

// POST /api/contactos - Crear contacto
router.post('/', verifyToken, crearContacto);

export default router;