import mongoose from 'mongoose';

const MensajeSchema = new mongoose.Schema({
    remitenteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El remitente es obligatorio']
    },
    destinatarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El destinatario es obligatorio']
    },
    contenido: {
        type: String,
        required: [true, 'El contenido del mensaje es obligatorio'],
        trim: true,
        maxlength: [1000, 'El mensaje no puede tener más de 1000 caracteres']
    },
    leido: {
        type: Boolean,
        default: false
    },
    tipo: {
        type: String,
        enum: ['texto', 'alerta', 'sistema'],
        default: 'texto'
    }
}, {
    timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Índice compuesto para búsquedas eficientes de conversaciones
MensajeSchema.index({ remitenteId: 1, destinatarioId: 1, createdAt: -1 });

const Mensaje = mongoose.model('Mensaje', MensajeSchema);

export default Mensaje;
