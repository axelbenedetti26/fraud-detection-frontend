"use client";

import { Reveal } from "./Reveal";

const LIMITATIONS = [
  {
    title: "single fraud typology",
    body: "The model only knows account-takeover fraud — it's never seen identity fraud, first-party fraud, or merchant collusion.",
  },
  {
    title: "no velocity features",
    body: "Transactions are scored independently, with no sense of a sequence of events over time — a real blind spot for fraud rings.",
  },
  {
    title: "fixed 0.5 threshold",
    body: "A real deployment would tune this against the actual cost of false positives vs. false negatives.",
  },
  {
    title: "synthetic data",
    body: "Generated, not observed. Designed to avoid trivial separability, but still reflects assumptions rather than empirical data.",
  },
];

export function LimitationsSection() {
  return (
    <section id="limitations" className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <div className="mb-1 font-mono-tab text-xs" style={{ color: "var(--text-muted)" }}>
            scope
          </div>
          <h2 className="text-2xl font-medium sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            This is a portfolio project, not a production fraud system
          </h2>
        </Reveal>

        <div className="mt-8 border-t" style={{ borderColor: "var(--border)" }}>
          {LIMITATIONS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.04}>
              <div
                className="flex flex-col gap-1 border-b py-4 sm:flex-row sm:gap-8"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="w-52 shrink-0 font-mono-tab text-xs" style={{ color: "var(--text-secondary)" }}>
                  {item.title}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
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
