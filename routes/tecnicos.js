const express = require("express");
const router = express.Router();
const { listaTecnicosPendientes, aprobarTecnico, denegarTecnico, listaTecnicosAprobados } = require("../controllers/tecnicos");
const uploadMiddleware = require("../utils/handleStorage");
const checkRol = require('../middleware/rol');
const authMiddleware = require('../middleware/session') 


// http://localhost:3010/api/tecnicos/

router.get("/tecnicosPendientes",authMiddleware, checkRol(['lider']),  listaTecnicosPendientes);
router.get("/tecnicosAprobados", authMiddleware, checkRol(['lider']), listaTecnicosAprobados);
router.put("/:id/aprobarTecnico",authMiddleware, checkRol(['lider']), aprobarTecnico);
router.put("/:id/denegarTecnico",authMiddleware, checkRol(['lider']), denegarTecnico);




module.exports = router;
