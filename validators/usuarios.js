const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");


const validatorPostUsuarios = [
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

        // .matches(/@soy\.sena\.edu\.co$/).withMessage("El correo debe pertenecer al dominio sena.edu.co"),
    check("rol").exists().notEmpty().trim().escape().isIn( ['Funcionario', 'Lider TIC', 'Tecnico']).withMessage("El rol no es válido"),
    check("telefono").exists().notEmpty().trim().escape().isNumeric().withMessage("El teléfono debe ser un número"),
    check("password").exists().isLength({ min: 6 }).notEmpty().trim().escape().withMessage("La contraseña debe tener al menos 6 caracteres"),
    check("aprobado").optional().isBoolean().withMessage("El estado de aprobación debe ser un valor booleano"),
    (req, res, next) => {
        validateResults(req, res, next); // Usa validateResults como middleware de validación
    }
];

const validatorUpdateUsuarios = [
    check("nombre").optional().notEmpty().trim().escape().withMessage("El nombre es requerido"),
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
    check("rol").exists().notEmpty().trim().escape().isIn( ['Funcionario', 'Lider TIC', 'Tecnico']).withMessage("El rol no es válido"),
    check("telefono").optional().notEmpty().trim().escape().isNumeric().withMessage("El teléfono debe ser un número"),
    check("password").optional().isLength({ min: 6 }).notEmpty().trim().escape().withMessage("La contraseña debe tener al menos 6 caracteres"),
    check("aprobado").optional().isBoolean().withMessage("El estado de aprobación debe ser un valor booleano"),
    (req, res, next) => {
        validateResults(req, res, next); 
    }
];


const validatorPostUsuariosId = [
    check("id").isMongoId().exists().notEmpty().trim().escape().withMessage("El id es requerido"),
    (req, res, next) => {
        validateResults(req, res, next); 
    }
];

module.exports = { validatorPostUsuarios, validatorUpdateUsuarios, validatorPostUsuariosId };

/* Las validaciones alidar y sanitizar los datos de las solicitudes HTTP. 
Estas validaciones se aplican antes de que los datos lleguen a tu base 
de datos o se procesen en tu controlador. */
