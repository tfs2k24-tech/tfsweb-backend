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

// ✅ Enhanced CORS setup
const allowedOrigins = [
  "https://techfusionstudios.netlify.app",
  "http://localhost:5174",
  "http://localhost:5173", // Vite default port
  "http://localhost:3000"  // Create React App default
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ✅ Handle preflight requests globally
app.options('*', cors());

// ✅ MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/testimonials", testimonialRoutes);

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// ✅ Global error handler for CORS
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS policy blocked this request",
      allowedOrigins: allowedOrigins
    });
  }
  next(err);
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
});
