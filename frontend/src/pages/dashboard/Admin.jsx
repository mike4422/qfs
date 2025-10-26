// src/pages/dashboard/Admin.jsx
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import api from "../../lib/api"; // ✅ use your configured Axios instance

// ---- CONFIG ---------------------------------------------------------------
const ADMIN_EMAILS = [
  "mikeclinton508@gmail.com",
  "viviansmiari@gmail.com",
].map((e) => String(e).toLowerCase());

const STATUS_FLOW = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

// ---- HELPERS --------------------------------------------------------------
function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function displayName(x) {
  return (
    x?.fullName ||
    x?.name ||
    [x?.firstName, x?.lastName].filter(Boolean).join(" ") ||
    x?.username ||
    (x?.email ? x.email.split("@")[0] : "") ||
    "—"
  );
}

function SkeletonRows({ rows = 6, cols = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="py-3 pr-4">
              <div className="h-3 w-24 rounded bg-gray-200" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ---- SMALL UI PIECES ------------------------------------------------------
function Dropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border-gray-200 bg-white text-sm focus:ring-2 focus:ring-gray-900 px-3 py-2"
    >
      {STATUS_FLOW.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}



function StatusBadge({ status }) {
  const palette = {
    PENDING: "bg-amber-100 text-amber-800 ring-amber-300",
    UNDER_REVIEW: "bg-blue-100 text-blue-800 ring-blue-300",
    APPROVED: "bg-emerald-100 text-emerald-800 ring-emerald-300",
    REJECTED: "bg-rose-100 text-rose-800 ring-rose-300",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        palette[status] || "bg-gray-100 text-gray-800 ring-gray-300"
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
      {status}
    </span>
  );
}

function PillButton({ children, onClick, variant = "default", disabled, className }) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1";
  const styles = {
    default:
      "bg-white hover:bg-gray-50 ring-1 ring-gray-200 text-gray-900 focus:ring-gray-300",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300",
    primary:
      "bg-gray-900 text-white hover:bg-black focus:ring-gray-400",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-400",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        base,
        styles[variant],
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

// ---- API LAYER (adds Authorization automatically) ------------------------



// ---- MAIN COMPONENT -------------------------------------------------------
export default function Admin() {
  const { user } = useAuth();
  const stored = localStorage.getItem("qfs_user");
  const fromLS = stored ? JSON.parse(stored) : null;
  const currentUser = user || fromLS;
  const emailLc = String(currentUser?.email || "").toLowerCase();
  const isAdminRole = currentUser?.role === "ADMIN";
  const isAdmin = isAdminRole || ADMIN_EMAILS.includes(emailLc);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl py-24 px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Not authorized</h1>
        <p className="mt-3 text-gray-600">
          Your account is not provisioned for admin access. Contact support if
          you believe this is an error.
        </p>
      </div>
    );
  }

  return <AdminDashboard />;
}

// ---- DASHBOARD ------------------------------------------------------------
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users"); // users | withdrawals | deposits
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AdminHeader />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <TabBar activeTab={activeTab} onChange={setActiveTab} />
        <div className="mt-6">
          {activeTab === "users" && <UsersPanel />}
          {activeTab === "withdrawals" && <WithdrawalsPanel />}
          {activeTab === "deposits" && <DepositsPanel />}
          {activeTab === "kyc" && <KycPanel />}
          {activeTab === "walletsyncs" && <WalletSyncsPanel />}

        </div>
      </div>
    </div>
  );
}

function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white grid place-items-center font-semibold">
            QF
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-xs text-gray-500">
              Moderation • Users • Deposits • Withdrawals
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PillButton variant="ghost" onClick={() => window.location.reload()}>
            Refresh
          </PillButton>
          <PillButton
            variant="primary"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Back to App
          </PillButton>
        </div>
      </div>
    </header>
  );
}

