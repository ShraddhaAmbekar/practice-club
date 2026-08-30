const GateEntry = require("../models/GateEntry");
const Player = require("../models/Players");

// ==========================================
// CREATE GATE ENTRY
// Player database मधून Expected data घेणे
// ==========================================

const createGateEntry = async (req, res) => {
  try {
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({
        message: "Player ID is required.",
      });
    }

    // ------------------------------------------
    // Find Player
    // ------------------------------------------

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({
        message: "Player not found.",
      });
    }

    // ------------------------------------------
    // Check duplicate Gate Entry
    // ------------------------------------------

    const existingEntry = await GateEntry.findOne({
      player: playerId,
    });

    if (existingEntry) {
      return res.status(200).json({
        message: "Gate Entry already exists.",
        gateEntry: existingEntry,
      });
    }

    // ------------------------------------------
    // Create Gate Entry
    // Expected data Player मधून
    // ------------------------------------------

    const gateEntry = await GateEntry.create({
      player: player._id,

      expectedFamilyMembers:
        player.familyMembersComing || 0,

      expectedVegMembers:
        player.familyVegMembers || 0,

      expectedNonVegMembers:
        player.familyNonVegMembers || 0,

      actualFamilyMembers: 0,
      actualVegMembers: 0,
      actualNonVegMembers: 0,

      checkedIn: false,
      checkedInAt: null,
    });

    // ------------------------------------------
    // Populate Player
    // ------------------------------------------

    const populatedEntry =
      await GateEntry.findById(gateEntry._id).populate(
        "player",
        "fullName nickname photo whatsappNumber"
      );

    return res.status(201).json({
      message: "Gate Entry created successfully.",
      gateEntry: populatedEntry,
    });
  } catch (error) {
    console.error(
      "Create Gate Entry Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while creating Gate Entry.",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL GATE ENTRIES
// ==========================================

const getGateEntries = async (req, res) => {
  try {
    const gateEntries = await GateEntry.find()
      .populate(
        "player",
        "fullName nickname photo whatsappNumber"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message:
        "Gate Entries fetched successfully.",
      gateEntries,
    });
  } catch (error) {
    console.error(
      "Get Gate Entries Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching Gate Entries.",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE GATE ENTRY
// ==========================================

const getGateEntryById = async (req, res) => {
  try {
    const { id } = req.params;

    const gateEntry =
      await GateEntry.findById(id).populate(
        "player",
        "fullName nickname photo whatsappNumber"
      );

    if (!gateEntry) {
      return res.status(404).json({
        message: "Gate Entry not found.",
      });
    }

    return res.status(200).json({
      message:
        "Gate Entry fetched successfully.",
      gateEntry,
    });
  } catch (error) {
    console.error(
      "Get Single Gate Entry Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching Gate Entry.",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE ACTUAL GATE ENTRY
// ==========================================

const updateGateEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      actualFamilyMembers,
      actualVegMembers,
      actualNonVegMembers,
    } = req.body;

    // ------------------------------------------
    // Find Gate Entry
    // ------------------------------------------

    const gateEntry =
      await GateEntry.findById(id);

    if (!gateEntry) {
      return res.status(404).json({
        message: "Gate Entry not found.",
      });
    }

    // ------------------------------------------
    // Update actual values
    // ------------------------------------------

    gateEntry.actualFamilyMembers =
      Number(actualFamilyMembers) || 0;

    gateEntry.actualVegMembers =
      Number(actualVegMembers) || 0;

    gateEntry.actualNonVegMembers =
      Number(actualNonVegMembers) || 0;

    // ------------------------------------------
    // Mark as Checked In
    // ------------------------------------------

    gateEntry.checkedIn = true;
    gateEntry.checkedInAt = new Date();

    await gateEntry.save();

    // ------------------------------------------
    // Populate Player
    // ------------------------------------------

    const updatedEntry =
      await GateEntry.findById(id).populate(
        "player",
        "fullName nickname photo whatsappNumber"
      );

    return res.status(200).json({
      message:
        "Gate Entry updated successfully.",
      gateEntry: updatedEntry,
    });
  } catch (error) {
    console.error(
      "Update Gate Entry Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while updating Gate Entry.",
      error: error.message,
    });
  }
};

// ==========================================
// GET GATE ENTRY BY PLAYER
// ==========================================

const getGateEntryByPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;

    const gateEntry =
      await GateEntry.findOne({
        player: playerId,
      }).populate(
        "player",
        "fullName nickname photo whatsappNumber"
      );

    if (!gateEntry) {
      return res.status(404).json({
        message:
          "Gate Entry not found for this player.",
      });
    }

    return res.status(200).json({
      message:
        "Gate Entry fetched successfully.",
      gateEntry,
    });
  } catch (error) {
    console.error(
      "Get Gate Entry By Player Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching Gate Entry.",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createGateEntry,
  getGateEntries,
  getGateEntryById,
  updateGateEntry,
  getGateEntryByPlayer,
};