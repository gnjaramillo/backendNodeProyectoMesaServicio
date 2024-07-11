const { validationResult } = require("express-validator");

const validateResults = (req, res, next) => {
    try {
        validationResult(req).throw(); // Lanza un error si hay resultados de validación
        return next(); // Continúa con el siguiente middleware
    } catch (error) {
        res.status(403).json({ message: "algo salió mal", errors: error.array() }); // Maneja el error de validación
    }
};

module.exports = validateResults;

