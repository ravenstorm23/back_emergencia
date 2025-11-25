import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { actualizarPerfilMayor, generarCodigo, obtenerCodigo, obtenerCuidadoresVinculados } from "../Controllers/perfilMayorController.js";

const router = express.Router();

// POST /api/perfil-mayor - Actualizar perfil
router.post("/", verifyToken, actualizarPerfilMayor);

// POST /api/perfil-mayor/generar-codigo - Generar código de vinculación
router.post("/generar-codigo", verifyToken, generarCodigo);

// GET /api/perfil-mayor/codigo - Obtener código de vinculación
router.get("/codigo", verifyToken, obtenerCodigo);

// GET /api/perfil-mayor/cuidadores - Obtener cuidadores vinculados
router.get("/cuidadores", verifyToken, obtenerCuidadoresVinculados);

export default router;
