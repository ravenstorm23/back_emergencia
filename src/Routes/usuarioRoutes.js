import express from 'express';
import { obtenerUsuarios } from '../Controllers/usuarioController.js';

const router = express.Router();

router.get('/', obtenerUsuarios);

export default router;
