"use client";

import { Reveal } from "./Reveal";

export function NarrativeSection() {
  return (
    <section className="border-y" style={{ borderColor: "var(--border)", background: "var(--bg-sunken)" }}>
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <div className="mb-1 font-mono-tab text-xs" style={{ color: "var(--text-muted)" }}>
            context
          </div>
          <h2 className="text-2xl font-medium sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            Account takeover doesn&apos;t look like an outlier
          </h2>
        </Reveal>

        <Reveal
          delay={0.08}
          className="mt-5 space-y-4 text-sm leading-relaxed sm:text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          <p>
            An attacker compromises a mobile money account — phishing, SIM swap, credential
            stuffing — and drains it in one transfer to a &quot;mule&quot; account with little
            history on the platform.
          </p>
          <p>
            Many platforms still guard against this with a static rule: flag any transfer
            above a fixed amount. Cheap, and easy to explain to a regulator. Also nearly
            blind to this pattern — attackers drain whatever the victim has, which usually
            looks like an ordinary transfer, not a whale transaction.
          </p>
          <p style={{ color: "var(--text-primary)" }}>This project quantifies that gap.</p>
        </Reveal>
      </div>
    </section>
  );
}
