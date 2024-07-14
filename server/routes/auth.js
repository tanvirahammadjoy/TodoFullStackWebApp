const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Token = require("../models/Token");

// Middleware to verify the token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const storedToken = await Token.findOne({ token, userId: decoded.userId });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.sendStatus(401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered");
  } catch (err) {
    res.status(400).send("Error registering user");
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    await Token.create({ token, userId: user._id, expiresAt });

    res.json({ token });
  } catch (err) {
    res.status(400).send("Error logging in");
  }
});

// Token verification route
router.get("/verify-token", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.error("No token provided");
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);

    const storedToken = await Token.findOne({ token, userId: decoded.userId });
    if (!storedToken) {
      console.error("Token not found in database");
      return res.sendStatus(401);
    }

    if (storedToken.expiresAt < new Date()) {
      console.error("Token has expired");
      return res.sendStatus(401);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Token verification failed:", error);
    res.sendStatus(401);
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    await Token.findOneAndDelete({ token });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = { router, verifyToken };
