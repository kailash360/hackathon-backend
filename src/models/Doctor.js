const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const bcrypt = require("bcrypt");

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
  rating: { type: mongoose.Types.Decimal128, required: true },
  totalRatings: { type: Number, required: true },
  specialization: { type: String, required: true },
  slot: [],
  pastAppointments: [
    {
      appointementId: { type: String },
      patientId: { type: String },
      date: { type: Number },
      remarks: { type: String },
      patientDetails: {
        patientname: {
          type: String,
        },
        patientemail: { type: String },
        patientcontact: { type: String },
        patientage: { type: Number },
      },
    },
  ],
  futureAppointments: [
    {
      appointementId: { type: String },
      patientId: { type: String },
      date: { type: Number },
      remarks: { type: String },
      url: { type: String },
      patientDetails: {
        patientname: {
          type: String,
        },
        patientemail: { type: String },
        patientcontact: { type: String },
        patientage: { type: Number },
      },
    },
  ],
  nextAppointment: {
    appointementId: { type: String },
    patientId: { type: String },
    date: { type: Number },
    remarks: { type: String },
    url: { type: String },
    patientDetails: {
      patientname: {
        type: String,
      },
      patientemail: { type: String },
      patientcontact: { type: String },
      patientage: { type: Number },
    },
  },
  requests: [
    {
      requestId: { type: String },
      patientId: { type: String },
      date: { type: Number },
      remarks: { type: String },
      patientDetails: {
        patientname: {
          type: String,
        },
        patientemail: { type: String },
        patientcontact: { type: String },
        patientage: { type: Number },
      },
    },
  ],
});

doctorSchema.methods.comparePassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return next(err);
    next(null, isMatch);
  });
};
module.exports = mongoose.model("doctor", doctorSchema);
