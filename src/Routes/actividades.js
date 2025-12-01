import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { crearActividad, obtenerActividades, eliminarActividad, actualizarActividad } from '../Controllers/actividadController.js';

const router = express.Router();

// CREAR nueva actividad
router.post("/", verifyToken, crearActividad);

// OBTENER actividades
router.get("/", verifyToken, obtenerActividades);

// ACTUALIZAR actividad
router.put("/:id", verifyToken, actualizarActividad);

// ELIMINAR actividad
router.delete("/:id", verifyToken, eliminarActividad);

export default router;
