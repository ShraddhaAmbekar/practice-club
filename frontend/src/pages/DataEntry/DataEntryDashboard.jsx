import { useState } from "react";
import PlayerForm from "./PlayerForm";

function DataEntryDashboard({ user, onLogout }) {
  const [activePage, setActivePage] =
    useState("dashboard");

  // ==========================================
  // PLAYER FORM
  // ==========================================

  if (activePage === "player-form") {
    return (
      <div className="min-h-screen bg-[#f5f8f6] text-slate-900">
        
        {/* ==========================================
            TOP BAR
        ========================================== */}

        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
            
            <div className="flex items-center justify-between gap-4">
              
              {/* BACK BUTTON */}

              <button
                onClick={() =>
                  setActivePage("dashboard")
                }
                className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span className="text-lg transition-transform group-hover:-translate-x-1">
                  ←
                </span>

                Dashboard वर जा
              </button>

              {/* USER + LOGOUT */}

              <div className="flex items-center gap-3">
                
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-700">
                    {user?.name || "Data Entry Operator"}
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Data Entry
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

        </div>

        {/* ==========================================
            PLAYER FORM
        ========================================== */}

        <PlayerForm
          player={null}
          onSave={() => {
            setActivePage("dashboard");
          }}
          onCancel={() => {
            setActivePage("dashboard");
          }}
        />

      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f5f8f6] text-slate-900 px-4 py-6 sm:px-6 lg:px-10">

      {/* ==========================================
          BACKGROUND DECORATION
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
          MAIN CONTENT
      ========================================== */}

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3 mb-2">

                <div className="h-9 w-1 rounded-full bg-emerald-600" />

                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-700">
                  Practice Football Club
                </span>

              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#09251b]">
                Data Entry Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                खेळाडूची माहिती नोंदवण्यासाठी खालील पर्याय वापरा.
              </p>

            </div>

            {/* CLUB RECORDS BADGE */}

            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 shadow-sm">

              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Data Entry
              </span>

            </div>

          </div>

        </div>

        {/* ==========================================
            WELCOME CARD
        ========================================== */}

        <div className="mb-5 rounded-[22px] border border-slate-200 bg-white p-5 sm:p-7 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              👋
            </div>

            <div>

              <h2 className="text-lg font-black text-[#09251b]">
                Welcome, {user?.name || "Data Entry Operator"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                येथे Practice Football Club मधील
                खेळाडूंची नवीन माहिती नोंदवू शकता.
              </p>

            </div>

          </div>

        </div>

        {/* ==========================================
            PLAYER REGISTRATION CARD
        ========================================== */}

        <div className="rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)] overflow-hidden">

          <div className="absolute" />

          <div className="p-5 sm:p-7">

            <div className="flex items-start gap-4">

              {/* ICON */}

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                ⚽
              </div>

              <div className="flex-1">

                <h2 className="text-xl font-black text-[#09251b]">
                  Player Registration
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  नवीन खेळाडूची माहिती व्यवस्थित नोंदवा.
                </p>

              </div>

            </div>

            {/* BUTTON */}

            <button
              onClick={() => {
                setActivePage("player-form");
              }}
              className="group mt-6 flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl bg-[#063b2b] px-7 py-3.5 text-sm font-black text-white transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/10"
            >

              <span>
                + Player माहिती भरा
              </span>

              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>

            </button>

          </div>

        </div>

        {/* ==========================================
            INFO
        ========================================== */}

        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">

          <div className="flex gap-3">

            <span className="text-lg">
              ℹ️
            </span>

            <div>

              <p className="text-sm font-bold text-[#09251b]">
                Data Entry Access
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Data Entry Operator नवीन Player entry
                करू शकतो. Existing Player माहिती
                edit करण्याचा अधिकार उपलब्ध नाही.
              </p>

            </div>

          </div>

        </div>

        {/* ==========================================
            LOGOUT
        ========================================== */}

        <div className="mt-6 flex justify-end">

          <button
            onClick={onLogout}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default DataEntryDashboard;