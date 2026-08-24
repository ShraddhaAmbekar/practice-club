const mongoose = require("mongoose");

const relativeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    relation: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { _id: false }
);

const playerSchema = new mongoose.Schema(
  {
    // -----------------------------
    // Basic Information
    // -----------------------------

    photo: {
      type: String,
      default: "",
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    nickname: {
      type: String,
      trim: true,
      default: "",
    },

    birthDate: {
      type: Date,
      default: null,
    },

    // -----------------------------
    // Contact Information
    // -----------------------------

    contactNumber: {
      type: String,
      trim: true,
      default: "",
    },

    alternateContactNumber: {
      type: String,
      trim: true,
      default: "",
    },

    // -----------------------------
    // Personal Information
    // -----------------------------

    foodPreference: {
      type: String,
      enum: ["Veg", "Non-Veg", ""],
      default: "",
    },

    // -----------------------------
    // Football Information
    // -----------------------------

    footballStartedYear: {
      type: Number,
      default: null,
    },


    practiceClubFromYear: {
      type: Number,
      default: null,
    },

    practiceClubToYear: {
      type: Number,
      default: null,
    },

    currentlyPlayingAtPracticeClub: {
      type: Boolean,
      default: false,
    },

    playingPosition: {
      type: String,
      enum: [
        "Goalkeeper",
        "Defender",
        "Midfielder",
        "Forward",
        "All-Rounder",
        "",
      ],
      default: "",
    },

    // -----------------------------
    // Competitions
    // -----------------------------

    memorableCompetitions: {
      type: [String],
      default: [],
    },

    // -----------------------------
    // Relatives in Practice Club
    // -----------------------------

    hasRelativesInPracticeClub: {
      type: Boolean,
      default: false,
    },

    relativesInPracticeClub: {
      type: [relativeSchema],
      default: [],
    },

    familyMembersComing: {
  type: Number,
  default: 0,
},

familyVegMembers: {
  type: Number,
  default: 0,
},

familyNonVegMembers: {
  type: Number,
  default: 0,
},
    // -----------------------------
    // Audit Information
    // -----------------------------

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Player", playerSchema);