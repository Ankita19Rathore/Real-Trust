const mongoose = require("mongoose");

const SubSchema = new mongoose.Schema(
  {
    email: String
  },
  { timestamps: true }   // <-- REQUIRED
);

module.exports = mongoose.model("Subscriber", SubSchema);
