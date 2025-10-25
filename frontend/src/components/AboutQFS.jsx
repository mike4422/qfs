// src/components/AboutQFS.jsx
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";

export default function AboutQFS() {
  return (
    <section className="relative py-20">
      {/* subtle section background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/40 via-white to-white" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: QFS image */}
          <div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop"
                alt="QFS enterprise infrastructure"
                className="h-[420px] w-full object-cover"
                loading="lazy"
              />
              {/* corner badge */}
              <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100 backdrop-blur">
                QFS • Enterprise
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-[11px] font-semibold text-blue-700 shadow-sm backdrop-blur">
              About QFS
            </span>

            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              The QFS Worldwide Network
            </h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              <strong>QFS</strong> stands for <strong>Q-F-S Worldwide Network</strong>—an advanced, AI-orchestrated
              financial system designed to eliminate monopolies in the monetary ecosystem. Built on secure, bank-grade
              infrastructure and intelligent automation, QFS ushers in a new era of resilient, transparent, and
              high-integrity banking.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Unlike systems swayed by shifting policies, QFS is <strong>asset-anchored</strong>—backed by tangible
              value including <strong>Gold</strong>, <strong>Platinum</strong>, and <strong>Oil</strong>—not merely
              paper claims. The result is a network that prioritizes verifiable value, security, and trust at global
              scale.
            </p>

            {/* Pillars */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Feature
                title="AI-Driven Integrity"
                desc="Autonomous checks, anomaly detection, and policy engines reinforce trust end-to-end."
              />
              <Feature
                title="Bank-Grade Infrastructure"
                desc="Hardened security, encryption at rest/in-transit, and audited controls."
              />
              <Feature
                title="Asset-Backed Stability"
                desc="Anchored by real assets (Gold • Platinum • Oil) for durable value."
              />
              <Feature
                title="Policy-Independent"
                desc="Engineered to resist manipulation and systemic monopoly."
              />
            </div>

            {/* micro stats / credibility line */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <Chip>Multi-sig approvals</Chip>
              <Chip>Immutable audit trails</Chip>
              <Chip>Global settlement</Chip>
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <NavLink
                to="/about"
                className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow"
              >
                Learn more about QFS
                <svg
                  viewBox="0 0 24 24"
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </NavLink>

              {/* <a
                href="/register"
                className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 border border-blue-200 hover:bg-blue-50 shadow-sm"
              >
                Get Started
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Small helpers for tidy JSX (unchanged) --- */
function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-700">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{desc}</div>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white/70 px-3 py-1">
      {children}
    </span>
  );
}
