// Middleware global de manejo de errores

export const errorHandler = (err, req, res, next) => {
    console.error('Error capturado:', err);

    // Errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            msg: 'Error de validación',
            errors
        });
    }

    // Error de cast (ID inválido)
    if (err.name === 'CastError') {
        return res.status(400).json({
            msg: 'ID inválido',
            field: err.path
        });
    }

    // Error de duplicado (unique constraint)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            msg: `El ${field} ya está en uso`,
            field
        });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            msg: 'Token inválido'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            msg: 'Token expirado'
        });
    }

    // Error genérico del servidor
    res.status(err.status || 500).json({
        msg: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Middleware para rutas no encontradas
export const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    error.status = 404;
    next(error);
};
