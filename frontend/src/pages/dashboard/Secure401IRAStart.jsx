import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft, ArrowRight, Check, Building2, FileText, UploadCloud,
  ChevronDown, ShieldCheck, PiggyBank, User, Calendar, FileCheck2
} from "lucide-react"
// ✅ NEW: read token from your auth store
import { useAuth } from "../../store/auth"

// --- tiny helpers
const cls = (...arr) => arr.filter(Boolean).join(" ")
const providers = [
  "Fidelity", "Vanguard", "Charles Schwab", "T. Rowe Price", "Merrill",
  "Empower", "Principal", "ADP", "Betterment", "SoFi"
]

function StepBadge({ n, current, done }) {
  return (
    <div className={cls(
      "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold",
      done ? "bg-green-600 text-white" :
      current ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white" :
      "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    )}>
      {done ? <Check className="h-4 w-4" /> : n}
    </div>
  )
}

export default function Secure401IRAStart() {
  const navigate = useNavigate()
  // ✅ NEW: pull the token (fallback to localStorage)
  const { user, token } = useAuth?.() || {}
  const authToken = token || user?.token || localStorage.getItem("token")

  // --- step control
  const [step, setStep] = useState(0)
  const steps = useMemo(() => [
    { key: "provider",   title: "Your current plan",    icon: Building2 },
    { key: "destination",title: "Destination account",  icon: PiggyBank },
    { key: "documents",  title: "Rollover documents",   icon: FileText },
    { key: "review",     title: "Review & confirm",     icon: ShieldCheck },
  ], [])

  const currentKey = steps[step].key
  const isFirst = step === 0
  const isLast  = step === steps.length - 1

  // --- form model
  const [model, setModel] = useState({
    provider: "",
    otherProvider: "",
    approxBalance: "",
    taxType: "Traditional", // or Roth
    destType: "Open IRA",   // or "Existing IRA"
    destInstitution: "",
    destAccountLast4: "",
    files: [],              // File[]
    legalName: "",
    dob: "",
  })

  // ---- submit state + handler
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  async function submitRollover() {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const fd = new FormData()
      fd.append("provider", model.provider)
      fd.append("otherProvider", model.otherProvider || "")
      fd.append("approxBalance", model.approxBalance || "")
      fd.append("taxType", model.taxType)
      fd.append("destType", model.destType)
      fd.append("destInstitution", model.destInstitution || "")
      fd.append("destAccountLast4", model.destAccountLast4 || "")
      fd.append("legalName", model.legalName)
      fd.append("dob", model.dob)

      for (const f of model.files || []) {
        fd.append("files", f) // multer field name "files"
      }

      const res = await fetch("/api/rollovers", {
        method: "POST",
        body: fd,
        credentials: "include",
        // ✅ NEW: send Bearer token if we have one
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.message || `Request failed (${res.status})`)
      }

      const j = await res.json()
      navigate(`/dashboard/secure401ira/confirmation?id=${j.id}`)
    } catch (e) {
      setSubmitError(e.message || "Unable to submit rollover")
    } finally {
      setSubmitting(false)
    }
  }

  // --- validation per step
  const errors = {}
  if (currentKey === "provider") {
    if (!model.provider) errors.provider = "Select a provider."
    if (model.provider === "Other" && !model.otherProvider.trim()) errors.otherProvider = "Enter provider name."
    if (!model.approxBalance.trim()) errors.approxBalance = "Enter an approximate balance."
  }
  if (currentKey === "destination") {
    if (model.destType === "Existing IRA") {
      if (!model.destInstitution.trim()) errors.destInstitution = "Institution is required."
      if (!model.destAccountLast4.trim()) errors.destAccountLast4 = "Last 4 is required."
    }
  }
  if (currentKey === "documents") {
    if (!model.legalName.trim()) errors.legalName = "Your legal name is required."
    if (!model.dob.trim()) errors.dob = "Date of birth is required."
    if ((model.files || []).length === 0) errors.files = "Upload at least one document."
  }

  const canNext = Object.keys(errors).length === 0

  function goNext() {
    if (!canNext) return
    if (isLast) {
      submitRollover()
    } else {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function goBack() {
    if (!isFirst) setStep(s => s - 1)
  }

  // --- UI blocks (unchanged below)
  function ProgressHeader() {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          {steps.map((s, i) => {
            const Icon = s.icon
            const current = i === step
            const done = i < step
            return (
              <div key={s.key} className="flex items-center gap-2">
                <StepBadge n={i+1} current={current} done={done} />
                <div className={cls(
                  "hidden xs:block text-[12px] sm:text-sm font-medium",
                  current ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                )}>
                  {s.title}
                </div>
                {i < steps.length - 1 && (
                  <span className="mx-2 h-px w-6 bg-gray-200 dark:bg-gray-800" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  function Field({ label, error, children }) {
    return (
      <div>
        <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-300">{label}</label>
        <div className="mt-1">{children}</div>
        {error ? <div className="mt-1 text-[11px] text-red-600">{error}</div> : null}
      </div>
    )
  }

  function ProviderStep() {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Your current plan</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Plan provider" error={errors.provider}>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                value={model.provider}
                onChange={(e) => setModel(m => ({ ...m, provider: e.target.value }))}
              >
                <option value="">Select provider</option>
                {providers.map(p => <option key={p} value={p}>{p}</option>)}
                <option value="Other">Other</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </Field>

          {model.provider === "Other" && (
            <Field label="Provider name" error={errors.otherProvider}>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="Enter provider"
                value={model.otherProvider}
                onChange={(e) => setModel(m => ({ ...m, otherProvider: e.target.value }))}
              />
            </Field>
          )}

          <Field label="Approximate balance (USD)" error={errors.approxBalance}>
            <input
              inputMode="decimal"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              placeholder="e.g., 12,500"
              value={model.approxBalance}
              onChange={(e) => setModel(m => ({ ...m, approxBalance: e.target.value }))}
            />
          </Field>

          <Field label="Tax type">
            <div className="flex items-center gap-2">
              {["Traditional", "Roth"].map(t => (
                <label key={t} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-gray-700">
                  <input
                    type="radio"
                    name="taxtype"
                    className="h-4 w-4 accent-blue-600"
                    checked={model.taxType === t}
                    onChange={() => setModel(m => ({ ...m, taxType: t }))}
                  />
                  <span className="text-gray-900 dark:text-gray-100">{t}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>
      </div>
    )
  }

  function DestinationStep() {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2">
          <PiggyBank className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Destination account</h2>
        </div>

        <div className="space-y-2">
          {[
            { key: "Open IRA", title: "Open a new IRA", sub: "Traditional & Roth supported. No minimums." },
            { key: "Existing IRA", title: "Use my existing IRA", sub: "Link your institution and confirm routing." },
          ].map(opt => (
            <label key={opt.key} className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="desttype"
                  className="h-4 w-4 accent-blue-600"
                  checked={model.destType === opt.key}
                  onChange={() => setModel(m => ({ ...m, destType: opt.key }))}
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{opt.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{opt.sub}</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </label>
          ))}
        </div>

        {model.destType === "Existing IRA" && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Institution" error={errors.destInstitution}>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="e.g., Vanguard"
                value={model.destInstitution}
                onChange={(e) => setModel(m => ({ ...m, destInstitution: e.target.value }))}
              />
            </Field>
            <Field label="Account last 4" error={errors.destAccountLast4}>
              <input
                maxLength={4}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="1234"
                value={model.destAccountLast4}
                onChange={(e) => setModel(m => ({ ...m, destAccountLast4: e.target.value.replace(/\D/g, "") }))}
              />
            </Field>
          </div>
        )}
      </div>
    )
  }

  function DocumentsStep() {
    const onFiles = (e) => {
      const files = Array.from(e.target.files || [])
      setModel(m => ({ ...m, files }))
    }

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Rollover documents</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Legal name" error={errors.legalName}>
            <div className="relative">
              <User className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full rounded-xl border border-gray-300 bg-white pl-8 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="As it appears on your account"
                value={model.legalName}
                onChange={(e) => setModel(m => ({ ...m, legalName: e.target.value }))}
              />
            </div>
          </Field>

          <Field label="Date of birth" error={errors.dob}>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                className="w-full rounded-xl border border-gray-300 bg-white pl-8 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                value={model.dob}
                onChange={(e) => setModel(m => ({ ...m, dob: e.target.value }))}
              />
            </div>
          </Field>
        </div>

        <Field label="Provider statements / authorization (PDF or image)" error={errors.files}>
          <label className="mt-1 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 bg-white px-3 py-3 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-900">
            <div className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <UploadCloud className="h-4 w-4" />
              <span>Upload files</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">(PDF, JPG, PNG)</span>
            </div>
            <input type="file" className="hidden" multiple onChange={onFiles} accept=".pdf,image/*" />
          </label>

          {model.files?.length ? (
            <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
              {model.files.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border border-gray-200 px-2 py-1 dark:border-gray-800">
                  <span className="truncate">{f.name}</span>
                  <span className="text-gray-400">{Math.round((f.size || 0)/1024)} KB</span>
                </li>
              ))}
            </ul>
          ) : null}
        </Field>
      </div>
    )
  }

  function ReviewStep() {
    const Provider = model.provider === "Other" ? model.otherProvider : model.provider
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Review & confirm</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Provider</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{Provider || "—"}</div>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Approx. balance</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{model.approxBalance || "—"}</div>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Tax type</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{model.taxType}</div>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Destination</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {model.destType === "Open IRA"
                ? "Open a new IRA"
                : `Existing IRA — ${model.destInstitution || "—"} • • • • ${model.destAccountLast4 || "—"}`}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-800 sm:col-span-2">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Documents</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {model.files?.length ? `${model.files.length} file(s) attached)` : "No files attached"}
            </div>
          </div>
        </div>

        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300">
          <FileCheck2 className="h-4 w-4" /> By confirming, you authorize us to generate provider forms and contact your institution as needed.
        </div>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/secure401ira"
            className="inline-flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Secure Transfer</div>
        </div>
      </div>

      <ProgressHeader />

      {/* body */}
      {currentKey === "provider"   && <ProviderStep />}
      {currentKey === "destination"&& <DestinationStep />}
      {currentKey === "documents"  && <DocumentsStep />}
      {currentKey === "review"     && <ReviewStep />}

      {/* footer actions */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Step {step + 1} of {steps.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            disabled={isFirst}
            className={cls(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold",
              isFirst
                ? "cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600"
                : "border-gray-200 text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-800"
            )}
          >
            Back
          </button>
          <button
            onClick={goNext}
            disabled={!canNext || submitting}
            className={cls(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm",
              (!canNext || submitting)
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            )}
          >
            {isLast ? (submitting ? "Submitting…" : "Confirm & Submit") : "Continue"}
            {!isLast && <ArrowRight className="h-4 w-4" />}
          </button>
          {submitError && (
            <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
              {submitError}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
