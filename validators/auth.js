const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorRegister = [
    check("nombre").exists().notEmpty().trim().escape().withMessage("El nombre es requerido"),
    check("correo")
        .exists().notEmpty().isEmail().normalizeEmail().withMessage("El correo electrónico no es válido")
        .custom(value => {
            // Verificar que el correo electrónico tenga el formato correcto
            const atSymbolIndex = value.indexOf('@');
            if (atSymbolIndex === -1 || atSymbolIndex === 0 || atSymbolIndex === value.length - 1) {
                throw new Error('El correo electrónico debe contener un símbolo @ y un dominio válido.');
            }
            return true;
        }),
        
        //.matches(/@soy\.sena\.edu\.co$/).withMessage("El correo debe pertenecer al dominio sena.edu.co"),
    check("rol").exists().notEmpty().trim().escape().isIn(['funcionario', 'lider', 'tecnico']).withMessage("El rol no es válido"),
    check("telefono").exists().notEmpty().trim().escape().isNumeric().withMessage("El teléfono debe ser un número"),
    check("password")
        .exists().isLength({ min: 6 }).notEmpty().trim().escape().withMessage("La contraseña debe tener al menos 6 caracteres")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/).withMessage("La contraseña debe tener una longitud mínima de 6 caracteres y contener al menos una letra y un número"),
    (req, res, next) => {
        validateResults(req, res, next); // Usa validateResults como middleware de validación
    }
];

const validatorLogin = [
    check("password")
        .exists().isLength({ min: 6 }).notEmpty().trim().escape().withMessage("La contraseña es requerida")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/).withMessage("La contraseña debe tener una longitud mínima de 6 caracteres y contener al menos una letra y un número"),
    check("correo").exists().notEmpty().isEmail().normalizeEmail().withMessage("El correo electrónico no es válido"),
    (req, res, next) => {
        validateResults(req, res, next);
    }
];



module.exports = { validatorRegister, validatorLogin };
