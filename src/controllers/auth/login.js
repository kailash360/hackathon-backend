const doctors = require("../../models/Doctor.js");
const patients = require("../../models/Patient.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    //Extract credentials and chek if fields are given
    const user = req.query.user;
    if (!user) {
      res.send({ status: "error", message: "User type not found" });
    }

    const email = req.body.email;
    const password = req.body.password;

    let dbuser, dbPassword;

    if (user === "doctor") {
      dbuser = await doctors.findOne({ email: email });
      dbPassword = dbuser.password;
    } else {
      dbuser = await patients.findOne({ email: email });
      dbPassword = dbuser.password;
    }

    console.log(dbuser, dbPassword);

    dbuser.comparePassword(password, (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Internal Server Error",
        });
      } else {
        if (!result) {
          res.send({ status: "error", message: "Incorrect password" });
        } else {
          const resuser = {
            name: dbuser.name,
            email: dbuser.email,
            userId: dbuser._id,
            type: user,
          };

          const token = jwt.sign(resuser, process.env.JWT_KEY);
          res.send({ status: "success", user: resuser, token: token });
          return;
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.send({ status: "error", message: err.message });
  }
};
