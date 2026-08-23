import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("कृपया Username आणि Password भरा.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Username किंवा Password चुकीचा आहे."
        );
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      onLogin(data.user);
    } catch (error) {
      console.error("Frontend login error:", error);

      setError(
        "Server शी connection होऊ शकले नाही."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8f6] text-slate-900 relative overflow-hidden">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Soft green glow */}

        <div className="absolute -top-60 -left-40 w-[650px] h-[650px] rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="absolute -bottom-72 -right-40 w-[700px] h-[700px] rounded-full bg-green-100/60 blur-3xl" />


        {/* Football pitch circle */}

        <div className="absolute left-1/2 bottom-[-420px] -translate-x-1/2 w-[900px] h-[900px] rounded-full border border-emerald-600/[0.06]" />

        <div className="absolute left-1/2 bottom-[-300px] -translate-x-1/2 w-[620px] h-[620px] rounded-full border border-emerald-600/[0.05]" />

        <div className="absolute left-0 right-0 bottom-[100px] border-t border-emerald-600/[0.05]" />


        {/* Small pitch lines */}

        <div className="absolute top-[25%] left-[-100px] w-[300px] h-[180px] border border-emerald-600/[0.04] rounded-r-full" />

        <div className="absolute top-[15%] right-[-100px] w-[300px] h-[180px] border border-emerald-600/[0.04] rounded-l-full" />


        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#064e3b 1px, transparent 1px), linear-gradient(90deg, #064e3b 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-20 px-5 sm:px-8 lg:px-14 py-5">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-[#063b2b] flex items-center justify-center shadow-lg shadow-emerald-900/10">

              <span className="text-xl font-black text-white">
                FC
              </span>

            </div>

            <div>

              <h2 className="text-sm font-black tracking-tight text-slate-900">
                PRACTICE FC
              </h2>

              <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400">
                Football Club
              </p>

            </div>

          </div>


          {/* Portal status */}

          <div className="hidden sm:flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />

            <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-slate-400">
              Club Management Portal
            </span>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative z-10 min-h-[calc(100vh-85px)] flex items-center px-5 sm:px-8 lg:px-14 pb-10">

        <div className="w-full max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-24 items-center">


            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <section className="hidden lg:block">

              <div className="max-w-xl">

                {/* Small heading */}

                <div className="flex items-center gap-3 mb-7">

                  <span className="w-10 h-[2px] bg-emerald-500" />

                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-600">
                    Welcome to the Club
                  </span>

                </div>


                {/* Main heading */}

                <h1 className="text-6xl xl:text-7xl font-black tracking-[-0.05em] leading-[0.92] text-[#09251b]">

                  WHERE
                  <br />

                  <span className="text-emerald-600">
                    PASSION
                  </span>

                  <br />

                  MEETS
                  <br />

                  <span className="text-slate-300">
                    FOOTBALL.
                  </span>

                </h1>


                {/* Description */}

                <p className="mt-8 max-w-md text-sm leading-7 text-slate-500">

                  A dedicated platform for managing
                  your football club, players, matches,
                  events and everything that keeps
                  the team moving forward.

                </p>


                {/* Stats */}

                <div className="mt-12 flex items-center gap-8">

                  <div>

                    <p className="text-xl font-black text-[#09251b]">
                      TEAM
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-slate-400">
                      Together
                    </p>

                  </div>


                  <div className="h-9 w-px bg-slate-200" />


                  <div>

                    <p className="text-xl font-black text-[#09251b]">
                      DRIVE
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-slate-400">
                      Forward
                    </p>

                  </div>


                  <div className="h-9 w-px bg-slate-200" />


                  <div>

                    <p className="text-xl font-black text-[#09251b]">
                      LEGACY
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-slate-400">
                      Forever
                    </p>

                  </div>

                </div>


                {/* Football pitch decoration */}

                <div className="mt-14 flex items-center gap-4">

                  <div className="relative w-24 h-14 rounded-xl border border-emerald-600/10 bg-white shadow-sm overflow-hidden">

                    {/* center line */}

                    <div className="absolute left-1/2 top-0 bottom-0 border-l border-emerald-600/10" />

                    {/* center circle */}

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-emerald-600/15" />

                    {/* left box */}

                    <div className="absolute left-0 top-3 w-5 h-8 border border-emerald-600/10 border-l-0" />

                    {/* right box */}

                    <div className="absolute right-0 top-3 w-5 h-8 border border-emerald-600/10 border-r-0" />

                  </div>


                  <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400">
                    Built for the game
                  </span>

                </div>

              </div>

            </section>


            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <section className="w-full max-w-md mx-auto">

              <div className="relative">

                {/* Card shadow/glow */}

                <div className="absolute -inset-2 bg-emerald-200/40 blur-2xl rounded-[30px]" />


                <div className="relative bg-white rounded-[26px] border border-slate-200 shadow-[0_25px_80px_rgba(15,23,42,0.10)] overflow-hidden">


                  {/* Top accent */}

                  <div className="h-1 bg-gradient-to-r from-emerald-700 via-emerald-500 to-green-400" />


                  <div className="p-7 sm:p-9">


                    {/* =================================================
                        CARD HEADER
                    ================================================= */}

                    <div className="mb-8">

                      <div className="flex items-center justify-between">

                        {/* Login icon */}

                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5 text-emerald-700"
                          >

                            <path
                              d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            />

                            <path
                              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.7 1.7-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20h-2.4v-.3a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-1.7-1.7.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.51-1H6.8v-2.4h.29a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06 1.7-1.7.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V5.6h2.4v.3a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 1.7 1.7-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1h.29V14h-.3A1.65 1.65 0 0 0 19.4 15Z"
                              stroke="currentColor"
                              strokeWidth="1.3"
                            />

                          </svg>

                        </div>


                        <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-300">
                          Secure Access
                        </span>

                      </div>


                      <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-emerald-700 font-black">
                        Management Portal
                      </p>


                      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                        Welcome back.
                      </h2>


                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        Sign in to manage your club
                        and keep your team moving forward.
                      </p>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >


                      {/* USERNAME */}

                      <div>

                        <label className="block mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          Username
                        </label>

                        <div className="relative">

                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            >

                              <path d="M20 21a8 8 0 0 0-16 0" />

                              <circle
                                cx="12"
                                cy="7"
                                r="4"
                              />

                            </svg>

                          </div>


                          <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                              setUsername(e.target.value)
                            }
                            placeholder="Enter your username"
                            autoComplete="username"
                            className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                          />

                        </div>

                      </div>


                      {/* PASSWORD */}

                      <div>

                        <label className="block mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          Password
                        </label>

                        <div className="relative">

                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            >

                              <rect
                                x="4"
                                y="10"
                                width="16"
                                height="11"
                                rx="2"
                              />

                              <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                            </svg>

                          </div>


                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={password}
                            onChange={(e) =>
                              setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-16 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                          />


                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-600 transition"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>

                        </div>

                      </div>


                      {/* ERROR */}

                      {error && (

                        <div className="flex gap-3 items-start rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">

                          <div className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-red-100 flex items-center justify-center">

                            <span className="text-xs font-bold text-red-600">
                              !
                            </span>

                          </div>

                          <p className="text-xs leading-5 text-red-600">
                            {error}
                          </p>

                        </div>

                      )}


                      {/* LOGIN BUTTON */}

                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full h-14 mt-2 overflow-hidden rounded-xl bg-[#063b2b] text-white font-black text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:bg-emerald-700 hover:shadow-[0_12px_30px_rgba(5,150,105,0.20)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >

                        <span className="relative z-10 flex items-center justify-center gap-3">

                          {loading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                              Signing in...
                            </>
                          ) : (
                            <>
                              Enter Club

                              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                                →
                              </span>
                            </>
                          )}

                        </span>

                      </button>

                    </form>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="mt-8 pt-6 border-t border-slate-100">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                          <span className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                            Protected Portal
                          </span>

                        </div>


                        <span className="text-[9px] uppercase tracking-[0.18em] text-slate-300">
                          Practice FC
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </section>

          </div>

        </div>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="relative z-10 pb-5 text-center">

        <p className="text-[9px] uppercase tracking-[0.25em] text-slate-400">
          Authorized Management Access • Practice Football Club
        </p>

      </footer>

    </div>
  );
}

export default Login;