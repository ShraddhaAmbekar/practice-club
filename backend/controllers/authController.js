const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthUser = require("../models/AuthUser");

const JWT_SECRET = "practice-football-club-secret-key";

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const user = await AuthUser.findOne({
      username: username.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "This account is inactive",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};

module.exports = {
  login,
};