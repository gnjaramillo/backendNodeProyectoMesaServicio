const express = require("express");
const router = express.Router();
// const authMiddleware = require('../middleware/session')

const { getTipoCaso, getTipoCasoId, postTipoCaso,updateTipoCaso, deleteTipoCaso} = require("../controllers/tipoCaso");

router.get("/",  getTipoCaso);
router.get("/:id",  getTipoCasoId);
router.post("/",  postTipoCaso);
router.put("/:id",  updateTipoCaso);
router.delete("/:id",   deleteTipoCaso);

module.exports = router;
