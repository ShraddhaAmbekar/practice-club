const express = require("express");

const {
  createPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
} = require("../controllers/playerController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin + Data Entry → Player Add
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "data_entry"),
  createPlayer
);

// Admin + Data Entry + Anchor → Player View/List
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "data_entry", "anchor"),
  getPlayers
);

// Admin + Data Entry + Anchor → Single Player View
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "data_entry", "anchor"),
  getPlayerById
);

// Admin → Edit Player
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updatePlayer
);

// Admin → Delete Player
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deletePlayer
);

module.exports = router;