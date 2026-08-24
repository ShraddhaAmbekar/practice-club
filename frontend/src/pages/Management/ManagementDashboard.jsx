import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import PlayerForm from "../DataEntry/PlayerForm";
import API_URL from "../../api";
import logo from "./../../assets/logo.png";
function ManagementDashboard({ user, onLogout }) {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET ALL PLAYER
  // ==========================================

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Login session सापडले नाही. कृपया पुन्हा Login करा."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/players`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Players fetch करताना error आला."
        );
      }

      setPlayers(data);
    } catch (error) {
      console.error("Fetch players error:", error);

      setError(
        error.message || "Players fetch करताना error आला."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET SINGLE PLAYER
  // ==========================================

  const handleViewPlayer = async (playerId) => {
    try {
      setDetailsLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Login session सापडले नाही.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/players/${playerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Player माहिती fetch करता आली नाही."
        );
      }

      setSelectedPlayer(data);
    } catch (error) {
      console.error("View player error:", error);

      setError(
        error.message ||
          "Player माहिती fetch करताना error आला."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================
  // DELETE PLAYER
  // ==========================================

  const handleDeletePlayer = async (playerId) => {
    const confirmed = window.confirm(
      "हा Player कायमचा delete करायचा आहे का?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Login session सापडले नाही. कृपया पुन्हा Login करा."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/players/${playerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Player delete करताना error आला."
        );
      }

      setPlayers((prevPlayers) =>
        prevPlayers.filter(
          (player) => player._id !== playerId
        )
      );

      if (selectedPlayer?._id === playerId) {
        setSelectedPlayer(null);
      }

      alert("Player यशस्वीपणे delete झाला.");
    } catch (error) {
      console.error("Delete player error:", error);

      setError(
        error.message ||
          "Player delete करताना error आला."
      );
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ==========================================
  // CLOSE DETAILS
  // ==========================================

  const closeDetails = () => {
    setSelectedPlayer(null);
    setError("");
  };

  // ==========================================
  // EXPORT TO EXCEL
  // ==========================================

  const exportToExcel = async () => {
  if (!players || players.length === 0) {
    alert("Export करण्यासाठी Player data उपलब्ध नाही.");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Players");

    // Columns
    worksheet.columns = [
      { header: "Sr. No.", key: "srNo", width: 10 },
      { header: "Photo", key: "photo", width: 18 },
      { header: "Full Name", key: "fullName", width: 25 },
      { header: "Nickname", key: "nickname", width: 18 },
      { header: "Birth Date", key: "birthDate", width: 15 },
      { header: "WhatsApp Number", key: "whatsappNumber", width: 20 },
      { header: "Alternate Contact Number", key: "alternateContactNumber", width: 25 },
      { header: "Food Preference", key: "foodPreference", width: 18 },
      { header: "Football Started Year", key: "footballStartedYear", width: 22 },
      { header: "Playing Position", key: "playingPosition", width: 20 },
      { header: "Practice Club From Year", key: "practiceClubFromYear", width: 25 },
      { header: "Practice Club To Year", key: "practiceClubToYear", width: 25 },
      {
        header: "Currently Playing At Practice Club",
        key: "currentlyPlayingAtPracticeClub",
        width: 35,
      },
      {
        header: "Memorable Competitions",
        key: "memorableCompetitions",
        width: 40,
      },
      {
        header: "Has Relatives In Practice Club",
        key: "hasRelativesInPracticeClub",
        width: 30,
      },
      {
        header: "Relatives",
        key: "relatives",
        width: 40,
      },
      {
        header: "Family Members Coming",
        key: "familyMembersComing",
        width: 25,
      },
      {
        header: "Family Veg Members",
        key: "familyVegMembers",
        width: 22,
      },
      {
        header: "Family Non-Veg Members",
        key: "familyNonVegMembers",
        width: 25,
      },
      {
        header: "Total Family Members",
        key: "totalFamilyMembers",
        width: 22,
      },
      {
        header: "Created By",
        key: "createdBy",
        width: 20,
      },
      {
        header: "Created At",
        key: "createdAt",
        width: 20,
      },
    ];

    // Header styling
    worksheet.getRow(1).font = {
      bold: true,
    };

    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.getRow(1).height = 25;

    // Add players
    for (let index = 0; index < players.length; index++) {
      const player = players[index];

      const familyMembers = Number(
        player.familyMembersComing || 0
      );

      const vegMembers = Number(
        player.familyVegMembers || 0
      );

      const nonVegMembers = Number(
        player.familyNonVegMembers || 0
      );

      const row = worksheet.addRow({
        srNo: index + 1,

        // Photo separately add करणार आहोत
        photo: "",

        fullName: player.fullName || "",

        nickname: player.nickname || "",

        birthDate: player.birthDate
          ? new Date(player.birthDate).toLocaleDateString("en-IN")
          : "",

        whatsappNumber:
          player.whatsappNumber ||
          player.contactNumber ||
          "",

        alternateContactNumber:
          player.alternateContactNumber || "",

        foodPreference:
          player.foodPreference || "",

        footballStartedYear:
          player.footballStartedYear || "",

        playingPosition:
          player.playingPosition || "",

        practiceClubFromYear:
          player.practiceClubFromYear || "",

        practiceClubToYear:
          player.practiceClubToYear || "",

        currentlyPlayingAtPracticeClub:
          player.currentlyPlayingAtPracticeClub
            ? "Yes"
            : "No",

        memorableCompetitions:
          Array.isArray(player.memorableCompetitions)
            ? player.memorableCompetitions.join(", ")
            : "",

        hasRelativesInPracticeClub:
          player.hasRelativesInPracticeClub
            ? "Yes"
            : "No",

        relatives:
          Array.isArray(player.relativesInPracticeClub)
            ? player.relativesInPracticeClub
                .map(
                  (relative) =>
                    `${relative.name || ""} (${
                      relative.relation || ""
                    })`
                )
                .join(", ")
            : "",

        familyMembersComing: familyMembers,

        familyVegMembers: vegMembers,

        familyNonVegMembers: nonVegMembers,

        totalFamilyMembers:
          vegMembers + nonVegMembers,

        createdBy:
          player.createdBy?.name || "",

        createdAt:
          player.createdAt
            ? new Date(
                player.createdAt
              ).toLocaleDateString("en-IN")
            : "",
      });

      // Excel row height
      row.height = 80;

      // ======================================
      // ADD ACTUAL PHOTO
      // ======================================

      if (player.photo) {
        try {
          const response = await fetch(player.photo);

          if (!response.ok) {
            throw new Error("Photo fetch failed");
          }

          const blob = await response.blob();

          const arrayBuffer = await blob.arrayBuffer();

          let extension = "jpeg";

          if (blob.type.includes("png")) {
            extension = "png";
          } else if (blob.type.includes("webp")) {
            extension = "jpeg";
          }

          const imageId = workbook.addImage({
            buffer: arrayBuffer,
            extension,
          });

          worksheet.addImage(imageId, {
            tl: {
              col: 1,
              row: index + 1,
            },
            ext: {
              width: 80,
              height: 80,
            },
          });
        } catch (photoError) {
          console.error(
            "Photo export failed:",
            photoError
          );

          row.getCell(2).value = "Photo unavailable";
        }
      }
    }

    // Borders / alignment
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: "middle",
          wrapText: true,
        };

        cell.border = {
          top: {
            style: "thin",
          },
          left: {
            style: "thin",
          },
          bottom: {
            style: "thin",
          },
          right: {
            style: "thin",
          },
        };
      });
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob(
      [buffer],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      "Practice_Football_Club_Players.xlsx";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    alert("Player data आणि photos Excel मध्ये export झाले.");
  } catch (error) {
    console.error("Excel export error:", error);

    alert(
      "Excel export करताना error आला. Console तपासा."
    );
  }
};

  // ==========================================
  // EDIT PLAYER
  // ==========================================

  if (editingPlayer) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] text-[#111111]">

        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#F5E7B2]/40 blur-3xl" />

          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#D4A017]/10 blur-3xl" />
        </div>

        <div className="relative z-10">

          {/* Header */}
          <header className="bg-[#111111] border-b border-[#8A5A0A]/30">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">

              <div className="flex items-center gap-3">
<div className="w-14 h-14 flex items-center justify-center">
  <img
    src={logo}
    alt="Practice Football Club Logo"
    className="w-full h-full object-contain"
  />
</div>

                <div>
                  <p className="text-sm font-black text-[#D4A017]">
                    PRACTICE
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#D4A017]/60">
                    Football Club
                  </p>
                </div>

              </div>

              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg border border-white/20 bg-[#111111] text-xs font-bold text-white hover:bg-black transition"
              >
                Logout
              </button>

            </div>
          </header>

          {/* Edit Content */}
          <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

            <div className="mb-7">

              <div className="flex items-center gap-2 mb-2">

                <span className="w-7 h-[2px] bg-[#111111]" />

                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8A5A0A]">
                  Player Management
                </span>

              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111111]">
                Edit Player
              </h1>

              <p className="mt-2 text-sm text-[#6F6250]">
                {editingPlayer.fullName}
              </p>

            </div>

            <div className="bg-white rounded-2xl border border-[#E8D49A] shadow-[0_15px_50px_rgba(138,90,10,0.08)] p-4 sm:p-7">

              <PlayerForm
                player={editingPlayer}

                onSave={(updatedPlayer) => {
                  setPlayers((prevPlayers) =>
                    prevPlayers.map((player) =>
                      player._id === updatedPlayer._id
                        ? updatedPlayer
                        : player
                    )
                  );

                  setSelectedPlayer(updatedPlayer);
                  setEditingPlayer(null);
                }}

                onCancel={() => {
                  setEditingPlayer(null);
                }}
              />

            </div>

          </main>

        </div>
      </div>
    );
  }

  // ==========================================
  // PLAYER DETAILS
  // ==========================================

  if (selectedPlayer) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] text-[#111111]">

        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">

          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#F5E7B2]/40 blur-3xl" />

          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#D4A017]/10 blur-3xl" />

        </div>

        <div className="relative z-10">

          {/* Header */}
          <header className="bg-[#111111] border-b border-[#D4A017]/40 sticky top-0 z-30">

            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-14 h-14 flex items-center justify-center">
  <img
    src={logo}
    alt="Practice Football Club Logo"
    className="w-full h-full object-contain"
  />
</div>

                <div>

                  <p className="text-sm font-black tracking-tight text-white">
                    PRACTICE FC
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#D4A017]">
                    Alumni Management
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="hidden sm:flex items-center gap-2">

                  <span className="w-2 h-2 rounded-full bg-[#D4A017]" />

                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#E8D49A]">
                    Management Portal
                  </span>

                </div>

                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-xs font-bold text-white hover:bg-[#D4A017] hover:text-[#111111] transition"
                >
                  Logout
                </button>

              </div>

            </div>

          </header>

          {/* Details */}
          <main className="max-w-7xl mx-auto px-5 sm:px-8 py-7">

            <div className="mb-7">

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111111]">
                Player Details
              </h1>

              <p className="mt-2 text-sm text-[#6F6250]">
                {selectedPlayer.fullName}
              </p>

            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-[#E8D49A] shadow-[0_15px_50px_rgba(138,90,10,0.08)] overflow-hidden">

              {/* Profile Header */}
              <div className="p-6 sm:p-8 bg-[#D4A017] text-[#111111]">

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#111111]/10 border border-[#111111]/20 overflow-hidden flex items-center justify-center shrink-0">

                    {selectedPlayer.photo ? (
                      <img
                        src={selectedPlayer.photo}
                        alt={selectedPlayer.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">
                        ⚽
                      </span>
                    )}

                  </div>

                  <div className="text-center sm:text-left pt-2">

                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#111111]/70 font-bold">
                      Practice Football Club
                    </p>

                    <h2 className="mt-2 text-2xl sm:text-3xl font-black">
                      {selectedPlayer.fullName}
                    </h2>

                    {selectedPlayer.nickname && (
                      <p className="mt-1 text-sm text-[#111111]/70">
                        "{selectedPlayer.nickname}"
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">

                      {selectedPlayer.playingPosition && (
                        <span className="px-3 py-1.5 rounded-full bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider">
                          {selectedPlayer.playingPosition}
                        </span>
                      )}

                      {selectedPlayer.practiceClubFromYear && (
                        <span className="px-3 py-1.5 rounded-full bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider">
                          Since{" "}
                          {selectedPlayer.practiceClubFromYear}
                        </span>
                      )}

                    </div>

                  </div>

                </div>

              </div>

              {/* Personal Information */}
              <div className="p-6 sm:p-8 border-b border-[#F0E5C3]">

                <SectionTitle title="वैयक्तिक माहिती" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">

                  <Detail
                    label="पूर्ण नाव"
                    value={selectedPlayer.fullName}
                  />

                  <Detail
                    label="टोपण नाव"
                    value={selectedPlayer.nickname}
                  />

                  <Detail
                    label="जन्मतारीख"
                    value={formatDate(
                      selectedPlayer.birthDate
                    )}
                  />

                  <Detail
                    label="WhatsApp Number"
                    value={
                      selectedPlayer.whatsappNumber ||
                      selectedPlayer.contactNumber
                    }
                  />

                  <Detail
                    label="Alternate Contact Number"
                    value={
                      selectedPlayer.alternateContactNumber
                    }
                  />

                  <Detail
                    label="आहार प्रकार"
                    value={selectedPlayer.foodPreference}
                  />

                </div>

              </div>

              {/* Football Information */}
              <div className="p-6 sm:p-8 border-b border-[#F0E5C3]">

                <SectionTitle title="Football माहिती" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">

                  <Detail
                    label="Football सुरू केलेले वर्ष"
                    value={
                      selectedPlayer.footballStartedYear
                    }
                  />

                  <Detail
                    label="Practice Club प्रवेश वर्ष"
                    value={
                      selectedPlayer.practiceClubFromYear
                    }
                  />

                  <Detail
                    label="Practice Club मधील शेवटचे वर्ष"
                    value={
                      selectedPlayer.practiceClubToYear
                    }
                  />

                  <Detail
                    label="सध्या Practice Club मध्ये"
                    value={
                      selectedPlayer.currentlyPlayingAtPracticeClub
                        ? "होय"
                        : "नाही"
                    }
                  />

                  <Detail
                    label="खेळातील प्रमुख स्थान"
                    value={
                      selectedPlayer.playingPosition
                    }
                  />

                </div>

              </div>

              {/* Competitions */}
              <div className="p-6 sm:p-8 border-b border-[#F0E5C3]">

                <SectionTitle title="आठवणीतील उल्लेखनीय स्पर्धा" />

                {selectedPlayer.memorableCompetitions?.length >
                0 ? (
                  <div className="mt-5 space-y-2">

                    {selectedPlayer.memorableCompetitions.map(
                      (competition, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFDF7] border border-[#F0E5C3]"
                        >

                          <span className="w-7 h-7 rounded-lg bg-[#D4A017] text-[#111111] flex items-center justify-center text-xs font-black">
                            {index + 1}
                          </span>

                          <span className="text-sm font-medium text-[#3F382E]">
                            {competition}
                          </span>

                        </div>
                      )
                    )}

                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[#9A8F7D]">
                    कोणतीही माहिती नाही.
                  </p>
                )}

              </div>

              {/* Relatives */}
              <div className="p-6 sm:p-8">

                <SectionTitle title="Practice Club मधील नातेवाईक" />

                <div className="mt-5">

                  <span
                    className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                      selectedPlayer.hasRelativesInPracticeClub
                        ? "bg-[#D4A017] text-[#111111]"
                        : "bg-[#F3F0E8] text-[#777064]"
                    }`}
                  >
                    {selectedPlayer.hasRelativesInPracticeClub
                      ? "होय"
                      : "नाही"}
                  </span>

                </div>

                {selectedPlayer.relativesInPracticeClub
                  ?.length > 0 && (
                  <div className="mt-4 space-y-2">

                    {selectedPlayer.relativesInPracticeClub.map(
                      (relative, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-[#FFFDF7] border border-[#F0E5C3]"
                        >

                          <p className="font-bold text-[#111111]">
                            {relative.name}
                          </p>

                          <p className="text-xs text-[#9A8F7D] mt-1">
                            {relative.relation}
                          </p>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              {/* FAMILY MEMBERS */}
              <div className="p-6 sm:p-8 border-t border-[#F0E5C3]">

                <SectionTitle title="Family Members माहिती" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">

                  <Detail
                    label="एकूण Family Members"
                    value={
                      selectedPlayer.familyMembersComing
                    }
                  />

                  <Detail
                    label="Veg Members"
                    value={
                      selectedPlayer.familyVegMembers
                    }
                  />

                  <Detail
                    label="Non-Veg Members"
                    value={
                      selectedPlayer.familyNonVegMembers
                    }
                  />

                </div>

              </div>

            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">

              <button
                onClick={() =>
                  setEditingPlayer(selectedPlayer)
                }
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#111111] text-white text-sm font-bold hover:bg-black transition shadow-lg"
              >
                ✏️ Edit Player
              </button>

              <button
                onClick={() =>
                  handleDeletePlayer(selectedPlayer._id)
                }
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#D4A017] text-[#111111] text-sm font-black hover:bg-[#C99216] transition"
              >
                🗑️ Delete Player
              </button>

              <button
                onClick={closeDetails}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white border border-[#E8D49A] text-[#111111] text-sm font-bold hover:bg-[#FFF8E5] transition"
              >
                ← Back to Players
              </button>

            </div>

          </main>

        </div>
      </div>
    );
  }

  // ==========================================
  // MANAGEMENT PLAYER LIST
  // ==========================================

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#111111]">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-[#F5E7B2]/40 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#D4A017]/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(#8A5A0A 1px, transparent 1px), linear-gradient(90deg, #8A5A0A 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

      </div>

      <div className="relative z-10">

        {/* HEADER */}
        <header className="bg-gradient-to-r from-[#111111] via-[#111111] to-[#D4A017] border-b border-[#111111]/30 sticky top-0 z-30">

          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-[#111111] flex items-center justify-center shadow-lg">

                <span className="text-sm font-black text-[#D4A017]">
                  FC
                </span>

              </div>

              <div>

                <p className="text-sm font-black tracking-tight text-[#ffffff]">
                  PRACTICE FOOTBALL CLUB
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              {/* EXPORT BUTTON */}
              <button
                type="button"
                onClick={exportToExcel}
                className="rounded-xl bg-[#ffffff] px-5 py-3 text-sm font-bold border border-[#D4A017] text-[#111111] transition hover:bg-[#D4A017] hover:text-[#111111]"
              >
                📊 Export to Excel
              </button>

              {/* LOGOUT */}
              <button
                onClick={onLogout}
                className="px-5 py-3 rounded-lg bg-[#111111] text-white text-xs font-bold hover:bg-black transition"
              >
                Logout
              </button>

            </div>

          </div>

        </header>

        {/* MAIN */}
        <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

          {/* Welcome */}
          <div className="mb-8">

            <div className="flex items-center gap-2 mb-3">

              <span className="h-[2px] bg-[#111111]" />

              <span className="text-[20px] font-bold text-[#8A5A0A]">
                Welcome to,
              </span>

            </div>

            <div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-[#111111]">
                Management Dashboard
              </h1>

            </div>

          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

            {/* Players */}
            <div className="relative overflow-hidden bg-[#D4A017] rounded-2xl p-6 text-[#111111] shadow-[0_15px_40px_rgba(138,90,10,0.15)]">

              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-[#111111]/10" />

              <p className="text-[10px] uppercase tracking-[0.22em] text-[#111111]/70 font-bold">
                Players
              </p>

              <div className="mt-3 flex items-end gap-2">

                <strong className="text-4xl font-black">
                  {players.length}
                </strong>

                <span className="text-xs text-[#111111]/70 mb-1">
                  Total
                </span>

              </div>

            </div>

            {/* Club */}
            <div className="hidden sm:block bg-white rounded-2xl border border-[#E8D49A] p-6 shadow-sm">

              <p className="text-[10px] uppercase tracking-[0.22em] text-[#8A5A0A] font-bold">
                Club
              </p>

              <p className="mt-3 text-xl font-black text-[#111111]">
                Practice FC
              </p>

              <p className="mt-1 text-xs text-[#9A8F7D]">
                Football Alumni
              </p>

            </div>

            {/* Status */}
            <div className="hidden sm:block bg-white rounded-2xl border border-[#E8D49A] p-6 shadow-sm">

              <p className="text-[10px] uppercase tracking-[0.22em] text-[#8A5A0A] font-bold">
                Status
              </p>

              <div className="mt-3 flex items-center gap-2">

                <span className="w-2.5 h-2.5 rounded-full bg-[#D4A017]" />

                <span className="text-xl font-black text-[#111111]">
                  Active
                </span>

              </div>

              <p className="mt-1 text-xs text-[#9A8F7D]">
                Management system
              </p>

            </div>

          </div>

          {/* PLAYERS */}
          <section className="bg-white rounded-2xl border border-[#E8D49A] shadow-[0_15px_50px_rgba(138,90,10,0.07)] overflow-hidden">

            {/* Section Header */}
            <div className="px-5 sm:px-7 py-5 border-b border-[#F0E5C3] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-xl font-black text-[#111111]">
                    Players
                  </h2>

                  <span className="px-2 py-1 rounded-md bg-[#D4A017] text-[#111111] text-[10px] font-black">
                    {players.length}
                  </span>

                </div>

                <p className="mt-1 text-xs text-[#9A8F7D]">
                  नोंद झालेल्या सर्व खेळाडूंची माहिती
                </p>

              </div>

              <button
                onClick={fetchPlayers}
                className="self-start sm:self-auto px-4 py-2.5 rounded-lg bg-[#111111] text-white text-xs font-bold hover:bg-black transition"
              >
                ↻ Refresh
              </button>

            </div>

            {/* Loading */}
            {loading && (
              <div className="p-12 text-center">

                <div className="w-8 h-8 mx-auto border-2 border-[#F5E7B2] border-t-[#111111] rounded-full animate-spin" />

                <p className="mt-4 text-sm text-[#9A8F7D]">
                  Players माहिती load होत आहे...
                </p>

              </div>
            )}

            {/* Details Loading */}
            {detailsLoading && (
              <div className="px-6 py-3 bg-[#FFF8E5] border-b border-[#E8D49A] text-xs text-[#8A5A0A]">
                Player माहिती load होत आहे...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mx-5 sm:mx-7 mt-5 flex gap-3 items-start rounded-xl border border-[#D4A017] bg-[#FFF8E5] px-4 py-3">

                <span className="w-5 h-5 shrink-0 rounded-full bg-[#111111] flex items-center justify-center text-xs font-black text-[#D4A017]">
                  !
                </span>

                <p className="text-xs leading-5 text-[#8A5A0A]">
                  {error}
                </p>

              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              players.length === 0 && (
                <div className="p-14 text-center">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#D4A017] flex items-center justify-center text-2xl">
                    ⚽
                  </div>

                  <p className="mt-4 text-sm font-bold text-[#6F6250]">
                    अजून कोणत्याही Player ची माहिती नोंद झालेली नाही.
                  </p>

                </div>
              )}

            {/* TABLE */}
            {!loading &&
              !error &&
              players.length > 0 && (
                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead>

                      <tr className="bg-[#FFF8E5] border-b border-[#E8D49A]">

                        <th className="px-5 sm:px-7 py-4 text-[12px] uppercase tracking-[0.18em] font-black text-[#8A5A0A]">
                          No.
                        </th>

                        <th className="px-5 py-4 text-[14px] uppercase tracking-[0.18em] font-black text-[#8A5A0A]">
                          Player Name
                        </th>

                        <th className="px-5 py-4 text-[14px] uppercase tracking-[0.18em] font-black text-[#8A5A0A]">
                          Created By
                        </th>

                        <th className="px-5 py-4 text-[14px] uppercase tracking-[0.18em] font-black text-[#8A5A0A]">
                          Created At
                        </th>

                        <th className="px-5 sm:px-7 py-4 text-[14px] uppercase tracking-[0.18em] font-black text-[#8A5A0A]">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-[#F0E5C3]">

                      {players.map((player, index) => (

                        <tr
                          key={player._id}
                          className="group hover:bg-[#FFF8E5] transition"
                        >

                          <td className="px-5 sm:px-7 py-4">

                            <span className="text-xs font-bold text-[#9A8F7D]">
                              {String(index + 1).padStart(
                                2,
                                "0"
                              )}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-9 h-9 rounded-lg bg-[#D4A017] text-[#111111] flex items-center justify-center font-black text-xs overflow-hidden">

                                {player.photo ? (
                                  <img
                                    src={player.photo}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  "⚽"
                                )}

                              </div>

                              <div>

                                <p className="text-sm font-bold text-[#111111]">
                                  {player.fullName}
                                </p>

                                {player.nickname && (
                                  <p className="text-[10px] text-[#9A8F7D]">
                                    {player.nickname}
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <span className="text-xs text-[#111111] font-bold">
                              {player.createdBy?.name || "-"}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span className="text-xs text-[#6F6250]">
                              {formatDate(player.createdAt)}
                            </span>

                          </td>

                          <td className="px-5 sm:px-7 py-4">

                            <button
                              className="px-4 py-2 rounded-lg bg-[#111111] text-white text-[10px] uppercase tracking-wider font-black hover:bg-black hover:shadow-md transition"
                              onClick={() =>
                                handleViewPlayer(player._id)
                              }
                            >
                              View
                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>
              )}

          </section>

        </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-5 sm:px-8 py-6">

          <p className="text-center text-[9px] uppercase tracking-[0.25em] text-[#9A8F7D]">
            Practice Football Club • Alumni Management System
          </p>

        </footer>

      </div>

    </div>
  );
}

// ==========================================
// SECTION TITLE
// ==========================================

function SectionTitle({ title }) {
  return (
    <div className="flex items-center gap-3">

      <span className="w-1 h-6 rounded-full bg-[#D4A017]" />

      <h2 className="text-lg font-black text-[#111111]">
        {title}
      </h2>

    </div>
  );
}

// ==========================================
// DETAIL COMPONENT
// ==========================================

function Detail({ label, value }) {
  return (
    <div className="rounded-xl bg-[#FFFDF7] border border-[#F0E5C3] p-4 hover:border-[#D4A017] hover:bg-[#FFF8E5] transition">

      <span className="block text-[9px] uppercase tracking-[0.15em] font-bold text-[#8A5A0A]">
        {label}
      </span>

      <strong className="block mt-2 text-sm font-bold text-[#111111] break-words">
        {value || "-"}
      </strong>

    </div>
  );
}

export default ManagementDashboard;