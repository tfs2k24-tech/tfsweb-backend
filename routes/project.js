// routes/projects.js
import express from "express";
import Project from "../models/project.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * ✅ GET all projects
 */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error("❌ GET /projects error:", err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ GET single project by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    console.error("❌ GET /projects/:id error:", err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ POST new project (with image upload)
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📥 Body:", req.body);
    console.log("📥 File:", req.file);

    const { title, category, description, fullDescription, technologies, link, github } = req.body;

    // Validate required fields
    if (!title || !category || !description || !fullDescription || !technologies || !req.file) {
      return res.status(400).json({ success: false, error: "All required fields must be provided" });
    }

    const project = new Project({
      title,
      category,
      description,
      fullDescription,
      technologies: technologies.split(",").map((t) => t.trim()),
      image: req.file.path, // Cloudinary URL or local path
      link: link || "#",
      github: github || "#",
    });

    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error("❌ POST /projects error:", err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ UPDATE (PUT) project
 */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, category, description, fullDescription, technologies, link, github } = req.body;

    // Build update object
    const updateData = {};
    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (fullDescription) updateData.fullDescription = fullDescription;
    if (technologies) updateData.technologies = technologies.split(",").map((t) => t.trim());
    if (link) updateData.link = link;
    if (github) updateData.github = github;
    if (req.file) updateData.image = req.file.path;

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    console.error("❌ PUT /projects/:id error:", err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ DELETE project
 */
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE /projects/:id error:", err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
