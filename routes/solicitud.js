const express = require("express");
const router = express.Router();
// const authMiddleware = require('../middleware/session')
// const checkRol = require('../middleware/rol')
const {getSolicitud, getSolicitudesPendientes, crearSolicitud, updateSolicitud, deleteSolicitud, getSolicitudId} = require("../controllers/solicitud")
const uploadMiddleware = require("../utils/handleStorage");




router.get("/",  getSolicitud);
router.get("/:id",   getSolicitudId);
router.get("/:id",   getSolicitudesPendientes);
router.post("/",  uploadMiddleware.single("foto"),  crearSolicitud);
router.put("/:id",  updateSolicitud);
router.delete("/:id",   deleteSolicitud);

module.exports = router;

// checkRol(['funcionario']),