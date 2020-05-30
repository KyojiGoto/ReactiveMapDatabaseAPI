var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var FoodBankSchema = new Schema(
  {
    type: { type: String, default: "Feature" },
    properties: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      status: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "High", "Undefined"],
        default: "Undefined"
      }
    },
    geometry: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number] }
    }
  },
  { collection: "foodBanks" }
);

module.exports = mongoose.model("foodBanks", FoodBankSchema);