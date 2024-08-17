// routes/storage.js

const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../utils/handleStorage");
const { createStorage, getStorage, getStorageId, deleteStorage, updateStorage  } = require("../controllers/storage");

router.get("/",  getStorage);
router.get("/:id", getStorageId);
router.post("/", uploadMiddleware.single('archivo'), createStorage);
router.put("/:id", uploadMiddleware.single('archivo'), updateStorage);
router.delete("/:id",  deleteStorage);




module.exports = router;

/* http://localhost:3010/api/storage en esta ruta puedo probar el envio del archivo en postman
pero para verlo, la url es http://localhost:3010/nameFile configurado en el controlador */

// single es para un archivo
// Ruta para guardar archivos de storage



