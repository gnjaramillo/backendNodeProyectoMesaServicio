const express = require("express");
const router = express.Router();
const {getSolicitud,  crearSolicitud, updateSolicitud, deleteSolicitud, getSolicitudId} = require("../controllers/solicitud")
const uploadMiddleware = require("../utils/handleStorage");




router.get("/", getSolicitud);
router.get("/:id", getSolicitudId);
router.post("/",  uploadMiddleware.single("foto"), crearSolicitud);
router.put("/:id", updateSolicitud);
router.delete("/:id", deleteSolicitud);

module.exports = router;