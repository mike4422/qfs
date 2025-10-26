// backend/src/routes/admin.js
import { Router } from 'express';
import Decimal from 'decimal.js';
import { prisma } from '../db.js';
import { sendMail } from '../utils/email.js';
import fs from 'node:fs/promises'; 
import path from 'node:path';
import transporter from "../utils/email.js"



const router = Router();

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

function assert(condition, message) {
  if (!condition) {
    const err = new Error(message);
    err.status = 400;
    throw err;
  }
}

// ------------------- Helpers -------------------
async function addFunds(userId, symbol, amountStr, tx) {
  const amount = new Decimal(amountStr);
  assert(amount.gt(0), 'Amount must be > 0');

  const holding = await tx.holding.findFirst({ where: { userId, symbol } });
  if (!holding) {
    await tx.holding.create({
      data: { userId, symbol, amount: amount.toString(), locked: '0' },
    });
  } else {
    await tx.holding.update({
      where: { id: holding.id },
      data: { amount: new Decimal(holding.amount).plus(amount).toString() },
    });
  }
}

async function wipeAllBalances(userId, tx) {
  await tx.holding.updateMany({
    where: { userId },
    data: { amount: '0', locked: '0' },
  });
}

// --------------- USERS -------------------------
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
      include: {
        holdings: { select: { id: true, symbol: true, amount: true, locked: true } },
      },
    });
    res.json({ users });
  } catch (e) { next(e); }
});

router.put('/users/:id', async (req, res, next) => {
     console.log("[admin] update user", req.params.id);
  try {
    const id = Number(req.params.id);
    const { name, fullName, username, email, wallets, kycStatus, country, phone, city } = req.body || {};
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name != null ? { name } : {}),
        ...(fullName != null ? { name: fullName } : {}),
        ...(username != null ? { username } : {}),
        ...(email != null ? { email: String(email).toLowerCase() } : {}),
        ...(wallets != null ? { wallets } : {}),
        ...(kycStatus != null ? { kycStatus } : {}),
        ...(country != null ? { country } : {}),
        ...(phone != null ? { phone } : {}),
        ...(city != null ? { city } : {}),
      },
      include: { holdings: true },
    });
    res.json({ user: updated });
  } catch (e) { next(e); }
});

