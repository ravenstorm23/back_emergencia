const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Rutas (importadas)
const usuarioRoutes = require('./routes/usuarioRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const emergenciaRoutes = require('./routes/emergenciaRoutes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/emergencias', emergenciaRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
