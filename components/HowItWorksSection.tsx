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

const LABELS: Record<string, string> = {
  oldbalanceDest: "Recipient balance before",
  balance_drained_ratio: "Balance drained ratio",
  amount: "Transaction amount",
  dest_txn_history: "Recipient's prior transactions",
  oldbalanceOrg: "Sender balance before",
  newbalanceOrig: "Sender balance after",
  newbalanceDest: "Recipient balance after",
  type_TRANSFER: "Type: transfer",
  hour_of_day: "Hour of day",
  type_PAYMENT: "Type: payment",
  type_CASH_OUT: "Type: cash-out",
  type_CASH_IN: "Type: cash-in",
  is_night: "Night hours (0-5am)",
  type_DEBIT: "Type: debit",
};

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
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <div className="text-xs font-mono-tab uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            How it works
          </div>
          <h2 className="mt-2 text-2xl font-medium sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            A Random Forest, 8 features, and one honest mistake
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
            <p>
              A <code className="font-mono-tab" style={{ color: "var(--text-primary)" }}>RandomForestClassifier</code>{" "}
              (300 trees) trained on transaction amount, sender/recipient balances, recipient
              transaction history, hour of day, and two engineered features — how much of the
              balance got drained, and whether it happened at night.
            </p>
            <p>
              The first version of the training data separated perfectly — AUC 1.0 on the very
              first model. That&apos;s not a win, it&apos;s a red flag: a feature was almost
              certainly leaking the label. The dataset was recalibrated so legitimate and
              fraudulent transactions genuinely overlap — some legit transactions drain most
              of a balance too, some fraud lands on older accounts — which is what makes
              80% recall an honest number instead of an artifact of an easy dataset.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)", boxShadow: "var(--shadow-card)" }}
          >
            <div className="mb-4 text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              What the model weighs most
            </div>
            <div className="space-y-3">
              {importances.map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-xs" style={{ color: "var(--text-secondary)" }}>
                    {LABELS[key] ?? key}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded" style={{ background: "var(--bg-sunken)" }}>
                    <div
                      className="h-full rounded transition-[width] duration-1000 ease-out"
                      style={{ width: `${(value / max) * 100}%`, background: "var(--accent)" }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-xs font-mono-tab" style={{ color: "var(--text-muted)" }}>
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
