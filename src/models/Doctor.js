const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    experience: { type: Number, required: true },
    fees: { type: Number, required: true },
    rating: { type: Number, required: true },
    pastAppointments: [{
        patientId: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: Date, required: true },
        remarks: { type: String }
    }],
    futureAppointments: [{
        patientId: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: Date, required: true },
        remarks: { type: String }
    }],
    nextAppointment: {
        patientId: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: Date, required: true },
        remarks: { type: String }
    }
});

const doctors = new model("doctor", doctorSchema);

module.exports = doctors;