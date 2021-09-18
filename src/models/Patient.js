const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    pastAppointments: [{
        doctorId: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: Date, required: true },
        remarks: { type: String }
    }],
    futureAppointments: [{
        doctorId: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: Date, required: true },
        remarks: { type: String }
    }],
    nextAppointment: {
        doctorId: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: Date, required: true },
        remarks: { type: String }
    }
});

const patients = new model("patient", patientSchema);

module.exports = patients;