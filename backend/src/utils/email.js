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
          from: msg.from || SMTP?.from || "no-reply@qfsworlwide.net",
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
    host,
    port,
    secure: port === 465, // SSL only on 465
    auth: { user, pass },
    pool: true,              // ✅ enable pooling for bursts
    maxConnections: 5,       // tune as needed
    maxMessages: 100,        // tune as needed
    // tls: { rejectUnauthorized: true }, // tighten if your SMTP has proper certs
    // dkim: { domainName, keySelector, privateKey } // if you have DKIM
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

    const from = SMTP?.from || "QFS Support <no-reply@qfsapp.com>";

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
        "List-Unsubscribe": "<mailto:support@yourdomain.com?subject=unsubscribe>",
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
