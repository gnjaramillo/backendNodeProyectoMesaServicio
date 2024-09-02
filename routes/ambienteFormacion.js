const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/session')
const checkRol = require('../middleware/rol')
const {getAmbiente, getAmbienteId, postAmbiente, updateAmbiente, deleteAmbiente } = require("../controllers/ambienteFormacion")



//http://localhost:3010/api/ambienteFormacion/

router.get("/", authMiddleware, checkRol(['lider']), getAmbiente);
router.get("/:id", authMiddleware, checkRol(['lider']), getAmbienteId);
router.post("/", authMiddleware, checkRol(['lider']), postAmbiente);
router.put("/:id", authMiddleware, checkRol(['lider']),  updateAmbiente);
router.delete("/:id", authMiddleware, checkRol(['lider']),  deleteAmbiente);

module.exports = router;



