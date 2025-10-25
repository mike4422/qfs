import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import DashboardSidebar from "../components/DashboardSidebar"
import DashboardHeader from "../components/DashboardHeader"
import ProfileMenu from "../components/ProfileMenu"
import ActionQuickBar from "../components/ActionQuickBar"
import UserCryptoHoldings from "../components/UserCryptoHoldings"
import MobileNavDock from "../components/MobileNavDock"

export default function Dashboard() {
  const loc = useLocation()
  const navigate = useNavigate()

  const isOverview =
    loc.pathname === "/dashboard" || loc.pathname === "/dashboard/overview"

  return (
    <div className="container-px py-6">
      <div className="grid lg:grid-cols-[16rem_1fr] gap-6">
       <div className="hidden lg:block">
        <DashboardSidebar />
      </div>
        <div className="min-h-[50vh]">
          {isOverview ? (
            <>
              {/* Full header for Overview only */}
              <DashboardHeader />
               <div className="mb-4">
                  <ActionQuickBar />
                </div>
                 <div className="space-y-6">
                    <UserCryptoHoldings />
                  </div>
              {/* Overview content area is intentionally empty (your Overview.jsx returns null) */}
              <Outlet />
            </>
          ) : (
            <>
              {/* Minimal top bar on nested pages */}
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/60 px-3 sm:px-4 py-3 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
               <div className="hidden sm:block">
                  <ProfileMenu />
                </div>
              </div>

              {/* Nested page content shows on its own (no header above it) */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <Outlet />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom navigation (fixed) */}
      <MobileNavDock />
    </div>
  )
}
