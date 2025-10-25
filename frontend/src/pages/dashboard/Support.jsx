// src/pages/dashboard/Support.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../../store/auth"
import {
  LifeBuoy, Plus, Search, Filter, Paperclip, Send, Loader2, AlertTriangle,
  CheckCircle2, ChevronDown, X, MessageSquare, Clock, FileText, Tag, RefreshCcw
} from "lucide-react"

const CATEGORIES = [
  "Account",
  "KYC",
  "Deposits",
  "Withdrawals",
  "Cards",
  "Trading / Swap",
  "Wallet Linking",
  "Payments",
  "Other"
]
const PRIORITIES = ["Low", "Normal", "High", "Urgent"]
const STATUSES = ["Open", "In Progress", "Resolved", "Closed"]

function cls(...a) { return a.filter(Boolean).join(" ") }

function Pill({ type="status", value }) {
  const map = {
    status: {
      Open: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
      Closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },
    priority: {
      Low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      Normal: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
      High: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
      Urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    }
  }
  const cl = (map[type] && map[type][value]) || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  return <span className={cls("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", cl)}>{value}</span>
}

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

export default function Support() {
  const { token, user } = useAuth()
  const authToken = token || user?.token || localStorage.getItem("token")

  // tickets list
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  // filters/search
  const [q, setQ] = useState("")
  const [fStatus, setFStatus] = useState("All")
  const [fPriority, setFPriority] = useState("All")
  const [fCategory, setFCategory] = useState("All")

  // modals
  const [newOpen, setNewOpen] = useState(false)
  const [view, setView] = useState(null) // { id, subject, ... } when opened

  // new ticket form
  const [nt, setNt] = useState({
    subject: "",
    category: "Account",
    priority: "Normal",
    message: "",
  })
  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const fileInput = useRef(null)

  // thread
  const [thread, setThread] = useState([])
  const [threadLoading, setThreadLoading] = useState(false)
  const [reply, setReply] = useState("")
  const [replyFiles, setReplyFiles] = useState([])
  const replyFileInput = useRef(null)
  const [replying, setReplying] = useState(false)

  // helpers
  const headers = useMemo(() => ({
    Accept: "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  }), [authToken])

  // fetch tickets
  async function loadTickets() {
    setLoading(true); setErr(null)
    try {
      const res = await fetch("/api/support/tickets", { credentials: "include", headers })
      const j = await res.json().catch(()=>[])
      if (!res.ok) throw new Error(j.message || "Failed to load tickets")
      setTickets(Array.isArray(j) ? j : (Array.isArray(j.items) ? j.items : []))
    } catch (e) {
      setErr(e.message || "Unable to load")
      setTickets([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { loadTickets() }, []) // eslint-disable-line

  // filtered view
  const filtered = useMemo(() => {
    return tickets.filter(t => {
      const matchesQ = !q || [t.subject, t.category, t.status, t.priority].join(" ").toLowerCase().includes(q.toLowerCase())
      const sOk = fStatus === "All" || t.status === fStatus
      const pOk = fPriority === "All" || t.priority === fPriority
      const cOk = fCategory === "All" || t.category === fCategory
      return matchesQ && sOk && pOk && cOk
    })
  }, [tickets, q, fStatus, fPriority, fCategory])

  // open ticket thread
  async function openTicket(t) {
    setView(t); setThread([]); setThreadLoading(true)
    try {
      const res = await fetch(`/api/support/tickets/${t.id}`, { credentials: "include", headers })
      const j = await res.json().catch(()=>({}))
      const msgs = Array.isArray(j.messages) ? j.messages : (Array.isArray(j) ? j : [])
      setThread(msgs)
    } catch {
      setThread([])
    } finally {
      setThreadLoading(false)
    }
  }

  // create ticket
  async function createTicket(e) {
    e.preventDefault()
    if (!nt.subject.trim() || !nt.message.trim()) return
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("subject", nt.subject.trim())
      fd.append("category", nt.category)
      fd.append("priority", nt.priority)
      fd.append("message", nt.message.trim())
      files.forEach(f => fd.append("attachments", f))
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        credentials: "include",
        headers, body: fd
      })
      const j = await res.json().catch(()=> ({}))
      if (!res.ok) throw new Error(j.message || "Failed to create ticket")
      setNewOpen(false)
      setNt({ subject:"", category:"Account", priority:"Normal", message:"" })
      setFiles([])
      await loadTickets()
      // open immediately
      if (j?.id) openTicket(j)
    } catch (e) {
      alert(e.message || "Unable to create ticket")
    } finally {
      setSubmitting(false)
    }
  }

  // reply to ticket
  async function sendReply() {
    if (!view?.id || !reply.trim()) return
    setReplying(true)
    try {
      // optimistic push
      const optimistic = {
        id: `tmp_${Date.now()}`,
        author: "You",
        createdAt: new Date().toISOString(),
        message: reply.trim(),
        attachments: replyFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
      }
      setThread(th => [...th, optimistic])

      const fd = new FormData()
      fd.append("message", reply.trim())
      replyFiles.forEach(f => fd.append("attachments", f))
      const res = await fetch(`/api/support/tickets/${view.id}/messages`, {
        method: "POST",
        credentials: "include",
        headers, body: fd
      })
      const j = await res.json().catch(()=> ({}))
      if (!res.ok) throw new Error(j.message || "Failed to send message")
      setReply("")
      setReplyFiles([])
      // reload thread to replace optimistic
      openTicket(view)
    } catch (e) {
      alert(e.message || "Unable to send message")
    } finally {
      setReplying(false)
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <LifeBuoy className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Support</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get help, track your tickets, and chat with our team.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadTickets()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
            title="Refresh"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
          <button
            onClick={() => setNewOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4" /> New Ticket
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-3 sm:grid-cols-[1fr_160px_160px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e)=> setQ(e.target.value)}
              placeholder="Search tickets (subject, category, status)…"
              className="w-full rounded-xl border border-gray-300 bg-white pl-8 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>
          <select value={fStatus} onChange={(e)=> setFStatus(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
            {["All", ...STATUSES].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={fPriority} onChange={(e)=> setFPriority(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
            {["All", ...PRIORITIES].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={fCategory} onChange={(e)=> setFCategory(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
            {["All", ...CATEGORIES].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tickets table */}
<div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="text-left">
        <tr className="border-b border-gray-200 dark:border-gray-800">
          {/* make header text white */}
          <th className="p-3 text-white">Subject</th>
          <th className="p-3 text-white">Category</th>
          <th className="p-3 text-white">Priority</th>
          <th className="p-3 text-white">Status</th>
          <th className="p-3 text-white">Updated</th>
          <th className="p-3"></th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td className="p-3" colSpan={6}><Loader2 className="h-4 w-4 animate-spin inline mr-2" /> Loading…</td></tr>
        ) : err ? (
          <tr><td className="p-3 text-red-600" colSpan={6}>{err}</td></tr>
        ) : filtered.length === 0 ? (
          <tr><td className="p-3 text-gray-500 dark:text-gray-400" colSpan={6}>No tickets found.</td></tr>
        ) : filtered.map(t => (
          <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
            {/* SUBJECT column → white */}
            <td className="p-3">
              <div className="font-medium text-white">{t.subject}</div>
              {/* you can keep the subtext muted if you want contrast, or make it white too */}
              <div className="text-xs text-white/80">
                #{t.id} • <MessageSquare className="inline h-3.5 w-3.5" /> {t.messagesCount ?? t.replies ?? 0}
              </div>
            </td>

            {/* CATEGORY column → white */}
            <td className="p-3 text-white">
              <div className="inline-flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-white/80" /> {t.category}
              </div>
            </td>

            {/* PRIORITY column → label stays white; pill keeps its own colors */}
            <td className="p-3 text-white">
              <Pill type="priority" value={t.priority || "Normal"} />
            </td>

            {/* STATUS column → label white; pill keeps its own colors */}
            <td className="p-3 text-white">
              <Pill type="status" value={t.status || "Open"} />
            </td>

            {/* UPDATED column → white */}
            <td className="p-3 text-xs text-white">
              <Clock className="inline h-3.5 w-3.5 mr-1 text-white/80" />
              {new Date(t.updatedAt || t.createdAt || Date.now()).toLocaleString()}
            </td>

            <td className="p-3 text-right">
              <button
                onClick={()=> openTicket(t)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      {/* NEW TICKET MODAL */}
      {newOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={()=> setNewOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[680px]">
            <form
              onSubmit={createTicket}
              className="mx-auto rounded-t-2xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <LifeBuoy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">New Support Ticket</div>
                </div>
                <button type="button" onClick={()=> setNewOpen(false)} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Subject">
                  <input
                    value={nt.subject}
                    onChange={(e)=> setNt(s=> ({...s, subject:e.target.value}))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                    placeholder="Brief summary of your issue"
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={nt.category}
                    onChange={(e)=> setNt(s=> ({...s, category:e.target.value}))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  >
                    {CATEGORIES.map(c=> <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Priority">
                  <select
                    value={nt.priority}
                    onChange={(e)=> setNt(s=> ({...s, priority:e.target.value}))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  >
                    {PRIORITIES.map(c=> <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <div className="hidden sm:block" />

                <div className="sm:col-span-2">
                  <Field label="Message" hint="Describe the problem. Avoid sharing secrets.">
                    <textarea
                      value={nt.message}
                      onChange={(e)=> setNt(s=> ({...s, message:e.target.value}))}
                      rows={5}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                      placeholder="How can we help?"
                    />
                  </Field>
                </div>

                <Field label="Attachments">
                  <div className="flex items-center gap-2">
                    <input ref={fileInput} type="file" multiple className="hidden"
                      onChange={(e)=> setFiles(Array.from(e.target.files || []))} />
                    <button type="button"
                      onClick={()=> fileInput.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-800">
                      <Paperclip className="h-4 w-4" /> Add files
                    </button>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {files.length ? `${files.length} file(s) selected` : "No files chosen"}
                    </div>
                  </div>
                </Field>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={()=> setNewOpen(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !nt.subject.trim() || !nt.message.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW TICKET DRAWER */}
      {view && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={()=> setView(null)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[680px]">
            <div className="flex h-full flex-col rounded-none sm:rounded-l-2xl border-l border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
              {/* header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{view.subject}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Tag className="h-3.5 w-3.5" /> {view.category}
                    <Pill type="priority" value={view.priority || "Normal"} />
                    <Pill type="status" value={view.status || "Open"} />
                  </div>
                </div>
                <button onClick={()=> setView(null)} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* thread */}
              <div className="flex-1 overflow-y-auto p-4">
                {threadLoading ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400"><Loader2 className="inline h-4 w-4 animate-spin mr-2" /> Loading thread…</div>
                ) : thread.length === 0 ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400">No messages yet.</div>
                ) : (
                  <ul className="space-y-3">
                    {thread.map((m) => (
                      <li key={m.id} className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {m.author || (m.isStaff ? "Support" : "You")}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(m.createdAt || Date.now()).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-1 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                          {m.message}
                        </div>
                        {(m.attachments || []).length > 0 && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <Paperclip className="inline h-3.5 w-3.5 mr-1" />
                            {(m.attachments||[]).map((a,i)=> (
                              <a key={i} href={a.url || "#"} target="_blank" rel="noreferrer" className="underline mr-2">
                                {a.name || `file-${i+1}`}
                              </a>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* composer */}
              <div className="border-t border-gray-200 p-3 dark:border-gray-800">
                <div className="rounded-xl border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-950">
                  <textarea
                    value={reply}
                    onChange={(e)=> setReply(e.target.value)}
                    rows={3}
                    placeholder="Write a reply…"
                    className="w-full resize-none rounded-lg bg-transparent px-2 py-1 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input ref={replyFileInput} type="file" multiple className="hidden"
                        onChange={(e)=> setReplyFiles(Array.from(e.target.files || []))} />
                      <button
                        type="button"
                        onClick={()=> replyFileInput.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        <Paperclip className="h-3.5 w-3.5" /> Attach
                      </button>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">
                        {replyFiles.length ? `${replyFiles.length} file(s)` : "No files"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={sendReply}
                      disabled={replying || !reply.trim()}
                      className={cls(
                        "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-white",
                        replying || !reply.trim()
                          ? "bg-gray-300 dark:bg-gray-700"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      )}
                    >
                      {replying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Send
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                  Our team replies within business hours. You’ll receive an email notification when there’s an update.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
