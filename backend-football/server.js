const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const playerRoutes =require("./routes/playerRoutes")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.json({
    message: "Practice Football Club API is running",
  });
});



// ==========================================
// API ROUTES
// ==========================================
app.use("/api/auth", authRoutes);

app.use("/api/players", playerRoutes);

const MONGO_URI =
  "mongodb://ambekarshraddha21_db_user:Password123@ac-qeumdmb-shard-00-00.p8xrzkd.mongodb.net:27017,ac-qeumdmb-shard-00-01.p8xrzkd.mongodb.net:27017,ac-qeumdmb-shard-00-02.p8xrzkd.mongodb.net:27017/?ssl=true&replicaSet=atlas-10vdtz-shard-0&authSource=admin&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });