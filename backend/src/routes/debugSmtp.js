// /backend/src/routes/debugSmtp.js
import { Router } from "express";
import { SMTP } from "../config.js";
import nodemailer from "nodemailer";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const has = {
      host: !!SMTP.host,
      port: !!SMTP.port,
      user: !!SMTP.user,
      pass: !!SMTP.pass, // only boolean
      from: !!SMTP.from,
    };

    if (!has.host || !has.user || !has.pass) {
      return res.status(200).json({ ok: false, reason: "missing_env", has });
    }

    const tx = nodemailer.createTransport({
      host: SMTP.host,
      port: Number(SMTP.port),
      secure: Number(SMTP.port) === 465,
      auth: { user: SMTP.user, pass: SMTP.pass },
    });

    const verify = await tx.verify().then(() => true).catch(() => false);
    return res.json({ ok: verify, has });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
