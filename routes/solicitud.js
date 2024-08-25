const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/session');
const checkRol = require('../middleware/rol');
const { getSolicitudId, getSolicitud, getSolicitudesPendientes, crearSolicitud, asignarTecnicoSolicitud, updateSolicitud, deleteSolicitud } = require("../controllers/solicitud");
const uploadMiddleware = require("../utils/handleStorage");



// http://localhost:3010/api/solicitud/pendientes
router.get("/pendientes", getSolicitudesPendientes); 
router.get("/:id", getSolicitudId); 


// http://localhost:3010/api/solicitud/:id/asignarTecnico
router.put("/:id/asignarTecnico", asignarTecnicoSolicitud); 


// http://localhost:3010/api/solicitud/
router.get("/", getSolicitud); 
router.post("/", uploadMiddleware.single("foto"), authMiddleware, checkRol(['funcionario']), crearSolicitud); 
router.put("/:id", updateSolicitud); 
router.delete("/:id", deleteSolicitud);

module.exports = router;



// checkRol(['funcionario']),