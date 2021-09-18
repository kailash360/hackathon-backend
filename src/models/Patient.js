const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pastAppointments: [{
        doctorId: { type: String },
        date: { type: Date },
        time: { type: Date },
        remarks: { type: String }
    }],
    futureAppointments: [{
        doctorId: { type: String },
        date: { type: Date },
        time: { type: Date },
        remarks: { type: String }
    }],
    nextAppointment: {
        doctorId: { type: String },
        date: { type: Date },
        time: { type: Date },
        remarks: { type: String }
    }
});

const patients = new model("patient", patientSchema);

module.exports = patients;