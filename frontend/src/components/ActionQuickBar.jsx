import { Link } from "react-router-dom"
import {
  ArrowUpToLine,
  ArrowDownToLine,
  Link2,
  ArrowLeftRight,
  CreditCard
} from "lucide-react"

function ActionButton({ to, icon: Icon, label, subtitle, variant = "primary" }) {
  const desktopVariants = {
    primary:
      "sm:border-blue-200 sm:bg-white hover:sm:bg-blue-50 dark:sm:border-blue-900/40 dark:sm:bg-gray-900 dark:hover:sm:bg-gray-800",
    neutral:
      "sm:border-gray-200 sm:bg-white hover:sm:bg-gray-50 dark:sm:border-gray-800 dark:sm:bg-gray-900 dark:hover:sm:bg-gray-800",
  }

  return (
    <Link
      to={to}
      className={[
        "group relative transition focus:outline-none focus:ring-2 focus:ring-blue-500/40",
        "rounded-lg px-1 py-2 sm:px-4 sm:py-3",
        "border-transparent bg-transparent shadow-none",
        "sm:rounded-2xl sm:border sm:shadow-sm",
        desktopVariants[variant] || desktopVariants.neutral,
        "flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left",
      ].join(" ")}
    >
      {/* Icon wrapper */}
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm sm:h-16 sm:w-16">
        <Icon className="h-9 w-9 sm:h-9 sm:w-9" />
      </span>

      <div className="min-w-0">
        {/* Mobile: black; Desktop: white */}
        <div className="text-[12px] font-semibold text-black sm:text-white sm:text-sm">
          {label}
        </div>
        {subtitle ? (
          <div className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
            {subtitle}
          </div>
        ) : null}
      </div>
    </Link>
  )
}

export function DepositButton(props) {
  return (
    <ActionButton
      to="/dashboard/deposit"
      icon={ArrowUpToLine}
      label="Deposit"
      subtitle="Add funds to your account"
      variant="primary"
      {...props}
    />
  )
}

export function WithdrawButton(props) {
  return (
    <ActionButton
      to="/dashboard/withdraw"
      icon={ArrowDownToLine}
      label="Withdraw"
      subtitle="Move funds out securely"
      variant="neutral"
      {...props}
    />
  )
}

export function LinkWalletButton(props) {
  return (
    <ActionButton
      to="/dashboard/wallet-sync"
      icon={Link2}
      label="Link Wallet"
      subtitle="Connect your external wallet"
      variant="neutral"
      {...props}
    />
  )
}

export function SwapButton(props) {
  return (
    <ActionButton
      to="/dashboard/swap"
      icon={ArrowLeftRight}
      label="Swap"
      subtitle="Exchange assets instantly"
      variant="neutral"
      {...props}
    />
  )
}

export function BuyCryptoButton(props) {
  return (
    <ActionButton
      to="/dashboard/buycrypto"
      icon={CreditCard}
      label="Buy Crypto"
      subtitle="Purchase with card or bank"
      variant="neutral"
      {...props}
    />
  )
}

export default function ActionQuickBar() {
  return (
    <>
      <div className="grid grid-cols-5 gap-1 sm:hidden">
        <DepositButton />
        <WithdrawButton />
        <LinkWalletButton />
        <SwapButton />
        <BuyCryptoButton />
      </div>

      <div className="hidden sm:grid sm:grid-cols-2 xl:grid-cols-5 sm:gap-3">
        <DepositButton />
        <WithdrawButton />
        <LinkWalletButton />
        <SwapButton />
        <BuyCryptoButton />
      </div>
    </>
  )
}
