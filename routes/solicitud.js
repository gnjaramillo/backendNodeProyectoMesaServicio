const express = require("express");
const router = express.Router();
const {getSolicitud,  crearSolicitud, updateSolicitud, deleteSolicitud, getSolicitudId} = require("../controllers/solicitud")

router.get("/", getSolicitud);
router.get("/:id", getSolicitudId);
router.post("/", crearSolicitud);
router.put("/:id", updateSolicitud);
router.delete("/:id", deleteSolicitud);

module.exports = router;