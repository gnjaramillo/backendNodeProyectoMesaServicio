const express = require("express");
const router = express.Router();
const { validatorRegister, validatorLogin } = require("../validators/auth");
const uploadMiddleware = require("../utils/handleStorage");
const {registerCtrl, loginCtrl} = require("../controllers/auth")

const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3010";

// Ruta para registro
router.post("/register", uploadMiddleware.single("foto"), validatorRegister, registerCtrl)

// Ruta para loguear
router.post("/login", validatorLogin, loginCtrl)


module.exports = router;



//crear un registro http://localhost:3010/api/auth/login

/* req.file es donde Multer almacena la información del archivo subido.
req.body contiene los demás campos del formulario. */





