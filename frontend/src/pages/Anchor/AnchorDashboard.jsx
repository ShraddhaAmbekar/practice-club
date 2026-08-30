import { useEffect, useMemo, useState } from "react";
import API_URL from "../../api";

function AnchorDashboard({ user, onLogout }) {
  // =====================================================
  // STATES
  // =====================================================

  const [players, setPlayers] = useState([]);
  const [gateEntries, setGateEntries] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [awardLoading, setAwardLoading] = useState(null);

  const [error, setError] = useState("");

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchAllData();
  }, []);

  // =====================================================
  // COMMON JSON RESPONSE HANDLER
  // =====================================================

  const getResponseData = async (response) => {
    const contentType =
      response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return await response.json();
    }

    const text = await response.text();

    console.error(
      "Non-JSON API Response:",
      text
    );

    throw new Error(
      `Server Error: ${response.status} ${response.statusText}`
    );
  };

  // =====================================================
  // FETCH PLAYERS + GATE ENTRIES
  // =====================================================

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Login session सापडले नाही. कृपया पुन्हा Login करा."
        );
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // =================================================
      // FETCH PLAYERS
      // =================================================

      const playerResponse = await fetch(
        `${API_URL}/api/players`,
        {
          method: "GET",
          headers,
        }
      );

      const playerData =
        await getResponseData(playerResponse);

      if (!playerResponse.ok) {
        throw new Error(
          playerData.message ||
            "Players fetch करता आले नाहीत."
        );
      }

      const playerList = Array.isArray(playerData)
        ? playerData
        : playerData.players || [];

      setPlayers(playerList);

      // =================================================
      // FETCH GATE ENTRIES
      // =================================================

      const gateResponse = await fetch(
        `${API_URL}/api/gate-entries`,
        {
          method: "GET",
          headers,
        }
      );

      const gateData =
        await getResponseData(gateResponse);

      if (!gateResponse.ok) {
        throw new Error(
          gateData.message ||
            "Gate Entries fetch करता आले नाहीत."
        );
      }

      const gateList = Array.isArray(gateData)
        ? gateData
        : gateData.gateEntries || [];

      setGateEntries(gateList);
    } catch (err) {
      console.error(
        "Anchor Dashboard Load Error:",
        err
      );

      setError(
        err.message ||
          "Data load करताना error आला."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    fetchAllData();
  };

  // =====================================================
  // GET PLAYER ID FROM GATE ENTRY
  // =====================================================

  const getPlayerId = (entry) => {
    if (!entry?.player) {
      return null;
    }

    if (typeof entry.player === "object") {
      return (
        entry.player._id ||
        entry.player.id ||
        null
      );
    }

    return entry.player;
  };

  // =====================================================
  // CHECKED-IN ENTRIES ONLY
  // =====================================================

  const completedEntries = useMemo(() => {
    return gateEntries.filter(
      (entry) =>
        entry?.checkedIn === true &&
        entry?.player
    );
  }, [gateEntries]);

  // =====================================================
  // GET PLAYER FROM ENTRY
  // =====================================================

  const getPlayerFromEntry = (entry) => {
    const playerId =
      getPlayerId(entry);

    if (!playerId) {
      return null;
    }

    const player = players.find(
      (item) =>
        String(item._id) ===
        String(playerId)
    );

    if (!player) {
      return null;
    }

    return {
      ...player,
      gateEntry: entry,
    };
  };

  // =====================================================
  // COMPLETED / CHECKED-IN PLAYERS
  // =====================================================

  const completedPlayers = useMemo(() => {
    return completedEntries
      .map((entry) =>
        getPlayerFromEntry(entry)
      )
      .filter(Boolean)
      .sort((a, b) => {
        const yearA = Number(
          a.practiceClubFromYear
        );

        const yearB = Number(
          b.practiceClubFromYear
        );

        if (
          !Number.isNaN(yearA) &&
          !Number.isNaN(yearB)
        ) {
          if (yearA !== yearB) {
            return yearA - yearB;
          }
        }

        if (Number.isNaN(yearA)) {
          return 1;
        }

        if (Number.isNaN(yearB)) {
          return -1;
        }

        return (
          a.fullName || ""
        ).localeCompare(
          b.fullName || ""
        );
      });
  }, [completedEntries, players]);

  // =====================================================
  // GROUP PLAYERS YEAR-WISE
  // =====================================================

  const groupedCompletedPlayers = useMemo(() => {
    const groups = {};

    completedPlayers.forEach((player) => {
      const rawYear =
        player.practiceClubFromYear;

      const year =
        rawYear !== undefined &&
        rawYear !== null &&
        String(rawYear).trim() !== ""
          ? String(rawYear)
          : "Year Not Available";

      if (!groups[year]) {
        groups[year] = [];
      }

      groups[year].push(player);
    });

    return Object.entries(groups).sort(
      ([yearA], [yearB]) => {
        if (
          yearA === "Year Not Available"
        ) {
          return 1;
        }

        if (
          yearB === "Year Not Available"
        ) {
          return -1;
        }

        return (
          Number(yearA) -
          Number(yearB)
        );
      }
    );
  }, [completedPlayers]);

  // =====================================================
  // AWARD PLAYER
  // =====================================================

  const handleAwardPlayer = async (
    gateEntryId
  ) => {
    if (!gateEntryId) {
      setError(
        "Gate Entry ID सापडला नाही."
      );
      return;
    }

    if (awardLoading) {
      return;
    }

    try {
      setAwardLoading(gateEntryId);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Login session सापडले नाही. कृपया पुन्हा Login करा."
        );
      }

      // =================================================
      // IMPORTANT DEBUG
      // =================================================

      console.log(
        "Award Gate Entry ID:",
        gateEntryId
      );

      console.log(
        "Award API URL:",
        `${API_URL}/api/gate-entries/${gateEntryId}/award`
      );

      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(
        `${API_URL}/api/gate-entries/${gateEntryId}/award`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Award API Status:",
        response.status
      );

      const data =
        await getResponseData(response);

      console.log(
        "Award API Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Player Awarded करता आला नाही."
        );
      }

      // =================================================
      // UPDATE LOCAL GATE ENTRY
      // =================================================

      setGateEntries((prevEntries) =>
        prevEntries.map((entry) =>
          String(entry._id) ===
          String(gateEntryId)
            ? {
                ...entry,
                awarded: true,
              }
            : entry
        )
      );

      // =================================================
      // UPDATE SELECTED PLAYER IF OPEN
      // =================================================

      if (selectedPlayer) {
        setSelectedPlayer((prev) =>
          prev
            ? {
                ...prev,
              }
            : prev
        );
      }
    } catch (err) {
      console.error(
        "Award Player Error:",
        err
      );

      setError(
        err.message ||
          "Player Award करताना error आला."
      );
    } finally {
      setAwardLoading(null);
    }
  };

  // =====================================================
  // VIEW PLAYER DETAILS
  // =====================================================

  const handleViewPlayer = async (id) => {
    try {
      setDetailsLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Login session सापडले नाही."
        );
      }

      const response = await fetch(
        `${API_URL}/api/players/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Player माहिती मिळाली नाही."
        );
      }

      setSelectedPlayer(data);
    } catch (err) {
      console.error(
        "View Player Error:",
        err
      );

      setError(
        err.message ||
          "Player माहिती load करताना error आला."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // PLAYER DETAILS PAGE
  // =====================================================

  if (selectedPlayer) {
    const gateEntry =
      gateEntries.find((entry) => {
        const playerId =
          getPlayerId(entry);

        return (
          String(playerId) ===
          String(selectedPlayer._id)
        );
      });

    return (
      <div className="min-h-screen bg-[#FFFDF7] px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">

          {/* HEADER */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8A5A0A]">
                Practice Football Club
              </p>

              <h1 className="mt-1 text-2xl font-black text-[#111111] sm:text-3xl">
                Player Details
              </h1>

              <p className="mt-1 truncate text-sm text-[#6F6250]">
                {selectedPlayer.fullName}
              </p>
            </div>

            <button
              onClick={onLogout}
              className="h-11 w-full shrink-0 rounded-xl bg-[#111111] px-5 text-sm font-black text-white transition hover:bg-[#222222] sm:w-auto"
            >
              Logout
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">
              <span className="break-words">
                {error}
              </span>

              <button
                type="button"
                onClick={() => setError("")}
                className="shrink-0 text-lg"
              >
                ×
              </button>
            </div>
          )}

          {/* DETAILS */}

          <div className="space-y-5">

            {/* PHOTO + STATUS */}

            <div className="rounded-[22px] border border-emerald-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">

                {selectedPlayer.photo ? (
                  <img
                    src={selectedPlayer.photo}
                    alt={selectedPlayer.fullName}
                    className="h-32 w-32 shrink-0 rounded-2xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-4xl">
                    ⚽
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="break-words text-2xl font-black text-[#111111]">
                    {selectedPlayer.fullName}
                  </h2>

                  {selectedPlayer.nickname && (
                    <p className="mt-1 text-sm text-slate-400">
                      {selectedPlayer.nickname}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">

                    {gateEntry?.checkedIn && (
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                        ✓ Checked In
                      </span>
                    )}

                    {gateEntry?.awarded && (
                      <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">
                        🏆 Awarded
                      </span>
                    )}

                  </div>
                </div>

              </div>
            </div>

            {/* PERSONAL INFORMATION */}

            <InfoSection title="वैयक्तिक माहिती">
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
                label="Contact Number"
                value={
                  selectedPlayer.contactNumber
                }
              />

              <Detail
                label="Alternate Contact"
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
            </InfoSection>

            {/* FOOTBALL INFORMATION */}

            <InfoSection title="Football माहिती">
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
            </InfoSection>

            {/* MEMORABLE COMPETITIONS */}

            <InfoSection title="आठवणीतील उल्लेखनीय स्पर्धा">

              {selectedPlayer
                .memorableCompetitions
                ?.length ? (
                <ul className="space-y-2">
                  {selectedPlayer.memorableCompetitions.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                      >
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">
                  कोणतीही माहिती नाही.
                </p>
              )}

            </InfoSection>

            {/* RELATIVES */}

            <InfoSection title="Practice Club मधील नातेवाईक">

              <p className="text-sm font-bold text-slate-700">
                {selectedPlayer.hasRelativesInPracticeClub
                  ? "होय"
                  : "नाही"}
              </p>

              {selectedPlayer
                .relativesInPracticeClub
                ?.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {selectedPlayer.relativesInPracticeClub.map(
                    (relative, index) => (
                      <li
                        key={index}
                        className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      >
                        <strong>
                          {relative.name}
                        </strong>{" "}
                        - {relative.relation}
                      </li>
                    )
                  )}
                </ul>
              )}

            </InfoSection>

            {/* GATE ENTRY */}

            {gateEntry && (
              <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 p-5 sm:p-6">

                <h2 className="mb-4 text-xl font-black text-emerald-800">
                  Gate Entry
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <Detail
                    label="Check-In Status"
                    value={
                      gateEntry.checkedIn
                        ? "✓ Checked In"
                        : "Not Checked In"
                    }
                  />

                  <Detail
                    label="Check-In Date"
                    value={formatDate(
                      gateEntry.checkedInAt
                    )}
                  />

                  <Detail
                    label="Award Status"
                    value={
                      gateEntry.awarded
                        ? "🏆 Awarded"
                        : "Pending"
                    }
                  />

                </div>

                {/* AWARD BUTTON */}

                {gateEntry.checkedIn &&
                  !gateEntry.awarded && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAwardPlayer(
                          gateEntry._id
                        )
                      }
                      disabled={
                        awardLoading ===
                        gateEntry._id
                      }
                      className="mt-5 h-12 w-full rounded-xl bg-[#D4A017] px-6 text-sm font-black text-white transition hover:bg-[#B8860B] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {awardLoading ===
                      gateEntry._id
                        ? "Awarding..."
                        : "🏆 Award Player"}
                    </button>
                  )}

                {/* ALREADY AWARDED */}

                {gateEntry.awarded && (
                  <div className="mt-5 flex h-12 items-center justify-center rounded-xl bg-amber-100 text-sm font-black text-amber-700">
                    🏆 Player Awarded
                  </div>
                )}

              </div>
            )}

            {/* BACK */}

            <button
              type="button"
              onClick={() =>
                setSelectedPlayer(null)
              }
              className="h-12 w-full rounded-xl bg-[#111111] text-sm font-black text-white transition hover:bg-[#222222]"
            >
              ← Back to Completed List
            </button>

          </div>
        </div>

        {/* DETAILS LOADING */}

        {detailsLoading && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">

            <div className="w-full max-w-sm rounded-2xl bg-white px-6 py-5 shadow-2xl">

              <div className="flex items-center justify-center gap-3">

                <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-[#D4A017]" />

                <p className="text-sm font-bold text-slate-600">
                  Player माहिती load होत आहे...
                </p>

              </div>

            </div>

          </div>
        )}
      </div>
    );
  }

  // =====================================================
  // MAIN DASHBOARD
  // =====================================================

  const awardedCount =
    completedPlayers.filter(
      (player) =>
        player.gateEntry?.awarded === true
    ).length;

  return (
    <div className="min-h-screen bg-[#FFFDF7] px-4 py-6 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-7">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div className="min-w-0">

              <div className="flex items-center gap-3">

                <div className="h-11 w-1 shrink-0 rounded-full bg-[#D4A017]" />

                <div className="min-w-0">

                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8A5A0A]">
                    Practice Football Club
                  </p>

                  <h1 className="mt-1 text-2xl font-black tracking-tight text-[#111111] sm:text-4xl">
                    Anchor Dashboard
                  </h1>

                </div>

              </div>

              <p className="mt-3 text-sm text-[#6F6250]">
                Welcome, {user?.name || "Anchor"}
              </p>

            </div>

            <button
              onClick={onLogout}
              className="h-11 w-full shrink-0 rounded-xl bg-[#111111] px-5 text-sm font-black text-white transition hover:bg-[#222222] sm:w-auto"
            >
              Logout
            </button>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600 sm:px-5">

            <span className="break-words">
              {error}
            </span>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-lg"
            >
              ×
            </button>

          </div>
        )}

        {/* SUMMARY */}

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* CHECKED IN */}

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">

            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
              Checked-In Players
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-700">
              {completedPlayers.length}
            </p>

          </div>

          {/* AWARDED */}

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">

            <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">
              Awarded Players
            </p>

            <p className="mt-2 text-3xl font-black text-amber-700">
              {awardedCount}
            </p>

          </div>

        </div>

        {/* CHECKED-IN PLAYERS */}

        <section>

          {/* SECTION HEADER */}

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                  ✓
                </div>

                <div>

                  <h2 className="text-xl font-black text-[#111111] sm:text-2xl">
                    Checked-In Players
                  </h2>

                  <p className="mt-1 text-xs text-[#9A8F7D]">
                    Gate Entry झालेल्या Players ची यादी
                  </p>

                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="h-10 w-full rounded-xl border border-[#E8D49A] bg-white px-4 text-xs font-black text-[#6F6250] transition hover:bg-[#FFF8E5] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading
                ? "Loading..."
                : "↻ Refresh"}
            </button>

          </div>

          {/* LOADING */}

          {loading ? (
            <div className="rounded-[22px] border border-[#E8D49A] bg-white p-12 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#D4A017]" />

              <p className="mt-4 text-sm font-semibold text-slate-400">
                Checked-In Players load होत आहेत...
              </p>

            </div>
          ) : completedPlayers.length === 0 ? (
            <div className="rounded-[22px] border border-[#E8D49A] bg-white p-12 text-center">

              <div className="text-4xl">
                ✓
              </div>

              <p className="mt-3 text-sm font-bold text-slate-500">
                अजून कोणत्याही Player ची Gate Entry झालेली नाही.
              </p>

            </div>
          ) : (

            /* YEAR-WISE LIST */

            <div className="space-y-8">

              {groupedCompletedPlayers.map(
                ([year, yearPlayers]) => (

                  <div key={year}>

                    {/* YEAR HEADER */}

                    <div className="mb-3 flex items-center gap-3">

                      <div className="flex h-10 min-w-[90px] shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-4">

                        <span className="text-sm font-black text-white">
                          {year}
                        </span>

                      </div>

                      <div className="h-px flex-1 bg-emerald-200" />

                      <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        {yearPlayers.length}
                      </span>

                    </div>

                    {/* PLAYERS */}

                    <div className="space-y-3">

                      {yearPlayers.map(
                        (player, index) => {

                          const gateEntry =
                            player.gateEntry;

                          return (
                            <div
                              key={player._id}
                              className="overflow-hidden rounded-[20px] border border-emerald-200 bg-white shadow-[0_8px_25px_rgba(16,185,129,0.05)]"
                            >

                              <div className="p-4 sm:p-5">

                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                                  {/* PLAYER */}

                                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-black text-emerald-700">
                                      {index + 1}
                                    </div>

                                    {player.photo ? (
                                      <img
                                        src={player.photo}
                                        alt={player.fullName}
                                        className="h-14 w-14 shrink-0 rounded-xl border border-emerald-100 object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-xl">
                                        ⚽
                                      </div>
                                    )}

                                    <div className="min-w-0">

                                      <h3 className="truncate text-base font-black text-[#111111]">
                                        {player.fullName}
                                      </h3>

                                      {player.nickname && (
                                        <p className="mt-0.5 truncate text-xs text-slate-400">
                                          {player.nickname}
                                        </p>
                                      )}

                                      <div className="mt-2 flex flex-wrap gap-2">

                                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                          ✓ Checked In
                                        </span>

                                        {gateEntry?.awarded && (
                                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700">
                                            🏆 Awarded
                                          </span>
                                        )}

                                      </div>

                                    </div>

                                  </div>

                                  {/* JOIN YEAR */}

                                  <div className="w-full rounded-xl bg-slate-50 px-5 py-3 lg:w-auto lg:min-w-[140px]">

                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                      Join Year
                                    </p>

                                    <p className="mt-1 text-xl font-black text-[#111111]">
                                      {player.practiceClubFromYear || "-"}
                                    </p>

                                  </div>

                                  {/* CHECK-IN DATE */}

                                  <div className="w-full rounded-xl bg-emerald-50 px-5 py-3 lg:w-auto lg:min-w-[160px]">

                                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                                      Checked In
                                    </p>

                                    <p className="mt-1 text-xs font-bold text-emerald-700">
                                      {gateEntry?.checkedInAt
                                        ? formatDate(
                                            gateEntry.checkedInAt
                                          )
                                        : "Completed"}
                                    </p>

                                  </div>

                                  {/* AWARD */}

                                  {!gateEntry?.awarded ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        console.log(
                                          "Award button clicked"
                                        );

                                        console.log(
                                          "Gate Entry:",
                                          gateEntry
                                        );

                                        console.log(
                                          "Gate Entry ID:",
                                          gateEntry?._id
                                        );

                                        handleAwardPlayer(
                                          gateEntry?._id
                                        );
                                      }}
                                      disabled={
                                        awardLoading ===
                                        gateEntry?._id
                                      }
                                      className="h-11 w-full rounded-xl bg-[#D4A017] px-5 text-sm font-black text-white transition hover:bg-[#B8860B] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                                    >
                                      {awardLoading ===
                                      gateEntry?._id
                                        ? "Awarding..."
                                        : "🏆 Award"}
                                    </button>
                                  ) : (
                                    <div className="flex h-11 w-full items-center justify-center rounded-xl bg-amber-50 px-5 text-sm font-black text-amber-700 lg:w-auto">
                                      🏆 Awarded
                                    </div>
                                  )}

                                  {/* VIEW */}

                                  <button
                                    type="button"
                                    className="h-11 w-full rounded-xl bg-[#111111] px-6 text-sm font-black text-white transition hover:bg-[#222222] lg:w-auto"
                                    onClick={() =>
                                      handleViewPlayer(
                                        player._id
                                      )
                                    }
                                  >
                                    View
                                  </button>

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* DETAILS LOADING */}

        {detailsLoading && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">

            <div className="w-full max-w-sm rounded-2xl bg-white px-6 py-5 shadow-2xl">

              <div className="flex items-center justify-center gap-3">

                <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-[#D4A017]" />

                <p className="text-sm font-bold text-slate-600">
                  Player माहिती load होत आहे...
                </p>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// =====================================================
// INFO SECTION
// =====================================================

function InfoSection({ title, children }) {
  return (
    <div className="rounded-[22px] border border-[#E8D49A] bg-white p-5 sm:p-6">

      <h2 className="mb-5 text-xl font-black text-[#111111]">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>

    </div>
  );
}

// =====================================================
// DETAIL COMPONENT
// =====================================================

function Detail({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <strong className="mt-1 block break-words text-sm font-black text-[#111111]">
        {value || "-"}
      </strong>

    </div>
  );
}

export default AnchorDashboard;