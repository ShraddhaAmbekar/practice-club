import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function GateEntryDashboard({ user, onLogout }) {
  const [gateEntries, setGateEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Actual values
  const [actualValues, setActualValues] = useState({});

  // ==========================================
  // FETCH GATE ENTRIES
  // ==========================================

  const fetchGateEntries = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/gate-entries`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gate Entries fetch करताना error आला."
        );
      }

      setGateEntries(data.gateEntries || []);

      // Existing actual values state मध्ये ठेवणे
      const values = {};

      (data.gateEntries || []).forEach((entry) => {
        values[entry._id] = {
          actualFamilyMembers:
            entry.actualFamilyMembers || 0,

          actualVegMembers:
            entry.actualVegMembers || 0,

          actualNonVegMembers:
            entry.actualNonVegMembers || 0,
        };
      });

      setActualValues(values);
    } catch (error) {
      console.error(
        "Fetch Gate Entries Error:",
        error
      );

      setMessage(
        error.message ||
          "Gate Entries fetch करताना error आला."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchGateEntries();
  }, []);

  // ==========================================
  // HANDLE ACTUAL INPUT
  // ==========================================

  const handleActualChange = (
    entryId,
    field,
    value
  ) => {
    setActualValues((prev) => ({
      ...prev,

      [entryId]: {
        ...prev[entryId],

        [field]: value,
      },
    }));
  };

  // ==========================================
  // CHECK IN
  // ==========================================

  const handleCheckIn = async (entry) => {
    const values =
      actualValues[entry._id] || {};

    const actualFamilyMembers =
      Number(values.actualFamilyMembers) || 0;

    const actualVegMembers =
      Number(values.actualVegMembers) || 0;

    const actualNonVegMembers =
      Number(values.actualNonVegMembers) || 0;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      actualVegMembers +
        actualNonVegMembers !==
      actualFamilyMembers
    ) {
      alert(
        "Actual Family Members = Veg + Non-Veg असणे आवश्यक आहे."
      );

      return;
    }

    try {
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/gate-entries/${entry._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            actualFamilyMembers,
            actualVegMembers,
            actualNonVegMembers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Check In करताना error आला."
        );
      }

      // Update local list
      setGateEntries((prev) =>
        prev.map((item) =>
          item._id === entry._id
            ? data.gateEntry
            : item
        )
      );

      setMessage(
        `✓ ${entry.player?.fullName || "Player"} successfully checked in.`
      );
    } catch (error) {
      console.error(
        "Check In Error:",
        error
      );

      setMessage(
        error.message ||
          "Check In करताना error आला."
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredEntries =
    gateEntries.filter((entry) => {
      const name =
        entry.player?.fullName || "";

      const nickname =
        entry.player?.nickname || "";

      const searchText =
        search.toLowerCase().trim();

      return (
        name
          .toLowerCase()
          .includes(searchText) ||
        nickname
          .toLowerCase()
          .includes(searchText)
      );
    });

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f5f8f6] text-slate-900 px-4 py-6 sm:px-6 lg:px-10">

      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-60 -right-60 h-[600px] w-[600px] rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="absolute -bottom-60 -left-60 h-[600px] w-[600px] rounded-full bg-green-100/40 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#064e3b 1px, transparent 1px), linear-gradient(90deg, #064e3b 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

      </div>

      {/* ==========================================
          MAIN
      ========================================== */}

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3 mb-2">

                <div className="h-9 w-1 rounded-full bg-emerald-600" />

                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-700">
                  Practice Football Club
                </span>

              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#09251b]">
                Gate Entry
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                कार्यक्रमासाठी आलेल्या Family Members
                ची Gate वर नोंद करा.
              </p>

            </div>

            {/* USER */}

            <div className="flex items-center gap-3">

              <div className="hidden sm:block text-right">

                <p className="text-xs font-bold text-slate-700">
                  {user?.name ||
                    "Gate Entry Operator"}
                </p>

                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Gate Entry
                </p>

              </div>

              <button
                onClick={onLogout}
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

        {/* ==========================================
            SEARCH + REFRESH
        ========================================== */}

        <div className="mb-6 rounded-[22px] border border-slate-200 bg-white p-4 sm:p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="flex flex-col sm:flex-row gap-3">

            {/* SEARCH */}

            <div className="relative flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Player चे नाव search करा..."
                className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

            </div>

            {/* REFRESH */}

            <button
              onClick={fetchGateEntries}
              disabled={loading}
              className="h-12 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 transition hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 disabled:opacity-50"
            >
              ↻ Refresh
            </button>

          </div>

        </div>

        {/* ==========================================
            MESSAGE
        ========================================== */}

        {message && (

          <div
            className={`mb-5 rounded-2xl border px-5 py-4 text-sm font-semibold ${
              message.startsWith("✓")
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>

        )}

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (

          <div className="rounded-[22px] border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              Gate Entries loading...
            </p>

          </div>

        ) : filteredEntries.length === 0 ? (

          /* ==========================================
              EMPTY
          ========================================== */

          <div className="rounded-[22px] border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
              ⚽
            </div>

            <h2 className="mt-5 text-xl font-black text-[#09251b]">
              {search
                ? "Player सापडला नाही"
                : "Gate Entry उपलब्ध नाही"}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {search
                ? "Search पुन्हा तपासा."
                : "सध्या कोणतीही Gate Entry तयार केलेली नाही."}
            </p>

          </div>

        ) : (

          /* ==========================================
              PLAYER LIST
          ========================================== */

          <div className="space-y-5">

            {filteredEntries.map((entry) => {

              const player =
                entry.player;

              const values =
                actualValues[
                  entry._id
                ] || {
                  actualFamilyMembers:
                    entry.actualFamilyMembers ||
                    0,

                  actualVegMembers:
                    entry.actualVegMembers ||
                    0,

                  actualNonVegMembers:
                    entry.actualNonVegMembers ||
                    0,
                };

              return (

                <div
                  key={entry._id}
                  className={`overflow-hidden rounded-[22px] border bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)] ${
                    entry.checkedIn
                      ? "border-emerald-200"
                      : "border-slate-200"
                  }`}
                >

                  {/* ==================================
                      PLAYER HEADER
                  ================================== */}

                  <div className="p-5 sm:p-6">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      <div className="flex items-center gap-4">

                        {/* PHOTO */}

                        {player?.photo ? (

                          <img
                            src={player.photo}
                            alt={
                              player.fullName
                            }
                            className="h-16 w-16 rounded-2xl object-cover border-2 border-white shadow-md"
                          />

                        ) : (

                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#063b2b] text-2xl shadow-md">
                            ⚽
                          </div>

                        )}

                        {/* NAME */}

                        <div>

                          <h2 className="text-lg sm:text-xl font-black text-[#09251b]">
                            {player?.fullName ||
                              "Unknown Player"}
                          </h2>

                          {player?.nickname && (

                            <p className="mt-0.5 text-xs text-slate-400">
                              "{player.nickname}"
                            </p>

                          )}

                        </div>

                      </div>

                      {/* STATUS */}

                      {entry.checkedIn ? (

                        <div className="flex items-center gap-2 self-start lg:self-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">

                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                            ✓
                          </span>

                          <div>

                            <p className="text-xs font-black text-emerald-700">
                              CHECKED IN
                            </p>

                            {entry.checkedInAt && (

                              <p className="text-[10px] text-emerald-600/70">
                                {new Date(
                                  entry.checkedInAt
                                ).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour: "2-digit",
                                    minute:
                                      "2-digit",
                                  }
                                )}
                              </p>

                            )}

                          </div>

                        </div>

                      ) : (

                        <div className="self-start lg:self-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2">

                          <span className="text-xs font-black text-amber-700">
                            NOT CHECKED IN
                          </span>

                        </div>

                      )}

                    </div>

                  </div>

                  {/* ==================================
                      EXPECTED
                  ================================== */}

                  <div className="border-y border-slate-100 bg-slate-50/70 p-5 sm:p-6">

                    <div className="mb-4">

                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                        Expected Members
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Player registration मधून
                        आलेली माहिती
                      </p>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                      <StatCard
                        label="Family Members"
                        value={
                          entry.expectedFamilyMembers
                        }
                        icon="👨‍👩‍👧"
                      />

                      <StatCard
                        label="Veg Members"
                        value={
                          entry.expectedVegMembers
                        }
                        icon="🥗"
                      />

                      <StatCard
                        label="Non-Veg Members"
                        value={
                          entry.expectedNonVegMembers
                        }
                        icon="🍽️"
                      />

                    </div>

                  </div>

                  {/* ==================================
                      ACTUAL
                  ================================== */}

                  <div className="p-5 sm:p-6">

                    <div className="mb-4">

                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Actual Members
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Gate वर प्रत्यक्ष आलेल्या
                        members ची संख्या भरा.
                      </p>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                      <NumberInput
                        label="Actual Family Members"
                        value={
                          values.actualFamilyMembers
                        }
                        disabled={
                          entry.checkedIn
                        }
                        onChange={(value) =>
                          handleActualChange(
                            entry._id,
                            "actualFamilyMembers",
                            value
                          )
                        }
                      />

                      <NumberInput
                        label="Actual Veg Members"
                        value={
                          values.actualVegMembers
                        }
                        disabled={
                          entry.checkedIn
                        }
                        onChange={(value) =>
                          handleActualChange(
                            entry._id,
                            "actualVegMembers",
                            value
                          )
                        }
                      />

                      <NumberInput
                        label="Actual Non-Veg Members"
                        value={
                          values.actualNonVegMembers
                        }
                        disabled={
                          entry.checkedIn
                        }
                        onChange={(value) =>
                          handleActualChange(
                            entry._id,
                            "actualNonVegMembers",
                            value
                          )
                        }
                      />

                    </div>

                    {/* ==================================
                        CHECK IN BUTTON
                    ================================== */}

                    {!entry.checkedIn && (

                      <button
                        onClick={() =>
                          handleCheckIn(entry)
                        }
                        className="mt-5 w-full h-12 rounded-xl bg-[#063b2b] text-sm font-black text-white transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/10"
                      >
                        ✓ Check In
                      </button>

                    )}

                    {entry.checkedIn && (

                      <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center">

                        <p className="text-sm font-bold text-emerald-700">
                          ✓ Entry Successfully
                          Completed
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              );
            })}

          </div>

        )}

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div className="mt-8 pb-5 text-center">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Practice Football Club • Gate
            Management
          </p>

        </div>

      </div>

    </div>
  );
}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <div className="flex items-center justify-between">

        <span className="text-xs font-bold text-slate-500">
          {label}
        </span>

        <span className="text-lg">
          {icon}
        </span>

      </div>

      <p className="mt-2 text-2xl font-black text-[#09251b]">
        {value || 0}
      </p>

    </div>
  );
}


// ==========================================
// NUMBER INPUT
// ==========================================

function NumberInput({
  label,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold text-slate-600">
        {label}
      </label>

      <input
        type="number"
        min="0"
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      />

    </div>
  );
}

export default GateEntryDashboard;