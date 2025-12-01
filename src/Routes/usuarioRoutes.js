import express from 'express';
import { obtenerUsuarios, obtenerUsuario, actualizarUsuario } from '../Controllers/usuarioController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', obtenerUsuarios);
router.get('/:id', verifyToken, obtenerUsuario);
router.patch('/:id', verifyToken, actualizarUsuario);

export default router;
