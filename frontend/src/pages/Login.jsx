import { useState } from "react";
import logo from "../assets/logo.png";

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
          data.message || "Username किंवा Password चुकीचा आहे."
        );
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLogin(data.user);
    } catch (error) {
      console.error("Frontend login error:", error);
      setError("Server शी connection होऊ शकले नाही.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#111111] relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-[#D4A017]/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#C99216]/10 blur-3xl" />

        <div className="hidden lg:block absolute left-1/2 bottom-[-420px] -translate-x-1/2 w-[900px] h-[900px] rounded-full border border-[#D4A017]/10" />

        <div className="hidden lg:block absolute left-1/2 bottom-[-300px] -translate-x-1/2 w-[620px] h-[620px] rounded-full border border-[#8A5A0A]/10" />

      </div>


      {/* ================= HEADER ================= */}

      <header className="relative z-20 px-5 sm:px-8 lg:px-14 py-4 sm:py-5">

        

      </header>


      {/* ================= MAIN ================= */}

      <main className="relative z-10 min-h-[calc(100vh-80px)] flex items-start lg:items-center px-4 sm:px-8 lg:px-14 pt-5 sm:pt-8 lg:pt-0 pb-8">

        <div className="w-full max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-24 items-center">


            {/* ================= DESKTOP BRANDING ================= */}

            <section className="hidden lg:block">

              <div className="max-w-xl">

                {/* LOGO */}

                <div className="flex items-center justify-start">

                  <div className="w-[380px] h-[380px] xl:w-[380px] xl:h-[380px] flex items-center justify-center">

                    <img
                      src={logo}
                      alt="Practice Football Club Logo"
                      className="w-full h-full object-contain"
                    />

                  </div>

                </div>


                {/* DESCRIPTION */}

                <p className="mt-8 max-w-md text-sm leading-7 text-[#111111]/55">
                  A dedicated platform for managing your football club,
                  players, events and everything that keeps the team
                  moving forward.
                </p>


                {/* VALUES */}

                <div className="mt-12 flex items-center gap-8">

                  <div>
                    <p className="text-xl font-black text-[#111111]">
                      TEAM
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#8A5A0A]">
                      Together
                    </p>
                  </div>


                  <div className="h-9 w-px bg-[#D4A017]/25" />


                  <div>
                    <p className="text-xl font-black text-[#111111]">
                      DRIVE
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#8A5A0A]">
                      Forward
                    </p>
                  </div>


                  <div className="h-9 w-px bg-[#D4A017]/25" />


                  <div>
                    <p className="text-xl font-black text-[#111111]">
                      LEGACY
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#8A5A0A]">
                      Forever
                    </p>
                  </div>

                </div>

              </div>

            </section>


            {/* ================= LOGIN AREA ================= */}

            <section className="w-full max-w-md mx-auto">


              {/* ================= MOBILE BRANDING ================= */}

              <div className="lg:hidden text-center mb-6 sm:mb-8">

                <div className="mx-auto mb-4 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#111111] flex items-center justify-center overflow-hidden shadow-xl shadow-[#D4A017]/20">

                  <img
                    src={logo}
                    alt="Practice Football Club Logo"
                    className="w-full h-full object-contain p-2"
                  />

                </div>


                <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-[#111111]">
                  PRACTICE FOOTBALL CLUB
                </h1>


                <div className="mt-2 flex items-center justify-center gap-2">

                  <span className="w-6 h-[1px] bg-[#D4A017]" />

                  <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#8A5A0A]">
                    Official Club Portal
                  </p>

                  <span className="w-6 h-[1px] bg-[#D4A017]" />

                </div>

              </div>


              {/* ================= LOGIN CARD ================= */}

              <div className="relative">

                <div className="absolute -inset-1 sm:-inset-2 bg-[#D4A017]/10 blur-2xl rounded-[28px]" />


                <div className="relative bg-[#FFFDF7] rounded-[22px] sm:rounded-[26px] border border-[#D4A017]/25 shadow-[0_20px_60px_rgba(17,17,17,0.10)] overflow-hidden">


                  {/* ACCENT */}

                  <div className="h-1 bg-gradient-to-r from-[#111111] via-[#D4A017] to-[#8A5A0A]" />


                  <div className="p-5 sm:p-8 md:p-9">


                    {/* ================= CARD HEADER ================= */}

                    <div className="mb-6 sm:mb-8">

                      <div className="flex items-center justify-between">

                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#D4A017]/10 border border-[#D4A017]/25 flex items-center justify-center">

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5 text-[#8A5A0A]"
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


                        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.22em] font-bold text-[#111111]/25">
                          Secure Access
                        </span>

                      </div>


                      <p className="mt-5 sm:mt-7 text-[9px] uppercase tracking-[0.3em] text-[#8A5A0A] font-black">
                        Management Portal
                      </p>


                      <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
                        Welcome back.
                      </h2>


                      <p className="mt-2 sm:mt-3 text-sm leading-6 text-[#111111]/55">
                        Sign in to access your club
                        management system.
                      </p>

                    </div>


                    {/* ================= FORM ================= */}

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 sm:space-y-5"
                    >

                      {/* USERNAME */}

                      <div>

                        <label className="block mb-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]/60">
                          Username
                        </label>

                        <div className="relative">

                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/35">

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
                            className="w-full h-14 rounded-xl border border-[#D4A017]/25 bg-[#FFFDF7] pl-11 pr-4 text-base sm:text-sm text-[#111111] placeholder:text-[#111111]/30 outline-none transition-all duration-300 focus:bg-white focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
                          />

                        </div>

                      </div>


                      {/* PASSWORD */}

                      <div>

                        <label className="block mb-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]/60">
                          Password
                        </label>

                        <div className="relative">

                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/35">

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
                            className="w-full h-14 rounded-xl border border-[#D4A017]/25 bg-[#FFFDF7] pl-11 pr-16 text-base sm:text-sm text-[#111111] placeholder:text-[#111111]/30 outline-none transition-all duration-300 focus:bg-white focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
                          />


                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 min-w-[48px] min-h-[42px] flex items-center justify-center text-[9px] uppercase tracking-widest font-bold text-[#111111]/40 hover:text-[#D4A017] transition"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>

                        </div>

                      </div>


                      {/* ERROR */}

                      {error && (
                        <div className="flex gap-3 items-start rounded-xl border border-red-200 bg-red-50 px-4 py-3">

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
                        className="group w-full h-14 mt-2 overflow-hidden rounded-xl bg-[#D4A017] text-[#111111] font-black text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#C99216] hover:text-white hover:shadow-[0_12px_30px_rgba(212,160,23,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >

                        <span className="flex items-center justify-center gap-3">

                          {loading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-[#111111]/30 border-t-[#111111] rounded-full animate-spin" />

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


                    {/* ================= CARD FOOTER ================= */}

                    <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#D4A017]/15">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />

                          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-[#111111]/35">
                            Protected Portal
                          </span>

                        </div>


                        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-[#111111]/25">
                          Practice
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


      {/* ================= FOOTER ================= */}

      <footer className="relative z-10 pb-4 sm:pb-5 text-center px-4">

        <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#111111]/35">
          Authorized Management Access • Practice Football Club
        </p>

      </footer>

    </div>
  );
}

export default Login;