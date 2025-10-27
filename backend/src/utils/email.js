// /utils/email.js
import nodemailer from "nodemailer";
import { SMTP } from "../config.js";
// Optional: npm i html-to-text if you want auto text fallback
// import { htmlToText } from "html-to-text";

let transporter; // singleton / pooled

function buildTransporter() {
  const host = SMTP?.host || process.env.SMTP_HOST || "smtp.hostinger.com";
  const port = Number(SMTP?.port || process.env.SMTP_PORT || 465);
  const user = SMTP?.user || process.env.SMTP_USER;
  const pass = SMTP?.pass || process.env.SMTP_PASS;

  // Dev-friendly: if SMTP not configured, return a mock transport that logs.
  if (!host || !user || !pass) {
    return {
      async sendMail(msg) {
        console.log("[mailer:dry-run]", {
          to: msg.to,
          subject: msg.subject,
          from: msg.from || SMTP?.from || "support@qfsworldwide.net",
        });
        return { messageId: "dry-run" };
      },
      async verify() {
        console.log("[mailer] SMTP not configured, running in dry-run mode");
      },
    };
  }

  const t = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for SSL (465), false for TLS (587)
    auth: {
      user,
      pass,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
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
    const from = SMTP?.from || "QFS Support <support@qfsworldwide.net>";

    // Auto-generate text from html if not provided (optional)
    // if (!text && html) text = htmlToText(html, { wordwrap: 120 });

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
    throw err;
  }
};

export default transporter;
