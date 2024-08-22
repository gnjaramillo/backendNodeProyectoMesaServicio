const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword } = require("../controllers/recuperarPassword");

// Ruta para solicitar restablecimiento de contraseña (envío de correo con token)
router.post("/", forgotPassword);

// Ruta para restablecer la contraseña con el token
router.post("/:token", resetPassword);

module.exports = router;