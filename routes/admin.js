import express from "express";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ======= Admin registration =======
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const admin = new Admin({ username, password });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully", admin: { _id: admin._id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======= Login =======
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======= JWT Middleware =======
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ======= Protected Dashboard =======
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.admin.username} to the Admin Dashboard!` });
});

// ======= Get all admins =======
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======= Update admin =======
router.put("/:id", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (username) admin.username = username;
    if (password && password.trim() !== "") admin.password = password; // hash automatically via pre-save

    await admin.save();
    res.json({ message: "Admin updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ======= Delete admin =======
router.delete("/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
