const doctors = require('../../models/Doctor.js')


exports.doctors = async(req, res) => {

    try {
        let filterObject = {}
        req.body.filterArray.includes('fees') ? filterObject.fees = 1 : ''
        req.body.filterArray.includes('experience') ? filterObject.experience = 1 : ''
        req.body.filterArray.includes('rating') ? filterObject.rating = 1 : ''

        console.log(filterObject)

        await doctors.find()
            .then((result, err) => {
                if (err) {
                    res.send({ 'status': 'error', 'message': err.message })
                    return
                }

                res.send({ 'status': 'success', 'data': result })
            })
    } catch (err) {
        console.log(err)
        res.send({ 'status': 'error', 'message': err.message })
    }
}