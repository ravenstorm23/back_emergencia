import mongoose from "mongoose";

const vinculacionSchema = new mongoose.Schema({
  cuidadorId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  codigo_adulto_mayor: { type: String, required: true },
  tipo_relacion: { type: String, required: true },
  es_contacto_principal: { type: Boolean, default: false },
  puede_ver_ubicacion: { type: Boolean, default: true },
  puede_recibir_alertas: { type: Boolean, default: true },
  puede_gestionar_medicamentos: { type: Boolean, default: false },
  notas: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Vinculacion", vinculacionSchema);
