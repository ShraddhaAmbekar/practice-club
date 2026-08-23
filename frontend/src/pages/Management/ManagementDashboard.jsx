import { useEffect, useState } from "react";
import PlayerForm from "../DataEntry/PlayerForm";

function ManagementDashboard({ user, onLogout }) {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] =
    useState(null);

  const [editingPlayer, setEditingPlayer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // GET ALL PLAYERS
  // ==========================================

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Login session सापडले नाही. कृपया पुन्हा Login करा."
        );
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/players",
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Players fetch करताना error आला."
        );
      }

      setPlayers(data);
    } catch (error) {
      console.error(
        "Fetch players error:",
        error
      );

      setError(
        error.message ||
          "Players fetch करताना error आला."
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

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Login session सापडले नाही."
        );
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/players/${playerId}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Player माहिती fetch करता आली नाही."
        );
      }

      setSelectedPlayer(data);
    } catch (error) {
      console.error(
        "View player error:",
        error
      );

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

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Login session सापडले नाही. कृपया पुन्हा Login करा."
        );
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/players/${playerId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Player delete करताना error आला."
        );
      }

      setPlayers((prevPlayers) =>
        prevPlayers.filter(
          (player) =>
            player._id !== playerId
        )
      );

      if (
        selectedPlayer?._id === playerId
      ) {
        setSelectedPlayer(null);
      }

      setError("");

      alert(
        "Player यशस्वीपणे delete झाला."
      );

    } catch (error) {
      console.error(
        "Delete player error:",
        error
      );

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

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // CLOSE DETAILS
  // ==========================================

  const closeDetails = () => {
    setSelectedPlayer(null);
    setError("");
  };

  // ==========================================
  // EDIT PLAYER
  // ==========================================

  if (editingPlayer) {
    return (
      <div className="min-h-screen bg-[#f5f8f6] text-slate-900">

        {/* Background */}

        <div className="fixed inset-0 pointer-events-none overflow-hidden">

          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-100/50 blur-3xl" />

          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-green-100/50 blur-3xl" />

        </div>

        <div className="relative z-10">

          {/* Header */}

          <header className="bg-white/90 backdrop-blur-md border-b border-slate-200">

            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-[#063b2b] flex items-center justify-center shadow-lg">

                  <span className="text-sm font-black text-white">
                    FC
                  </span>

                </div>

                <div>

                  <p className="text-sm font-black text-slate-900">
                    PRACTICE FC
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.25em] text-slate-400">
                    Alumni Management
                  </p>

                </div>

              </div>

              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-red-200 hover:text-red-600 transition"
              >
                Logout
              </button>

            </div>

          </header>

          {/* Edit content */}

          <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

            <div className="mb-7">

              <div className="flex items-center gap-2 mb-2">

                <span className="w-7 h-[2px] bg-emerald-500" />

                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-600">
                  Player Management
                </span>

              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#09251b]">
                Edit Player
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {editingPlayer.fullName}
              </p>

            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_15px_50px_rgba(15,23,42,0.07)] p-4 sm:p-7">

              <PlayerForm
                player={editingPlayer}

                onSave={(updatedPlayer) => {
                  console.log(
                    "Updated player:",
                    updatedPlayer
                  );

                  setPlayers((prevPlayers) =>
                    prevPlayers.map((player) =>
                      player._id ===
                      updatedPlayer._id
                        ? updatedPlayer
                        : player
                    )
                  );

                  setSelectedPlayer(
                    updatedPlayer
                  );

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
  // PLAYER DETAILS VIEW
  // ==========================================

  if (selectedPlayer) {
    return (
      <div className="min-h-screen bg-[#f5f8f6] text-slate-900">

        {/* Background */}

        <div className="fixed inset-0 pointer-events-none overflow-hidden">

          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-100/50 blur-3xl" />

          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-green-100/50 blur-3xl" />

        </div>

        <div className="relative z-10">

          {/* Header */}

          <header className="bg-white/90 backdrop-blur-md border-b border-slate-200">

            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-[#063b2b] flex items-center justify-center shadow-lg">

                  <span className="text-sm font-black text-white">
                    FC
                  </span>

                </div>

                <div>

                  <p className="text-sm font-black text-slate-900">
                    PRACTICE FC
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.25em] text-slate-400">
                    Alumni Management
                  </p>

                </div>

              </div>

              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-red-200 hover:text-red-600 transition"
              >
                Logout
              </button>

            </div>

          </header>

          {/* Details */}

          <main className="max-w-7xl mx-auto px-5 sm:px-8 py-7">

            {/* Page heading */}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">

              <div>

                <div className="flex items-center gap-2 mb-2">

                  <span className="w-7 h-[2px] bg-emerald-500" />

                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-600">
                    Alumni Profile
                  </span>

                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#09251b]">
                  Player Details
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  {selectedPlayer.fullName}
                </p>

              </div>

            </div>

            {/* Profile card */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_15px_50px_rgba(15,23,42,0.07)] overflow-hidden">

              {/* Top profile */}

              <div className="p-6 sm:p-8 bg-gradient-to-r from-[#063b2b] to-[#0b6046] text-white">

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center shrink-0">

                    {selectedPlayer.photo ? (

                      <img
                        src={selectedPlayer.photo}
                        alt={
                          selectedPlayer.fullName
                        }
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <span className="text-4xl">
                        ⚽
                      </span>

                    )}

                  </div>

                  <div className="text-center sm:text-left pt-2">

                    <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-200 font-bold">
                      Practice Football Club
                    </p>

                    <h2 className="mt-2 text-2xl sm:text-3xl font-black">
                      {selectedPlayer.fullName}
                    </h2>

                    {selectedPlayer.nickname && (
                      <p className="mt-1 text-sm text-emerald-100">
                        "{selectedPlayer.nickname}"
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">

                      {selectedPlayer.playingPosition && (

                        <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold uppercase tracking-wider">
                          {selectedPlayer.playingPosition}
                        </span>

                      )}

                      {selectedPlayer.practiceClubFromYear && (

                        <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold uppercase tracking-wider">
                          Since {selectedPlayer.practiceClubFromYear}
                        </span>

                      )}

                    </div>

                  </div>

                </div>

              </div>

              {/* Personal Information */}

              <div className="p-6 sm:p-8 border-b border-slate-100">

                <SectionTitle title="वैयक्तिक माहिती" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">

                  <Detail
                    label="पूर्ण नाव"
                    value={
                      selectedPlayer.fullName
                    }
                  />

                  <Detail
                    label="टोपण नाव"
                    value={
                      selectedPlayer.nickname
                    }
                  />

                  <Detail
                    label="जन्मतारीख"
                    value={formatDate(
                      selectedPlayer.birthDate
                    )}
                  />

                  <Detail
                    label="contact Number"
                    value={
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
                    value={
                      selectedPlayer.foodPreference
                    }
                  />

                </div>

              </div>

              {/* Football Information */}

              <div className="p-6 sm:p-8 border-b border-slate-100">

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

              <div className="p-6 sm:p-8 border-b border-slate-100">

                <SectionTitle title="आठवणीतील उल्लेखनीय स्पर्धा" />

                {selectedPlayer
                  .memorableCompetitions
                  ?.length > 0 ? (

                  <div className="mt-5 space-y-2">

                    {selectedPlayer.memorableCompetitions.map(
                      (
                        competition,
                        index
                      ) => (

                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                        >

                          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                            {index + 1}
                          </span>

                          <span className="text-sm font-medium text-slate-700">
                            {competition}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p className="mt-4 text-sm text-slate-400">
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
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {selectedPlayer.hasRelativesInPracticeClub
                      ? "होय"
                      : "नाही"}
                  </span>

                </div>

                {selectedPlayer
                  .relativesInPracticeClub
                  ?.length > 0 && (

                  <div className="mt-4 space-y-2">

                    {selectedPlayer.relativesInPracticeClub.map(
                      (
                        relative,
                        index
                      ) => (

                        <div
                          key={index}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                        >

                          <p className="font-bold text-slate-800">
                            {relative.name}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {relative.relation}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

            {/* Actions */}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">

              <button
                onClick={() =>
                  setEditingPlayer(
                    selectedPlayer
                  )
                }
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#063b2b] text-white text-sm font-bold hover:bg-emerald-800 transition shadow-lg shadow-emerald-900/10"
              >
                ✏️ Edit Player
              </button>

              <button
                onClick={() =>
                  handleDeletePlayer(
                    selectedPlayer._id
                  )
                }
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition"
              >
                🗑️ Delete Player
              </button>

              <button
                onClick={closeDetails}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition"
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
    <div className="min-h-screen bg-[#f5f8f6] text-slate-900">

      {/* Background */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-green-100/50 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(#064e3b 1px, transparent 1px), linear-gradient(90deg, #064e3b 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

      </div>

      <div className="relative z-10">

        {/* ======================================
            HEADER
        ====================================== */}

        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">

          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">

            <div className="flex items-center gap-3">

              {/* Logo placeholder */}

              <div className="w-11 h-11 rounded-xl bg-[#063b2b] flex items-center justify-center shadow-lg shadow-emerald-900/10">

                <span className="text-sm font-black text-white">
                  FC
                </span>

              </div>

              <div>

                <p className="text-sm font-black tracking-tight text-slate-900">
                  PRACTICE FC
                </p>

                <p className="text-[9px] uppercase tracking-[0.25em] text-slate-400">
                  Alumni Management
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="hidden sm:flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-emerald-500" />

                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400">
                  Management Portal
                </span>

              </div>

              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-red-200 hover:text-red-600 transition"
              >
                Logout
              </button>

            </div>

          </div>

        </header>

        {/* ======================================
            MAIN
        ====================================== */}

        <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

          {/* Welcome */}

          <div className="mb-8">

            <div className="flex items-center gap-2 mb-3">

              <span className="w-8 h-[2px] bg-emerald-500" />

              <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-emerald-600">
                Club Administration
              </span>

            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

              <div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-[#09251b]">
                  Management Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Welcome,{" "}
                  <span className="font-bold text-slate-700">
                    {user.name}
                  </span>
                </p>

              </div>

            </div>

          </div>

          {/* ======================================
              SUMMARY
          ====================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

            <div className="relative overflow-hidden bg-[#063b2b] rounded-2xl p-6 text-white shadow-[0_15px_40px_rgba(6,59,43,0.15)]">

              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-white/10" />

              <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-200 font-bold">
                Alumni Players
              </p>

              <div className="mt-3 flex items-end gap-2">

                <strong className="text-4xl font-black">
                  {players.length}
                </strong>

                <span className="text-xs text-emerald-200 mb-1">
                  Total
                </span>

              </div>

            </div>

            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400 font-bold">
                Club
              </p>

              <p className="mt-3 text-xl font-black text-[#09251b]">
                Practice FC
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Football Alumni
              </p>

            </div>

            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400 font-bold">
                Status
              </p>

              <div className="mt-3 flex items-center gap-2">

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

                <span className="text-xl font-black text-[#09251b]">
                  Active
                </span>

              </div>

              <p className="mt-1 text-xs text-slate-400">
                Management system
              </p>

            </div>

          </div>

          {/* ======================================
              PLAYERS SECTION
          ====================================== */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_15px_50px_rgba(15,23,42,0.06)] overflow-hidden">

            {/* Section Header */}

            <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-xl font-black text-[#09251b]">
                    Players
                  </h2>

                  <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    {players.length}
                  </span>

                </div>

                <p className="mt-1 text-xs text-slate-400">
                  नोंद झालेल्या सर्व खेळाडूंची माहिती
                </p>

              </div>

              <button
                onClick={fetchPlayers}
                className="self-start sm:self-auto px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition"
              >
                ↻ Refresh
              </button>

            </div>

            {/* Loading */}

            {loading && (

              <div className="p-12 text-center">

                <div className="w-8 h-8 mx-auto border-2 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />

                <p className="mt-4 text-sm text-slate-400">
                  Players माहिती load होत आहे...
                </p>

              </div>

            )}

            {/* Details Loading */}

            {detailsLoading && (

              <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 text-xs text-emerald-700">
                Player माहिती load होत आहे...
              </div>

            )}

            {/* Error */}

            {error && (

              <div className="mx-5 sm:mx-7 mt-5 flex gap-3 items-start rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                <span className="w-5 h-5 shrink-0 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">
                  !
                </span>

                <p className="text-xs leading-5 text-red-600">
                  {error}
                </p>

              </div>

            )}

            {/* Empty */}

            {!loading &&
              !error &&
              players.length === 0 && (

                <div className="p-14 text-center">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl">
                    ⚽
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-600">
                    अजून कोणत्याही Player ची माहिती नोंद झालेली नाही.
                  </p>

                </div>

              )}

            {/* Table */}

            {!loading &&
              !error &&
              players.length > 0 && (

                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead>

                      <tr className="bg-slate-50/80 border-b border-slate-100">

                        <th className="px-5 sm:px-7 py-4 text-[9px] uppercase tracking-[0.18em] font-black text-slate-400">
                          No.
                        </th>

                        <th className="px-5 py-4 text-[9px] uppercase tracking-[0.18em] font-black text-slate-400">
                          Player Name
                        </th>

                        <th className="px-5 py-4 text-[9px] uppercase tracking-[0.18em] font-black text-slate-400">
                          Created By
                        </th>

                        <th className="px-5 py-4 text-[9px] uppercase tracking-[0.18em] font-black text-slate-400">
                          Created At
                        </th>

                        <th className="px-5 sm:px-7 py-4 text-[9px] uppercase tracking-[0.18em] font-black text-slate-400">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {players.map(
                        (
                          player,
                          index
                        ) => (

                          <tr
                            key={player._id}
                            className="group hover:bg-emerald-50/40 transition"
                          >

                            <td className="px-5 sm:px-7 py-4">

                              <span className="text-xs font-bold text-slate-400">
                                {String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                            </td>

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs overflow-hidden">

                                  {player.photo ? (

                                    <img
                                      src={
                                        player.photo
                                      }
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />

                                  ) : (
                                    "⚽"
                                  )}

                                </div>

                                <div>

                                  <p className="text-sm font-bold text-slate-800">
                                    {player.fullName}
                                  </p>

                                  {player.nickname && (

                                    <p className="text-[10px] text-slate-400">
                                      {player.nickname}
                                    </p>

                                  )}

                                </div>

                              </div>

                            </td>

                            <td className="px-5 py-4">

                              <span className="text-xs text-slate-500">
                                {player.createdBy?.name ||
                                  "-"}
                              </span>

                            </td>

                            <td className="px-5 py-4">

                              <span className="text-xs text-slate-500">
                                {formatDate(
                                  player.createdAt
                                )}
                              </span>

                            </td>

                            <td className="px-5 sm:px-7 py-4">

                              <button
                                className="px-4 py-2 rounded-lg bg-[#063b2b] text-white text-[10px] uppercase tracking-wider font-bold hover:bg-emerald-800 hover:shadow-md transition"
                                onClick={() =>
                                  handleViewPlayer(
                                    player._id
                                  )
                                }
                              >
                                View
                              </button>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

          </section>

        </main>

        {/* Footer */}

        <footer className="max-w-7xl mx-auto px-5 sm:px-8 py-6">

          <p className="text-center text-[9px] uppercase tracking-[0.25em] text-slate-400">
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

      <span className="w-1 h-6 rounded-full bg-emerald-600" />

      <h2 className="text-lg font-black text-[#09251b]">
        {title}
      </h2>

    </div>
  );
}

// ==========================================
// DETAIL COMPONENT
// ==========================================

function Detail({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 hover:border-emerald-100 hover:bg-emerald-50/30 transition">

      <span className="block text-[9px] uppercase tracking-[0.15em] font-bold text-slate-400">
        {label}
      </span>

      <strong className="block mt-2 text-sm font-bold text-slate-800 break-words">
        {value || "-"}
      </strong>

    </div>
  );
}

export default ManagementDashboard;