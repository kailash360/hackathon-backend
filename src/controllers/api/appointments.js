const patients = require("../../models/Patient.js");
const doctors = require("../../models/Doctor.js");

//to request an appointment
exports.requestAppointment = async (req, res) => {
  //Extract details of appointment
  const patientId = req.body.patientId;
  const doctorId = req.body.doctorId;
  const date = req.body.date;
  const remarks = req.body.remarks || "None";
  const doctorname = req.body.doctorName;
  const doctoremail = req.body.doctoremail;
  const doctorcontact = req.body.doctorcontact;
  const doctorexperience = req.body.doctorexperience;
  const doctorfees = req.body.doctorfees;
  const doctorspecialization = req.body.doctorspecialization;
  const patientname = req.body.patientname;
  const patientemail = req.body.patientemail;
  const patientcontact = req.body.patientcontact;
  const patientage = req.body.patientage;

  const requestId = patientId + "--" + doctorId + "--" + date;

  //Find the doctor and add request to the doctor
  doctors.findOne({ _id: doctorId }).then(async (doctor, err) => {
    let newRequest = {
      requestId: requestId,
      patientId: patientId,
      date: date,
      confirmed: false,
      patientDetails: {
        patientname,
        patientemail,
        patientcontact,
        patientage,
      },
    };

    doctor.requests.push(newRequest);
    // await doctors.findOneAndUpdate({ _id: doctorId }, { $set: { requests: doctor.requests } }, { upsert: true }, (result, err) => {
    //     if (err) {
    //         console.error(err)
    //         res.send({ 'status': 'error', 'message': err.message })
    //     }
    // })
    await doctor.save();
  });

  //find patient and add request to patient
  patients
    .findOne({ _id: patientId })
    .then(async (patient, err) => {
      let newRequest = {
        requestId: requestId,
        patientId: patientId,
        date: date,
        confirmed: false,
        doctorDetails: {
          doctorname,
          doctoremail,
          doctorcontact,
          doctorexperience,
          doctorfees,
          doctorspecialization,
        },
      };

      patient.requests.push(newRequest);

      try {
        await patient.save();
        res.send({
          status: "success",
          message: "Appointment requested successfully",
        });
      } catch (err) {
        console.error(err);
        res.send({ status: "error", message: err.message });
      }
    })
    .catch((err) => {
      console.error(err);
      res.send({ status: "error", message: err.message });
    });
};

//To confirm/cancel an appointment
exports.confirmAppointmentRequest = async (req, res) => {
  const requestId = req.body.requestId;
  const patientId = req.body.patientId;
  const doctorId = req.body.doctorId;
  const confirmed = req.body.confirmed;
  const comments = req.body.comments;
  const url = req.body.url;

  switch (confirmed) {
    //If appointment is confirmed
    case true:
      //save the appointment in doctor
      // let newAppointment = {
      //     appointmentId: requestId,
      //     patientId: patientId,
      //     date: date,
      //     remarks: remarks,
      //     url: url,
      // }

      doctors
        .find({
          _id: doctorId,
          requests: { $elemMatch: { requestId: requestId } },
        })
        .then(async (doctor, err) => {
          if (err) {
            res.send({ status: "error", message: err.message });
          }
          console.log("1");
          console.log(doctor);

          // doctor.nextAppointments.push(newAppointment)

          // doctor.requests = doctor.requests.filter(item => item.requestId !== requestId)
          // try {
          //     await doctor.save()
          // } catch (err) {
          //     console.error(err)
          //     res.send({ 'status': 'error', 'message': err.message })
          // }
          // res.send({ 'data': doctor })
        });
      //save the appointtment in patient
      newAppointment = {
        appointmentId: requestId,
        doctorId: doctorId,
        // date: date,
        confirmed: "true",
        // remarks: remarks,
        comments: comments,
        url: url,
      };
      // await patients.findOne({ _id: patientId })
      //     .then(async(patient, err) => {
      //         if (err) {
      //             res.send({ 'status': 'error', 'message': err.message })
      //         }

      //         patient.futureAppointments.push(newAppointment)
      //         patient.requests = patient.requests.map(item => {
      //             if (item.requestId === requestId) {
      //                 item.confirmed = true
      //             }

      //             return item
      //         })

      //         try {
      //             patient.save()
      //             res.send({ 'status': 'success', 'message': 'Appointment confirmed successfully' })
      //         } catch (err) {
      //             console.error(err)
      //             res.send({ 'status': 'error', 'message': err.message })
      //         }

      //     }).catch((err) => {
      //         console.error(err)
      //         res.send({ 'status': 'error', 'message': err.message })
      //     })
      break;

    //If appointment is rejected,
    case false:
      //Find doctor and remove the request
      await doctors.findOne({ _id: doctorId }).then(async (doctor, err) => {
        if (err) {
          res.send({ status: "error", message: err.message });
        }

        doctor.requests = doctor.requests.filter(
          (request) => request.requestId !== requestId
        );
        await doctors.findOneAndUpdate(
          { _id: doctorId },
          { $set: { requests: doctor.requests } },
          { upsert: true },
          (result, err) => {
            if (err) {
              res.send({ status: "error", message: err.message });
            }
          }
        );
      });

      //Find patient and set the request to false
      await patients.findOne({ _id: patientId }).then(async (patient, err) => {
        if (err) {
          res.send({ status: "error", message: err.message });
        }

        patient.requests = patient.requests.map((item) => {
          if (item.requestId === requestId) {
            item.confirmed = false;
          }

          return item;
        });

        await patients.findOneAndUpdate(
          { _id: patientId },
          { $set: { requests: patient.requests } },
          { upsert: true },
          (result, err) => {
            if (err) {
              res.send({ status: "error", message: err.message });
            }

            res.send({
              status: "success",
              message: "Apointment cancelled successfully",
            });
          }
        );
      });
      break;

    default:
      res.send({ status: "error", message: "Invalid confirmation status" });
  }
};

