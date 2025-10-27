// src/pages/dashboard/Kyc.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../../store/auth"
import api from "../../utils/api"
import {
  IdCard, Globe, User, Calendar, Mail, Phone, MapPin, FileText,
  UploadCloud, CheckCircle2, ShieldCheck, AlertTriangle, Loader2
} from "lucide-react"

const COUNTRIES = [
  "United States","United Kingdom","Canada","Germany","France","Spain","Italy",
  "Netherlands","Sweden","Norway","Denmark","Switzerland","Poland","Turkey",
  "UAE","Saudi Arabia","South Africa","Kenya","Ghana","India",
  "Singapore","Hong Kong","Japan","South Korea","Australia","New Zealand","Brazil","Mexico"
]

const DOC_TYPES = [
  { value: "PASSPORT", label: "Passport" },
  { value: "DRIVER_LICENSE", label: "Driver’s License" },
  { value: "NATIONAL_ID", label: "National ID" },
]

function Field({ label, children, hint, error }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{hint}</div>}
      {error && <div className="mt-1 text-[11px] text-red-600">{error}</div>}
    </div>
  )
}

function Pill({ status }) {
  const map = {
    not_verified: { text: "Not verified", class: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
    pending:      { text: "Pending review", class: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
    approved:     { text: "Approved", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  }
  const p = map[status] || map.not_verified
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${p.class}`}>{p.text}</span>
}

export default function Kyc() {
  const { token, user, refresh  } = useAuth()
  const authToken = token || user?.token || localStorage.getItem("token")

  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(true)

  // form state
  const [form, setForm] = useState({
    country: "United States",
    docType: "PASSPORT",
    firstName: "",
    lastName: "",
    dob: "",
    email: user?.email || "",
    phone: "",
    address: "",
  })

  const [files, setFiles] = useState({
    docFront: null,
    docBack: null,
    selfie: null,
    proofAddress: null,
  })

  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null) // {type:"success"|"error", message:""}
  const inpDocFront = useRef(null)
  const inpDocBack = useRef(null)
  const inpSelfie = useRef(null)
  const inpProof = useRef(null)

  // Fetch current status
  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoadingSummary(true)
      try {
       const { data } = await api.get("/me/summary")
       if (!alive) return
       setSummary(data || {})
      } catch {
        if (alive) setSummary(null)
      } finally {
        if (alive) setLoadingSummary(false)
      }
    })()
    return () => { alive = false }
  }, [authToken])

 const kycStatus = String(summary?.kycStatus || "NOT_VERIFIED").toLowerCase()

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const canSubmit = useMemo(() => {
    const baseOk =
      form.firstName.trim().length >= 2 &&
      form.lastName.trim().length >= 2 &&
      /^\d{4}-\d{2}-\d{2}$/.test(form.dob) &&
      form.email.includes("@") &&
      form.phone.trim().length >= 6 &&
      form.address.trim().length >= 6

    const docOk = Boolean(files.docFront) && (form.docType === "PASSPORT" ? true : Boolean(files.docBack))
    const selfieOk = Boolean(files.selfie)
    const proofOk = Boolean(files.proofAddress)

    return baseOk && docOk && selfieOk && proofOk
  }, [form, files])

  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (form.firstName.trim().length < 2) e.firstName = "Please enter your first name"
    if (form.lastName.trim().length < 2) e.lastName = "Please enter your last name"
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dob)) e.dob = "Use YYYY-MM-DD"
    if (!form.email.includes("@")) e.email = "Enter a valid email"
    if ((form.phone || "").trim().length < 6) e.phone = "Enter a valid phone"
    if ((form.address || "").trim().length < 6) e.address = "Enter a complete address"
    if (!files.docFront) e.docFront = "Upload document front"
    if (form.docType !== "PASSPORT" && !files.docBack) e.docBack = "Upload document back"
    if (!files.selfie) e.selfie = "Upload a selfie holding the document"
    if (!files.proofAddress) e.proofAddress = "Upload a proof of address"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setDone(null)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k, v))
      Object.entries(files).forEach(([k,v]) => v && fd.append(k, v))
      // pass a 'consent' flag if needed by backend
      fd.append("consent", "true")

       const { data: submitResp } = await api.post("/kyc/submit", fd, {
    // Tip: with Axios + FormData in the browser, you can omit Content-Type,
    // but adding it is harmless; axios will set the boundary correctly.
    headers: { "Content-Type": "multipart/form-data" },
    })
      setDone({ type: "success", message: "KYC submitted successfully. We’ll notify you once it’s reviewed." })
      // optionally refresh summary
      // refresh user profile so UI reflects the new KYC status immediately
      await refresh();
      setSummary((s) => ({ ...(s || {}), kycStatus: "pending", kycSubmittedAt: new Date().toISOString() }))
    } catch (err) {
      setDone({ type: "error", message: err.message || "Unable to submit KYC" })
    } finally {
      setSubmitting(false)
    }
  }

  const disabled = kycStatus === "approved"

  // simple preview component
  const Preview = ({ file }) => {
    const [url, setUrl] = useState("")
    useEffect(() => {
      if (!file) return setUrl("")
      const u = URL.createObjectURL(file)
      setUrl(u)
      return () => URL.revokeObjectURL(u)
    }, [file])
    if (!file) return null
    const isImage = /^image\//i.test(file.type)
    return (
      <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        {isImage ? (
          // eslint-disable-next-line
          <img src={url} alt={file.name} className="max-h-48 w-full object-cover" />
        ) : (
          <div className="p-3 text-xs text-gray-600 dark:text-gray-400 truncate">{file.name}</div>
        )}
      </div>
    )
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">KYC Verification</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Verify your identity to unlock deposits, withdrawals, and higher limits.
          </p>
        </div>
        <div className="inline-flex items-center gap-2">
          {!loadingSummary && <Pill status={kycStatus} />}
        </div>
      </div>

      {/* Stepper */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: User, label: "Personal Info" },
          { icon: IdCard, label: "Documents" },
          { icon: ShieldCheck, label: "Review & Submit" },
        ].map((s, i) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-3 text-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <s.icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <div className="font-semibold text-gray-900 dark:text-white">{s.label}</div>
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Step {i+1}</div>
          </div>
        ))}
      </div>

      {/* Notice for approved/pending */}
      {kycStatus !== "not_verified" && (
        <div className={`
          rounded-xl border px-3 py-2 text-sm
          ${kycStatus === "approved"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
            : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200"}
        `}>
          {kycStatus === "approved" ? "Your KYC is approved. You're all set!" : "Your KYC is submitted and pending review."}
        </div>
      )}

      {/* Form */}
      <form onSubmit={submit} className="space-y-6">
        {/* Personal Info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Personal Information</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Country / Region">
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  disabled={disabled}
                  value={form.country}
                  onChange={onChange("country")}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                >
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </Field>

            <Field label="Document type">
              <div className="relative">
                <IdCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  disabled={disabled}
                  value={form.docType}
                  onChange={onChange("docType")}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                >
                  {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </Field>

            <Field label="First name" error={errors.firstName}>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  disabled={disabled}
                  value={form.firstName}
                  onChange={onChange("firstName")}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="Jane"
                />
              </div>
            </Field>

            <Field label="Last name" error={errors.lastName}>
              <input
                disabled={disabled}
                value={form.lastName}
                onChange={onChange("lastName")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="Doe"
              />
            </Field>

            <Field label="Date of birth" hint="YYYY-MM-DD" error={errors.dob}>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  disabled={disabled}
                  type="date"
                  value={form.dob}
                  onChange={onChange("dob")}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </Field>

            <Field label="Email" error={errors.email}>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  disabled={disabled}
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="you@domain.com"
                />
              </div>
            </Field>

            <Field label="Phone number" error={errors.phone}>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  disabled={disabled}
                  type="tel"
                  value={form.phone}
                  onChange={onChange("phone")}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="+1432 454 6789"
                />
              </div>
            </Field>

            <Field label="Residential address" error={errors.address}>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  disabled={disabled}
                  value={form.address}
                  onChange={onChange("address")}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="Street, City, State, ZIP, Country"
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Documents */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Documents</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="ID document (front)" error={errors.docFront} hint="PNG/JPG/PDF. Max 10MB.">
              <div className="flex items-center gap-2">
                <input ref={inpDocFront} type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden"
                       onChange={(e)=> setFiles(f => ({...f, docFront: e.target.files?.[0] || null}))} />
                <button type="button" disabled={disabled}
                        onClick={()=> inpDocFront.current?.click()}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-800">
                  <UploadCloud className="h-4 w-4" /> Upload
                </button>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{files.docFront?.name || "No file"}</div>
              </div>
              <Preview file={files.docFront} />
            </Field>

            <Field label="ID document (back)" error={errors.docBack} hint={form.docType === "PASSPORT" ? "Not required for passports" : "PNG/JPG/PDF. Max 10MB."}>
              <div className="flex items-center gap-2">
                <input ref={inpDocBack} type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden"
                       onChange={(e)=> setFiles(f => ({...f, docBack: e.target.files?.[0] || null}))} />
                <button type="button" disabled={disabled || form.docType === "PASSPORT"}
                        onClick={()=> inpDocBack.current?.click()}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-800">
                  <UploadCloud className="h-4 w-4" /> Upload
                </button>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{files.docBack?.name || "No file"}</div>
              </div>
              <Preview file={files.docBack} />
            </Field>

            <Field label="Selfie with document" error={errors.selfie} hint="Hold the document next to your face. PNG/JPG.">
              <div className="flex items-center gap-2">
                <input ref={inpSelfie} type="file" accept=".png,.jpg,.jpeg" className="hidden"
                       onChange={(e)=> setFiles(f => ({...f, selfie: e.target.files?.[0] || null}))} />
                <button type="button" disabled={disabled}
                        onClick={()=> inpSelfie.current?.click()}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-800">
                  <UploadCloud className="h-4 w-4" /> Upload
                </button>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{files.selfie?.name || "No file"}</div>
              </div>
              <Preview file={files.selfie} />
            </Field>

            <Field label="Proof of address" error={errors.proofAddress} hint="Bank statement / utility bill / tax letter. PNG/JPG/PDF.">
              <div className="flex items-center gap-2">
                <input ref={inpProof} type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden"
                       onChange={(e)=> setFiles(f => ({...f, proofAddress: e.target.files?.[0] || null}))} />
                <button type="button" disabled={disabled}
                        onClick={()=> inpProof.current?.click()}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-800">
                  <UploadCloud className="h-4 w-4" /> Upload
                </button>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{files.proofAddress?.name || "No file"}</div>
              </div>
              <Preview file={files.proofAddress} />
            </Field>
          </div>

          <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-300">
            <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
            Make sure your photos are clear, uncropped, and show all corners. Details must be readable.
          </div>
        </div>

        {/* Review & Submit */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Review & Submit</h2>
          </div>

          <ul className="mb-3 grid grid-cols-1 gap-2 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2">
            <li><span className="text-gray-500 dark:text-gray-400">Name:</span> {form.firstName || "—"} {form.lastName || ""}</li>
            <li><span className="text-gray-500 dark:text-gray-400">DOB:</span> {form.dob || "—"}</li>
            <li><span className="text-gray-500 dark:text-gray-400">Country:</span> {form.country}</li>
            <li><span className="text-gray-500 dark:text-gray-400">Document:</span> {DOC_TYPES.find(d=>d.value===form.docType)?.label}</li>
            <li className="sm:col-span-2"><span className="text-gray-500 dark:text-gray-400">Address:</span> {form.address || "—"}</li>
          </ul>

          <div className="flex items-center justify-between">
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              By submitting, you confirm the information is accurate and you consent to verification.
            </div>
            <button
              type="submit"
              disabled={!canSubmit || submitting || disabled}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm",
                (!canSubmit || submitting || disabled)
                  ? "bg-gray-300 dark:bg-gray-700"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              ].join(" ")}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {kycStatus === "approved" ? "Already Verified" : "Submit KYC"}
            </button>
          </div>

          {done && (
            <div className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
              done.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
            }`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {done.message}
            </div>
          )}
        </div>
      </form>
    </section>
  )
}
