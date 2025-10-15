const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  alerta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergencia', // referencia al evento de emergencia
    required: true
  },
  destinatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // cuidador o contacto que recibe la alerta
    required: true
  },
  metodo_envio: {
    type: String,
    enum: ['correo', 'sms', 'app'],
    default: 'app'
  },
  fecha_envio: {
    type: Date,
    default: Date.now
  },
  estado_envio: {
    type: String,
    enum: ['enviado', 'pendiente', 'fallido'],
    default: 'pendiente'
  }
});

module.exports = mongoose.model('Notificacion', notificacionSchema);
