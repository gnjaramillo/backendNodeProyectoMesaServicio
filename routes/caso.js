const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../utils/handleStorage");
const { getCaso, getCasoId, postCaso, updateCaso, deleteCaso } = require("../controllers/caso");

router.get("/", getCaso);
router.get("/:id", getCasoId);
router.post("/", uploadMiddleware.single('evidencia'), postCaso);
router.put("/:id", uploadMiddleware.single('evidencia'), updateCaso); 
router.delete("/:id", deleteCaso);

module.exports = router;
