"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";

const ROWS = [
  { key: "static_rule.recall", value: 0.56, decimals: 2, suffix: "%", tone: "danger" as const },
  { key: "model.recall", value: 80.0, decimals: 1, suffix: "%", tone: "safe" as const },
  { key: "model.precision", value: 96.0, decimals: 1, suffix: "%", tone: "safe" as const },
  { key: "model.auc", value: 0.9996, decimals: 4, suffix: "", tone: "accent" as const },
];

export function Hero() {
  return (
    <section id="top" className="relative">
      <div className="mx-auto max-w-3xl px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 font-mono-tab text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          account-takeover fraud model · mobile money · benchmarked live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-medium tracking-tight sm:text-5xl"
          style={{ color: "var(--text-primary)" }}
        >
          A static rule catches{" "}
          <span style={{ color: "var(--danger)" }}>0.6%</span> of this fraud.
          <br />A model catches <span style={{ color: "var(--safe)" }}>80%</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-lg text-base sm:text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          A Random Forest model for account-takeover fraud, run against the
          flat-threshold rule most platforms still ship with.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="#demo"
            className="px-5 py-2.5 text-sm font-medium transition-transform active:scale-[0.98]"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Run the live demo →
          </a>
          <a href="#results" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            See full results
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {ROWS.map((row, i) => (
            <div
              key={row.key}
              className="flex items-baseline justify-between border-b py-2.5 font-mono-tab text-sm"
              style={{ borderColor: "var(--border)" }}
            >
              <span style={{ color: "var(--text-muted)" }}>{row.key}</span>
              <span
                style={{
                  color:
                    row.tone === "danger" ? "var(--danger)" : row.tone === "safe" ? "var(--safe)" : "var(--accent)",
                }}
              >
                <AnimatedNumber value={row.value} decimals={row.decimals} suffix={row.suffix} duration={1000 + i * 150} />
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
