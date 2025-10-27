// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import FAQ from "./pages/FAQ.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


// ✅ Dashboard nested pages
import Overview from "./pages/dashboard/Overview.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import WalletSync from "./pages/dashboard/WalletSync.jsx";
import Transactions from "./pages/dashboard/Transactions.jsx";
import Withdraw from "./pages/dashboard/Withdraw.jsx";
import Deposit from "./pages/dashboard/Deposit.jsx";
import Buycrypto from "./pages/dashboard/Buycrypto.jsx";
import Swap from "./pages/dashboard/swap.jsx";
import Secure401IRA from "./pages/dashboard/Secure401IRA.jsx";
import Cards from "./pages/dashboard/Cards.jsx";
import KYC from "./pages/dashboard/KYC.jsx";
import Admin from "./pages/dashboard/Admin.jsx";
import Support from "./pages/dashboard/Support"
import Secure401IRAStart from "./pages/dashboard/Secure401IRAStart"
import Secure401IRAConfirmation from "./pages/dashboard/Secure401IRAConfirmation"
import Secure401IRAHIstory from "./pages/dashboard/Secure401IRAHIstory"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* ✅ Protected Dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested dashboard pages */}
          <Route index element={<Overview />} /> {/* default */}
          <Route path="profile" element={<Profile />} />
          <Route path="wallet-sync" element={<WalletSync />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="buycrypto" element={<Buycrypto />} />
          <Route path="swap" element={<Swap />} />
          <Route path="secure-401-ira" element={<Secure401IRA />} />
          <Route path="cards" element={<Cards />} />
          <Route path="kyc" element={<KYC />} />
          <Route path="admin" element={<Admin />} />
              {/* ✅ Support route */}
          <Route path="support" element={<Support />} />
          <Route path="secure401ira/start" element={<Secure401IRAStart />} />
          <Route path="secure401ira/confirmation" element={<Secure401IRAConfirmation />} />
          <Route path="secure401ira/history" element={<Secure401IRAHIstory />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
