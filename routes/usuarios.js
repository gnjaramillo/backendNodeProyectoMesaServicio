const express = require("express");
const router = express.Router();
const { getUsuarios, updateUsuarios, deleteUsuarios, getUsuariosId, listaTecnicosFalse, aprobarTecnico } = require("../controllers/usuarios");
const uploadMiddleware = require("../utils/handleStorage");
const { validatorPostUsuarios, validatorUpdateUsuarios, validatorPostUsuariosId } = require("../validators/usuarios");

// http://localhost:3010/api/usuarios/

router.put("/:id/aprobarTecnico", aprobarTecnico);
router.get("/tecnicosFalse", listaTecnicosFalse);
router.get("/", getUsuarios);
router.get("/:id", validatorPostUsuariosId, getUsuariosId);
router.put("/:id", uploadMiddleware.single('foto'), validatorUpdateUsuarios, updateUsuarios);
router.delete("/:id", deleteUsuarios);

module.exports = router;

/* l orden de tus rutas en el archivo de rutas refleje la 
especificidad de los endpoints, colocando las rutas más
 específicas antes de las más generales para evitar conflictos. */