const express = require("express");
const userControl = require("../controls/userControl");
const authHandler = require("../handlers/authHandling");
const router = express.Router();

router.get("/", authHandler, (req, res) => {
  res.json({ msg: "hi you passed the login" });
});
router.post("/login", userControl.login);
router.post("/", userControl.registerUser);

module.exports = router;
