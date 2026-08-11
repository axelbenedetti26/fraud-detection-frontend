"use client";

import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { fetchModelInfo } from "@/lib/api";

const FALLBACK_IMPORTANCES: [string, number][] = [
  ["oldbalanceDest", 0.3437],
  ["balance_drained_ratio", 0.1862],
  ["amount", 0.0969],
  ["dest_txn_history", 0.0809],
  ["oldbalanceOrg", 0.0797],
  ["newbalanceOrig", 0.0676],
];

export function HowItWorksSection() {
  const [importances, setImportances] = useState<[string, number][]>(FALLBACK_IMPORTANCES);

  useEffect(() => {
    fetchModelInfo()
      .then((info) => {
        const sorted = Object.entries(info.feature_importances).sort((a, b) => b[1] - a[1]).slice(0, 6);
        setImportances(sorted);
      })
      .catch(() => {});
  }, []);

  const max = Math.max(...importances.map(([, v]) => v));

  return (
    <section id="how-it-works" className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <div className="mb-1 font-mono-tab text-xs" style={{ color: "var(--text-muted)" }}>
          GET /model-info
        </div>
        <h2 className="text-2xl font-medium sm:text-3xl" style={{ color: "var(--text-primary)" }}>
          A Random Forest, 8 features, and one honest mistake
        </h2>
        <div className="mt-5 space-y-4 text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
          <p>
            300 trees, trained on transaction amount, sender/recipient balances, recipient
            history, hour of day, and two engineered features: how much of the balance got
            drained, and whether it happened at night.
          </p>
          <p>
            The first version of the training data separated perfectly — AUC 1.0 on the very
            first model. Not a win, a red flag: a feature was leaking the label. The dataset
            was recalibrated so legitimate and fraudulent transactions genuinely overlap,
            which is what makes 80% recall an honest number instead of an artifact of an
            easy dataset.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <div className="mb-4 font-mono-tab text-xs" style={{ color: "var(--text-muted)" }}>
          feature_importances
        </div>
        <div className="space-y-2.5">
          {importances.map(([key, value]) => (
            <div key={key} className="flex items-center gap-3 font-mono-tab text-xs">
              <span className="w-44 shrink-0 truncate" style={{ color: "var(--text-secondary)" }}>
                {key}
              </span>
              <div className="h-1.5 flex-1" style={{ background: "var(--bg-sunken)" }}>
                <div
                  className="h-full transition-[width] duration-1000 ease-out"
                  style={{ width: `${(value / max) * 100}%`, background: "var(--accent)" }}
                />
              </div>
              <span className="w-9 shrink-0 text-right" style={{ color: "var(--text-primary)" }}>
                {(value * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
