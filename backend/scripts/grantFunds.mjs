// backend/scripts/grantFunds.mjs
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function parseArgs() {
  const args = process.argv.slice(2)
  const opts = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === "--email") opts.email = args[++i]
    else if (a === "--userId") opts.userId = Number(args[++i])
    else if (a === "--symbol") opts.symbol = String(args[++i]).toUpperCase()
    else if (a === "--amount") opts.amount = String(args[++i])
  }
  if ((!opts.email && !opts.userId) || !opts.symbol || !opts.amount) {
    console.error("Usage: node scripts/grantFunds.mjs --email user@site.com --symbol BTC --amount 0.5")
    console.error("   or: node scripts/grantFunds.mjs --userId 1 --symbol ETH --amount 2.25")
    process.exit(1)
  }
  return opts
}

function randRef(prefix = "MANUAL_DEP") {
  const t = Date.now()
  const r = Math.floor(Math.random() * 1e6).toString().padStart(6, "0")
  return `${prefix}_${t}_${r}`
}

async function main() {
  const { email, userId: idFromArg, symbol, amount } = parseArgs()

  // 1) find user
  const user = email
    ? await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    : await prisma.user.findUnique({ where: { id: idFromArg } })

  if (!user) {
    console.error("User not found.")
    process.exit(1)
  }

  // 2) upsert holding (increase amount; leave locked untouched)
  const existing = await prisma.holding.findFirst({
    where: { userId: user.id, symbol },
  })

  if (existing) {
    await prisma.holding.update({
      where: { id: existing.id },
      data: {
        amount: (BigInt(Math.round(parseFloat(existing.amount) * 1e18)) + BigInt(Math.round(parseFloat(amount) * 1e18))).toString() // safety: avoid float drift
      }
    })
  } else {
    await prisma.holding.create({
      data: {
        userId: user.id,
        symbol,
        amount,        // Prisma Decimal accepts string
        locked: "0",
      }
    })
  }

  // 3) record a confirmed DEPOSIT transaction (optional but nice for history)
  // Your Transaction model: { ref (unique), type, amount (String), status, userId }
  const ref = randRef()
  await prisma.transaction.create({
    data: {
      ref,
      type: "DEPOSIT",
      amount: amount.toString(),
      status: "CONFIRMED",
      userId: user.id,
      symbol: sym, 
    }
  })

  console.log(`✅ Funded ${user.email || user.username || user.name} with +${amount} ${symbol}`)
  console.log(`   Holding updated, transaction ref: ${ref}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
