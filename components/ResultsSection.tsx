"use client";

import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { fetchModelInfo, ModelInfo } from "@/lib/api";

const FALLBACK = {
  ruleRecall: 0.0056,
  rulePrecision: 0.0126,
  modelRecall: 0.8,
  modelPrecision: 0.96,
  auc: 0.9996,
};

function Bar({ label, ruleValue, modelValue }: { label: string; ruleValue: number; modelValue: number }) {
  return (
    <div>
      <div className="mb-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {label}
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
            Rule
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "var(--bg-sunken)" }}>
            <div
              className="h-full rounded-full transition-[width] duration-1000 ease-out"
              style={{ width: `${Math.max(ruleValue * 100, 1.5)}%`, background: "var(--danger)" }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-xs font-mono-tab" style={{ color: "var(--text-secondary)" }}>
            {(ruleValue * 100).toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
            Model
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "var(--bg-sunken)" }}>
            <div
              className="h-full rounded-full transition-[width] duration-1000 ease-out"
              style={{ width: `${modelValue * 100}%`, background: "var(--safe)" }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-xs font-mono-tab" style={{ color: "var(--text-secondary)" }}>
            {(modelValue * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function ResultsSection() {
  const [info, setInfo] = useState<ModelInfo | null>(null);

  useEffect(() => {
    fetchModelInfo().then(setInfo).catch(() => {});
  }, []);

  const ruleRecall = info?.static_rule.recall ?? FALLBACK.ruleRecall;
  const rulePrecision = info?.static_rule.precision ?? FALLBACK.rulePrecision;
  const modelRecall = info?.model_metrics.recall ?? FALLBACK.modelRecall;
  const modelPrecision = info?.model_metrics.precision ?? FALLBACK.modelPrecision;
  const auc = info?.model_metrics.auc ?? FALLBACK.auc;

  return (
    <section id="results" className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <h2 className="text-2xl font-medium sm:text-3xl" style={{ color: "var(--text-primary)" }}>
          Rules react to size. Models react to behavior.
        </h2>
      </Reveal>

      <Reveal delay={0.08} className="mt-10 grid gap-8 sm:grid-cols-2">
        <Bar label="Recall — fraud actually caught" ruleValue={ruleRecall} modelValue={modelRecall} />
        <Bar label="Precision — alerts that are real fraud" ruleValue={rulePrecision} modelValue={modelPrecision} />
      </Reveal>

      <Reveal delay={0.14} className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t pt-6" style={{ borderColor: "var(--border)" }}>
        <div>
          <div className="text-xl font-medium font-mono-tab" style={{ color: "var(--accent)" }}>
            {auc.toFixed(4)}
          </div>
          <div className="mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>
            Model AUC
          </div>
        </div>
        <div>
          <div className="text-xl font-medium font-mono-tab" style={{ color: "var(--text-primary)" }}>
            {info ? `${(info.fraud_rate_test * 100).toFixed(1)}%` : "1.2%"}
          </div>
          <div className="mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>
            Fraud in test set
          </div>
        </div>
        <div>
          <div className="text-xl font-medium font-mono-tab" style={{ color: "var(--text-primary)" }}>
            {info ? `${(info.model_vs_rule_agreement_rate * 100).toFixed(1)}%` : "98.4%"}
          </div>
          <div className="mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>
            Model / rule agreement
          </div>
        </div>
      </Reveal>
    </section>
  );
}
