//all apis
const express = require("express");
const router = express.Router();
const { doctors } = require("../controllers/api/doctors.js")
const { requestAppointment } = require("../controllers/api/appointments.js")

//All api for doctors
router.get('/doctors', doctors)

//all apis for appointments
router.post('/requestAppointment', requestAppointment)


module.exports = router