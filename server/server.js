const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Ensure the correct paths to the routes
const authRoutes = require("./routes/auth").router;
const indexRoutes = require("./routes/index");
const todoRoutes = require("./routes/todos");

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "client"))); // Serves all static files from the client folder
app.use(cors());

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api", authRoutes);
app.use("/", indexRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server is running on port http://localhost:${process.env.PORT || 3000}`
      );
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB:", err));