exports.cancelAppointmentRequest = async (req, res) => {
  const patientId = req.body.patientId;
  const doctorId = req.body.doctorId;
  const requestId = req.body.requestId;

  await doctors.findOne({ _id: doctorId }).then(async (doctor, err) => {
    if (err) {
      res.send({ status: "error", message: err.message });
    }

    doctor.requests = doctor.requests.filter(
      (request) => request.requestId !== requestId
    );
    await doctors.findOneAndUpdate(
      { _id: doctorId },
      { $set: { requests: doctor.requests } },
      { upsert: true },
      (result, err) => {
        if (err) {
          res.send({ status: "error", message: err.message });
        }
      }
    );
  });
  await patients.find({ _id: patientId }).then(async (patient, err) => {
    if (err) {
      res.send({ status: "error", message: err.message });
    }

    patients.requests = patient.requests.filter(
      (request) => request.requestId !== requestId
    );
    await patients.findOneAndUpdate(
      { _id: patientId },
      { $set: { requests: patient.requests } },
      { upsert: true },
      (result, err) => {
        if (err) {
          res.send({ status: "error", message: err.message });
        }

        res.send({
          status: "success",
          message: "Request deleted successfully",
        });
      }
    );
  });
};

exports.futureAppointments = async (req, res) => {
  const type = req.params.type;
  const userId = req.params.userId;

  console.log("request made to futureAppointments");

  if (type === "doctor") {
    doctors
      .findOne({ _id: userId })
      .then((result) => {
        if (!result) {
          res.send({ status: "error", message: "No such User Exists" });
          return;
        }
        res.send({
          status: "success",
          futureAppointments: result.futureAppointments,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: "error", message: "Invalid user type" });
      });
  } else {
    patients
      .findOne({ _id: userId })
      .then((result) => {
        if (!result) {
          res.send({ status: "error", message: "No such User Exists" });
          return;
        }
        res.send({
          status: "success",
          futureAppointments: result.futureAppointments,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: "error", message: "Invalid user type" });
      });
  }
};

exports.pastAppointments = async (req, res) => {
  const type = req.params.type;
  const userId = req.params.userId;

  console.log("request made to pastAppointments");

  if (type === "doctor") {
    doctors
      .findOne({ _id: userId })
      .then((result) => {
        if (!result) {
          res.send({ status: "error", message: "No such User Exists" });
          return;
        }
        res.send({
          status: "success",
          pastAppointments: result.pastAppointments,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: "error", message: "Invalid user type" });
      });
  } else {
    patients
      .findOne({ _id: userId })
      .then((result) => {
        if (!result) {
          res.send({ status: "error", message: "No such User Exists" });
          return;
        }
        res.send({
          status: "success",
          pastAppointments: result.pastAppointments,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: "error", message: "Invalid user type" });
      });
  }
};

exports.nextAppointment = async (req, res) => {
  const userId = req.params.userId;
  const type = req.params.type;

  console.log("request made to nextAppointments");

  if (type === "doctor") {
    doctors
      .findOne({ _id: userId })
      .then((result) => {
        if (!result) {
          res.send({ status: "error", message: "No such User Exists" });
          return;
        }
        res.send({
          status: "success",
          nextAppointments: result.nextAppointments,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: "error", message: "Invalid user type" });
      });
  } else {
    patients
      .findOne({ _id: userId })
      .then((result) => {
        if (!result) {
          res.send({ status: "error", message: "No such User Exists" });
          return;
        }
        res.send({
          status: "success",
          nextAppointments: result.nextAppointments,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: "error", message: "Invalid user type" });
      });
  }
};
exports.requestedAppointments = async (req, res) => {
  const userId = req.params.userId;
  const type = req.params.type;

  console.log("request made to requestedAppointments");

  if (type === "doctor") {
    doctors
      .findOne({ _id: userId })
      .then((result) => {
        if (!result) {
          res.send({ status: "error", message: "No such User Exists" });
          return;
        }
        res.send({
          status: "success",
          requestedAppointments: result.requests,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: "error", message: "Invalid user type" });
      });
  } else {
    patients
      .findOne({ _id: userId })
      .then((result) => {
        if (!result) {
          res.send({ status: "error", message: "No such User Exists" });
          return;
        }
        console.log(result);
        res.send({
          status: "success",
          requestedAppointments: result.requests,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: "error", message: "Invalid user type" });
      });
  }
};
exports.cancelledAppointments = async (req, res) => {
  const userId = req.params.userId;
  const type = req.params.type;

  console.log("request made to cancelledAppointments");

  if (type === "patient") {
    patients
      .findOne({ _id: userId })
      .then((result) => {
        if (!result) {
          res.send({ status: "error", message: "No such User Exists" });
          return;
        }
        res.send({
          status: "success",
          cancelledAppointments: result.cancelledAppointments,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: "error", message: "Invalid user type" });
      });
  } else {
    res.send({ status: "error", message: "Invalid user type" });
  }
};
