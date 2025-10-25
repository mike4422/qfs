import { Link, useSearchParams } from "react-router-dom"
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react"

export default function Secure401IRAConfirmation() {
  const [params] = useSearchParams()
  const id = params.get("id")

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Request submitted</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your rollover request has been received and is now <strong>Pending</strong>. You can track status from your dashboard.
              {id ? <> Reference: <span className="font-mono text-gray-900 dark:text-gray-100">#{id}</span></> : null}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-300">
              <CheckCircle2 className="h-4 w-4" />
              We’ll notify you as soon as your provider confirms the transfer.
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700"
              >
                Back to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard/secure-401-ira"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                View 401/IRA Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
