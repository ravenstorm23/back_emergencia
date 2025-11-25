import mongoose from 'mongoose';

const emergenciaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  tipo: {
    type: String,
    enum: ['caída', 'salud', 'incendio', 'otro'],
    default: 'otro'
  },
  descripcion: {
    type: String,
    required: true
  },
  ubicacion: {
    type: String, // Puede ser dirección o coordenadas GPS
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en proceso', 'resuelta'],
    default: 'pendiente'
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Emergencia', emergenciaSchema);
