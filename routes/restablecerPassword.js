// routes/restablecerPassword.js

const express = require('express');
const router = express.Router();
const { resetPassword } = require('../controllers/restablecerPassword');

// Ruta para restablecer la contraseña utilizando el token
router.post('/:token', resetPassword);

module.exports = router;