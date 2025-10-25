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
    <main className="relative min-h-[88vh] flex items-center justify-center py-12">
      {/* Background aura */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-700/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Log in</h2>
            <p className="mt-1 text-sm text-slate-600">
              Welcome back. Secure access to your QFS dashboard.
            </p>
          </div>

          {/* ✅ Success message (after verification) */}
          {msg && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {msg}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
                placeholder="you@domain.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-800">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          {/* Footer row: forgot + create */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-slate-600">
            <Link to="/forgot-password" className="font-semibold text-blue-600 hover:underline">
              Forgot password?
            </Link>
            <p>
              No account?{" "}
              <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
