// /utils/email.js
import nodemailer from "nodemailer";
import { SMTP } from "../config.js";
// Optional: npm i html-to-text if you want auto text fallback
// import { htmlToText } from "html-to-text";

let transporter; // singleton / pooled

function buildTransporter() {
  const host = SMTP?.host;
  const port = Number(SMTP?.port || 587);
  const user = SMTP?.user;
  const pass = SMTP?.pass;

  // Dev-friendly: if SMTP not configured, return a mock transport that logs.
  if (!host || !user || !pass) {
    return {
      async sendMail(msg) {
        console.log("[mailer:dry-run]", {
          to: msg.to,
          subject: msg.subject,
          from: msg.from || SMTP?.from || "support@qfsworlwide.net",
        });
        return { messageId: "dry-run" };
      },
      // optional verify() stub
      async verify() {
        console.log("[mailer] SMTP not configured, running in dry-run mode");
      },
    };
  }

 const t = nodemailer.createTransport({
  host: process.env.SMTP_HOST,                 // smtp.hostinger.com
  port: Number(process.env.SMTP_PORT),         // 465 (SSL) or 587 (STARTTLS)
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,               // support@qfsworldwide.net
    pass: process.env.SMTP_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  // Optional timeouts to avoid “hangs” under load:
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

  return t;
}

function getTransporter() {
  if (!transporter) transporter = buildTransporter();
  return transporter;
}

/**
 * sendMail({ to, subject, html, text?, replyTo?, headers? })
 * - returns { ok: true, messageId } on success
 */
export const sendMail = async ({ to, subject, html, text, replyTo, headers }) => {
  try {
    const tx = getTransporter();

    // Optionally verify once at boot time elsewhere:
    // await tx.verify();

    const from = SMTP?.from || "QFS Support <support@qfsworldwide.net>";

    // Auto-generate text from html if not provided (uncomment if you installed html-to-text)
    // if (!text && html) {
    //   text = htmlToText(html, { wordwrap: 120 });
    // }

    const info = await tx.sendMail({
      from,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || from,
      headers: {
        "X-Mailer": "QFS Mailer",
        "List-Unsubscribe": "<mailto:support@qfsworldwide.net?subject=unsubscribe>",
        ...(headers || {}),
      },
    });

    console.log(`📧 Email sent to ${to} (messageId: ${info.messageId})`);
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    // Re-throw so callers (e.g., admin actions) can decide whether to fail or continue.
    // If you prefer to swallow, return { ok:false } instead.
    throw err;
  }
};

export default transporter
