import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  image: {
    public_id: { type: String, required: true }, // Cloudinary public ID
    url: { type: String, required: true },       // Cloudinary secure_url
  },
});

const Team = mongoose.model("Team", teamSchema);

export default Team;
