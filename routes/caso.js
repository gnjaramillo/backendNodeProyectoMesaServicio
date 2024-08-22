const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../utils/handleStorage");
// const authMiddleware = require('../middleware/session')
const { getCaso, getCasoId, postCaso, updateCaso, deleteCaso, getCasosPendientes } = require("../controllers/caso");


// http://localhost:3010/api/caso/

router.get("/pendientes",  getCasosPendientes);
router.get("/:id",  getCasoId);
router.get("/", getCaso);
router.post("/", uploadMiddleware.single('evidencia'),  postCaso);
router.put("/:id", uploadMiddleware.single('evidencia'),  updateCaso); 
router.delete("/:id",  deleteCaso);

module.exports = router;
