const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/session');
const checkRol = require('../middleware/rol');
const { 
    getSolicitudId, 
    getSolicitud, 
    getHistorialSolicitud,
    getSolicitudesPendientes, 
    crearSolicitud, 
    historialSolicitudesCreadas,
    asignarTecnicoSolicitud, 
    getSolicitudesAsignadas, 
    getSolicitudesFinalizadas,
    deleteSolicitud 
} = require("../controllers/solicitud");
const uploadMiddleware = require("../utils/handleStorage");
const { validarSolicitud } = require("../validators/solicitud");




// http://localhost:3010/api/solicitud/  ver solicitudes 
router.get("/", getSolicitud); 

// http://localhost:3010/api/solicitud/historialSolicitudes  (lider) historial solicitudes
router.get("/historialSolicitudes", authMiddleware, checkRol(['lider']), getHistorialSolicitud); 

// http://localhost:3010/api/solicitud/pendientes (lider) solicitudes para ser asignadas
router.get("/pendientes", authMiddleware, checkRol(['lider']), getSolicitudesPendientes); 

// http://localhost:3010/api/solicitud/asignadas (técnico) solicitudes asignadas a tecnico
router.get("/asignadas", authMiddleware, checkRol(['tecnico']), getSolicitudesAsignadas);

// http://localhost:3010/api/solicitud/finalizadas (técnico) solicitudes finalizadas por el tecnico
router.get("/finalizadas", authMiddleware, checkRol(['tecnico']), getSolicitudesFinalizadas);

// http://localhost:3010/api/solicitud/historial (funcionario) historial de las solicitudes creadas
router.get("/historial", authMiddleware,  checkRol(['funcionario']),  historialSolicitudesCreadas);

// http://localhost:3010/api/solicitud/ (funcionario)  Ruta para crear las solicitudes
router.post("/", authMiddleware,  checkRol(['funcionario']), uploadMiddleware.single("foto"), validarSolicitud, crearSolicitud);
router.get("/:id", getSolicitudId); 
router.delete("/:id", deleteSolicitud); 

// http://localhost:3010/api/:idSolicitud/asignarTecnico (lider)
router.put("/:id/asignarTecnico", authMiddleware, checkRol(['lider']), asignarTecnicoSolicitud); 

module.exports = router;




