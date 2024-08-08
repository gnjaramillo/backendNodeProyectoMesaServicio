// routes/storage.js

const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../utils/handleStorage");
const { createStorage } = require("../controllers/storage");

router.post("/", uploadMiddleware.single('archivo'), createStorage);

module.exports = router;

/* http://localhost:3010/api/storage en esta ruta puedo probar el envio del archivo en postman
pero para verlo, la url es http://localhost:3010/nameFile configurado en el controlador */

// single es para un archivo
// Ruta para guardar archivos de storage



