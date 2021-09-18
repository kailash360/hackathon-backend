const doctors = require('../../models/Doctor.js')
const patients = require('../../models/Patient.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.login = async(req, res) => {

    try {

        //Extract credentials and chek if fields are given
        const user = req.query.user
        if (!user) {
            res.send({ 'status': 'error', 'message': 'User type not found' })
        }

        const email = req.body.email
        const password = req.body.password

        if (!email || !password) {
            res.send({ 'status': 'error', 'message': 'Fields cannot be empty' })
        }

        switch (user) {

            //If user is a doctor
            case 'doctor':

                //Search in db and match password
                await doctors.findOne({ email: email, password: userPassword })
                    .then(async(result, err) => {

                        if (err) {
                            res.send({ 'status': 'error', 'message': err.message })
                        }

                        if (!result) {
                            res.send({ 'status': 'error', 'message': 'User not found' })
                            return
                        } else {

                            const dbPassword = result.password

                            await bcrypt.compare(dbPassword, password, (err, result) => {
                                if (err) {
                                    res.send({ 'status': 'error', 'message': err.message })
                                } else {
                                    if (!result) {
                                        res.send({ 'status': 'error', 'message': 'Incorrect password' })
                                        return
                                    }
                                }
                            })

                            //If password matches, send proper data
                            console.log(result)
                            const user = {
                                name: result.name,
                                email: result.email,
                                userId: result._id,
                                type: 'doctor'
                            }

                            const token = jwt.sign(user, process.env.JWT_KEY)
                            res.send({ 'status': 'success', 'user': user, 'token': token })
                            return
                        }
                    })

                break

            case 'patient':

                await patients.findOne({ email: email })
                    .then(async(result, err) => {

                        if (err) {
                            res.send({ 'status': 'error', 'message': err.message })
                        }

                        if (!result) {
                            res.send({ 'status': 'error', 'message': 'User not found' })
                        } else {

                            const dbPassword = result.password

                            await bcrypt.compare(dbPassword, password, (err, result) => {
                                if (err) {
                                    res.send({ 'status': 'error', 'message': err.message })
                                } else {
                                    if (!result) {
                                        res.send({ 'status': 'error', 'message': 'Incorrect password' })
                                    }
                                }
                            })

                            console.log(result)
                            const user = {
                                name: result.name,
                                email: result.email,
                                userId: result._id,
                                type: 'patient'
                            }

                            const token = jwt.sign(user, process.env.JWT_KEY)
                            res.send({ 'status': 'success', 'user': user, 'token': token })
                        }
                    })

                break
            default:
                res.send({ 'status': 'error', 'message': 'Invalid user' })
                break
        }
    } catch (err) {
        console.error(err)
        res.send({ 'status': 'error', 'message': err.message })
    }

}