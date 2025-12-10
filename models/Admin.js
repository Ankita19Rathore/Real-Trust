const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  email: String,
  passwordHash: String
});

module.exports = mongoose.model("Admin", AdminSchema);
