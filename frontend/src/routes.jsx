import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"

const Home         = lazy(()=>import("./pages/Home"))
const About        = lazy(()=>import("./pages/About"))
const Services     = lazy(()=>import("./pages/Services"))
const FAQ          = lazy(()=>import("./pages/FAQ"))
const Login        = lazy(()=>import("./pages/Login"))
const Register     = lazy(()=>import("./pages/Register"))
const Dashboard    = lazy(()=>import("./pages/Dashboard"))
const Overview     = lazy(()=>import("./pages/dashboard/Overview"))
const Profile      = lazy(()=>import("./pages/dashboard/Profile"))
const KYC          = lazy(()=>import("./pages/dashboard/KYC"))
const Projects     = lazy(()=>import("./pages/dashboard/Projects"))
const WalletSync   = lazy(()=>import("./pages/dashboard/WalletSync"))
const Transactions = lazy(()=>import("./pages/dashboard/Transactions"))
const Cards        = lazy(()=>import("./pages/dashboard/Cards"))
const Admin        = lazy(()=>import("./pages/dashboard/Admin"))

const Fallback = () => <div className="p-4">Loading…</div>

const E = ({ el }) => <Suspense fallback={<Fallback/>}>{el}</Suspense>

export default function RoutesConfig(){
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<E el={<Home/>} />} />
        <Route path="about" element={<E el={<About/>} />} />
        <Route path="services" element={<E el={<Services/>} />} />
        <Route path="faq" element={<E el={<FAQ/>} />} />
        <Route path="login" element={<E el={<Login/>} />} />
        <Route path="register" element={<E el={<Register/>} />} />

        <Route
          path="dashboard"
          element={<ProtectedRoute><E el={<Dashboard/>} /></ProtectedRoute>}
        >
          <Route index element={<E el={<Overview/>} />} />
          <Route path="profile" element={<E el={<Profile/>} />} />
          <Route path="kyc" element={<E el={<KYC/>} />} />
          <Route path="projects" element={<E el={<Projects/>} />} />
          <Route path="wallet-sync" element={<E el={<WalletSync/>} />} />
          <Route path="transactions" element={<E el={<Transactions/>} />} />
          <Route path="cards" element={<E el={<Cards/>} />} />
          <Route path="admin" element={<E el={<Admin/>} />} />
        </Route>
      </Route>
    </Routes>
  )
}
