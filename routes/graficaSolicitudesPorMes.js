const express = require("express");
const { getSolicitudesPorMes } = require("../controllers/graficaSolicitudesPorMes");
const router = express.Router();



/* Ruta para obtener las solicitudes por mes:
http://localhost:3010/api/graficaSolicitudesPorMes


Ruta para obtener la grafica de las solicitudes por mes
http://localhost:3010/solicitudesPorMes.html */


router.get("/", getSolicitudesPorMes);

module.exports = router;