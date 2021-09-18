const patients = require('../../models/Patient.js')
const doctors = require('../../models/Doctor.js')

//to request an appointment 
exports.requestAppointment = async(req, res) => {

    //Extract details of appointment
    const patientId = req.body.patientId
    const doctorId = req.body.doctorId
    const date = req.body.date
    const time = req.body.time

    const requestId = patientId + '--' + doctorId + '--' + date

    //Find the doctor and add request to the doctor
    await doctors.findOne({ _id: doctorId })
        .then(async(doctor, err) => {
            let newRequest = {
                requestId: requestId,
                patientId: patientId,
                date: date,
                time: time,
                remarks: remarks
            }

            doctor.requests.push(newRequest)
            await doctors.findOneAndUpdate({ _id: doctorId }, { $set: { requests: doctor.requests } }, { upsert: true }, (result, err) => {
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
                requestId: requestId,
                doctorId: doctorId,
                date: date,
                time: time,
                remarks: remarks,
                confirmed: 'Pending',
                comments: '',
            }

            patient.requests.push(newRequest)
            await patients.findOneAndUpdate({ _id: patientId }, { $set: { requests: patient.requests } }, { upsert: true }, (result, err) => {
                if (err) {
                    console.error(err)
                    res.send({ 'status': 'error', 'message': err.message })
                }

                res.send({ 'status': 'success', 'message': 'Appointment requested successfully' })
            })

        })

}


//To confirm/cancel an appointment
exports.confirmAppointmentRequest = async(req, res) => {
    const requestId = req.body.requestId
    const patientId = req.body.patientId
    const doctorId = req.body.doctorId
    const confirmed = req.body.confirmed
    const comments = req.body.comments
    const date = req.body.date
    const url = req.body.url

    switch (confirmed) {
        //If appointment is confirmed
        case true:

            //save the appointment in doctor
            let newAppointment = {
                appointmentId: requestId,
                patientId: patientId,
                date: date,
                remarks: remarks,
                url: url,
            }

            await doctors.findOne({ _id: doctorId })
                .then(async(doctor, err) => {
                    if (err) {
                        res.send({ 'status': 'error', 'message': err.message })
                    }

                    doctor.futureAppointments.push(newAppointment)
                    doctor.requests = doctor.requests.filter(item => item.requestId !== requestId)
                    doctor.findOneAndUpdate({ _id: doctorId }, { $set: { futureAppointments: doctor.futureAppointments, requests: doctor.requests } }, { upsert: true }, (result, err) => {
                        if (err) {
                            res.send({ 'status': 'error', 'message': err })
                        }
                    })

                })
                //save the appointtment in patient
            newAppointment = {
                appointmentId: requestId,
                doctorId: doctorId,
                date: date,
                confirmed: 'true',
                remarks: remarks,
                comments: comments,
                url: url,
            }
            await patients.findOne({ _id: patientId })
                .then(async(patient, err) => {
                    if (err) {
                        res.send({ 'status': 'error', 'message': err.message })
                    }

                    patient.futureAppointments.push(newAppointment)
                    patient.requests = patient.requests.map(item => {
                        if (item.requestId === requestId) {
                            item.confirmed = true
                        }

                        return item
                    })
                    await patients.findOneAndUpdate({ _id: patientId }, { $set: { futureAppointments: patient.futureAppointments, requests: patient.requests } }, { upsert: true }, (result, err) => {
                        if (err) {
                            res.send({ 'status': 'error', 'message': err.message })
                        }

                        res.send({ 'status': 'success', 'message': 'Appointment confirmed successfully' })
                    })

                })
            break

            //If appointment is rejected,
        case false:

            //Find doctor and remove the request
            await doctors.findOne({ _id: doctorId })
                .then(async(doctor, err) => {
                    if (err) {
                        res.send({ 'status': 'error', 'message': err.message })
                    }

                    doctor.requests = doctor.requests.filter(request => request.requestId !== requestId)
                    await doctors.findOneAndUpdate({ _id: doctorId }, { $set: { requests: doctor.requests } }, { upsert: true }, (result, err) => {
                        if (err) {
                            res.send({ 'status': 'error', 'message': err.message })
                        }
                    })
                })

            //Find patient and set the request to false
            await patients.findOne({ _id: patientId })
                .then(async(patient, err) => {
                    if (err) {
                        res.send({ 'status': 'error', 'message': err.message })
                    }

                    patient.requests = patient.requests.map(item => {
                        if (item.requestId === requestId) {
                            item.confirmed = false
                        }

                        return item
                    })

                    await patients.findOneAndUpdate({ _id: patientId }, { $set: { requests: patient.requests } }, { upsert: true }, (result, err) => {
                        if (err) {
                            res.send({ 'status': 'error', 'message': err.message })
                        }

                        res.send({ 'status': 'success', 'message': 'Apointment cancelled successfully' })
                    })
                })
            break

        default:
            res.send({ 'status': 'error', 'message': 'Invalid confirmation status' })



    }

}

exports.cancelAppointmentRequest = async(req, res) => {
    const patientId = req.body.patientId
    const doctorId = req.body.doctorId
    const requestId = req.body.requestId

    await doctors.findOne({ _id: doctorId })
        .then(async(doctor, err) => {
            if (err) {
                res.send({ 'status': 'error', 'message': err.message })
            }

            doctor.requests = doctor.requests.filter(request => request.requestId !== requestId)
            await doctors.findOneAndUpdate({ _id: doctorId }, { $set: { requests: doctor.requests } }, { upsert: true }, (result, err) => {
                if (err) {
                    res.send({ 'status': 'error', 'message': err.message })
                }
            })
        })
    await patients.find({ _id: patientId })
        .then(async(patient, err) => {
            if (err) {
                res.send({ 'status': 'error', 'message': err.message })
            }

            patients.requests = patient.requests.filter(request => request.requestId !== requestId)
            await patients.findOneAndUpdate({ _id: patientId }, { $set: { requests: patient.requests } }, { upsert: true }, (result, err) => {
                if (err) {
                    res.send({ 'status': 'error', 'message': err.message })
                }

                res.send({ 'status': 'success', 'message': 'Request deleted successfully' })
            })
        })
}

exports.futureAppointments = async(req, res) => {

    const type = req.body.type
    const userId = req.query.userId

    switch (type) {
        case 'doctor':
            await doctors.findOne({ _id: doctorId })
                .then((result, err) => {
                    if (err) {
                        res.send({ 'status': 'error', 'message': err.message })
                    }

                    res.send({ 'status': 'success', 'futureAppointments': result.futureAppointments })
                })
            break

        case 'patient':
            await patients.findOne({ _id: userId })
                .then((result, err) => {
                    if (err) {
                        res.send({ 'status': 'error', 'message': err.message })
                    }

                    res.send({ 'status': 'success', 'futureAppointments': result.futureAppointments })
                })
            break

        default:
            res.send({ 'status': 'error', 'message': 'Invalid user type' })
    }
}

exports.pastAppointments = async(req, res) => {

    const type = req.body.type
    const userId = req.query.userId

    switch (type) {
        case 'doctor':
            await doctors.findOne({ _id: doctorId })
                .then((result, err) => {
                    if (err) {
                        res.send({ 'status': 'error', 'message': err.message })
                    }

                    res.send({ 'status': 'success', 'pastAppointments': result.pastAppointments })
                })
            break

        case 'patient':
            await patients.findOne({ _id: userId })
                .then((result, err) => {
                    if (err) {
                        res.send({ 'status': 'error', 'message': err.message })
                    }

                    res.send({ 'status': 'success', 'pastAppointments': result.pastAppointments })
                })
            break

        default:
            res.send({ 'status': 'error', 'message': 'Invalid user type' })
    }
}

exports.nextAppointment = async(req, res) => {

    const userId = req.query.userId
    const type = req.body.type

    switch (type) {

        case 'doctor':
            await doctors.findOne({ _id: userId })
                .then((result, err) => {
                    if (err) {
                        res.send({ 'status': 'error', 'message': err.message })
                    }

                    res.send({ 'status': 'success', 'nextAppointment': result.nextAppointment })
                })
            break

        case 'patient':
            await patients.findOne({ _id: userId })
                .then((result, err) => {
                    if (err) {
                        res.send({ 'status': 'error', 'message': err.message })
                    }

                    res.send({ 'status': 'success', 'nextAppointment': result.nextAppointment })
                })
            break

        default:
            res.send({ 'status': 'error', 'message': 'Invalid user type' })
    }
}