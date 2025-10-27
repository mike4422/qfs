// /scripts/email_tester.js
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Resolve ../.env relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { sendMail } from "../src/utils/email.js"; // adjust path to your email.js

// Optional: quick visibility check (masks password)
console.log("[SMTP check]", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? "***" : undefined,
});

const res = await sendMail({
  to: "mikeclinton508@gmail.com",
  subject: "QFS Email Test ✅",
  html: "<p>Hello from <b>QFS Worldwide</b> — Hostinger SMTP live.</p>",
});

console.log(res);
