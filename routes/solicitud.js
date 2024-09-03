const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/session');
const checkRol = require('../middleware/rol');
const { 
    getSolicitudId, 
    getSolicitud, 
    getSolicitudesPendientes, 
    crearSolicitud, 
    asignarTecnicoSolicitud, 
    getSolicitudesAsignadas, 
    deleteSolicitud 
} = require("../controllers/solicitud");
const uploadMiddleware = require("../utils/handleStorage");
const { validarSolicitud } = require("../validators/solicitud");



// Ruta para obtener todas las solicitudes
router.get("/", getSolicitud); 

// http://localhost:3010/api/solicitud/pendientes (lider)
router.get("/pendientes", authMiddleware, checkRol(['lider']), getSolicitudesPendientes); 

// http://localhost:3010/api/solicitud/asignadas (técnico)
router.get("/asignadas", authMiddleware, checkRol(['tecnico']), getSolicitudesAsignadas);

// http://localhost:3010/api/solicitud/
router.post("/", authMiddleware, uploadMiddleware.single("foto"), checkRol(['funcionario']), validarSolicitud, crearSolicitud);
router.get("/:id", getSolicitudId); 
router.delete("/:id", deleteSolicitud); 

// http://localhost:3010/api/:idSolicitud/asignarTecnico (lider)
router.put("/:id/asignarTecnico", authMiddleware, checkRol(['lider']), asignarTecnicoSolicitud); 

module.exports = router;
