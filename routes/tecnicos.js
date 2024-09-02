const express = require("express");
const router = express.Router();
const { listaTecnicosPendientes, aprobarTecnico, denegarTecnico, listaTecnicosAprobados } = require("../controllers/tecnicos");
const uploadMiddleware = require("../utils/handleStorage");
const checkRol = require('../middleware/rol');
const authMiddleware = require('../middleware/session') 

const { validatorUpdateUsuarios, validatorGetUsuariosId } = require("../validators/usuarios");

// http://localhost:3010/api/usuarios/

// Rutas específicas para técnicos
router.put("/:id/aprobarTecnico", aprobarTecnico);
router.put("/:id/denegarTecnico", denegarTecnico);
router.get("/tecnicosPendientes", listaTecnicosPendientes);
router.get("/tecnicosAprobados", listaTecnicosAprobados);

module.exports = router;



