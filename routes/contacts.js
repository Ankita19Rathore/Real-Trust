const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");

// Create contact (public)
router.post("/", async (req, res) => {
  res.json(await Contact.create(req.body));
});

// Get all contacts (admin)
router.get("/", auth, async (req, res) => {
  res.json(await Contact.find().sort({ createdAt: -1 }));
});

// Delete contact (admin)
router.delete("/:id", auth, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
