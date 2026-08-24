const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
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



mongoose
  .connect(process.env.MONGO_URI || MONGO_URI )
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`  );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });