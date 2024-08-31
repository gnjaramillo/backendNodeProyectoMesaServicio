// routes/restablecerPassword.js

const express = require('express');
const router = express.Router();
const { resetPassword } = require('../controllers/restablecerPassword');
const { validatorPassword} = require("../validators/restablecerPassword");


// Ruta para restablecer la contraseña utilizando el token
router.post('/:token', validatorPassword, resetPassword);

module.exports = router;