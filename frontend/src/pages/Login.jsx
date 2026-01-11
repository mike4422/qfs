// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null); // ✅ Added success message
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { state } = useLocation();
  const [params] = useSearchParams(); // ✅ Detect query param

  // ✅ If the user was redirected after verification, show message
  useEffect(() => {
    if (params.get("verified") === "1") {
      setMsg("✅ Your email has been verified! You can now log in.");
    }
  }, [params]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Call your auth store's login and grab what it returns
      const result = await login(email.trim().toLowerCase(), password);

      // Robustly extract token from different possible shapes
      const token =
        result?.token ||
        result?.data?.token ||
        (typeof result === "string" ? result : null);

      // Persist token so subsequent fetches (DashboardHeader) can read it
      if (token) {
        localStorage.setItem("token", token);
      }

      // Continue as before
      nav(state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[88vh] overflow-hidden">
      {/* ===== Web3 background ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(40% 40% at 20% 15%, rgba(34,197,94,.30) 0%, rgba(34,197,94,0) 60%), radial-gradient(35% 35% at 80% 25%, rgba(56,189,248,.22) 0%, rgba(56,189,248,0) 60%)",
        }}
      />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
            {/* ===== Left: Value proposition ===== */}
            <div className="hidden lg:block">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Web3LedgerTrust • Secure Access
              </span>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">
                Log in to your ledger-linked wallet security.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80">
                Monitor migration status, link your wallet to the Web3 security ledger, and manage your{" "}
                <span className="font-semibold text-white">10% monthly yield</span> dashboard.
              </p>

              <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
                <MiniCard
                  title="CEX → Wallet Migration"
                  text="Track transfers with clear checkpoints."
                  icon={<ArrowSwapIcon />}
                />
                <MiniCard
                  title="Ledger Link Security"
                  text="Real-time tracking signals + monitoring."
                  icon={<ShieldIcon />}
                />
                <MiniCard
                  title="Yield Dashboard"
                  text="See yield accrual and wallet balances."
                  icon={<SparkIcon />}
                />
                <MiniCard
                  title="Account Controls"
                  text="Secure sessions and device hygiene."
                  icon={<BoltIcon />}
                />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-2 text-xs text-white/70">
                <Pill>Self-custody first</Pill>
                <Pill>Non-custodial link</Pill>
                <Pill>Web3-native security</Pill>
              </div>
            </div>

            {/* ===== Right: Login card ===== */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">Log in</h2>
                    <p className="mt-1 text-sm text-white/75">
                      Secure access to your Web3LedgerTrust dashboard.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    Encrypted session
                  </div>
                </div>
              </div>

              {/* ✅ Success message (after verification) */}
              {msg && (
                <div className="mb-4 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {msg}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-4 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-emerald-300/60"
                    placeholder="you@domain.com"
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/90">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 pr-10 text-sm text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-emerald-300/60"
                      placeholder="Your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
                      aria-label={showPw ? "Hide password" : "Show password"}
                      title={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Trust note */}
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
                  Security reminder: Web3LedgerTrust will never request your seed phrase or private keys.
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Logging in…" : "Log in to Web3LedgerTrust"}
                </button>
              </form>

              {/* Footer row: forgot + create */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
                <Link to="/forgot-password" className="font-semibold text-emerald-200 hover:underline">
                  Forgot password?
                </Link>
                <p>
                  No account?{" "}
                  <Link to="/register" className="font-semibold text-emerald-200 hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile value props */}
          <div className="mt-8 lg:hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-sm font-semibold text-white">Web3LedgerTrust</div>
            <div className="mt-1 text-white/80 text-sm">
              Log in to manage migration, ledger link security, and your 10% monthly yield dashboard.
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniCard title="CEX → Wallet Migration" text="Track transfers and checkpoints." icon={<ArrowSwapIcon />} />
              <MiniCard title="Ledger Link Security" text="Real-time tracking signals." icon={<ShieldIcon />} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- Small UI pieces ---------- */

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/75 backdrop-blur">
      {children}
    </span>
  );
}

function MiniCard({ title, text, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950">
          {icon}
        </span>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-white/70">{text}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Icons ---------- */

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.6 10.6a3 3 0 004.2 4.2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.2 6.2C3.9 8 2.5 12 2.5 12s3.5 7 9.5 7c2 0 3.7-.6 5-1.4M9 5.4A9.6 9.6 0 0112 5c6 0 9.5 7 9.5 7s-1 2-3 3.8"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7.5 4v6c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-5" />
    </svg>
  );
}

function ArrowSwapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h11l-2-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17H6l2 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 7l-2-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 17l2 2" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l1.3 6.2L20 10l-6.7 1.8L12 18l-1.3-6.2L4 10l6.7-1.8L12 2z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}
