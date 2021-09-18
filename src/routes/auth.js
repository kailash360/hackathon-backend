//all apis
const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/auth/signup.js")
const { login } = require("../controllers/auth/login.js")

router.post('/signup', signup)
router.post('/login', login)

module.exports = router