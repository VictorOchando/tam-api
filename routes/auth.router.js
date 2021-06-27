const router = require("express").Router();
var { login, register } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
