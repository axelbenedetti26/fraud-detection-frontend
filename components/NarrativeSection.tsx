"use client";

import { Reveal } from "./Reveal";

export function NarrativeSection() {
  return (
    <section className="border-y" style={{ borderColor: "var(--border)", background: "var(--bg-sunken)" }}>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="text-xs font-mono-tab uppercase tracking-wide" style={{ color: "var(--accent)" }}>
              The problem
            </div>
            <h2 className="mt-2 text-2xl font-medium sm:text-3xl" style={{ color: "var(--text-primary)" }}>
              Account takeover doesn&apos;t look like an outlier.
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="space-y-4 text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
            <p>
              Mobile money platforms face a recurring pattern: an attacker compromises a
              victim&apos;s account — phishing, SIM swap, credential stuffing — and immediately
              drains the balance in one transfer or cash-out to a &quot;mule&quot; account with
              little history on the platform.
            </p>
            <p>
              Many platforms still guard against this with a static rule: flag any transfer
              above a fixed dollar amount. It&apos;s cheap and fully explainable to a
              regulator. It&apos;s also nearly blind to this fraud pattern — attackers don&apos;t
              need to move huge sums to do damage, they drain whatever the victim has, which
              usually looks like an ordinary transfer, not a whale transaction.
            </p>
            <p style={{ color: "var(--text-primary)" }}>
              This project quantifies that gap, and ships it as a working API you can query
              live above.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