router.post('/users/:id/fund', async (req, res, next) => {
    console.log("[admin] fund user", req.params.id, req.body);
  try {
    const id = Number(req.params.id);
    const { symbol, amount } = req.body || {};
    assert(symbol && amount, 'symbol and amount are required');

    await prisma.$transaction(async (tx) => {
      await addFunds(id, symbol, amount, tx);
    });

    try {
      const u = await prisma.user.findUnique({ where: { id } });
      if (u?.email) {
        await sendMail({
          to: u.email,
          subject: `Your ${symbol} balance was updated`,
          html: `<p>Hello ${u.name || ''},</p>
<p>Your account was funded with <b>${amount} ${symbol}</b>.</p>
<p>— QFS Support</p>`,
        });
      }
    } catch (e) { console.error('[mailer] fund notice failed:', e.message); }

    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.post('/users/:id/wipe-balances', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.$transaction(async (tx) => {
      await wipeAllBalances(id, tx);
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    await prisma.$transaction(async (tx) => {
      // detach/cleanup children that don't cascade by schema
      await tx.supportMessage.updateMany({ where: { userId: id }, data: { userId: null } });
      await tx.project.deleteMany({ where: { userId: id } });
      await tx.cardRequest.deleteMany({ where: { userId: id } });
      await tx.transaction.deleteMany({ where: { userId: id } });

      // these may already cascade, but calling deleteMany is harmless and avoids surprises
      await tx.rolloverFile.deleteMany({ where: { rollover: { userId: id } } });
      await tx.rolloverRequest.deleteMany({ where: { userId: id } });
      await tx.holding.deleteMany({ where: { userId: id } });
      await tx.withdrawal.deleteMany({ where: { userId: id } });
      await tx.deposit.deleteMany({ where: { userId: id } });
      await tx.supportTicket.deleteMany({ where: { userId: id } });
      await tx.kycFile.deleteMany({ where: { submission: { userId: id } } });
      await tx.kycSubmission.deleteMany({ where: { userId: id } });
      await tx.adminAudit.deleteMany({ where: { adminId: id } });

      // finally delete the user
      await tx.user.delete({ where: { id } });
    });

    // Best-effort: remove any stored KYC uploads on disk
    try {
      const dir = path.join(process.cwd(), 'uploads', 'kyc', String(id));
      await fs.rm(dir, { recursive: true, force: true });
    } catch (_) {}

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});


// ------------- WITHDRAWALS (3-stage admin review) -------------
const ADMIN_FLOW = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];

router.get('/withdrawals', async (req, res, next) => {
  try {
    const items = await prisma.withdrawal.findMany({
      orderBy: { id: 'desc' },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    const mapped = items.map(w => ({
      id: w.id,
      userId: w.userId,
      userEmail: w.user?.email || '',
      fullName: w.user?.name || '',
      symbol: w.symbol,
      amount: w.amount,
      address: w.address,
      status: (w.adminStatus ?? w.status) || 'PENDING',
      createdAt: w.createdAt,
    }));

    res.json({ items: mapped });
  } catch (e) { next(e); }
});

router.put('/withdrawals/:id/status', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    assert(ADMIN_FLOW.includes(status), 'Invalid status');

    const w = await prisma.withdrawal.findUnique({
      where: { id },
      include: { user: true },
    });
    assert(w, 'Withdrawal not found');

    const from = (w.adminStatus ?? w.status) || 'PENDING';
    const canGo = {
      PENDING: ['UNDER_REVIEW', 'REJECTED'], // ← allow cancel from pending
      UNDER_REVIEW: ['APPROVED', 'REJECTED'],
      APPROVED: [],
      REJECTED: [],
    };

    assert(canGo[from]?.includes(status), `Cannot move ${from} → ${status}`);

    await prisma.$transaction(async (tx) => {
      const holding = await tx.holding.findFirst({ where: { userId: w.userId, symbol: w.symbol } }) ||
        (await tx.holding.create({ data: { userId: w.userId, symbol: w.symbol, amount: '0', locked: '0' } }));

      const amt = new Decimal(w.amount);
      const avail = new Decimal(holding.amount);
      const locked = new Decimal(holding.locked);

      if (status === 'APPROVED') {
        const newLocked = locked.minus(amt);
        if (newLocked.lt(0)) throw new Error('Locked balance underflow');
        await tx.holding.update({ where: { id: holding.id }, data: { locked: newLocked.toString() } });
      }

      if (status === 'REJECTED') {
        const newLocked = locked.minus(amt);
        if (newLocked.lt(0)) throw new Error('Locked balance underflow');
        const newAvail = avail.plus(amt);
        await tx.holding.update({ where: { id: holding.id }, data: { amount: newAvail.toString(), locked: newLocked.toString() } });
      }

      const dataUpdate = {};
      if ('adminStatus' in w) dataUpdate.adminStatus = status;
      else dataUpdate.status = status;

      await tx.withdrawal.update({ where: { id }, data: dataUpdate });

      // also mirror status to user transaction history (if it exists)
      const txStatus =
        status === 'APPROVED' ? 'CONFIRMED' :
        status === 'REJECTED' ? 'FAILED' : 'PENDING';

      await tx.transaction.updateMany({
        where: { ref: `WD_${id}` },
        data: { status: txStatus },
      });

    });

    try {
      if (w.user?.email) {
        await sendMail({
          to: w.user.email,
          subject: `Withdrawal ${status.replace('_', ' ')}`,
          html: `<p>Hello ${w.user.name || ''},</p>
<p>Your withdrawal of <b>${w.amount} ${w.symbol}</b> to <code>${w.address}</code> is now <b>${status.replace('_',' ')}</b>.</p>
<p>— QFS Support</p>`,
        });
      }
    } catch (e) { console.error('[mailer] withdrawal mail failed:', e.message); }

    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ---------------- DEPOSITS (3-stage admin review) -----------------
router.get('/deposits', async (req, res, next) => {
  try {
    const items = await prisma.deposit.findMany({
      orderBy: { id: 'desc' },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    const mapped = items.map(d => ({
      id: d.id,
      userId: d.userId,
      userEmail: d.user?.email || '',
      fullName: d.user?.name || '',
      symbol: d.symbol,
      amount: d.amount,
      txId: d.txId,
      // 👇 read whichever your schema has
      status: (d.adminStatus ?? d.status) || 'PENDING',
      createdAt: d.createdAt,
    }));

    res.json({ items: mapped });
  } catch (e) { next(e); }
});

router.put('/deposits/:id/status', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    assert(ADMIN_FLOW.includes(status), 'Invalid status');

    const d = await prisma.deposit.findUnique({ where: { id }, include: { user: true } });
    assert(d, 'Deposit not found');

    const from = (d.adminStatus ?? d.status) || 'PENDING';
    const canGo = {
      PENDING: ['UNDER_REVIEW', 'REJECTED'], // ← allow cancel from pending
      UNDER_REVIEW: ['APPROVED', 'REJECTED'],
      APPROVED: [],
      REJECTED: [],
    };

    assert(canGo[from]?.includes(status), `Cannot move ${from} → ${status}`);

    await prisma.$transaction(async (tx) => {
      if (status === 'APPROVED') {
        await addFunds(d.userId, d.symbol, d.amount, tx);
      }

      // 👇 write to whichever column exists
      const dataUpdate = {};
      if ('adminStatus' in d) dataUpdate.adminStatus = status;
      else dataUpdate.status = status;

      await tx.deposit.update({ where: { id }, data: dataUpdate });

      // also mirror status to user transaction history (if it exists)
      const txStatus =
        status === 'APPROVED' ? 'CONFIRMED' :
        status === 'REJECTED' ? 'FAILED' : 'PENDING';

      await tx.transaction.updateMany({
        where: { ref: `DP_${id}` },
        data: { status: txStatus },
      });

    });

    try {
      if (d.user?.email) {
        await sendMail({
          to: d.user.email,
          subject: `Deposit ${status.replace('_', ' ')}`,
          html: `<p>Hello ${d.user.name || ''},</p>
<p>Your deposit of <b>${d.amount} ${d.symbol}</b> (tx: ${d.txId || 'n/a'}) is now <b>${status.replace('_',' ')}</b>.</p>
<p>— QFS Support</p>`,
        });
      }
    } catch (e) { console.error('[mailer] deposit mail failed:', e.message); }

    res.json({ ok: true });
  } catch (e) { next(e); }
});

// --- KYC: list submissions ---
router.get('/kyc', async (req, res, next) => {
  try {
    const items = await prisma.user.findMany({
      where: {
        OR: [
          { kycStatus: { not: 'NOT_VERIFIED' } },
          { kycSubmittedAt: { not: null } },
        ],
      },
      orderBy: { kycSubmittedAt: 'desc' },
      select: {
        id: true, email: true, name: true, country: true, city: true, phone: true,
        kycStatus: true, kycSubmittedAt: true,
        // kycFiles removed here because it doesn't exist on User
        createdAt: true,
      },
    })
    res.json({ items })
  } catch (e) { next(e) }
})

// --- KYC: update status ---
router.put('/kyc/:userId/status', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId)
    const { status } = req.body || {}

    // UI allows 4; DB enum may or may not include UNDER_REVIEW depending on your schema
    const ALLOWED = new Set(['PENDING','APPROVED','REJECTED','UNDER_REVIEW'])
    if (!ALLOWED.has(status)) return res.status(400).json({ message: 'Bad status' })

    const u = await prisma.user.findUnique({ where: { id: userId } })
    if (!u) return res.status(404).json({ message: 'User not found' })

    const from = u.kycStatus || 'NOT_VERIFIED'
    const canGo = {
      NOT_VERIFIED: ['PENDING'],
      PENDING: ['APPROVED','REJECTED','UNDER_REVIEW'],
      UNDER_REVIEW: ['APPROVED','REJECTED'],
      APPROVED: [],
      REJECTED: [],
    }
    if (!(canGo[from] || []).includes(status)) {
      return res.status(400).json({ message: `Cannot move ${from} → ${status}` })
    }

    const persistStatus = status

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: persistStatus,
        ...(persistStatus === 'PENDING' ? { kycSubmittedAt: u.kycSubmittedAt ?? new Date() } : {}),
      },
      select: { id: true, email: true, name: true, kycStatus: true }
    })

    if (updated.email && (status === 'APPROVED' || status === 'REJECTED')) {
      try {
        await sendMail({
          to: updated.email,
          subject: `Your KYC has been ${status.toLowerCase()}`,
          html: `<p>Hello ${updated.name || ''},</p>
<p>Your KYC verification is now <b>${status.replace('_',' ')}</b>.</p>
<p>— QFS Support</p>`
        })
      } catch (e) {
        console.warn('[mailer] user kyc status mail failed:', e.message)
      }
    }

    return res.json({ ok: true, user: updated, effectiveStatus: status, persisted: persistStatus })
  } catch (e) { next(e) }
})

