const express = require("express");
const router = express.Router();
// const authMiddleware = require('../middleware/session')
// const checkRol = require('../middleware/rol')
const {getAmbiente, getAmbienteId, postAmbiente, updateAmbiente, deleteAmbiente } = require("../controllers/ambienteFormacion")

router.get("/", getAmbiente);
router.get("/:id",    getAmbienteId);
router.post("/", postAmbiente);
router.put("/:id",  updateAmbiente);
router.delete("/:id",  deleteAmbiente);

module.exports = router;

// checkRol(['lider']),