const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/session');
const checkRol = require('../middleware/rol');
const { getSolicitudId, getSolicitud, getSolicitudesPendientes, crearSolicitud, asignarTecnicoSolicitud, getSolicitudesAsignadas } = require("../controllers/solicitud");
const uploadMiddleware = require("../utils/handleStorage");


// http://localhost:3010/api/solicitud/
router.get("/", getSolicitud); 
router.post("/", authMiddleware, uploadMiddleware.single("foto"),  checkRol(['funcionario']), crearSolicitud); 

// http://localhost:3010/api/solicitud/pendientes
router.get("/pendientes", getSolicitudesPendientes); 


// http://localhost:3010/api/solicitud/asignadas
router.get("/asignadas",  authMiddleware, checkRol(['tecnico']), getSolicitudesAsignadas);  
router.get("/:id", getSolicitudId); 



// http://localhost:3010/api/solicitud/:id/asignarTecnico
router.put("/:id/asignarTecnico", asignarTecnicoSolicitud); 

module.exports = router;



// checkRol(['funcionario']),