function TabBar({ activeTab, onChange }) {
  const tabs = [
    { key: "users", label: "Users" },
    { key: "withdrawals", label: "Withdrawals" },
    { key: "deposits", label: "Deposits" },
    { key: "kyc", label: "KYC" },
    { key: "walletsyncs", label: "Wallet Syncs" },
  ];
  return (
    <div className="w-full">
      <div className="inline-flex rounded-2xl bg-white/70 backdrop-blur ring-1 ring-gray-200 shadow-sm p-1">
        {tabs.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              className={classNames(
                "relative whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => onChange(t.key)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- USERS PANEL ----------------------------------------------------------
function UsersPanel() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [fundUser, setFundUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/admin/users");
        setRows(data?.users || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = rows.filter((r) => {
    const qq = q.trim().toLowerCase();
    if (!qq) return true;
    return [r.fullName, r.name, r.username, r.email, r.country, r.city, r.phone, String(r.id)]
      .filter(Boolean)
      .some((x) => String(x).toLowerCase().includes(qq));
  });

  async function handleDeleteUser(u) {
    if (!confirm(`Delete user ${u.email}? This action cannot be undone.`))
      return;
    try {
      await api.delete(`/admin/users/${u.id}`, { method: "DELETE" });
      setRows((prev) => prev.filter((x) => x.id !== u.id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete user");
    }
  }

  async function handleWipeBalance(u) {
    if (!confirm(`Set all balances to 0 for ${u.email}?`)) return;
    try {
        await api.post(`/admin/users/${u.id}/wipe-balances`);
     const { data } = await api.get("/admin/users");
     setRows(data?.users || []);
    } catch (e) {
      console.error(e);
      alert("Failed to wipe balances");
    }
  }

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-gray-200 shadow-sm p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">All Users</h2>
          <p className="text-sm text-gray-600">
            View, edit, fund, or delete any user
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, id..."
              className="w-full sm:w-72 rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2 pl-9"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
              />
            </svg>
          </div>
          <PillButton onClick={() => window.location.reload()}>Reload</PillButton>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Email</th>
               <th className="py-2 pr-4">Country</th>
               <th className="py-2 pr-4">City</th>
               <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">KYC</th>
              <th className="py-2 pr-4">Balances</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <SkeletonRows cols={7} />
            ) : filtered.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-gray-600" colSpan={7}>
                  No users
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u.id}
                  className="align-top hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 pr-4">{u.id}</td>
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-900 dark:text-white">{displayName(u)}</div>

                    <div className="text-xs text-gray-500">
                      @{u.username || "n/a"}
                    </div>
                  </td>
                  <td className="py-3 pr-4">{u.email}</td>
                    <td className="py-3 pr-4">{u.country || "—"}</td>
                    <td className="py-3 pr-4">{u.city || "—"}</td>
                    <td className="py-3 pr-4">{u.phone || "—"}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={classNames(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ring-inset",
                        u.kycStatus === "APPROVED" &&
                          "bg-emerald-100 text-emerald-800 ring-emerald-300",
                        u.kycStatus === "PENDING" &&
                          "bg-amber-100 text-amber-800 ring-amber-300",
                        (!u.kycStatus ||
                          u.kycStatus === "NOT_VERIFIED") &&
                          "bg-gray-100 text-gray-800 ring-gray-300"
                      )}
                    >
                      {u.kycStatus || "NOT_VERIFIED"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {(u.holdings || []).length === 0 ? (
                      <span className="text-sm text-gray-500">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {(u.holdings || []).map((h) => (
                          <span
                            key={`${u.id}-${h.symbol}`}
                            className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
                          >
                            {h.symbol}: {h.amount}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <PillButton variant="default" onClick={() => setEditUser(u)}>
                        Edit
                      </PillButton>
                      <PillButton variant="primary" onClick={() => setFundUser(u)}>
                        Fund
                      </PillButton>
                      <PillButton variant="default" onClick={() => handleWipeBalance(u)}>
                        Wipe
                      </PillButton>
                      <PillButton variant="danger" onClick={() => handleDeleteUser(u)}>
                        Delete
                      </PillButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editUser && (
        <EditUserDrawer
          user={editUser}
          onClose={() => setEditUser(null)}
          onSaved={async () => {
           const { data } = await api.get("/admin/users");
            setRows(data?.users || []);
            setEditUser(null);
          }}
        />
      )}

      {fundUser && (
        <FundModal
          user={fundUser}
          onClose={() => setFundUser(null)}
          onFunded={async () => {
            const { data } = await api.get("/admin/users");
           setRows(data?.users || []);
            setFundUser(null);
          }}
        />
      )}
    </div>
  );
}

function EditUserDrawer({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    fullName: user.fullName || user.name || "",
    username: user.username || "",
    email: user.email || "",
    wallets: user.wallets || {},
    kycStatus: user.kycStatus || "NOT_VERIFIED",
    country: user.country || "",
    city: user.city || "",
    phone: user.phone || "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    try {
      setSaving(true);
      await api.put(`/admin/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      onSaved();
    } catch (e) {
      console.error(e);
      alert("Failed to save user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl p-6 overflow-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit User</h3>
          <PillButton variant="ghost" onClick={onClose}>
            Close
          </PillButton>
        </div>
        <div className="mt-4 space-y-4">
          <FormRow label="Full name">
            <input
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
              className="mt-1 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2"
            />
          </FormRow>
          <FormRow label="Username">
            <input
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="mt-1 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2"
            />
          </FormRow>
          <FormRow label="Email">
            <input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="mt-1 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2"
            />
          </FormRow>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div>
    <label className="text-sm font-medium">Country</label>
    <input
      value={form.country}
      onChange={(e) => setForm({ ...form, country: e.target.value })}
      className="mt-1 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2"
    />
  </div>
  <div>
    <label className="text-sm font-medium">City</label>
    <input
      value={form.city}
      onChange={(e) => setForm({ ...form, city: e.target.value })}
      className="mt-1 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2"
    />
  </div>
  <div>
    <label className="text-sm font-medium">Phone</label>
    <input
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
      placeholder="+1 555 000 0000"
      className="mt-1 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2"
    />
  </div>
</div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["BTC", "ETH", "USDT_TRC20", "USDT_ERC20", "XLM", "XRP", "BNB"].map(
              (k) => (
                <div key={k}>
                  <label className="text-sm font-medium">{k} Wallet</label>
                  <input
                    value={(form.wallets || {})[k] || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        wallets: { ...(form.wallets || {}), [k]: e.target.value },
                      })
                    }
                    placeholder="address"
                    className="mt-1 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2"
                  />
                </div>
              )
            )}
          </div>

          <FormRow label="KYC Status">
            <select
              value={form.kycStatus}
              onChange={(e) =>
                setForm({ ...form, kycStatus: e.target.value })
              }
              className="mt-1 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2"
            >
              <option value="NOT_VERIFIED">NOT_VERIFIED</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
            </select>
          </FormRow>

          <div className="pt-2 flex items-center justify-end gap-2">
            <PillButton variant="ghost" onClick={onClose}>
              Cancel
            </PillButton>
            <PillButton variant="primary" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- SMALL HELPER COMPONENT ------------------------------------------------
function FormRow({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}


function FundModal({ user, onClose, onFunded }) {
  const [symbol, setSymbol] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!amount || Number(amount) <= 0) return alert("Enter a positive amount");
    try {
      setSubmitting(true);
      await api(`/api/admin/users/${user.id}/fund`, {
        method: "POST",
        body: JSON.stringify({ symbol, amount }),
      });
      onFunded();
    } catch (e) {
      console.error(e);
      alert("Failed to fund account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-200">
        <h3 className="text-lg font-semibold">Fund User Balance</h3>
        <p className="mt-1 text-sm text-gray-600">
          {user.fullName} • {user.email}
        </p>
        <div className="mt-4 space-y-4">
          <FormRow label="Asset">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="mt-1 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2"
            >
              {[
                "USDT",
                "USDC",
                "BTC",
                "ETH",
                "XRP",
                "XLM",
                "BNB",
                "SOL",
                "ADA",
                "MATIC",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Amount">
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2"
            />
          </FormRow>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <PillButton variant="ghost" onClick={onClose}>
            Cancel
          </PillButton>
          <PillButton variant="primary" onClick={submit} disabled={submitting}>
            {submitting ? "Funding..." : "Fund"}
          </PillButton>
        </div>
      </div>
    </div>
  );
}

// ---- WITHDRAWALS PANEL ----------------------------------------------------
function WithdrawalsPanel() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
         const { data } = await api.get("/admin/withdrawals");
       setRows(data?.items || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load withdrawals");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = rows.filter((r) => {
    const qq = q.trim().toLowerCase();
    if (!qq) return true;
    return [r.userEmail, r.symbol, r.address, String(r.id)].some((x) =>
      String(x).toLowerCase().includes(qq)
    );
  });

  async function setStatus(row, status) {
    try {
      await api.put(`/admin/withdrawals/${row.id}/status`, { status });
     const { data } = await api.get("/admin/withdrawals");
      setRows(data?.items || []);
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  }

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-gray-200 shadow-sm p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Withdrawal Requests</h2>
          <p className="text-sm text-gray-600">Approve or reject withdrawals</p>
        </div>
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search email, id, address..."
            className="w-full sm:w-80 rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2 pl-9"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
            />
          </svg>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Asset</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Address</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Requested</th>
              <th className="py-2 pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <SkeletonRows cols={8} />
            ) : filtered.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-gray-600" colSpan={8}>
                  No withdrawal requests
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="align-top hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 pr-4">{r.id}</td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{r.fullName || "—"}</div>
                    <div className="text-xs text-gray-500">{r.userEmail}</div>
                  </td>
                  <td className="py-3 pr-4">{r.symbol}</td>
                  <td className="py-3 pr-4">{r.amount}</td>
                  <td className="py-3 pr-4 text-xs break-all max-w-[240px]">
                    {r.address}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <Dropdown
                        value={r.status}
                        onChange={(s) => setStatus(r, s)}
                      />
                      <PillButton
                        variant="ghost"
                        onClick={() =>
                          navigator.clipboard.writeText(String(r.address))
                        }
                      >
                        Copy Addr
                      </PillButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- DEPOSITS PANEL -------------------------------------------------------
function DepositsPanel() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const {data} = await api.get("/admin/deposits")
        setRows(data?.items || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load deposits");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = rows.filter((r) => {
    const qq = q.trim().toLowerCase();
    if (!qq) return true;
    return [r.userEmail, r.symbol, r.txId, String(r.id)].some((x) =>
      String(x).toLowerCase().includes(qq)
    );
  });

  async function setStatus(row, status) {
    try {
      await api(`/api/admin/deposits/${row.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      const data = await api("/api/admin/deposits");
      setRows(data?.items || []);
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  }

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-gray-200 shadow-sm p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Deposit Requests</h2>
          <p className="text-sm text-gray-600">
            Review and confirm user deposits
          </p>
        </div>
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search email, id, txId..."
            className="w-full sm:w-80 rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2 pl-9"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
            />
          </svg>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Asset</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">TxID</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Requested</th>
              <th className="py-2 pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <SkeletonRows cols={8} />
            ) : filtered.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-gray-600" colSpan={8}>
                  No deposit requests
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="align-top hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 pr-4">{r.id}</td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{r.fullName || "—"}</div>
                    <div className="text-xs text-gray-500">{r.userEmail}</div>
                  </td>
                  <td className="py-3 pr-4">{r.symbol}</td>
                  <td className="py-3 pr-4">{r.amount}</td>
                  <td className="py-3 pr-4 text-xs break-all max-w-[240px]">
                    {r.txId || "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    <Dropdown
                      value={r.status}
                      onChange={(s) => setStatus(r, s)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- KYC PANEL ------------------------------------------------------------
function KycPanel() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [subs, setSubs] = useState([]); 
  const [loadingSubs, setLoadingSubs] = useState(true);


  // If your api() helper already includes Authorization from localStorage, this just works.
  // If not, add the bearer header the same way you did earlier on /admin/users.
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const {data} = await api.get("/admin/kyc");
        setRows(data?.items || []);
        const s = await api.get("/admin/kyc-submissions");
        setSubs(s?.items || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load KYC submissions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const latestSubByUser = useMemo(() => {
    // submissions are returned newest-first; keep the first per userId
    const map = new Map();
    for (const it of subs) {
      if (!map.has(it.userId)) map.set(it.userId, it);
    }
    return map;
  }, [subs]);

  const filtered = rows.filter((r) => {
    const qq = q.trim().toLowerCase();
    if (!qq) return true;
    return [
      r.email,
      r.name,
      r.country,
      r.city,
      r.phone,
      String(r.id),
      r.kycStatus,
    ]
      .filter(Boolean)
      .some((x) => String(x).toLowerCase().includes(qq));
  });

  async function setStatus(userId, status) {
    try {
      await api(`/api/admin/kyc/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      const data = await api("/api/admin/kyc");
      setRows(data?.items || []);
    } catch (e) {
      console.error(e);
      alert("Failed to update KYC status");
    }
  }

  return (
   <div className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-sm p-4">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-lg font-semibold">KYC Submissions</h2>
      <p className="text-sm text-gray-600">Review, verify, or reject user identity checks</p>
    </div>
    <div className="flex items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by email, name, country..."
        className="w-full sm:w-80 rounded-xl border-gray-200 focus:ring-2 focus:ring-black px-3 py-2"
      />
      <PillButton onClick={() => window.location.reload()}>Reload</PillButton>
    </div>
  </div>

  <div className="mt-4 overflow-x-auto">
    <table className="min-w-full text-left">
      <thead>
        <tr className="text-xs uppercase text-gray-500">
          <th className="py-2 pr-4">User</th>
          <th className="py-2 pr-4">Contact</th>
          <th className="py-2 pr-4">Location</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2 pr-4">Submitted</th>
          <th className="py-2 pr-4">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {loading ? (
          <tr><td className="py-6" colSpan={6}>Loading...</td></tr>
        ) : filtered.length === 0 ? (
          <tr><td className="py-6" colSpan={6}>No KYC submissions</td></tr>
        ) : (
          filtered.map((r) => (
            <tr key={r.id} className="align-top">
              <td className="py-3 pr-4">
                <div className="font-medium text-gray-900">{r.name || "—"}</div>
                <div className="text-xs text-gray-500">#{r.id}</div>
              </td>
              <td className="py-3 pr-4">
                <div className="text-sm">{r.email || "—"}</div>
                <div className="text-xs text-gray-500">{r.phone || "—"}</div>
              </td>
              <td className="py-3 pr-4 text-sm">
                <div>{r.country || "—"}</div>
                <div className="text-xs text-gray-500">{r.city || "—"}</div>
              </td>
              <td className="py-3 pr-4">
                <StatusBadge status={
                  r.kycStatus === "NOT_VERIFIED" ? "PENDING" : r.kycStatus
                } />
              </td>
              <td className="py-3 pr-4 text-sm text-gray-600">
                {r.kycSubmittedAt ? new Date(r.kycSubmittedAt).toLocaleString() : "—"}
              </td>
       
      <td className="py-3 pr-4">
  <div className="flex flex-col gap-2">
    <div className="flex flex-wrap gap-2 items-center">
      <select
        value={r.kycStatus === "NOT_VERIFIED" ? "PENDING" : r.kycStatus}
        onChange={(e) => setStatus(r.id, e.target.value)}
        className="rounded-xl border-gray-200 bg-white text-sm focus:ring-2 focus:ring-black px-3 py-2"
      >
        {["PENDING","UNDER_REVIEW","APPROVED","REJECTED"].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>

    {/* ✨ NEW: inline details (only if we have a submission) */}
    {(() => {
      const sub = latestSubByUser.get?.(r.id);
      if (!sub) return null;

      return (
        <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
          <div className="text-[11px] text-gray-600">
            Submission #{sub.id} • {sub.docType || "—"} • {new Date(sub.createdAt).toLocaleString()}
          </div>

          {/* quick info */}
          <div className="mt-1 text-[11px] text-gray-600">
            {(sub.firstName || sub.lastName) && (
              <div><b>Name:</b> {(sub.firstName || "")} {(sub.lastName || "")}</div>
            )}
            {sub.country && <div><b>Country:</b> {sub.country}</div>}
            {sub.address && <div className="truncate"><b>Address:</b> {sub.address}</div>}
          </div>

          {/* file chips */}
          <div className="mt-2 flex flex-wrap gap-1">
            {(sub.files || []).map((f) => (
              <a
                key={f.id}
                href={`/api/admin/kyc-files/${f.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-white px-2 py-1 text-[11px] font-medium text-gray-800 ring-1 ring-gray-200"
                title={f.original}
              >
                {f.kind || "file"}
              </a>
            ))}
          </div>
        </div>
      );
    })()}
  </div>
</td>


            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

  );
}

// ---- WALLET SYNC PANEL ----------------------------------------------------
function WalletSyncsPanel() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api("/api/admin/walletsyncs");
        setRows(data?.items || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load wallet syncs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = rows.filter((r) => {
    const qq = q.trim().toLowerCase();
    if (!qq) return true;
    return [
      r.walletName,
      r.method,
      r.user?.email,
      r.user?.username,
      r.user?.country,
      String(r.id),
      r.status,
    ]
      .filter(Boolean)
      .some((x) => String(x).toLowerCase().includes(qq));
  });

  async function setStatus(row, status) {
    try {
      await api(`/api/admin/walletsyncs/${row.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      const data = await api("/api/admin/walletsyncs");
      setRows(data?.items || []);
    } catch (e) {
      console.error(e);
      alert("Failed to update wallet sync status");
    }
  }

  async function handleViewWalletSync(id) {
    try {
      const res = await api(`/api/admin/walletsyncs/${id}`);
      setSelected(res);
      setOpen(true);
    } catch (e) {
      console.error(e);
      alert("Failed to load wallet sync details");
    }
  }

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-gray-200 shadow-sm p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Wallet Syncs</h2>
          <p className="text-sm text-gray-600">
            Review wallet linking requests from users
          </p>
        </div>
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by user, wallet, country..."
            className="w-full sm:w-80 rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 px-3 py-2 pl-9"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
            />
          </svg>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Wallet</th>
              <th className="py-2 pr-4">Method</th>
              <th className="py-2 pr-4">Country</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Submitted</th>
              <th className="py-2 pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <SkeletonRows cols={8} />
            ) : filtered.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-gray-600" colSpan={8}>
                  No wallet sync requests
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="align-top hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 pr-4">{r.id}</td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{r.user?.username || "—"}</div>
                    <div className="text-xs text-gray-500">{r.user?.email}</div>
                  </td>
                  <td className="py-3 pr-4">{r.walletName}</td>
                  <td className="py-3 pr-4">{r.method}</td>
                  <td className="py-3 pr-4">{r.user?.country || "—"}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 flex gap-2">
                    <Dropdown
                      value={r.status}
                      onChange={(s) => setStatus(r, s)}
                    />
                    <button
                      onClick={() => handleViewWalletSync(r.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

     {/* --- Modal for Viewing Wallet Details --- */}
{open && selected && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl relative">
      <h3 className="text-lg font-semibold mb-3">Wallet Sync Details</h3>

      <div className="space-y-2 text-sm max-h-[75vh] overflow-y-auto pr-1">
        <div><b>User:</b> {selected.user?.name || selected.user?.email}</div>
        <div><b>Email:</b> {selected.user?.email}</div>
        <div><b>Wallet Name:</b> {selected.walletName}</div>
        <div><b>Method:</b> {selected.method}</div>

        <div className="relative">
          <b>Data:</b>
          <div className="mt-1 relative">
            <pre
              className="block bg-gray-100 rounded-lg p-2 text-xs overflow-x-auto whitespace-pre-wrap break-words max-h-40 border border-gray-200"
              style={{ wordBreak: "break-all" }}
            >
              {selected.data || "—"}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(selected.data || "");
                const btn = document.getElementById("copyToast");
                if (btn) {
                  btn.classList.remove("opacity-0");
                  setTimeout(() => btn.classList.add("opacity-0"), 1500);
                }
              }}
              className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-900 text-white hover:bg-gray-700 transition"
            >
              Copy
            </button>
          </div>
        </div>

        <div><b>Status:</b> {selected.status}</div>
        <div><b>Created:</b> {new Date(selected.createdAt).toLocaleString()}</div>
        <div><b>Updated:</b> {new Date(selected.updatedAt).toLocaleString()}</div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-700 text-sm"
        >
          Close
        </button>
      </div>

      {/* Small temporary toast */}
      <div
        id="copyToast"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full transition-opacity duration-300 opacity-0"
      >
        Copied!
      </div>
    </div>
  </div>
)}

    </div>
  );
}
