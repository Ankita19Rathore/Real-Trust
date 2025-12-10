const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    name: String,
    designation: String,
    description: String,
    imagePath: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
