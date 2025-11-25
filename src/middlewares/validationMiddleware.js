// Middleware de validación para campos comunes

export const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

export const validateObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

export const validateRequired = (fields, body) => {
    const missing = [];
    for (const field of fields) {
        if (!body[field]) {
            missing.push(field);
        }
    }
    return missing;
};

// Middleware para validar actividad
export const validateActividad = (req, res, next) => {
    const { pacienteId, tipo, titulo } = req.body;

    const missing = validateRequired(['pacienteId', 'tipo', 'titulo'], req.body);
    if (missing.length > 0) {
        return res.status(400).json({
            msg: "Faltan campos obligatorios",
            campos: missing
        });
    }

    if (!validateObjectId(pacienteId)) {
        return res.status(400).json({ msg: "ID de paciente inválido" });
    }

    const tiposValidos = ['medicamento', 'cita', 'revision', 'otro'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            msg: "Tipo de actividad inválido",
            tiposValidos
        });
    }

    next();
};

// Middleware para validar emergencia
export const validateEmergencia = (req, res, next) => {
    const { descripcion, ubicacion } = req.body;

    const missing = validateRequired(['descripcion', 'ubicacion'], req.body);
    if (missing.length > 0) {
        return res.status(400).json({
            msg: "Faltan campos obligatorios",
            campos: missing
        });
    }

    next();
};

// Middleware para validar vinculación
export const validateVinculacion = (req, res, next) => {
    const { codigo_adulto_mayor, tipo_relacion } = req.body;

    const missing = validateRequired(['codigo_adulto_mayor', 'tipo_relacion'], req.body);
    if (missing.length > 0) {
        return res.status(400).json({
            msg: "Faltan campos obligatorios",
            campos: missing
        });
    }

    next();
};

// Middleware para validar contacto
export const validateContacto = (req, res, next) => {
    const { usuario_mayor, usuario_cuidador } = req.body;

    const missing = validateRequired(['usuario_mayor', 'usuario_cuidador'], req.body);
    if (missing.length > 0) {
        return res.status(400).json({
            msg: "Faltan campos obligatorios",
            campos: missing
        });
    }

    if (!validateObjectId(usuario_mayor) || !validateObjectId(usuario_cuidador)) {
        return res.status(400).json({ msg: "IDs de usuario inválidos" });
    }

    next();
};
