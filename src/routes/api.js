//all apis
const express = require("express");
const router = express.Router();
const { doctors } = require("../controllers/api/doctors.js")

router.get('/doctors', doctors)

module.exports = router