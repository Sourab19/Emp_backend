const mongoose = require("mongoose");
const empSchema = mongoose.Schema({
  name: String,
  position: String,
  location: String,
  salary:Number,
});

const empData = mongoose.model("data", empSchema);// map schema to collection
module.exports = empData;
