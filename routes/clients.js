const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Create new client (ADMIN ONLY)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const newClient = await Client.create({
      name: req.body.name,
      designation: req.body.designation,
      description: req.body.description,
      imagePath: req.file ? "/uploads/" + req.file.filename : null
    });

    res.json(newClient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all clients (PUBLIC)
router.get("/", async (req, res) => {
  const clients = await Client.find().sort({ createdAt: -1 });
  res.json(clients);
});

// Delete client (ADMIN ONLY)
router.delete("/:id", auth, async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
