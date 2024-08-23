const { check, body  } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorUpdateUsuarios = [
    // No permite edición de 'nombre', 'correo' y 'rol' eliminando sus validaciones
    check("telefono").optional().notEmpty().trim().escape().isNumeric().withMessage("El teléfono debe ser un número"),
    check("password").optional().isLength({ min: 6 }).notEmpty().trim().escape().withMessage("La contraseña debe tener al menos 6 caracteres"),
  
    (req, res, next) => {
        //  no se envíen `nombre`, `correo`, ni `rol`
        const camposDeshabilitados = ["nombre", "correo", "rol"];
        for (const campo of camposDeshabilitados) {
            if (req.body[campo]) {
                return res.status(400).send({ message: `No se permite actualizar el campo ${campo}` });
            }
        }
        validateResults(req, res, next); 
    }
];

const validatorGetUsuariosId = [
    check("id").isMongoId().exists().notEmpty().trim().escape().withMessage("El id es requerido"),
    (req, res, next) => {
        validateResults(req, res, next); 
    }
];



module.exports = { validatorUpdateUsuarios, validatorGetUsuariosId };


/* Las validaciones alidar y sanitizar los datos de las solicitudes HTTP. 
Estas validaciones se aplican antes de que los datos lleguen a tu base 
de datos o se procesen en tu controlador. */
