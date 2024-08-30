const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorPassword = [
    check("password")
        .exists().isLength({ min: 6 }).notEmpty().trim().escape().withMessage("La contraseña debe tener al menos 6 caracteres")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/).withMessage("La contraseña debe tener una longitud mínima de 6 caracteres y contener al menos una letra y un número"),
    (req, res, next) => {
        validateResults(req, res, next); // Usa validateResults como middleware de validación
    }
];

module.exports = { validatorPassword };
