const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const auth = require("../middleware/auth");

// Create subscriber (public)
router.post("/", async (req, res) => {
  res.json(await Subscriber.create({ email: req.body.email }));
});

// Get subscribers (admin)
router.get("/", auth, async (req, res) => {
  res.json(await Subscriber.find().sort({ createdAt: -1 }));
});

// Delete subscriber (admin)
router.delete("/:id", auth, async (req, res) => {
  await Subscriber.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
