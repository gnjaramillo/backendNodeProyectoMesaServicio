const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorRegister = [
    check("nombre").exists().notEmpty().trim().escape().withMessage("El nombre es requerido"),
    check("correo")
        .exists().notEmpty().isEmail().normalizeEmail().withMessage("El correo electrónico no es válido")
        .matches(/@sena\.edu\.co$/).withMessage("El correo debe pertenecer al dominio sena.edu.co"),
    check("rol").exists().notEmpty().trim().escape().isIn( ['Funcionario', 'Lider TIC', 'Tecnico']).withMessage("El rol no es válido"),
    check("telefono").exists().notEmpty().trim().escape().isNumeric().withMessage("El teléfono debe ser un número"),
    check("password").exists().isLength({ min: 6 }).notEmpty().trim().escape().withMessage("La contraseña debe tener al menos 6 caracteres"),
    (req, res, next) => {
        validateResults(req, res, next); // Usa validateResults como middleware de validación
    }
];

const validatorLogin = [
    check("password").exists().isLength({ min: 6 }).notEmpty().trim().escape().withMessage("La contraseña es requerida"),
    check("correo").exists().notEmpty().isEmail().normalizeEmail().withMessage("El correo electrónico no es válido"),
    (req, res, next) => {
        validateResults(req, res, next);
    }
];


const validateId = [
    check('id').isMongoId().withMessage('ID de usuario no válido'),
    (req, res, next) => {
        validateResults(req, res, next);
    }
];

module.exports = { validatorRegister, validatorLogin, validateId };
