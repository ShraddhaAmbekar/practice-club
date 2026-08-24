const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");

const app = express();

// ==========================================
// CORS
// ==========================================

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// ==========================================
// PREFLIGHT
// ==========================================

app.options("/api/players", cors(corsOptions));
app.options("/api/auth/login", cors(corsOptions));

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Practice Football Club API is running",
  });
});

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);

// ==========================================
// DATABASE + SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });