const express = require("express");
const router = express.Router();
const checkRol = require('../middleware/rol');
const authMiddleware = require('../middleware/session') 

const { getTipoCaso, getTipoCasoId, postTipoCaso,updateTipoCaso, deleteTipoCaso} = require("../controllers/tipoCaso");

router.get("/", authMiddleware, checkRol(['lider', 'tecnico']), getTipoCaso);
router.get("/:id", authMiddleware, checkRol(['lider']), getTipoCasoId);
router.post("/", authMiddleware, checkRol(['lider']), postTipoCaso);
router.put("/:id",authMiddleware, checkRol(['lider']),  updateTipoCaso);
router.delete("/:id", authMiddleware, checkRol(['lider']),  deleteTipoCaso);

module.exports = router;
