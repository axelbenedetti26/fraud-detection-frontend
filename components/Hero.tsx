"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";
import { pingHealth } from "@/lib/api";

export function Hero() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "waking">("checking");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    pingHealth(controller.signal).then((ok) => {
      clearTimeout(timeout);
      if (cancelled) return;
      setApiStatus(ok ? "online" : "waking");
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-[0.4] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full"
              style={{
                background: apiStatus === "online" ? "var(--safe)" : "var(--warn)",
                animation: "pulse-dot 1.8s ease-in-out infinite",
              }}
            />
          </span>
          <span className="font-mono-tab">
            {apiStatus === "checking" && "checking model API…"}
            {apiStatus === "online" && "model API online — try it below"}
            {apiStatus === "waking" && "model API waking up (free tier, ~30s)"}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl"
          style={{ color: "var(--text-primary)" }}
        >
          A static rule catches{" "}
          <span style={{ color: "var(--danger)" }}>0.6%</span> of this fraud.
          <br />A model catches <span style={{ color: "var(--safe)" }}>80%</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-xl text-base sm:text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          A Random Forest model trained to catch mobile-money account-takeover
          fraud, benchmarked live against the flat-threshold rule a lot of
          platforms still run in production.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="#demo"
            className="rounded-md px-5 py-2.5 text-sm font-medium transition-transform active:scale-[0.98]"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Try the live demo →
          </a>
          <a
            href="#results"
            className="rounded-md border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          >
            See the full results
          </a>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:mt-20 sm:grid-cols-4">
          {[
            { label: "Static rule recall", value: 0.56, decimals: 2, suffix: "%", tone: "danger" as const },
            { label: "Model recall", value: 80.0, decimals: 1, suffix: "%", tone: "safe" as const },
            { label: "Model precision", value: 96.0, decimals: 1, suffix: "%", tone: "safe" as const },
            { label: "Model AUC", value: 0.9996, decimals: 4, suffix: "", tone: "accent" as const },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)", boxShadow: "var(--shadow-card)" }}
            >
              <div className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
              <div
                className="mt-1.5 text-2xl font-medium sm:text-3xl"
                style={{
                  color:
                    stat.tone === "danger" ? "var(--danger)" : stat.tone === "safe" ? "var(--safe)" : "var(--accent)",
                }}
              >
                <AnimatedNumber value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