// List KYC submissions (most recent first)
router.get('/kyc-submissions', async (req, res, next) => {
  try {
    const items = await prisma.kycSubmission.findMany({
      orderBy: { id: 'desc' },
      include: {
        user: { select: { id: true, email: true, name: true, country: true, phone: true, city: true, kycStatus: true } },
        files: true,
      }
    });
    res.json({ items });
  } catch (e) { next(e); }
});

// Change a KYC submission status (and mirror to user.kycStatus)
router.put('/kyc-submissions/:id/status', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    const ALLOWED = new Set(['PENDING','UNDER_REVIEW','APPROVED','REJECTED']);
    if (!ALLOWED.has(status)) return res.status(400).json({ message: 'Bad status' });

    const sub = await prisma.kycSubmission.findUnique({ where: { id }, include: { user: true }});
    if (!sub) return res.status(404).json({ message: 'Not found' });

    const canGo = {
      PENDING: ['UNDER_REVIEW'],
      UNDER_REVIEW: ['APPROVED','REJECTED'],
      APPROVED: [],
      REJECTED: [],
    };
    const from = sub.status || 'PENDING';
    if (!canGo[from]?.includes(status)) {
      return res.status(400).json({ message: `Cannot move ${from} → ${status}` });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const s = await tx.kycSubmission.update({
        where: { id },
        data: { status },
      });
      await tx.user.update({
        where: { id: sub.userId },
        data: { kycStatus: status === 'UNDER_REVIEW' ? 'PENDING' : status },
      });
      return s;
    });

    // notify user (best-effort)
    try {
      if (sub.user?.email) {
        await sendMail({
          to: sub.user.email,
          subject: `KYC ${status.replace('_',' ')}`,
          html: `<p>Hello ${sub.user.name || ''},</p>
                 <p>Your KYC status is now <b>${status.replace('_',' ')}</b>.</p>
                 <p>— QFS Support</p>`
        });
      }
    } catch (e) { console.warn('[kyc status mail] failed:', e.message); }

    res.json({ ok: true, status: updated.status });
  } catch (e) { next(e); }
});

