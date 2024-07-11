const express = require("express");
const router = express.Router();
const {getRegional, postRegional, updateRegional, deleteRegional, getRegionalId} = require("../controllers/regional")

router.get("/", getRegional);
router.get("/:id", getRegionalId);
router.post("/", postRegional);
router.put("/:id", updateRegional);
router.delete("/:id", deleteRegional);

module.exports = router;