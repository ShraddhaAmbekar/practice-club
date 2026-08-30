const mongoose = require("mongoose");

const gateEntrySchema = new mongoose.Schema(
  {
    // ==========================================
    // PLAYER
    // ==========================================

    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    // ==========================================
    // EXPECTED FAMILY MEMBERS
    // Player database मधून येईल
    // ==========================================

    expectedFamilyMembers: {
      type: Number,
      default: 0,
      min: 0,
    },

    expectedVegMembers: {
      type: Number,
      default: 0,
      min: 0,
    },

    expectedNonVegMembers: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // ACTUAL FAMILY MEMBERS
    // Gate वर Operator भरेल
    // ==========================================

    actualFamilyMembers: {
      type: Number,
      default: 0,
      min: 0,
    },

    actualVegMembers: {
      type: Number,
      default: 0,
      min: 0,
    },

    actualNonVegMembers: {
      type: Number,
      default: 0,
      min: 0,
    },
 awarded: {
      type: Boolean,
      default: false,
    },
  
 

    // ==========================================
    // GATE ENTRY STATUS
    // ==========================================

    checkedIn: {
      type: Boolean,
      default: false,
    },

    checkedInAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "GateEntry",
  gateEntrySchema
);