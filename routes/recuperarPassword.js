const express = require("express");
const router = express.Router();
const { forgotPassword } = require("../controllers/recuperarPassword");



// Ruta para solicitar restablecimiento de contraseña (se envia correo registrado para obtener url con token)


// http://localhost:3010/api/recuperarPassword/
router.post("/", forgotPassword);



module.exports = router;