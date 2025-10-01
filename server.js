import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import adminRoutes from "./routes/admin.js";
import queryRoutes from "./routes/queries.js";
import teamRoutes from "./routes/team.js";
import project from "./routes/project.js";
import testimonialRoutes from "./routes/test.js";

dotenv.config();

const app = express();
app.use(express.json());

// 🔹 Add CORS middleware back and allow your frontend
app.use(cors({
  origin: " https://tfsweb-backend.onrender.com",
  credentials: true,
}));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/projects", project);
app.use("/api/testimonials", testimonialRoutes);

// 🔹 For Render deployment, use HTTP/HTTPS automatically handled by Render
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
