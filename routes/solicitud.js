const express = require("express");
const router = express.Router();
const {getSolicitud, postSolicitud, updateSolicitud, deleteSolicitud, getSolicitudId} = require("../controllers/solicitud")

router.get("/", getSolicitud);
router.get("/:id", getSolicitudId);
router.post("/", postSolicitud);
router.put("/:id", updateSolicitud);
router.delete("/:id", deleteSolicitud);

module.exports = router;