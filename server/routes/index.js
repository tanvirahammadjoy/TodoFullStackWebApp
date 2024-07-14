// ./index.js
const express = require("express");
const router = express.Router();
const path = require("path");

// Serve the index.html file
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "index.html"));
});

// Serve the register.html file
router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "register.html"));
});

// Serve the login.html file
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "login.html"));
});

module.exports = router;
