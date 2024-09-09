const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/session');
const checkRol = require('../middleware/rol');
const { solucionCaso } = require("../controllers/solucionCaso");
const uploadMiddleware = require("../utils/handleStorage");



// http://localhost:3010/api/solucionCaso/:idSolicitud
router.post("/:id", authMiddleware,  checkRol(['tecnico']), uploadMiddleware.single('evidencia'),  solucionCaso); 


module.exports = router;
