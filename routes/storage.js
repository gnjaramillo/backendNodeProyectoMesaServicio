const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../utils/handleStorage");
const {createStorage} = require("../controllers/storage");


/* http://localhost:3010/api/storage en esta ruta puedo probar el envio del archivo en postman
pero para verlo, la url es http://localhost:3010/nameFile configurado en el controlador */

// single es para un archivo
// Ruta para guardar archivos de storage

router.post("/", uploadMiddleware.single("myFile"), createStorage)



module.exports = router;



