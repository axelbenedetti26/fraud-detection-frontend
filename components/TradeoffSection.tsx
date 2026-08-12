"use client";

import { useEffect, useMemo, useState } from "react";
import { Reveal } from "./Reveal";
import { fetchModelInfo, ModelInfo } from "@/lib/api";

const FALLBACK_CURVE = [
  { threshold: 0.05, recall: 0.9944, precision: 0.4625 },
  { threshold: 0.3, recall: 0.9278, precision: 0.8653 },
  { threshold: 0.5, recall: 0.8, precision: 0.96 },
  { threshold: 0.7, recall: 0.6111, precision: 0.991 },
  { threshold: 0.95, recall: 0.2056, precision: 1.0 },
];

const FALLBACK_DOLLARS = {
  test_set_fraud_total_usd: 4499243.8,
  model_caught_usd: 3416567.81,
  model_missed_usd: 1082675.99,
  rule_caught_usd: 0,
  rule_missed_usd: 4499243.8,
};

function fmtUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function DollarBar({ label, caught, total }: { label: string; caught: number; total: number }) {
  const pct = total > 0 ? (caught / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="font-mono-tab" style={{ color: "var(--text-primary)" }}>
          {fmtUsd(caught)} <span style={{ color: "var(--text-muted)" }}>of {fmtUsd(total)}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden" style={{ background: "var(--danger-soft)" }}>
        <div
          className="h-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, background: "var(--safe)" }}
        />
      </div>
    </div>
  );
}

export function TradeoffSection() {
  const [info, setInfo] = useState<ModelInfo | null>(null);
  const [threshold, setThreshold] = useState(0.5);

  useEffect(() => {
    fetchModelInfo().then(setInfo).catch(() => {});
  }, []);

  const curve = info?.threshold_curve ?? FALLBACK_CURVE;
  const dollars = info?.dollar_impact ?? FALLBACK_DOLLARS;

  const point = useMemo(() => {
    return curve.reduce((closest, p) =>
      Math.abs(p.threshold - threshold) < Math.abs(closest.threshold - threshold) ? p : closest
    , curve[0]);
  }, [curve, threshold]);

  const lean = threshold <= 0.3 ? "catch" : threshold >= 0.7 ? "precise" : "balanced";

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <div className="mb-1 font-mono-tab text-xs" style={{ color: "var(--text-muted)" }}>
          threshold_curve
        </div>
        <h2 className="text-2xl font-medium sm:text-3xl" style={{ color: "var(--text-primary)" }}>
          0.5 is a choice, not a law
        </h2>
        <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
          Every score above gets compared to a cutoff to decide "flag it or not." Move it and
          watch what you trade away.
        </p>
      </Reveal>

      <Reveal delay={0.08} className="mt-8">
        <div className="flex items-baseline justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <span>catches more fraud</span>
          <span>fewer false alarms</span>
        </div>
        <input
          type="range"
          min={0.05}
          max={0.95}
          step={0.05}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="mt-2 w-full"
        />
        <div className="mt-1 text-center font-mono-tab text-xs" style={{ color: "var(--text-secondary)" }}>
          cutoff = {threshold.toFixed(2)}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <div className="text-2xl font-medium font-mono-tab" style={{ color: "var(--safe)" }}>
              {(point.recall * 100).toFixed(0)}%
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              of real fraud gets caught
            </div>
          </div>
          <div>
            <div className="text-2xl font-medium font-mono-tab" style={{ color: "var(--accent)" }}>
              {(point.precision * 100).toFixed(0)}%
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              of those alerts are correct
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {lean === "catch" &&
            "At this cutoff the model flags aggressively — it catches nearly everything, but a lot of legitimate transactions get caught up too."}
          {lean === "balanced" &&
            "This is the middle ground: strong fraud coverage without drowning the team in false alarms. 0.5 sits near here."}
          {lean === "precise" &&
            "At this cutoff the model only flags when it's very sure — almost every alert is real fraud, but more fraud slips through."}
        </p>
      </Reveal>

      <Reveal delay={0.14} className="mt-14">
        <div className="mb-1 font-mono-tab text-xs" style={{ color: "var(--text-muted)" }}>
          dollar_impact · same test set
        </div>
        <h3 className="text-xl font-medium" style={{ color: "var(--text-primary)" }}>
          What that means in dollars
        </h3>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Not a hypothetical — this is the real fraud value in the 15,000-transaction test
          set, and how much of it each approach actually catches, at the default 0.5 cutoff.
        </p>

        <div className="mt-6 space-y-5">
          <DollarBar
            label="Static rule"
            caught={dollars.rule_caught_usd}
            total={dollars.test_set_fraud_total_usd}
          />
          <DollarBar
            label="Model"
            caught={dollars.model_caught_usd}
            total={dollars.test_set_fraud_total_usd}
          />
        </div>
      </Reveal>
    </section>
  );
}
