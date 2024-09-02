const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");


// Validaciones con express-validator
const validarSolicitud = [
    check('usuario')
        .notEmpty().withMessage('El campo usuario es obligatorio.')
        .isMongoId().withMessage('El ID del usuario no es válido.'),
    check('ambiente')
        .notEmpty().withMessage('El campo ambiente es obligatorio.')
        .isMongoId().withMessage('El ID del ambiente no es válido.'),
    check('descripcion')
        .notEmpty().withMessage('El campo descripción es obligatorio.')
        .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres.'),
    check('telefono')
        .notEmpty().withMessage('El campo teléfono es obligatorio.')
        .isMobilePhone().withMessage('Debe ser un número de teléfono válido.'),
    // Puedes agregar más validaciones según los requisitos de los campos
];

module.exports = { validarSolicitud};
