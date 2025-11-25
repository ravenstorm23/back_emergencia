import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { crearVinculacion, obtenerVinculaciones } from "../Controllers/vinculacionController.js";

const router = express.Router();

// POST /api/vincular - Crear vinculación
router.post("/", verifyToken, crearVinculacion);

// GET /api/vincular - Obtener vinculaciones del usuario
router.get("/", verifyToken, obtenerVinculaciones);

export default router;
