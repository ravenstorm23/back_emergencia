import mongoose from 'mongoose';

const contactoSchema = new mongoose.Schema({
  usuario_mayor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  usuario_cuidador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  relacion: {
    type: String,
    enum: ['hijo', 'sobrino', 'vecino', 'amigo', 'otro'],
    default: 'otro'
  },
  fecha_vinculacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Contacto', contactoSchema);
