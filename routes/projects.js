const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

// Add
router.post("/", auth, upload.single("image"), async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    description: req.body.description,
    imagePath: "/uploads/" + req.file.filename
  });
  res.json(project);
});

// Get all
router.get("/", async (req, res) => {
  res.json(await Project.find());
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
