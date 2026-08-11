"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";

export function Hero() {
  return (
    <section id="top" className="relative">
      <div className="mx-auto max-w-3xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-medium tracking-tight sm:text-5xl"
          style={{ color: "var(--text-primary)" }}
        >
          A static rule catches{" "}
          <span style={{ color: "var(--danger)" }}>0.6%</span> of this fraud.
          <br />A model catches <span style={{ color: "var(--safe)" }}>80%</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-lg text-base sm:text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          A Random Forest model for mobile-money account-takeover fraud,
          benchmarked live against the flat-threshold rule most platforms
          still run.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="#demo"
            className="rounded-md px-5 py-2.5 text-sm font-medium transition-transform active:scale-[0.98]"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Try the live demo →
          </a>
          <a href="#results" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            See the full results
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-wrap gap-x-10 gap-y-6 border-t pt-8"
          style={{ borderColor: "var(--border)" }}
        >
          {[
            { label: "Static rule recall", value: 0.56, decimals: 2, suffix: "%", tone: "danger" as const },
            { label: "Model recall", value: 80.0, decimals: 1, suffix: "%", tone: "safe" as const },
            { label: "Model precision", value: 96.0, decimals: 1, suffix: "%", tone: "safe" as const },
            { label: "Model AUC", value: 0.9996, decimals: 4, suffix: "", tone: "accent" as const },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                className="text-2xl font-medium sm:text-3xl"
                style={{
                  color:
                    stat.tone === "danger" ? "var(--danger)" : stat.tone === "safe" ? "var(--safe)" : "var(--accent)",
                }}
              >
                <AnimatedNumber value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
