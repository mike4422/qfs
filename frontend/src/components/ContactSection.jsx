// src/components/ContactSection.jsx
import { useState } from "react";

const WHATSAPP_PHONE = "+15819427285"; // ← replace with your real WhatsApp number (E.164 format)

export default function ContactSection() {
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  function buildWhatsAppText({ name = "", email = "", subject = "", message = "" } = {}) {
    const lines = [
      `Hello QFS Team 👋`,
      subject ? `Subject: ${subject}` : null,
      message ? `Message: ${message}` : null,
      name || email ? "" : null,
      name ? `— ${name}` : null,
      email ? `(${email})` : null,
    ].filter(Boolean);
    return encodeURIComponent(lines.join("\n"));
  }

  function openWhatsAppFromForm(e) {
    // read current form values without submitting
    const form = e?.currentTarget?.closest?.("form") || document.querySelector("#contact-form");
    if (!form) return;
    const formData = new FormData(form);
    const data = Object.fromEntries(Array.from(formData.entries()).map(([k, v]) => [k, String(v)]));
    const url = `https://wa.me/${WHATSAPP_PHONE.replace(/\D/g, "")}?text=${buildWhatsAppText(data)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(Array.from(formData.entries()).map(([k, v]) => [k, String(v)]));

    const localErrors = {};
    if (!data.name) localErrors.name = "Please enter your name.";
    if (!data.email) localErrors.email = "Please enter your email.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) localErrors.email = "Enter a valid email address.";
    if (!data.message) localErrors.message = "Please include a message.";

    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24">
      {/* Background aura */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-700/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* LEFT PANEL — QFS THEME */}
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800" />
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(40% 40% at 20% 20%, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 60%), radial-gradient(35% 35% at 80% 30%, rgba(255,255,255,.25) 0%, rgba(255,255,255,0) 60%)",
              }}
            />
            <div className="relative p-10 sm:p-12 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Quantum Financial Network
              </div>

              <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight">
                The Future of Global Finance Has Begun
              </h2>

              <p className="mt-4 max-w-xl text-white/85 text-sm leading-relaxed">
                The Quantum Financial System (QFS) is emerging as the foundation of a fair and transparent global economy — 
                designed to eliminate corruption, remove monopolies, and protect your assets from the collapse of paper money.
              </p>

              <p className="mt-4 max-w-xl text-white/85 text-sm leading-relaxed">
                As NESARA/GESARA reforms unfold, individuals and institutions must prepare for 
                the transition. Secure your wealth, synchronize your accounts, and back up your funds 
                before you wake up one morning and realize everything has changed.
              </p>

              {/* Highlight cards */}
              <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
                {[
                  ["NESARA/GESARA", "Global Prosperity Act"],
                  ["QFS Integration", "ISO20022-Compliant"],
                  ["Digital Reset", "Asset-Backed Currencies"],
                  ["Financial Sovereignty", "Freedom from Control"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white/5 p-4 text-center ring-1 ring-white/10">
                    <div className="text-sm font-semibold">{k}</div>
                    <div className="mt-1 text-xs text-white/70">{v}</div>
                  </div>
                ))}
              </div>

              {/* Contact info */}
              <div className="mt-10 space-y-4 text-sm">
                <div className="flex items-center gap-3 text-white/90">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.098 1.918l-6.75 3.857a2.25 2.25 0 0 1-2.204 0L3.348 8.911A2.25 2.25 0 0 1 2.25 6.993V6.75" />
                  </svg>
                  <span>support@qfsworldwide.net</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M2.25 4.5l3.36-.84a2.25 2.25 0 0 1 2.64 1.27l1.13 2.64a2.25 2.25 0 0 1-.54 2.52l-1.5 1.5a16.5 16.5 0 0 0 6.75 6.75l1.5-1.5a2.25 2.25 0 0 1 2.52-.54l2.64 1.13a2.25 2.25 0 0 1 1.27 2.64l-.84 3.36a2.25 2.25 0 0 1-2.19 1.69A18.75 18.75 0 0 1 2.25 6.69 2.25 2.25 0 0 1 3.94 4.5z" />
                  </svg>
                  <span>{WHATSAPP_PHONE}</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M12 2.25c4.556 0 8.25 3.694 8.25 8.25 0 6.375-8.25 11.25-8.25 11.25S3.75 16.875 3.75 10.5C3.75 5.944 7.444 2.25 12 2.25z" />
                    <circle cx="12" cy="10.5" r="2.25" />
                  </svg>
                  <span>Corporate headquarters. 75 Taaffe Place Brooklyn, NY 11205</span>
                </div>

                {/* WhatsApp CTA card */}
                <div className="mt-6 rounded-2xl bg-emerald-400/10 ring-1 ring-emerald-300/30 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-emerald-100">Prefer WhatsApp?</div>
                      <div className="mt-0.5 text-xs text-emerald-200/90">
                        Chat with us instantly on WhatsApp. We reply fast.
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${WHATSAPP_PHONE.replace(/\D/g, "")}?text=${encodeURIComponent("Hello QFS Team 👋")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-400"
                    >
                      Open WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Contact Form */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                Get in Touch
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Reach out to learn more about the Quantum Financial System, asset transition, 
                or partnership opportunities with QFS Worldwide.
              </p>

              {status === "success" && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Thank you! Your message has been received.
                </div>
              )}
              {status === "error" && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Something went wrong. Please try again later.
                </div>
              )}

              <form id="contact-form" onSubmit={handleSubmit} className="mt-6 space-y-5">
                <FloatInput id="name" name="name" label="Full name" placeholder="John Doe" error={errors.name} />
                <FloatInput id="email" name="email" type="email" label="Email" placeholder="you@example.com" error={errors.email} />
                <FloatInput id="subject" name="subject" label="Subject" placeholder="Investment or inquiry" />
                <FloatTextarea id="message" name="message" label="Message" rows={5} placeholder="Your message..." error={errors.message} />

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>

                  <button
                    type="button"
                    onClick={openWhatsAppFromForm}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
                    title="Open WhatsApp with your message"
                  >
                    Message on WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Floating Inputs (same as before) */
function FloatInput({ id, name, label, placeholder = "", type = "text", error }) {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        placeholder=" "
        className={`peer block w-full rounded-xl bg-white/90 px-3.5 pt-5 pb-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ${error ? "ring-red-300 focus:ring-red-400" : "ring-slate-300 focus:ring-blue-500"} outline-none transition placeholder-transparent`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-2.5 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function FloatTextarea({ id, name, label, rows = 4, placeholder = "", error }) {
  return (
    <div className="relative">
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder=" "
        className={`peer block w-full rounded-xl bg-white/90 px-3.5 pt-5 pb-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ${error ? "ring-red-300 focus:ring-red-400" : "ring-slate-300 focus:ring-blue-500"} outline-none transition placeholder-transparent`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-2.5 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