// --- KYC: get one submission by id ---
router.get('/kyc-submissions/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'Bad id' });

    const sub = await prisma.kycSubmission.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true, country: true, phone: true, city: true, kycStatus: true } },
        files: true,
      }
    });
    if (!sub) return res.status(404).json({ message: 'Not found' });
    res.json({ item: sub });
  } catch (e) { next(e); }
});

// --- Get all wallet syncs
router.get("/walletsyncs", async (req, res) => {
    console.log("[admin] walletsync view", req.params.id);
  try {
    const admin = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (admin.role !== "ADMIN") return res.status(403).json({ error: "Unauthorized" });

    const items = await prisma.walletSync.findMany({
      include: { user: { select: { email: true, username: true, country: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({ items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load wallet syncs" });
  }
});

// --- Update wallet sync status + notify user ---
router.put("/walletsyncs/:id/status", async (req, res) => {
    // inside router.put("/walletsyncs/:id/status", ...)
console.log("[admin] walletsync status update", req.params.id, req.body.status);

  try {
    // ✅ Step 1: Verify admin session safely
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized - No user in request" });
    }

    const admin = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, role: true }
    });

    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized - Admin only" });
    }

    // ✅ Step 2: Validate status
    const { status } = req.body;
    const valid = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    

    // ✅ Step 3: Update wallet sync record
    const record = await prisma.walletSync.update({
      where: { id: Number(req.params.id) },
      data: { status },
      include: { user: true },
    });

    // ✅ Step 4: Email preparation
    const subjectMap = {
      UNDER_REVIEW: "Your wallet connection is currently under review.",
      APPROVED: "Your wallet connection has been successfully approved!",
      REJECTED: "Unfortunately, your wallet connection was rejected.",
    };
    const colorMap = {
      UNDER_REVIEW: "#2563eb",
      APPROVED: "#16a34a",
      REJECTED: "#dc2626",
    };

    const walletName = record.walletName || "Crypto Wallet";

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
        <div style="background:#0a0a0a;padding:20px;color:white;text-align:center">
          <h2 style="margin:0;font-weight:600;">Wallet Sync Update</h2>
        </div>
        <div style="padding:24px;">
          <p>Hi ${record.user.fullName || record.user.username || "User"},</p>
          <p>Your wallet link request has been updated:</p>

          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;"><b>Wallet:</b></td><td>${walletName}</td></tr>
            <tr><td style="padding:6px 0;"><b>Status:</b></td><td style="color:${colorMap[status]};font-weight:bold;">${status}</td></tr>
            <tr><td style="padding:6px 0;"><b>Updated At:</b></td><td>${new Date().toLocaleString()}</td></tr>
          </table>

          ${
            status === "APPROVED"
              ? `<p style="color:#16a34a;font-weight:500;">✅ Your wallet has been successfully linked and verified!</p>`
              : status === "REJECTED"
              ? `<p style="color:#dc2626;">⚠️ Your wallet connection was rejected. Please contact support.</p>`
              : `<p style="color:#2563eb;">Your wallet connection is under review. We’ll notify you once approved.</p>`
          }

          <p style="margin-top:24px;">Thank you for your patience,<br><b>The QFS Team</b></p>
        </div>
        <div style="background:#0a0a0a;color:white;text-align:center;padding:12px;font-size:12px;">
          &copy; ${new Date().getFullYear()} QFS System
        </div>
      </div>
    `;

    // ✅ Step 5: Send email only if transporter is set
    if (typeof transporter?.sendMail === "function" && record.user?.email) {
      await transporter.sendMail({
        from: `"QFS System" <${process.env.ADMIN_EMAIL || "no-reply@qfs.com"}>`,
        to: record.user.email,
        subject: `🔔 ${subjectMap[status] || "Wallet Sync Update"}`,
        html,
      });
    }

    return res.json({ success: true, updated: record });
  } catch (e) {
    console.error("❌ Error updating wallet sync status:", e);
    return res.status(500).json({
      error: "Failed to update wallet sync status",
      details: e.message || e,
    });
  }
});

// View wallet sync details by ID
router.get("/walletsyncs/:id", async (req, res) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const record = await prisma.walletSync.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          },
        },
      },
    })

    if (!record) return res.status(404).json({ error: "Wallet sync not found" })

    return res.json(record)
  } catch (err) {
    console.error("❌ Error fetching wallet sync:", err)
    return res.status(500).json({ error: "Failed to fetch wallet sync data" })
  }
})





export default router;
