const patients = require('../../models/Patient.js')
const doctors = require('../../models/Doctor.js')

//to request an appointment 
exports.requestAppointment = async(req, res) => {

    //Extract details of appointment
    const patientId = req.body.patientId
    const doctorId = req.body.doctorId
    const date = req.body.date
    const time = req.body.time

    //Find the doctor and add request to the doctor
    await doctors.findOne({ _id: doctorId })
        .then(async(doctor, err) => {
            let newRequest = {
                patientId: patientId,
                date: date,
                time: time,
                remarks: remarks
            }

            doctor.requests.push(newRequest)
            await doctors.findOneAndUpdate({ _id: doctorId }, { $set: { requests: doctor.requests } }, upsert: true, (result, err) => {
                if (err) {
                    console.error(err)
                    res.send({ 'status': 'error', 'message': err.message })
                }
            })
        })

    //find patient and add request to patient
    await patients.findOne({ _id: patientId })
        .then(async(patient, err) => {

            let newRequest = {
                doctorId: doctorId,
                date: date,
                time: time,
                remarks: remarks,
                confirmed: false,
                comments: '',
            }

            patient.requests.push(newRequest)
            await patients.findOneAndUpdate({ _id: patientId }, { $set: { requests: patient.requests } }, upsert: true, (result, err) => {
                if (err) {
                    console.error(err)
                    res.send({ 'status': 'error', 'message': err.message })
                }

                res.send({ 'status': 'success', 'message': 'Appointment created successfully' })
            })

        })

}