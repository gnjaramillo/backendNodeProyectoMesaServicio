const express = require("express");
const router = express.Router();
// const authMiddleware = require('../middleware/session')
const checkRol = require('../middleware/rol')
const {getSolicitud,  crearSolicitud, updateSolicitud, deleteSolicitud, getSolicitudId} = require("../controllers/solicitud")
const uploadMiddleware = require("../utils/handleStorage");




router.get("/",  getSolicitud);
router.get("/:id",   getSolicitudId);
router.post("/",  uploadMiddleware.single("foto"),  checkRol(['funcionario']),  crearSolicitud);
router.put("/:id",  updateSolicitud);
router.delete("/:id",   deleteSolicitud);

module.exports = router;