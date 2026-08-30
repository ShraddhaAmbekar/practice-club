const express = require("express");

const {
  createGateEntry,
  getGateEntries,
  getGateEntryById,
  updateGateEntry,
  getGateEntryByPlayer,
} = require("../controllers/gateEntryController");

const router = express.Router();

// ==========================================
// CREATE GATE ENTRY
// ==========================================

router.post(
  "/",
  createGateEntry
);

// ==========================================
// GET ALL GATE ENTRIES
// ==========================================

router.get(
  "/",
  getGateEntries
);

// ==========================================
// GET GATE ENTRY BY PLAYER
// ==========================================

router.get(
  "/player/:playerId",
  getGateEntryByPlayer
);

// ==========================================
// GET SINGLE GATE ENTRY
// ==========================================

router.get(
  "/:id",
  getGateEntryById
);

// ==========================================
// UPDATE ACTUAL GATE ENTRY
// ==========================================

router.put(
  "/:id",
  updateGateEntry
);

module.exports = router;