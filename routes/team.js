import express from "express";
import Team from "../models/team.js";
import upload from "../middleware/upload.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

// GET all team members
router.get("/", async (req, res) => {
  try {
    const team = await Team.find();
    res.json(team);
  } catch (err) {
    console.error("GET /team error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new team member
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageData = req.file
      ? {
          public_id: req.file.filename,
          url: req.file.path,
        }
      : null;

    const teamMember = new Team({
      name: req.body.name,
      role: req.body.role,
      bio: req.body.bio,
      image: imageData,
    });

    const newMember = await teamMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    console.error("POST /team error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT (update) a team member
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Update image if a new file is uploaded
    if (req.file) {
      if (member.image?.public_id) {
        await cloudinary.uploader.destroy(member.image.public_id);
      }
      member.image = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    // Update text fields
    member.name = req.body.name || member.name;
    member.role = req.body.role || member.role;
    member.bio = req.body.bio || member.bio;

    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (err) {
    console.error("PUT /team/:id error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE a team member
router.delete("/:id", async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Delete image from Cloudinary if exists
    if (member.image?.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    await member.deleteOne();
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error("DELETE /team/:id error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
