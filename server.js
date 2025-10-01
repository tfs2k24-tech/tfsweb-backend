import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import adminRoutes from "./routes/admin.js";
import queryRoutes from "./routes/queries.js";
import teamRoutes from "./routes/team.js";
import projectRoutes from "./routes/project.js";
import testimonialRoutes from "./routes/test.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS setup
const allowedOrigins = [
  "https://techfusionstudios.netlify.app", // frontend deployed
  "http://localhost:5174"                  // frontend dev
];

app.use(cors({
  origin: function(origin, callback) {
    if(!origin) return callback(null, true); // allow non-browser requests like Postman
    if(allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/testimonials", testimonialRoutes);

// ✅ Start server (Render automatically handles HTTPS)
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
