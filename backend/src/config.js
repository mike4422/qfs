// import 'dotenv/config'

// export const PORT = process.env.PORT || 4000
// export const JWT_SECRET = process.env.JWT_SECRET
// export const CLIENT_URL = process.env.CLIENT_URL
// export const SMTP = {
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT || 587),
//   user: process.env.SMTP_USER,
//   pass: process.env.SMTP_PASS,
//   from: process.env.SMTP_FROM || 'support@qfsworldwide.net'
// }


// /src/config.js (adjust path if different)
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// If config.js is in /src and .env is at project root:
loadEnv({ path: path.resolve(__dirname, "../.env") });

export const PORT = process.env.PORT || 4000;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL;

export const SMTP = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || "support@qfsworldwide.net",
};
