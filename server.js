import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import https from "https";
import adminRoutes from "./routes/admin.js";
import queryRoutes from "./routes/queries.js";
import teamRoutes from "./routes/team.js"; // <-- New team route
import project from "./routes/project.js";
import testimonialRoutes from "./routes/test.js";

dotenv.config();

const app = express();
app.use(express.json());

// Allow both frontends
app.use(
  cors({
    origin: ["https://techfusionstudios.netlify.app/", "https://localhost:5174"],
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/team", teamRoutes); // <-- New team API endpoint
app.use("/api/projects", project);
app.use("/api/testimonials", testimonialRoutes);

// HTTPS options
const sslOptions = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};

// Start HTTPS server
const PORT = process.env.PORT || 5500;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS Server running on https://localhost:${PORT}`);
});
