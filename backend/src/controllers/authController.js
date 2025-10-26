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

    const link = `${process.env.CLIENT_URL}/api/auth/verify?token=${verificationToken}`;

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


    res.json({ message: "Registered. Check your email for verification link." });
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
