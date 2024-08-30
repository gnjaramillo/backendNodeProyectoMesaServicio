const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/session');
const checkRol = require('../middleware/rol');
const { getSolicitudId, getSolicitud, getSolicitudesPendientes, crearSolicitud, asignarTecnicoSolicitud, getSolicitudesAsignadas, solucionSolicitud } = require("../controllers/solicitud");
const uploadMiddleware = require("../utils/handleStorage");


// http://localhost:3010/api/solicitud/
router.get("/", getSolicitud); 
router.post("/", authMiddleware, uploadMiddleware.single("foto"),  checkRol(['funcionario']), crearSolicitud); 

// http://localhost:3010/api/solicitud/pendientes
router.get("/pendientes", getSolicitudesPendientes); 
router.get("/asignadas",  authMiddleware, checkRol(['tecnico']), getSolicitudesAsignadas);  
router.post("/:id/solucion", authMiddleware,  uploadMiddleware.single('evidencia'), checkRol(['tecnico']), solucionSolicitud); 

router.get("/:id", getSolicitudId); 

// http://localhost:3010/api/solicitud/:id/asignarTecnico
router.put("/:id/asignarTecnico", asignarTecnicoSolicitud); 

module.exports = router;



// checkRol(['funcionario']),


