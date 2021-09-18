const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    experience: { type: Number, required: true },
    fees: { type: Number, required: true },
    rating: { type: Number, required: true },
    totalRatings: { type: Number, required: true },
    specialization: { type: String, required: true },
    pastAppointments: [{
        patientId: { type: String },
        date: { type: Date },
        time: { type: Date },
        remarks: { type: String }
    }],
    futureAppointments: [{
        patientId: { type: String },
        date: { type: Date },
        time: { type: Date },
        remarks: { type: String }
    }],
    nextAppointment: {
        patientId: { type: String },
        date: { type: Date },
        time: { type: Date },
        remarks: { type: String }
    }
});

const doctors = new model("doctor", doctorSchema);

module.exports = doctors;