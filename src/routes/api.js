//all apis
const express = require("express");
const router = express.Router();
const { doctors } = require("../controllers/api/doctors.js")
const { requestAppointment, confirmAppointmentRequest, cancelAppointmentRequest } = require("../controllers/api/appointments.js")

//All api for doctors
router.get('/doctors', doctors)

//all apis for appointments
router.post('/requestAppointment', requestAppointment)
router.post('/confirmAppointmentRequest', confirmAppointmentRequest)
router.post('/cancelAppointmentRequest', cancelAppointmentRequest)

module.exports = router