import mongoose from "mongoose";

const actividadSchema = new mongoose.Schema({
  cuidadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  tipo: {
    type: String,
    enum: ["medicamento", "cita", "revision", "otro"],
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    default: "",
  },
  fechaHora: {
    type: Date,
  },
  recordatorio: {
    type: Boolean,
    default: false,
  },
  duracion: {
    type: String, // ej: "30 min"
  },
  prioridad: {
    type: String,
    enum: ["alta", "media", "baja"],
    default: "media",
  },
  estado: {
    type: String,
    enum: ["pendiente", "completada"],
    default: "pendiente",
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
  actualizadoEn: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Actividad", actividadSchema);
