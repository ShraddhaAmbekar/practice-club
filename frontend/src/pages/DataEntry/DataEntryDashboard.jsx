import { useState } from "react";
import PlayerForm from "./PlayerForm";
import logo from "../../assets/logo.png"

function DataEntryDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  // ==========================================
  // PLAYER FORM
  // ==========================================

  if (activePage === "player-form") {
    return (
      <div className="min-h-screen bg-[#FFFDF7] text-[#111111]">
        {/* ==========================================
            BACKGROUND
        ========================================== */}

        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-60 -right-60 h-[600px] w-[600px] rounded-full bg-[#F5E7B2]/40 blur-3xl" />

          <div className="absolute -bottom-60 -left-60 h-[600px] w-[600px] rounded-full bg-[#D4A017]/10 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(#8A5A0A 1px, transparent 1px), linear-gradient(90deg, #8A5A0A 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
        </div>

        {/* ==========================================
            TOP BAR
        ========================================== */}

        <div className="sticky top-0 z-30 border-b border-[#D4A017]/30 bg-gradient-to-r from-[#111111]  via-[#111111] to-[#D4A017] backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
            <div className="flex items-center justify-between gap-4">

              {/* LEFT */}
              <div className="flex items-center gap-3">

                {/* LOGO */}
                <div className="w-11 h-11 rounded-xl  flex items-center justify-center shadow-lg shadow-black/20">
                  <img
    src={logo}
    alt="Practice Football Club Logo"
    className="w-full h-full object-contain"
  />
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-black text-white">
                    PRACTICE FOOTBALL CLUB
                  </p>

                  
                </div>

              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                {/* BACK BUTTON */}
                <button
                  onClick={() => setActivePage("dashboard")}
                  className="group flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-[#D4A017] hover:bg-[#D4A017] hover:text-[#111111]"
                >
                  <span className="text-lg transition-transform group-hover:-translate-x-1">
                    ←
                  </span>

                  Dashboard वर जा
                </button>

                {/* USER */}
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-white">
                    {user?.name || "Data Entry Operator"}
                  </p>

                
                </div>

                {/* LOGOUT */}
                <button
                  onClick={onLogout}
                  className="rounded-xl border border-[#D4A017]/40 bg-[#111111] px-4 py-2.5 text-sm font-bold text-[#ffffff] transition hover:bg-[#C99216]"
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

        <div className="relative z-10">
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
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#111111] px-4 py-6 sm:px-6 lg:px-10">

      {/* ==========================================
          BACKGROUND DECORATION
      ========================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-60 -right-60 h-[600px] w-[600px] rounded-full bg-[#F5E7B2]/40 blur-3xl" />

        <div className="absolute -bottom-60 -left-60 h-[600px] w-[600px] rounded-full bg-[#D4A017]/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#8A5A0A 1px, transparent 1px), linear-gradient(90deg, #8A5A0A 1px, transparent 1px)",
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

            {/* LEFT HEADER */}

            <div>

              <div className="flex items-center gap-3 mb-3">

                {/* LOGO */}

                <div className="w-12 h-12 rounded-xl bg-[#111111] flex items-center justify-center shadow-lg">
                  <span className="text-sm font-black text-[#D4A017]">
                    FC
                  </span>
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-[#111111]">
                    Practice Football Club
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.28em] text-[#8A5A0A]">
                   Users Portal
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 mt-5">

                <div className="h-9 w-1 rounded-full bg-[#D4A017]" />

                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8A5A0A]">
                  Management System
                </span>

              </div>

              <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#111111]">
                Users Dashboard
              </h1>

              <p className="mt-2 text-sm text-[#6F6250]">
                खेळाडूची माहिती नोंदवण्यासाठी खालील पर्याय वापरा.
              </p>

            </div>

            {/* STATUS BADGE */}

            

          </div>

        </div>

        {/* ==========================================
            WELCOME CARD
        ========================================== */}

        <div className="mb-5 rounded-[22px] border border-[#E8D49A] bg-white p-5 sm:p-7 shadow-[0_10px_35px_rgba(138,90,10,0.08)]">

          <div className="flex items-start gap-4">

            

            <div>

              <h2 className="text-lg font-black text-[#111111]">
                Welcome, {user?.name || "Data Entry Operator"}
              </h2>

              <p className="mt-1 text-sm text-[#6F6250]">
                येथे Practice Football Club मधील
                माजी खेळाडूंची माहिती नोंदवू शकता.
              </p>

            </div>

          </div>

        </div>

        {/* ==========================================
            PLAYER REGISTRATION CARD
        ========================================== */}

        <div className="relative rounded-[22px] border border-[#E8D49A] bg-white shadow-[0_15px_45px_rgba(138,90,10,0.08)] overflow-hidden">

          {/* GOLD TOP LINE */}

          <div className="h-1 bg-[#D4A017]" />

          <div className="p-5 sm:p-7">

            <div className="flex items-start gap-4">

              {/* ICON */}

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-2xl shadow-md">
                <span>⚽</span>
              </div>

              <div className="flex-1">

                <div className="flex items-center gap-3">

                  <h2 className="text-xl font-black text-[#111111]">
                    Invitees Registration
                  </h2>

                  <span className="hidden sm:inline-flex px-2 py-1 rounded-md bg-[#D4A017] text-[#111111] text-[9px] font-black uppercase tracking-wider">
                    New Entry
                  </span>

                </div>

                <p className="mt-1 text-sm text-[#9A8F7D]">
                 माजी खेळाडूची माहिती व्यवस्थित नोंदवा.
                </p>

              </div>

            </div>

            {/* BUTTON */}

            <button
              onClick={() => {
                setActivePage("player-form");
              }}
              className="group mt-6 flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl bg-[#111111] px-7 py-3.5 text-sm font-black text-white transition hover:bg-black hover:shadow-lg hover:shadow-black/20"
            >

              <span>
                + Player माहिती भरा
              </span>

              <span className="text-lg text-[#D4A017] transition-transform group-hover:translate-x-1">
                →
              </span>

            </button>

          </div>

        </div>

        {/* ==========================================
            INFO
        ========================================== */}

      

        {/* ==========================================
            LOGOUT
        ========================================== */}

        <div className="mt-6 flex justify-end">

          <button
            onClick={onLogout}
            className="rounded-xl border border-[#E8D49A] bg-white px-5 py-3 text-sm font-bold text-[#6F6250] transition hover:border-[#D4A017] hover:bg-[#FFF8E5] hover:text-[#111111]"
          >
            Logout
          </button>

        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div className="py-8 text-center">

          <p className="text-[9px] uppercase tracking-[0.25em] text-[#9A8F7D]">
            Practice Football Club
          </p>

        </div>

      </div>

    </div>
  );
}

export default DataEntryDashboard;