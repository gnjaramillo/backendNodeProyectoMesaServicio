const express = require("express");
const router = express.Router();
const { getSolicitudesPorAmbientes } = require("../controllers/graficaSolicitudesPorAmbiente"); 
const authMiddleware = require('../middleware/session')
const checkRol = require('../middleware/rol')



/*  Ruta para obtener las solicitudes por ambiente
 http://localhost:3010/api/graficaSolicitudesPorAmbiente 


 Ruta para obtener la grafica
 http://localhost:3010/solicitudesPorAmbiente.html  */
 

router.get("/", authMiddleware, checkRol(['lider']), getSolicitudesPorAmbientes); 

module.exports = router;