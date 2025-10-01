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

app.use(express.json());

// Allowed origins
const allowedOrigins = [
  "https://techfusionstudios.netlify.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests from allowed origins or Postman/servers (no origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin ${origin}`));
    }
  },
  credentials: true,
}));

// Preflight requests
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Test endpoint
app.get("/", (req, res) => res.send("Backend running ✅"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

