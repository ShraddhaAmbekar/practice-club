const Player = require("../models/Players");

// =====================================================
// CREATE PLAYER
// Admin + Data Entry
// =====================================================

const createPlayer = async (req, res) => {
  try {
    const {
      photo,
      fullName,
      nickname,
      birthDate,
      whatsappNumber,
      alternateContactNumber,
      foodPreference,
      footballStartedYear,
      practiceClubFromYear,
      practiceClubToYear,
      currentlyPlayingAtPracticeClub,
      playingPosition,
      memorableCompetitions,
      hasRelativesInPracticeClub,
      relativesInPracticeClub,
    } = req.body;

    // Full Name required
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        message: "पूर्ण नाव आवश्यक आहे.",
      });
    }

    // Create player
    const player = await Player.create({
      photo: photo || "",

      fullName: fullName.trim(),

      nickname: nickname || "",

      birthDate: birthDate || null,

      whatsappNumber: whatsappNumber || "",

      alternateContactNumber:
        alternateContactNumber || "",

      foodPreference:
        foodPreference || "",

      footballStartedYear:
        footballStartedYear
          ? Number(footballStartedYear)
          : null,

      practiceClubFromYear:
        practiceClubFromYear
          ? Number(practiceClubFromYear)
          : null,

      practiceClubToYear:
        practiceClubToYear
          ? Number(practiceClubToYear)
          : null,

      currentlyPlayingAtPracticeClub:
        Boolean(currentlyPlayingAtPracticeClub),

      playingPosition:
        playingPosition || "",

      memorableCompetitions:
        Array.isArray(memorableCompetitions)
          ? memorableCompetitions
          : [],

      hasRelativesInPracticeClub:
        Boolean(hasRelativesInPracticeClub),

      relativesInPracticeClub:
        Array.isArray(relativesInPracticeClub)
          ? relativesInPracticeClub
          : [],

      // Logged-in user
      // JWT मधून येतो
      createdBy: req.user.id,
    });

    // createdBy चे user details populate
    const populatedPlayer =
      await Player.findById(player._id).populate(
        "createdBy",
        "name username role"
      );

    return res.status(201).json({
      message:
        "Player माहिती यशस्वीपणे save झाली.",
      player: populatedPlayer,
    });
  } catch (error) {
    console.error(
      "Create player error:",
      error
    );

    return res.status(500).json({
      message:
        "Player माहिती save करताना error आला.",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL PLAYERS
// Admin + Data Entry + Anchor
// =====================================================

const getPlayers = async (req, res) => {
  try {
    const players = await Player.find()
      .populate(
        "createdBy",
        "name username role"
      )
      .sort({
        practiceClubFromYear: 1,
        fullName: 1,
      });

    return res.status(200).json(players);
  } catch (error) {
    console.error(
      "Get players error:",
      error
    );

    return res.status(500).json({
      message:
        "Players fetch करताना error आला.",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE PLAYER
// Admin + Data Entry + Anchor
// =====================================================

const getPlayerById = async (req, res) => {
  try {
    const player =
      await Player.findById(
        req.params.id
      ).populate(
        "createdBy",
        "name username role"
      );

    if (!player) {
      return res.status(404).json({
        message: "Player सापडला नाही.",
      });
    }

    return res.status(200).json(player);
  } catch (error) {
    console.error(
      "Get player by id error:",
      error
    );

    return res.status(500).json({
      message:
        "Player माहिती fetch करताना error आला.",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE PLAYER
// Admin Only
// =====================================================

const updatePlayer = async (req, res) => {
  try {
    const {
      photo,
      fullName,
      nickname,
      birthDate,
      whatsappNumber,
      alternateContactNumber,
      foodPreference,
      footballStartedYear,
      practiceClubFromYear,
      practiceClubToYear,
      currentlyPlayingAtPracticeClub,
      playingPosition,
      memorableCompetitions,
      hasRelativesInPracticeClub,
      relativesInPracticeClub,
    } = req.body;

    // Full Name validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        message: "पूर्ण नाव आवश्यक आहे.",
      });
    }

    const updateData = {
      photo: photo || "",

      fullName: fullName.trim(),

      nickname: nickname || "",

      birthDate: birthDate || null,

      whatsappNumber:
        whatsappNumber || "",

      alternateContactNumber:
        alternateContactNumber || "",

      foodPreference:
        foodPreference || "",

      footballStartedYear:
        footballStartedYear
          ? Number(footballStartedYear)
          : null,

      practiceClubFromYear:
        practiceClubFromYear
          ? Number(practiceClubFromYear)
          : null,

      practiceClubToYear:
        practiceClubToYear
          ? Number(practiceClubToYear)
          : null,

      currentlyPlayingAtPracticeClub:
        Boolean(currentlyPlayingAtPracticeClub),

      playingPosition:
        playingPosition || "",

      memorableCompetitions:
        Array.isArray(memorableCompetitions)
          ? memorableCompetitions
          : [],

      hasRelativesInPracticeClub:
        Boolean(hasRelativesInPracticeClub),

      relativesInPracticeClub:
        Array.isArray(relativesInPracticeClub)
          ? relativesInPracticeClub
          : [],

      updatedAt: new Date(),
    };

    const player =
      await Player.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "createdBy",
        "name username role"
      );

    if (!player) {
      return res.status(404).json({
        message: "Player सापडला नाही.",
      });
    }

    return res.status(200).json({
      message:
        "Player माहिती यशस्वीपणे update झाली.",
      player,
    });
  } catch (error) {
    console.error(
      "Update player error:",
      error
    );

    return res.status(500).json({
      message:
        "Player update करताना error आला.",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE PLAYER
// Admin Only
// =====================================================

const deletePlayer = async (req, res) => {
  try {
    const player =
      await Player.findByIdAndDelete(
        req.params.id
      );

    if (!player) {
      return res.status(404).json({
        message: "Player सापडला नाही.",
      });
    }

    return res.status(200).json({
      message:
        "Player यशस्वीपणे delete झाला.",
    });
  } catch (error) {
    console.error(
      "Delete player error:",
      error
    );

    return res.status(500).json({
      message:
        "Player delete करताना error आला.",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
};