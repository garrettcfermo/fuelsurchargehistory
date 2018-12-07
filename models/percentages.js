var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PercentageSchema = new Schema({
  createdAt : String,
  updatedAt: String,
  vendor_name: String,
  effective_date: String,
  indicator: String,
  percentage: Number
});

var Percentages = mongoose.model("percentages", PercentageSchema);

module.exports = Percentages;