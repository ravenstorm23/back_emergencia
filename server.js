import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import usuarioRoutes from './src/Routes/usuarioRoutes.js';
import contactoRoutes from './src/Routes/contactoRoutes.js';
import emergenciaRoutes from './src/Routes/emergenciaRoutes.js';
import authRoutes from './src/Routes/auth.js';
import vinculacionRoutes from './src/Routes/vinculacionRoutes.js';
import actividadesRoutes from './src/Routes/actividades.js';
import perfilMayorRoutes from "./src/Routes/perfilMayor.js";
import alertasRoutes from './src/Routes/alertasRoutes.js';
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';


dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/emergencias', emergenciaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vincular', vinculacionRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use("/api/perfil-mayor", perfilMayorRoutes);
app.use('/api/alertas', alertasRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(notFound);
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
