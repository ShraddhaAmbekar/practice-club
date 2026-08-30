import { useEffect, useMemo, useState } from "react";

import API_URL from "../../api";

function GateEntry() {
  // =====================================================
  // STATES
  // =====================================================

  const [players, setPlayers] = useState([]);
  const [gateEntries, setGateEntries] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedGateEntry, setSelectedGateEntry] = useState(null);

  const [actualFamilyMembers, setActualFamilyMembers] = useState("");

  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // LOAD PLAYERS + GATE ENTRIES
  // =====================================================

  const loadData = async () => {
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

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // =================================================
      // GET PLAYERS
      // =================================================

      const playerResponse = await fetch(
        `${API_URL}/api/players`,
        {
          method: "GET",
          headers,
        }
      );

      const playerData = await playerResponse.json();

      console.log("PLAYERS API RESPONSE:", playerData);

      if (!playerResponse.ok) {
        throw new Error(
          playerData.message ||
            "Players fetch करता आले नाहीत."
        );
      }

      // -------------------------------------------------
      // IMPORTANT:
      // Your backend currently returns:
      //
      // return res.status(200).json(players);
      //
      // So playerData itself is an ARRAY.
      //
      // This code supports BOTH:
      // 1. [player1, player2, ...]
      // 2. { players: [player1, player2, ...] }
      // -------------------------------------------------

      let playersList = [];

      if (Array.isArray(playerData)) {
        playersList = playerData;
      } else if (Array.isArray(playerData.players)) {
        playersList = playerData.players;
      }

      console.log(
        "TOTAL PLAYERS RECEIVED:",
        playersList.length
      );

      setPlayers(playersList);

      // =================================================
      // GET GATE ENTRIES
      // =================================================

      const gateResponse = await fetch(
        `${API_URL}/api/gate-entries`,
        {
          method: "GET",
          headers,
        }
      );

      const gateData = await gateResponse.json();

      console.log(
        "GATE ENTRIES API RESPONSE:",
        gateData
      );

      if (!gateResponse.ok) {
        throw new Error(
          gateData.message ||
            "Gate Entries fetch करता आले नाहीत."
        );
      }

      // -------------------------------------------------
      // Support BOTH:
      // 1. [entry1, entry2]
      // 2. { gateEntries: [...] }
      // -------------------------------------------------

      let gateEntriesList = [];

      if (Array.isArray(gateData)) {
        gateEntriesList = gateData;
      } else if (
        Array.isArray(gateData.gateEntries)
      ) {
        gateEntriesList = gateData.gateEntries;
      }

      console.log(
        "TOTAL GATE ENTRIES:",
        gateEntriesList.length
      );

      setGateEntries(gateEntriesList);
    } catch (err) {
      console.error(
        "Gate Entry Load Error:",
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
  // SUCCESS MESSAGE
  // =====================================================

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 4000);
  };

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  const clearError = () => {
    setError("");
  };

  // =====================================================
  // SEARCH PLAYERS
  // =====================================================

  const filteredPlayers = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    if (!searchText) {
      return players;
    }

    return players.filter((player) => {
      const fullName =
        player.fullName?.toLowerCase() || "";

      const nickname =
        player.nickname?.toLowerCase() || "";

      return (
        fullName.includes(searchText) ||
        nickname.includes(searchText)
      );
    });
  }, [players, search]);

  // =====================================================
  // GET GATE ENTRY FOR PLAYER
  // =====================================================

  const getGateEntryForPlayer = (playerId) => {
    return gateEntries.find((entry) => {
      const entryPlayerId =
        typeof entry.player === "object"
          ? entry.player?._id
          : entry.player;

      return entryPlayerId === playerId;
    });
  };

  // =====================================================
  // CHECKED IN?
  // =====================================================

  const isCheckedIn = (playerId) => {
    const entry =
      getGateEntryForPlayer(playerId);

    return Boolean(entry?.checkedIn);
  };

  // =====================================================
  // OPEN CHECK-IN MODAL
  // =====================================================

  const openCheckIn = async (player) => {
    try {
      clearError();

      setSelectedPlayer(null);
      setSelectedGateEntry(null);
      setActualFamilyMembers("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Login session सापडले नाही."
        );
        return;
      }

      // =================================================
      // CHECK LOCAL GATE ENTRY
      // =================================================

      const existingEntry =
        getGateEntryForPlayer(player._id);

      if (existingEntry) {
        setSelectedPlayer(player);
        setSelectedGateEntry(existingEntry);

        setActualFamilyMembers(
          existingEntry.actualFamilyMembers ?? ""
        );

        return;
      }

      // =================================================
      // FETCH SPECIFIC GATE ENTRY
      // =================================================

      const response = await fetch(
        `${API_URL}/api/gate-entries/player/${player._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data =
          await response.json();

        console.log(
          "SPECIFIC GATE ENTRY:",
          data
        );

        if (data.gateEntry) {
          setSelectedPlayer(player);

          setSelectedGateEntry(
            data.gateEntry
          );

          setActualFamilyMembers(
            data.gateEntry
              .actualFamilyMembers ?? ""
          );

          return;
        }
      }

      // =================================================
      // NO GATE ENTRY
      // =================================================

      setSelectedPlayer(player);
      setSelectedGateEntry(null);
      setActualFamilyMembers("");
    } catch (err) {
      console.error(
        "Open Check-In Error:",
        err
      );

      // Still allow modal to open
      setSelectedPlayer(player);
      setSelectedGateEntry(null);
      setActualFamilyMembers("");
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (checkingIn) return;

    setSelectedPlayer(null);
    setSelectedGateEntry(null);
    setActualFamilyMembers("");

    clearError();
  };

  // =====================================================
  // CHECK IN
  // =====================================================

  const handleCheckIn = async () => {
    if (!selectedPlayer) return;

    clearError();

    // =================================================
    // VALIDATION
    // =================================================

    if (
      actualFamilyMembers === "" ||
      Number(actualFamilyMembers) < 0
    ) {
      setError(
        "कृपया Actual Family Members संख्या भरा."
      );

      return;
    }

    try {
      setCheckingIn(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Login session सापडले नाही."
        );

        return;
      }

      let gateEntry =
        selectedGateEntry;

      // =================================================
      // CREATE GATE ENTRY
      // =================================================

      if (!gateEntry) {
        const createResponse =
          await fetch(
            `${API_URL}/api/gate-entries`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                playerId:
                  selectedPlayer._id,
              }),
            }
          );

        const createData =
          await createResponse.json();

        console.log(
          "CREATE GATE ENTRY RESPONSE:",
          createData
        );

        if (!createResponse.ok) {
          throw new Error(
            createData.message ||
              "Gate Entry create करता आली नाही."
          );
        }

        gateEntry =
          createData.gateEntry;
      }

      // =================================================
      // UPDATE ACTUAL ENTRY
      // =================================================

      const updateResponse =
        await fetch(
          `${API_URL}/api/gate-entries/${gateEntry._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              actualFamilyMembers:
                Number(actualFamilyMembers),

              actualVegMembers: 0,

              actualNonVegMembers: 0,
            }),
          }
        );

      const updateData =
        await updateResponse.json();

      console.log(
        "UPDATE GATE ENTRY RESPONSE:",
        updateData
      );

      if (!updateResponse.ok) {
        throw new Error(
          updateData.message ||
            "Check In update करता आले नाही."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      showSuccess(
        `${selectedPlayer.fullName} यांची Check-In Entry यशस्वी झाली.`
      );

      closeModal();

      // =================================================
      // REFRESH DATABASE DATA
      // =================================================

      await loadData();
    } catch (err) {
      console.error(
        "Check-In Error:",
        err
      );

      setError(
        err.message ||
          "Check In करताना error आला."
      );
    } finally {
      setCheckingIn(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // TOTAL EXPECTED
  // =====================================================

  const totalExpected =
    players.reduce(
      (total, player) =>
        total +
        Number(
          player.familyMembersComing || 0
        ),
      0
    );

  // =====================================================
  // TOTAL CHECKED IN
  // =====================================================

  const totalActual =
    gateEntries
      .filter(
        (entry) => entry.checkedIn
      )
      .reduce(
        (total, entry) =>
          total +
          Number(
            entry.actualFamilyMembers || 0
          ),
        0
      );

  // =====================================================
  // CHECKED-IN LIST
  // =====================================================

  const checkedInList =
    gateEntries.filter(
      (entry) => entry.checkedIn
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#FFFDF7] px-4 py-6 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="h-11 w-1 rounded-full bg-[#D4A017]" />

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8A5A0A]">
                    Practice Football Club
                  </p>

                  <h1 className="mt-1 text-3xl font-black tracking-tight text-[#111111] sm:text-4xl">
                    Gate Entry
                  </h1>

                </div>

              </div>

              <p className="mt-3 max-w-2xl text-sm text-[#6F6250]">
                Player शोधा, Expected Family Members
                पहा आणि Gate वर प्रत्यक्ष आलेल्या
                Members ची Check-In Entry करा.
              </p>

            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="h-11 rounded-xl border border-[#E8D49A] bg-white px-5 text-sm font-bold text-[#6F6250] shadow-sm transition hover:border-[#D4A017] hover:bg-[#FFF8E5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Loading..."
                : "↻ Refresh Data"}
            </button>

          </div>

        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            ✓ {success}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && !selectedPlayer && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">

            <span>{error}</span>

            <button
              type="button"
              onClick={clearError}
              className="text-lg text-red-400 hover:text-red-700"
            >
              ×
            </button>

          </div>
        )}

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* PLAYERS */}

          <div className="rounded-2xl border border-[#E8D49A] bg-white p-5 shadow-[0_8px_25px_rgba(138,90,10,0.05)]">

            <p className="text-[10px] font-black uppercase tracking-wider text-[#8A5A0A]">
              Total Players
            </p>

            <p className="mt-2 text-3xl font-black text-[#111111]">
              {players.length}
            </p>

          </div>

          {/* EXPECTED */}

          <div className="rounded-2xl border border-[#E8D49A] bg-white p-5 shadow-[0_8px_25px_rgba(138,90,10,0.05)]">

            <p className="text-[10px] font-black uppercase tracking-wider text-[#8A5A0A]">
              Expected Members
            </p>

            <p className="mt-2 text-3xl font-black text-[#111111]">
              {totalExpected}
            </p>

          </div>

          {/* ACTUAL */}

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-[0_8px_25px_rgba(16,185,129,0.05)]">

            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
              Actual Checked-In
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-700">
              {totalActual}
            </p>

          </div>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mb-6 rounded-[22px] border border-[#E8D49A] bg-white p-5 shadow-[0_10px_35px_rgba(138,90,10,0.06)]">

          <div className="mb-2 flex items-center justify-between">

            <label className="text-xs font-bold text-[#6F6250]">
              Player Search
            </label>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs font-bold text-[#8A5A0A] hover:underline"
              >
                Clear
              </button>
            )}

          </div>

          <div className="relative">

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Player चे नाव search करा..."
              className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm font-medium outline-none transition focus:border-[#D4A017] focus:bg-white focus:ring-4 focus:ring-[#D4A017]/10"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>

          </div>

          {search && (
            <p className="mt-2 text-xs text-slate-400">
              {filteredPlayers.length} player
              {filteredPlayers.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          )}

        </div>

        {/* =================================================
            PLAYERS
        ================================================= */}

        <section className="mb-10">

          <div className="mb-4 flex items-end justify-between">

            <div>

              <h2 className="text-xl font-black text-[#111111]">
                Players List
              </h2>

              <p className="mt-1 text-xs text-[#9A8F7D]">
                Database मधील registered players
              </p>

            </div>

            <span className="rounded-full bg-[#FFF8E5] px-3 py-1 text-xs font-black text-[#8A5A0A]">
              {filteredPlayers.length}
            </span>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="rounded-[22px] border border-[#E8D49A] bg-white p-12 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#D4A017]" />

              <p className="mt-4 text-sm font-semibold text-slate-400">
                Players load होत आहेत...
              </p>

            </div>

          ) : filteredPlayers.length === 0 ? (

            <div className="rounded-[22px] border border-[#E8D49A] bg-white p-12 text-center">

              <div className="text-4xl">
                🔍
              </div>

              <p className="mt-3 text-sm font-bold text-slate-500">
                कोणताही Player सापडला नाही.
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mt-3 text-xs font-bold text-[#8A5A0A] hover:underline"
                >
                  सर्व Players दाखवा
                </button>
              )}

            </div>

          ) : (

            <div className="space-y-3">

              {filteredPlayers.map(
                (player) => {

                  const checkedIn =
                    isCheckedIn(
                      player._id
                    );

                  const expected =
                    Number(
                      player.familyMembersComing ||
                        0
                    );

                  const entry =
                    getGateEntryForPlayer(
                      player._id
                    );

                  return (
                    <div
                      key={player._id}
                      className={`overflow-hidden rounded-[20px] border bg-white shadow-[0_8px_25px_rgba(138,90,10,0.05)] transition ${
                        checkedIn
                          ? "border-emerald-200"
                          : "border-[#E8D49A]"
                      }`}
                    >

                      {/* TOP */}

                      <div className="p-4 sm:p-5">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                          {/* PLAYER */}

                          <div className="flex min-w-0 flex-1 items-center gap-4">

                            {player.photo ? (
                              <img
                                src={player.photo}
                                alt={
                                  player.fullName
                                }
                                className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 object-cover"
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
                                <p className="mt-0.5 text-xs text-slate-400">
                                  {player.nickname}
                                </p>
                              )}

                              {checkedIn && (
                                <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                  ✓ Checked In
                                </span>
                              )}

                            </div>

                          </div>

                          {/* EXPECTED */}

                          <div className="rounded-xl border border-[#E8D49A] bg-[#FFF8E5] px-5 py-3 lg:min-w-[180px]">

                            <p className="text-[10px] font-black uppercase tracking-wider text-[#8A5A0A]">
                              Expected Family
                            </p>

                            <div className="mt-1 flex items-end gap-2">

                              <span className="text-2xl font-black text-[#111111]">
                                {expected}
                              </span>

                              <span className="mb-1 text-xs text-[#9A8F7D]">
                                members
                              </span>

                            </div>

                          </div>

                          {/* ACTUAL */}

                          {checkedIn &&
                            entry && (
                              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-3 lg:min-w-[160px]">

                                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                                  Actual
                                </p>

                                <div className="mt-1 flex items-end gap-2">

                                  <span className="text-2xl font-black text-emerald-700">
                                    {entry.actualFamilyMembers ||
                                      0}
                                  </span>

                                  <span className="mb-1 text-xs text-emerald-600">
                                    members
                                  </span>

                                </div>

                              </div>
                            )}

                          {/* ACTION */}

                          <div className="lg:w-[140px]">

                            {checkedIn ? (

                              <div className="flex h-11 w-full items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-black text-emerald-700">
                                ✓ Completed
                              </div>

                            ) : (

                              <button
                                type="button"
                                onClick={() =>
                                  openCheckIn(
                                    player
                                  )
                                }
                                className="h-11 w-full rounded-xl bg-[#111111] text-sm font-black text-white transition hover:bg-[#222222] hover:shadow-lg"
                              >
                                Check In
                              </button>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

        {/* =================================================
            CHECKED-IN LIST
        ================================================= */}

        <section>

          <div className="mb-4 flex items-end justify-between">

            <div>

              <h2 className="text-xl font-black text-[#111111]">
                Checked-In List
              </h2>

              <p className="mt-1 text-xs text-[#9A8F7D]">
                कार्यक्रमाला प्रत्यक्ष आलेल्या
                Players ची नोंद
              </p>

            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              {checkedInList.length}
            </span>

          </div>

          {checkedInList.length === 0 ? (

            <div className="rounded-[22px] border border-[#E8D49A] bg-white p-10 text-center">

              <div className="text-4xl">
                ✓
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-400">
                अजून कोणाची Check-In Entry
                झालेली नाही.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {checkedInList.map(
                (entry) => {

                  const player =
                    typeof entry.player ===
                    "object"
                      ? entry.player
                      : null;

                  const expected =
                    Number(
                      entry.expectedFamilyMembers ||
                        player?.familyMembersComing ||
                        0
                    );

                  const actual =
                    Number(
                      entry.actualFamilyMembers ||
                        0
                    );

                  return (
                    <div
                      key={entry._id}
                      className="rounded-[20px] border border-emerald-200 bg-white p-4 shadow-[0_8px_25px_rgba(16,185,129,0.05)] sm:p-5"
                    >

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                        {/* PLAYER */}

                        <div className="flex min-w-0 flex-1 items-center gap-4">

                          {player?.photo ? (

                            <img
                              src={player.photo}
                              alt={
                                player.fullName
                              }
                              className="h-12 w-12 shrink-0 rounded-xl object-cover"
                            />

                          ) : (

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#111111]">
                              ⚽
                            </div>

                          )}

                          <div className="min-w-0">

                            <p className="truncate font-black text-[#111111]">
                              {player?.fullName ||
                                "Unknown Player"}
                            </p>

                            <p className="mt-0.5 text-xs text-emerald-600">
                              ✓ Checked In
                            </p>

                          </div>

                        </div>

                        {/* EXPECTED */}

                        <div className="rounded-xl bg-slate-50 px-5 py-3 lg:min-w-[140px]">

                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Expected
                          </p>

                          <p className="mt-1 text-xl font-black text-[#111111]">
                            {expected}
                          </p>

                        </div>

                        {/* ACTUAL */}

                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-3 lg:min-w-[140px]">

                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                            Actual
                          </p>

                          <p className="mt-1 text-xl font-black text-emerald-700">
                            {actual}
                          </p>

                        </div>

                        {/* DIFFERENCE */}

                        <div
                          className={`rounded-xl px-5 py-3 lg:min-w-[130px] ${
                            actual > expected
                              ? "bg-blue-50"
                              : actual < expected
                              ? "bg-orange-50"
                              : "bg-emerald-50"
                          }`}
                        >

                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Difference
                          </p>

                          <p className="mt-1 text-xl font-black text-[#111111]">
                            {actual -
                              expected >=
                            0
                              ? "+"
                              : ""}
                            {actual -
                              expected}
                          </p>

                        </div>

                        {/* TIME */}

                        <div className="lg:min-w-[170px]">

                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Check-In Time
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-600">
                            {formatDateTime(
                              entry.checkedInAt
                            )}
                          </p>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

      </div>

      {/* ===================================================
          CHECK-IN MODAL
      =================================================== */}

      {selectedPlayer && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(e) => {

            if (
              e.target ===
                e.currentTarget &&
              !checkingIn
            ) {
              closeModal();
            }

          }}
        >

          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[24px] bg-white shadow-2xl">

            {/* HEADER */}

            <div className="border-b border-slate-100 p-5 sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  {selectedPlayer.photo ? (

                    <img
                      src={
                        selectedPlayer.photo
                      }
                      alt={
                        selectedPlayer.fullName
                      }
                      className="h-12 w-12 shrink-0 rounded-xl object-cover"
                    />

                  ) : (

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#111111]">
                      ⚽
                    </div>

                  )}

                  <div className="min-w-0">

                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A5A0A]">
                      Gate Check-In
                    </p>

                    <h2 className="mt-1 truncate text-xl font-black text-[#111111]">
                      {
                        selectedPlayer.fullName
                      }
                    </h2>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={checkingIn}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  ×
                </button>

              </div>

            </div>

            {/* BODY */}

            <div className="p-5 sm:p-6">

              {/* EXPECTED CARD */}

              <div className="rounded-2xl border border-[#E8D49A] bg-[#FFF8E5] p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-black uppercase tracking-wider text-[#8A5A0A]">
                      Expected Family
                    </p>

                    <p className="mt-1 text-xs text-[#9A8F7D]">
                      Player registration मधून
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-4xl font-black text-[#111111]">
                      {
                        selectedPlayer.familyMembersComing ||
                        0
                      }
                    </p>

                    <p className="text-[10px] font-bold text-[#9A8F7D]">
                      MEMBERS
                    </p>

                  </div>

                </div>

              </div>

              {/* ACTUAL INPUT */}

              <div className="mt-5">

                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Actual Family Members आले *
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    actualFamilyMembers
                  }
                  onChange={(e) => {

                    setActualFamilyMembers(
                      e.target.value
                    );

                    clearError();

                  }}
                  placeholder="उदा. 3"
                  className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xl font-black outline-none transition focus:border-[#D4A017] focus:bg-white focus:ring-4 focus:ring-[#D4A017]/10"
                  autoFocus
                />

                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Gate वर प्रत्यक्ष आलेल्या
                  Family Members ची संख्या
                  भरा.
                </p>

              </div>

              {/* COMPARISON */}

              {actualFamilyMembers !== "" && (

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Expected
                    </p>

                    <p className="mt-1 text-xl font-black text-[#111111]">
                      {
                        selectedPlayer.familyMembersComing ||
                        0
                      }
                    </p>

                  </div>

                  <div className="rounded-xl bg-emerald-50 p-4">

                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                      Actual
                    </p>

                    <p className="mt-1 text-xl font-black text-emerald-700">
                      {
                        Number(
                          actualFamilyMembers
                        )
                      }
                    </p>

                  </div>

                </div>

              )}

              {/* ERROR */}

              {error && (

                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                  {error}
                </div>

              )}

              {/* ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={checkingIn}
                  className="h-12 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="h-12 flex-1 rounded-xl bg-[#111111] text-sm font-black text-white transition hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {checkingIn ? (

                    <span className="flex items-center justify-center gap-2">

                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Saving...

                    </span>

                  ) : (

                    "✓ Confirm Check In"

                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default GateEntry;