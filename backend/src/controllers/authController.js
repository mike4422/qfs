// /controllers/authController.js
import { prisma } from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, CLIENT_URL } from '../config.js'
import { validationResult } from 'express-validator'
import crypto from 'crypto'
import { sendMail } from '../utils/email.js'

// ✅ NEW: allowlist of admin emails (comma-separated)
const ADMIN_SET = new Set(
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
);

export async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

       // ✅ Normalize: accept fullName or name (prefer existing name if present)
    if (!req.body?.name && req.body?.fullName) {
      req.body.name = req.body.fullName;
    }

    const { name, username, email, country, phone, password } = req.body;

    // ✅ NEW: normalize email
    const emailLc = String(email || '').toLowerCase();

    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(24).toString("hex");

    // ✅ NEW: auto-role (ADMIN if email is allowlisted)
    const role = ADMIN_SET.has(emailLc) ? 'ADMIN' : 'USER';

    await prisma.user.create({
      data: {
        name,
        username,
        email: emailLc,          // ✅ store lowercase
        country,
        phone,
        password: hash,
        verificationToken,
        role,                    // ✅ save role
      },
    });

    const link = `https://api.qfsworldwide.net/api/auth/verify?token=${verificationToken}`;

   await sendMail({
  to: emailLc,
  subject: "Verify Your Email – QFS Network",
  html: `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #ffffff;">
      <!-- Header -->
      <div style="background: linear-gradient(90deg, #2563eb, #1e3a8a); padding: 24px; text-align: center; color: white;">
        <h2 style="margin: 0; font-weight: 600;">QFS Network</h2>
        <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">Secure Financial Infrastructure</p>
      </div>

      <!-- Body -->
      <div style="padding: 32px 24px;">
        <h3 style="margin-top: 0; color: #111827;">Verify your email address</h3>
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          Thank you for registering with <strong>QFS Network</strong>.<br>
          Please verify your email address to activate your account and start using our secure platform.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${link}" 
            style="background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 600; padding: 12px 28px; border-radius: 8px; display: inline-block;">
            Verify Email
          </a>
        </div>

        <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
          If the button above doesn’t work, copy and paste this link into your browser:
          <br>
          <a href="${link}" style="color: #2563eb; word-break: break-all;">${link}</a>
        </p>

        <p style="margin-top: 32px; font-size: 12px; color: #9ca3af;">
          This link will expire in 24 hours. If you did not create an account, you can safely ignore this message.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} QFS Network. All rights reserved.
      </div>
    </div>
  `
});


    res.json({ message: "Registered, Check your inbox or spam folder to verify your email.." });
  } catch (err) {
    if (err.code === "P2002" && err.meta?.target?.includes("username")) {
      return res.status(400).json({ message: "Username already taken. Choose a different one." });
    }
    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      return res.status(400).json({ message: "Email already in use." });
    }

    console.error("❌ Error in register():", err);
    res.status(500).json({ message: "Server error during registration." });
  }
}

export async function verifyEmail(req, res) {
  const { token } = req.query;
  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) return res.status(400).json({ message: "Invalid token" });

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null },
  });

  return res.redirect(`${process.env.CLIENT_URL}/login?verified=1`);
}

export async function login(req, res) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body

    // ✅ NEW: normalize email for lookup
    const emailLc = String(email || '').toLowerCase();

    // ✅ CHANGED: make lookup case-insensitive so existing mixed-case rows still work
    const user = await prisma.user.findFirst({
      where: { email: { equals: emailLc, mode: 'insensitive' } },
    });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    if (!user.emailVerified)
      return res.status(403).json({ message: 'Please verify your email' })

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,  // ✅ frontend can show Admin menu if role === 'ADMIN'
        name: user.name,
      },
    })
  } catch (err) {
    console.error('❌ Error in login():', err)
    return res.status(500).json({ message: 'Server error during login.' })
  }
}


// --- Forgot / Reset password ---
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body || {}
    if (!email || !String(email).includes("@")) {
      return res.status(400).json({ message: "Enter a valid email" })
    }

    const emailLc = String(email).toLowerCase()
    const user = await prisma.user.findFirst({
      where: { email: { equals: emailLc, mode: "insensitive" } },
      select: { id: true, email: true, name: true }
    })

    // Always respond the same to avoid user enumeration
    if (!user) return res.json({ message: "If that email exists, a reset link has been sent." })

    const raw = crypto.randomBytes(32).toString("hex")
    const hashed = crypto.createHash("sha256").update(raw).digest("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashed, resetTokenExpires: expires },
    })

    const base = CLIENT_URL || "https://www.qfsworldwide.net"
    const url = `${base}/reset-password?token=${raw}`

    try {
      await sendMail({
        to: user.email,
        subject: "Reset your password",
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
            <div style="background:#0a0a0a;padding:20px;color:white;text-align:center">
              <h2 style="margin:0;font-weight:600;">Password Reset</h2>
            </div>
            <div style="padding:24px;">
              <p>Hello ${user.name || ""},</p>
              <p>Click the button below within the next hour to reset your password:</p>
              <p style="margin:20px 0;">
                <a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
              </p>
              <p style="font-size:13px;color:#374151">Or copy this link:</p>
              <p style="word-break:break-all;color:#2563eb">${url}</p>
              <p style="margin-top:24px;">— QFS Support</p>
            </div>
            <div style="background:#0a0a0a;color:white;text-align:center;padding:12px;font-size:12px;">
              &copy; ${new Date().getFullYear()} QFS Worldwide
            </div>
          </div>
        `
      })
    } catch (_) {}

    return res.json({ message: "If that email exists, a reset link has been sent." })
  } catch (err) {
    console.error("POST /auth/forgot error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password, confirmPassword } = req.body || {}
    if (!(token && password && confirmPassword)) {
      return res.status(400).json({ message: "Missing fields" })
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" })
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" })
    }

    const hashed = crypto.createHash("sha256").update(String(token)).digest("hex")
    const now = new Date()

    const user = await prisma.user.findFirst({
      where: { resetToken: hashed, resetTokenExpires: { gt: now } },
      select: { id: true }
    })
    if (!user) return res.status(400).json({ message: "Invalid or expired token" })

    const hash = await bcrypt.hash(String(password), 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hash, resetToken: null, resetTokenExpires: null }
    })

    return res.json({ message: "Password updated successfully. You can now log in." })
  } catch (err) {
    console.error("POST /auth/reset error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}
