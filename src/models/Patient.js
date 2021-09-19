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
  pastAppointments: [
    {
      appointementId: { type: String },
      doctorId: { type: String },
      date: { type: Number },
      remarks: { type: String },
      attended: { type: Boolean },
      doctorDetails: {
        doctorname: {
          type: String,
        },
        doctoremail: { type: String },
        doctorcontact: { type: String },
        doctorexperience: { type: Number },
        doctorfees: { type: Number },
        doctorspecialization: { type: String },
      },
    },
  ],
  cancelledAppointments: [
    {
      appointementId: { type: String },
      doctorId: { type: String },
      date: { type: Number },
      remarks: { type: String },
      comment: { type: String },
      attended: { type: Boolean },
      doctorDetails: {
        doctorname: {
          type: String,
        },
        doctoremail: { type: String },
        doctorcontact: { type: String },
        doctorexperience: { type: Number },
        doctorfees: { type: Number },
        doctorspecialization: { type: String },
      },
    },
  ],
  futureAppointments: [
    {
      appointementId: { type: String },
      doctorId: { type: String },
      date: { type: Number },
      remarks: { type: String },
      url: { type: String },
      doctorDetails: {
        doctorname: {
          type: String,
        },
        doctoremail: { type: String },
        doctorcontact: { type: String },
        doctorexperience: { type: Number },
        doctorfees: { type: Number },
        doctorspecialization: { type: String },
      },
    },
  ],
  nextAppointment: {
    appointementId: { type: String },
    doctorId: { type: String },
    date: { type: Number },
    remarks: { type: String },
    url: { type: String },
    doctorDetails: {
      doctorname: {
        type: String,
      },
      doctoremail: { type: String },
      doctorcontact: { type: String },
      doctorexperience: { type: Number },
      doctorfees: { type: Number },
      doctorspecialization: { type: String },
    },
  },
  requests: [
    {
      requestId: { type: String },
      doctorId: { type: String },
      date: { type: Number },
      remarks: { type: String },
      confirmed: { type: String },
      comments: { type: String },
      doctorDetails: {
        doctorname: {
          type: String,
        },
        doctoremail: { type: String },
        doctorcontact: { type: String },
        doctorexperience: { type: Number },
        doctorfees: { type: Number },
        doctorspecialization: { type: String },
      },
    },
  ],
});

const patients = new model("patient", patientSchema);

module.exports = patients;
