// src/pages/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin",
  "Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia",
  "Comoros","Congo (Congo-Brazzaville)","Costa Rica","Côte d’Ivoire","Croatia","Cuba","Cyprus","Czechia",
  "Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica",
  "Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho",
  "Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali",
  "Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia",
  "Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua",
  "Niger","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay",
  "Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis",
  "Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia",
  "Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia",
  "South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia",
  "Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    country: "United States",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const onChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
    setApiError(null);
    setMsg(null);
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.username.trim()) e.username = "Username is required.";
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username))
      e.username = "3–20 chars, letters/numbers/underscore only.";

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";

    if (!form.country) e.country = "Select your country.";

    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^[\d+()\-\s]{7,20}$/.test(form.phone))
      e.phone = "Enter a valid phone number.";

    if (!form.password) e.password = "Create a password.";
    else if (form.password.length < 8)
      e.password = "At least 8 characters.";
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      e.password = "Use letters and numbers.";

    if (!form.confirmPassword) e.confirmPassword = "Confirm your password.";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setApiError(null);

    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        country: form.country,
        phone: form.phone.trim(),
        password: form.password,
      };

      const { data } = await api.post("/auth/register", payload);
      setMsg(data.message || "Registered — check your inbox (or spam) to verify your email.");
      setForm({
        name: "",
        username: "",
        email: "",
        country: "Nigeria",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);

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
          <div className="grid gap-8 lg:grid-cols-[1fr_460px] lg:items-start">
            {/* ===== Left: Value proposition ===== */}
            <div className="hidden lg:block">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Web3LedgerTrust • Account
              </span>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">
                Reclaim custody. Track everything. Earn yield.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80">
                Create your Web3LedgerTrust account to migrate funds from centralized exchanges to a self-custody wallet,
                link to our security ledger, and unlock <span className="font-semibold text-white">10% monthly yield</span>{" "}
                on wallet balances.
              </p>

              <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
                <MiniCard
                  title="CEX → Wallet Migration"
                  text="Guided transfer flow with clean checkpoints."
                  icon={<ArrowSwapIcon />}
                />
                <MiniCard
                  title="Ledger Link Security"
                  text="Real-time tracking signals + hardened monitoring."
                  icon={<ShieldIcon />}
                />
                <MiniCard
                  title="10% Monthly Yield"
                  text="Earn yield on verified wallet balances."
                  icon={<SparkIcon />}
                />
                <MiniCard
                  title="Fast Onboarding"
                  text="Create an account in under a minute."
                  icon={<BoltIcon />}
                />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-2 text-xs text-white/70">
                <Pill>Self-custody first</Pill>
                <Pill>Non-custodial link</Pill>
                <Pill>Web3-native UI</Pill>
                <Pill>Security-ledger tracking</Pill>
              </div>
            </div>

            {/* ===== Right: Form card ===== */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      Create your account
                    </h2>
                    <p className="mt-1 text-sm text-white/75">
                      Start migration, link your wallet, and earn 10% monthly yield.
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    Secure onboarding
                  </div>
                </div>
              </div>

              {msg && (
                <div className="mb-4 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {msg}
                </div>
              )}
              {apiError && (
                <div className="mb-4 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {apiError}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                {/* Name */}
                <Field
                  id="name"
                  label="Full name"
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder="Jane Doe"
                  error={errors.name}
                  autoComplete="name"
                  dark
                />

                {/* Username */}
                <Field
                  id="username"
                  label="Username"
                  value={form.username}
                  onChange={onChange("username")}
                  placeholder="jane_doe"
                  error={errors.username}
                  autoComplete="username"
                  dark
                />

                {/* Email */}
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder="you@domain.com"
                  error={errors.email}
                  autoComplete="email"
                  dark
                />

                {/* Country + Phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-white/90">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={onChange("country")}
                      className={[
                        "mt-1 block w-full rounded-xl border bg-white/5 px-3 py-2 text-sm text-white outline-none backdrop-blur",
                        errors.country
                          ? "border-red-300/50 focus:border-red-300"
                          : "border-white/15 focus:border-emerald-300/60",
                      ].join(" ")}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} className="bg-slate-950 text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.country && <p className="mt-1 text-xs text-red-200">{errors.country}</p>}
                  </div>

                  <Field
                    id="phone"
                    label="Phone number"
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder="+1 000 000 0000"
                    error={errors.phone}
                    autoComplete="tel"
                    dark
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
                      name="password"
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={onChange("password")}
                      className={[
                        "block w-full rounded-xl border bg-white/5 px-3 py-2 pr-10 text-sm text-white outline-none backdrop-blur placeholder:text-white/40",
                        errors.password
                          ? "border-red-300/50 focus:border-red-300"
                          : "border-white/15 focus:border-emerald-300/60",
                      ].join(" ")}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
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

                  {/* Strength */}
                  <div className="mt-2">
                    <div className="h-1 w-full rounded bg-white/10">
                      <div className={`h-1 rounded ${strength.color}`} style={{ width: strength.width }} />
                    </div>
                    <p className="mt-1 text-xs text-white/60">Strength: {strength.label}</p>
                  </div>

                  {errors.password && <p className="mt-1 text-xs text-red-200">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
                    Confirm password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPw2 ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={onChange("confirmPassword")}
                      className={[
                        "block w-full rounded-xl border bg-white/5 px-3 py-2 pr-10 text-sm text-white outline-none backdrop-blur placeholder:text-white/40",
                        errors.confirmPassword
                          ? "border-red-300/50 focus:border-red-300"
                          : "border-white/15 focus:border-emerald-300/60",
                      ].join(" ")}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw2((v) => !v)}
                      className="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
                      aria-label={showPw2 ? "Hide password" : "Show password"}
                      title={showPw2 ? "Hide password" : "Show password"}
                    >
                      {showPw2 ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-200">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Trust note */}
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
                  We will never ask for your seed phrase. Wallet linking is a secure, consent-based handshake.
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Creating account…" : "Create Web3LedgerTrust account"}
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
                <Link to="/forgot-password" className="font-semibold text-emerald-200 hover:underline">
                  Forgot password?
                </Link>

                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-emerald-200 hover:underline">
                    Log in
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-xs text-white/50">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-white/70 hover:text-white hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-white/70 hover:text-white hover:underline">
                  Privacy Policy
                </Link>
                .
              </div>
            </div>
          </div>

          {/* Mobile value props */}
          <div className="mt-8 lg:hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-sm font-semibold text-white">Web3LedgerTrust</div>
            <div className="mt-1 text-white/80 text-sm">
              Migrate from CEX → self-custody wallet, link to our ledger, earn 10% monthly yield.
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniCard title="CEX → Wallet Migration" text="Guided transfer flow." icon={<ArrowSwapIcon />} />
              <MiniCard title="Ledger Link Security" text="Real-time tracking signals." icon={<ShieldIcon />} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- Reusable Field component ---------- */
function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  dark = false,
}) {
  const base =
    "mt-1 block w-full rounded-xl border px-3 py-2 text-sm outline-none transition";
  const light =
    "border-slate-300 bg-white text-slate-900 focus:border-blue-500";
  const darkMode = [
    "border-white/15 bg-white/5 text-white backdrop-blur placeholder:text-white/40",
    error ? "focus:border-red-300" : "focus:border-emerald-300/60",
  ].join(" ");
  const errorBorder = dark ? "border-red-300/50" : "border-red-300";

  return (
    <div>
      <label
        htmlFor={id}
        className={dark ? "block text-sm font-medium text-white/90" : "block text-sm font-medium text-slate-800"}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className={[
          base,
          dark ? darkMode : light,
          error ? errorBorder : "",
        ].join(" ")}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error && (
        <p className={dark ? "mt-1 text-xs text-red-200" : "mt-1 text-xs text-red-600"}>{error}</p>
      )}
    </div>
  );
}

/* ---------- Password strength helper ---------- */
function getPasswordStrength(pw = "") {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map = [
    { label: "Very weak", color: "bg-red-400", width: "10%" },
    { label: "Weak", color: "bg-orange-400", width: "30%" },
    { label: "Fair", color: "bg-yellow-400", width: "55%" },
    { label: "Good", color: "bg-lime-500", width: "75%" },
    { label: "Strong", color: "bg-emerald-500", width: "100%" },
  ];

  return map[Math.max(0, Math.min(score - 1, map.length - 1))];
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
