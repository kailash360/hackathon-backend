const patients = require("../../models/Patient.js");
const doctors = require("../../models/Doctor.js");
const { hashPassword } = require("../../utils/password.js");

exports.signup = async(req, res) => {
    try {
        //check if user type is provided or not
        const user = req.query.user;
        if (!user) {
            return res.send({ status: "error", message: "User type not provided" });
        }

        const name = req.body.name;
        const email = req.body.email;
        const contact = req.body.contact;
        const password = req.body.password;

        if (user === "doctor") {
            //When user is a doctor

            const experience = parseInt(req.body.experience);
            const fees = parseInt(req.body.fees);
            const specialization = req.body.specialization;

            let doctor = new doctors();
            doctor.name = name;
            doctor.email = email;
            doctor.contact = contact;
            await hashPassword(password).then((result) => {
                doctor.password = result;
            });
            doctor.experience = experience;
            doctor.fees = fees;
            doctor.specialization = specialization;
            doctor.rating = 0;
            doctor.totalRatings = 0;
            doctor.pastAppointments = [];
            doctor.futureAppointments = [];
            doctor.nextAppointment = {};


            try {
                await doctor.save();
                res.send({
                    status: "success",
                    message: "doctor created successfully",
                });
            } catch (err) {
                res.send({ status: "error", message: err.message });
            }
        }
        //When user is a patient
        else {
            //body of a patient should contain {name,email,age,contact,password}
            const age = parseInt(req.body.age);

            let patient = new patients();
            patient.name = name;
            patient.email = email;
            patient.contact = contact;
            patient.age = age;
            await hashPassword(password).then((result) => {
                patient.password = result;
            });
            patient.pastAppointments = [];
            patient.futureAppointments = [];
            patient.nextAppointment = {};


            try {
                await patients.save();
                res.send({
                    status: "success",
                    message: "patient created successfully",
                });
            } catch (err) {
                res.send({ status: "error", message: err.message });
            }
        }
    } catch (e) {
        console.error(e);
        res.send({ status: "error", message: err });
    }
};