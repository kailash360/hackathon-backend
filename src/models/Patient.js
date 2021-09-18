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
        appointementId: { type: String },
        doctorId: { type: String },
        date: { type: Date },
        time: { type: Date },
        remarks: { type: String },
        attended: { type: Boolean }
    }],
    futureAppointments: [{
        appointementId: { type: String },
        doctorId: { type: String },
        date: { type: Date },
        remarks: { type: String },
        url: { type: String },
    }],
    nextAppointment: {
        appointementId: { type: String },
        doctorId: { type: String },
        date: { type: Date },
        remarks: { type: String },
        url: { type: String },
    },
    requests: [{
        requestId: { type: String },
        doctorId: { type: String },
        date: { type: Date },
        remarks: { type: String },
        confirmed: { type: String },
        comments: { type: String }
    }]
});

const patients = new model("patient", patientSchema);

module.exports = patients;