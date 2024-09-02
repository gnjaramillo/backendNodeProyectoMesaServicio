const express = require('express');
const router = express.Router();
const { resetPassword } = require('../controllers/restablecerPassword');
const { validatorPassword} = require("../validators/restablecerPassword");



// http://localhost:3010/api/restablecerPassword/:token   (la ruta debe llegar al correo)
router.post('/:token', validatorPassword, resetPassword);



module.exports = router;


// Ruta para restablecer la contraseña utilizando el token 