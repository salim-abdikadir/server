const express = require("express");
const authHandler = require("../handlers/authHandling");
const memberControls = require("../controls/membersControl");
const router = express.Router();

router.get("/", memberControls.getAll);
router.get("/:id", memberControls.getById);
router.post("/", memberControls.post);
router.delete("/:id", memberControls.delete);
router.put("/:id", memberControls.patch);

module.exports = router;
