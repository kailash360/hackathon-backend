const doctors = require("../../models/Doctor.js");

exports.doctors = async (req, res) => {
  try {
    let filterObject = {};
    req.body.filterArray.includes("price") ? (filterObject.fees = 1) : "";
    req.body.filterArray.includes("experience")
      ? (filterObject.experience = -1)
      : "";
    req.body.filterArray.includes("rating") ? (filterObject.rating = -1) : "";

    doctors
      .find()
      .sort(filterObject)
      .then((result) => {
        res.send({ status: "success", data: result });
      });
  } catch (err) {
    console.log(err);
    res.send({ status: "error", message: err.message });
  }
};
exports.specficdoctor = async (req, res) => {
  const id = req.params.id;
  console.log("reaaskldfj");

  doctors
    .findOne({ _id: id })
    .then((result) => {
      res.send({ status: "success", data: result });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: "error", message: err.message });
    });
};
