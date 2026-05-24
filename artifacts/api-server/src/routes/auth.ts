import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

    if (!name || !email || !password) {
      res.status(400).json({ error: "name, email and password are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const secret = process.env["JWT_SECRET"];
    if (!secret) { res.status(500).json({ error: "Server configuration error" }); return; }

    const token = jwt.sign({ userId: user._id.toString() }, secret, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    req.log.error({ err }, "Register failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const secret = process.env["JWT_SECRET"];
    if (!secret) { res.status(500).json({ error: "Server configuration error" }); return; }

    const token = jwt.sign({ userId: user._id.toString() }, secret, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (_req, res) => {
  res.json({ message: "Logged out successfully" });
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json({ id: user._id.toString(), name: user.name, email: user.email });
  } catch (err) {
    req.log.error({ err }, "Get me failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
