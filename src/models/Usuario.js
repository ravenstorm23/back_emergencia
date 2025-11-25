// src/models/Usuario.js
import mongoose from "mongoose";

const VinculacionSchema = new mongoose.Schema({
  codigo_adulto_mayor: { type: String, required: true },
  tipo_relacion: { type: String, required: true },
  es_contacto_principal: { type: Boolean, default: false },
  permisos: {
    puede_ver_ubicacion: { type: Boolean, default: true },
    puede_recibir_alertas: { type: Boolean, default: true },
    puede_gestionar_medicamentos: { type: Boolean, default: false }
  },
  notas: { type: String, default: "" },
  creadoEn: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"]
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Por favor ingrese un email válido"]
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
  },
  // Roles: coinciden con tu front: "adulto_mayor" y "cuidador"
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
    enum: ["adulto mayor", "cuidador"],
    default: "adulto mayor"
  },
  // Opcionales: los hicimos opcionales (no required) porque en registro pueden no enviarse
  telefono: {
    type: String,
    required: false
  },
  direccion: {
    type: String,
    required: false
  },
  // Código único para que cuidadores se vinculen (solo para adultos mayores)
  codigo_vinculacion: {
    type: String,
    unique: true,
    sparse: true // permite que solo algunos usuarios tengan código
  },
  // Configuración de alertas y notificaciones
  configuracion_alertas: {
    notificaciones_push: { type: Boolean, default: true },
    notificaciones_email: { type: Boolean, default: true },
    notificaciones_sms: { type: Boolean, default: false },
    alertas_emergencia: { type: Boolean, default: true },
    alertas_medicamentos: { type: Boolean, default: true },
    alertas_citas: { type: Boolean, default: true },
    sonido_activado: { type: Boolean, default: true },
    vibracion_activada: { type: Boolean, default: true }
  },
  // Vinculaciones (puede haber 0-n)
  vinculaciones: {
    type: [VinculacionSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Usuario", userSchema);
