const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/session');
const checkRol = require('../middleware/rol');
const { solucionCaso } = require("../controllers/solucionCaso");
const uploadMiddleware = require("../utils/handleStorage");



// http://localhost:3010/api/:idSolicitud/solucion
router.post("/:id/solucion", authMiddleware,  uploadMiddleware.single('evidencia'), checkRol(['tecnico']), solucionCaso); 


module.exports = router;
