const express = require("express");
const router = express.Router();
const { getUsuarios, updateUsuarios, deleteUsuarios, getUsuariosId } = require("../controllers/usuarios");
const uploadMiddleware = require("../utils/handleStorage");
const { validatorPostUsuarios, validatorUpdateUsuarios, validatorPostUsuariosId } = require("../validators/usuarios");

// Rutas para la manipulación de usuarios
router.get("/", getUsuarios);
router.get("/:id", validatorPostUsuariosId, getUsuariosId);
router.put("/:id", uploadMiddleware.single('foto'), validatorUpdateUsuarios, updateUsuarios);
router.delete("/:id", deleteUsuarios);

module.exports = router;

