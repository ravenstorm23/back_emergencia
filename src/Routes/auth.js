import express from "express";
import { registerUser, loginUser } from "../Controllers/authController.js";

const router = express.Router();

// Conectar rutas con controlador
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
