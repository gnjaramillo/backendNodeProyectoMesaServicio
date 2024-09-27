const express = require("express");
const router = express.Router();
const { getUsuarios, getUsuariosId, getPerfilUsuario, updateUsuarios, inactivarUsuarios, usuariosInactivos, reactivarUsuarios, usuariosActivos } = require("../controllers/usuarios");
const uploadMiddleware = require("../utils/handleStorage");
const checkRol = require('../middleware/rol');
const authMiddleware = require('../middleware/session') 

const { validatorUpdateUsuarios, validatorUsuariosId } = require("../validators/usuarios");

// http://localhost:3010/api/usuarios/
// http://localhost:3010/api/usuarios/perfil
// http://localhost:3010/api/usuarios/inactivos
// http://localhost:3010/api/usuarios/:idUsuario/inactivar
// http://localhost:3010/api/usuarios/:idUsuario/reactivar


router.get("/", getUsuarios);
router.get("/perfil", authMiddleware, checkRol(['lider', 'tecnico', 'funcionario']), getPerfilUsuario);
router.put("/perfil", authMiddleware, checkRol(['lider', 'tecnico', 'funcionario']), uploadMiddleware.single('foto'),  validatorUpdateUsuarios,  updateUsuarios);
router.get("/activos", authMiddleware, checkRol(['lider']),  usuariosActivos);
router.get("/inactivos", authMiddleware, checkRol(['lider']),  usuariosInactivos);
router.get("/:id", validatorUsuariosId, getUsuariosId);
router.put("/:id/inactivar", authMiddleware, checkRol(['lider']), validatorUsuariosId, inactivarUsuarios);
router.put("/:id/reactivar", authMiddleware, checkRol(['lider']), validatorUsuariosId, reactivarUsuarios);

module.exports = router;

/* El orden de tus rutas debe reflejar la 
especificidad de los endpoints, colocando las rutas más
 específicas antes de las más generales para evitar conflictos. */