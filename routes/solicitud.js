const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/session');
const checkRol = require('../middleware/rol');
const { getSolicitudId, getSolicitud, getSolicitudesPendientes, crearSolicitud, asignarTecnicoSolicitud, getSolicitudesAsignadas } = require("../controllers/solicitud");
const uploadMiddleware = require("../utils/handleStorage");
const { validarSolicitud } = require("../validators/solicitud");




router.get("/", getSolicitud); 
router.get("/:id", getSolicitudId); 


// http://localhost:3010/api/solicitud/   (funcionario)
router.post("/", authMiddleware, uploadMiddleware.single("foto"),  checkRol(['funcionario']), validarSolicitud, crearSolicitud); 


// http://localhost:3010/api/solicitud/pendientes  (lider)
router.get("/pendientes", authMiddleware,  checkRol(['lider']), getSolicitudesPendientes); 



// http://localhost:3010/api/solicitud/asignadas  (tecnico)
router.get("/asignadas",  authMiddleware, checkRol(['tecnico']), getSolicitudesAsignadas);  



// http://localhost:3010/api/solicitud/:idSolicitud/asignarTecnico    (lider)
router.put("/:id/asignarTecnico", authMiddleware,  checkRol(['lider']), asignarTecnicoSolicitud); 



module.exports = router;





