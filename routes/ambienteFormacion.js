const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/session')
const checkRol = require('../middleware/rol')
const {getAmbiente, getAmbienteId, postAmbiente, updateAmbiente, inactivarAmbiente } = require("../controllers/ambienteFormacion")



//http://localhost:3010/api/ambienteFormacion/

router.get("/", authMiddleware, checkRol(['lider', 'funcionario']),  getAmbiente);
router.get("/:id", authMiddleware, checkRol(['lider', 'funcionario']),  getAmbienteId);
router.post("/", authMiddleware, checkRol(['lider']), postAmbiente);
router.put("/:id", authMiddleware, checkRol(['lider']),  updateAmbiente);
router.put("/:id", authMiddleware, checkRol(['lider']),  inactivarAmbiente);

module.exports = router;



