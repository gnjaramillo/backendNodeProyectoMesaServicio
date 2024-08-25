const express = require("express");
const router = express.Router();
const { getUsuarios, getUsuariosId, updateUsuarios, deleteUsuarios,  listaTecnicosPendientes, aprobarTecnico, denegarTecnico, listaTecnicosAprobados } = require("../controllers/usuarios");
const uploadMiddleware = require("../utils/handleStorage");
// const authMiddleware = require('../middleware/session') 

const { validatorUpdateUsuarios, validatorGetUsuariosId } = require("../validators/usuarios");

// http://localhost:3010/api/usuarios/

// Rutas específicas para técnicos
router.put("/:id/aprobarTecnico", aprobarTecnico);
router.put("/:id/denegarTecnico", denegarTecnico);
router.get("/tecnicosPendientes", listaTecnicosPendientes);
router.get("/tecnicosAprobados", listaTecnicosAprobados);

// Rutas generales de usuarios
router.get("/", getUsuarios);
router.get("/:id", validatorGetUsuariosId, getUsuariosId);
router.put("/:id", uploadMiddleware.single('foto'), validatorUpdateUsuarios, updateUsuarios);
router.delete("/:id", validatorGetUsuariosId, deleteUsuarios);

module.exports = router;

/* El orden de tus rutas debe reflejar la 
especificidad de los endpoints, colocando las rutas más
 específicas antes de las más generales para evitar conflictos. */