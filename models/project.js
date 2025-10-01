// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }, // will hold Cloudinary URL
  description: { type: String, required: true },
  fullDescription: { type: String, required: true },
  technologies: [{ type: String, required: true }],
  link: { type: String, default: "#" },
  github: { type: String, default: "#" }
});

export default mongoose.model("Project", projectSchema);
