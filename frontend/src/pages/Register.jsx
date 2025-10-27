// src/pages/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

console.log("API BASE URL =", import.meta.env.VITE_API_BASE);


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
      setMsg(data.message || "Registered, Check your inbox or spam folder to verify your email..");
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
    <main className="relative min-h-[88vh] flex items-center justify-center py-12">
      {/* Background gradient aura */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-700/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Secure your access to the QFS Network.
            </p>
          </div>

          {msg && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {msg}
            </div>
          )}
          {apiError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
            />

            {/* Country + Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-800">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={onChange("country")}
                  className={`mt-1 block w-full rounded-xl border ${errors.country ? "border-red-300" : "border-slate-300"} bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500`}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
              </div>

              <Field
                id="phone"
                label="Phone number"
                value={form.phone}
                onChange={onChange("phone")}
                placeholder="+1 000 000 0000"
                error={errors.phone}
                autoComplete="tel"
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
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={onChange("password")}
                  className={`block w-full rounded-xl border ${errors.password ? "border-red-300" : "border-slate-300"} bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500`}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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
              {/* Strength */}
              <div className="mt-2">
                <div className="h-1 w-full rounded bg-slate-200">
                  <div
                    className={`h-1 rounded ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Strength: {strength.label}
                </p>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-800">
                Confirm password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPw2 ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={onChange("confirmPassword")}
                  className={`block w-full rounded-xl border ${errors.confirmPassword ? "border-red-300" : "border-slate-300"} bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500`}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw2((v) => !v)}
                  className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                  aria-label={showPw2 ? "Hide password" : "Show password"}
                >
                  {showPw2 ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Registering…" : "Create account"}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-slate-600">
            <Link
              to="/forgot-password"
              className="font-semibold text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>

            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

/* ---------- Reusable Field component ---------- */
function Field({ id, label, type = "text", value, onChange, placeholder, error, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full rounded-xl border ${
          error ? "border-red-300" : "border-slate-300"
        } bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500`}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
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
