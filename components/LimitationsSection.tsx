"use client";

import { Reveal } from "./Reveal";

const LIMITATIONS = [
  {
    title: "Single fraud typology",
    body: "The model only knows account-takeover fraud. It has never seen identity fraud, first-party fraud, or merchant collusion.",
  },
  {
    title: "No velocity features",
    body: "Transactions are scored independently, with no sense of a sequence of events over time — a real blind spot for fraud rings.",
  },
  {
    title: "Fixed 0.5 decision threshold",
    body: "A real deployment would tune this against the actual cost of false positives vs. false negatives, not hardcode it.",
  },
  {
    title: "Synthetic data",
    body: "Generated, not observed. Designed to avoid trivial separability, but still reflects assumptions rather than empirical data.",
  },
];

export function LimitationsSection() {
  return (
    <section id="limitations" className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="text-xs font-mono-tab uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Limitations
          </div>
          <h2 className="mt-2 max-w-2xl text-2xl font-medium sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            This is a portfolio project, not a production fraud system
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {LIMITATIONS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div
                className="h-full rounded-xl border p-5"
                style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
              >
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {item.title}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
