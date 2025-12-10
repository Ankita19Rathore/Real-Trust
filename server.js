require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const Admin = require("./models/Admin");

const app = express();
app.use(cors());
app.use(express.json());

// Serve website files first
app.use(express.static(path.join(__dirname, "public")));

// Serve admin panel
app.use("/admin", express.static(path.join(__dirname, "public", "admin")));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/clients", require("./routes/clients"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/subscribers", require("./routes/subscribers"));

// Seed admin
(async () => {
  const exists = await Admin.findOne();
  if (!exists) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      passwordHash: hash
    });
    console.log("Admin created automatically");
  }
})();

connectDB(process.env.MONGO_URI);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
