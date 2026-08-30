
const express = require("express");

const {
  createGateEntry,
  getGateEntries,
  getGateEntryById,
  updateGateEntry,
  getGateEntryByPlayer,
  awardGateEntry,
} = require("../controllers/gateEntryController");

const router = express.Router();

// ==========================================
// CREATE GATE ENTRY
// ==========================================

router.post("/", createGateEntry);

// ==========================================
// GET ALL GATE ENTRIES
// ==========================================

router.get("/", getGateEntries);

// ==========================================
// GET GATE ENTRY BY PLAYER
// ==========================================

router.get("/player/:playerId", getGateEntryByPlayer);

// ==========================================
// AWARD PLAYER
// IMPORTANT: This must be BEFORE /:id
// ==========================================

router.put("/:id/award", awardGateEntry);

// ==========================================
// GET SINGLE GATE ENTRY
// ==========================================

router.get("/:id", getGateEntryById);

// ==========================================
// UPDATE ACTUAL GATE ENTRY
// Gate Check-In
// ==========================================

router.put("/:id", updateGateEntry);

module.exports = router;
