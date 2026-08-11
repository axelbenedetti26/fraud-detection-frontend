"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { ScoreGauge } from "./ScoreGauge";
import { predictTransaction, TransactionInput, TxnType, PredictionResult } from "@/lib/api";

const PRESETS: { label: string; blurb: string; input: TransactionInput }[] = [
  {
    label: "Account takeover",
    blurb: "3am · full balance drain · brand-new destination",
    input: {
      type: "TRANSFER",
      amount: 45230.5,
      oldbalanceOrg: 46100,
      newbalanceOrig: 0,
      oldbalanceDest: 120,
      newbalanceDest: 45350.5,
      dest_txn_history: 1,
      hour_of_day: 3,
    },
  },
  {
    label: "Everyday payment",
    blurb: "afternoon · small spend · established recipient",
    input: {
      type: "PAYMENT",
      amount: 85.3,
      oldbalanceOrg: 3200,
      newbalanceOrig: 3114.7,
      oldbalanceDest: 15000,
      newbalanceDest: 15085.3,
      dest_txn_history: 42,
      hour_of_day: 14,
    },
  },
  {
    label: "Large legit transfer",
    blurb: "$250k · trips the static rule · not account takeover",
    input: {
      type: "TRANSFER",
      amount: 250000,
      oldbalanceOrg: 900000,
      newbalanceOrig: 650000,
      oldbalanceDest: 40000,
      newbalanceDest: 290000,
      dest_txn_history: 30,
      hour_of_day: 11,
    },
  },
];

const TXN_TYPES: TxnType[] = ["TRANSFER", "CASH_OUT", "PAYMENT", "CASH_IN", "DEBIT"];

function fieldStyle() {
  return {
    background: "var(--bg-elevated)",
    borderColor: "var(--border-strong)",
    color: "var(--text-primary)",
  };
}

export function DemoSection() {
  const [input, setInput] = useState<TransactionInput>(PRESETS[0].input);
  const [activePreset, setActivePreset] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "waking" | "error">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const derived = useMemo(() => {
    const drained = Math.max(
      0,
      Math.min(1, (input.oldbalanceOrg - input.newbalanceOrig) / (input.oldbalanceOrg + 1))
    );
    const isNight = input.hour_of_day >= 0 && input.hour_of_day <= 5;
    return { drained, isNight };
  }, [input]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);

    setStatus("loading");
    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      wakeTimerRef.current = setTimeout(() => setStatus("waking"), 3500);

      predictTransaction(input, controller.signal)
        .then((res) => {
          setResult(res);
          setStatus("idle");
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setStatus("error");
        })
        .finally(() => {
          if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
        });

      return () => controller.abort();
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const update = (patch: Partial<TransactionInput>) => setInput((prev) => ({ ...prev, ...patch }));

  return (
    <section id="demo" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <div className="mb-2 text-xs font-mono-tab uppercase tracking-wide" style={{ color: "var(--accent)" }}>
          Live demo
        </div>
        <h2 className="text-2xl font-medium sm:text-3xl" style={{ color: "var(--text-primary)" }}>
          Build a transaction, watch the model score it
        </h2>
        <p className="mt-2 max-w-2xl text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
          This calls the real deployed model — not a canned response. It's hosted on a free
          instance, so the first request can take up to a minute to wake up.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-6 flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => {
              setActivePreset(i);
              setInput(p.input);
            }}
            className="rounded-lg border px-4 py-2.5 text-left text-sm transition-colors"
            style={{
              borderColor: activePreset === i ? "var(--accent)" : "var(--border)",
              background: activePreset === i ? "var(--accent-soft)" : "var(--bg-elevated)",
              color: activePreset === i ? "var(--accent-strong)" : "var(--text-primary)",
            }}
          >
            <div className="font-medium">{p.label}</div>
            <div className="mt-0.5 text-xs font-mono-tab" style={{ color: "var(--text-muted)" }}>
              {p.blurb}
            </div>
          </button>
        ))}
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal delay={0.1}>
          <div
            className="rounded-2xl border p-5 sm:p-6"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)", boxShadow: "var(--shadow-card)" }}
          >
            <div className="grid grid-cols-2 gap-4">
              <label className="col-span-2 sm:col-span-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                Transaction type
                <select
                  value={input.type}
                  onChange={(e) => update({ type: e.target.value as TxnType })}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  style={fieldStyle()}
                >
                  {TXN_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Amount (USD)
                <input
                  type="number"
                  value={input.amount}
                  onChange={(e) => update({ amount: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono-tab"
                  style={fieldStyle()}
                />
              </label>

              <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Sender balance before
                <input
                  type="number"
                  value={input.oldbalanceOrg}
                  onChange={(e) => update({ oldbalanceOrg: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono-tab"
                  style={fieldStyle()}
                />
              </label>

              <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Sender balance after
                <input
                  type="number"
                  value={input.newbalanceOrig}
                  onChange={(e) => update({ newbalanceOrig: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono-tab"
                  style={fieldStyle()}
                />
              </label>

              <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Recipient balance before
                <input
                  type="number"
                  value={input.oldbalanceDest}
                  onChange={(e) => update({ oldbalanceDest: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono-tab"
                  style={fieldStyle()}
                />
              </label>

              <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Recipient balance after
                <input
                  type="number"
                  value={input.newbalanceDest}
                  onChange={(e) => update({ newbalanceDest: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono-tab"
                  style={fieldStyle()}
                />
              </label>

              <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Recipient's prior transactions
                <input
                  type="number"
                  min={0}
                  value={input.dest_txn_history}
                  onChange={(e) => update({ dest_txn_history: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono-tab"
                  style={fieldStyle()}
                />
              </label>

              <label className="col-span-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                Hour of day: <span className="font-mono-tab">{String(input.hour_of_day).padStart(2, "0")}:00</span>
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={input.hour_of_day}
                  onChange={(e) => update({ hour_of_day: Number(e.target.value) })}
                  className="mt-2 w-full"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                signals the model sees ·{" "}
                <span className="font-mono-tab" style={{ color: "var(--text-secondary)" }}>
                  balance drained {(derived.drained * 100).toFixed(0)}%
                </span>{" "}
                ·{" "}
                <span className="font-mono-tab" style={{ color: "var(--text-secondary)" }}>
                  {derived.isNight ? "night hours" : "daytime"}
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            className="flex h-full flex-col items-center justify-center rounded-2xl border p-6 text-center"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)", boxShadow: "var(--shadow-card)" }}
          >
            {status === "waking" && (
              <p className="mb-3 text-xs font-mono-tab" style={{ color: "var(--warn)" }}>
                waking up the free-tier server, hang tight…
              </p>
            )}
            {status === "error" && (
              <p className="mb-3 text-xs" style={{ color: "var(--danger)" }}>
                Couldn&apos;t reach the model API. It may still be waking up — try again in a moment.
              </p>
            )}

            <div style={{ opacity: status === "loading" || status === "waking" ? 0.4 : 1, transition: "opacity 0.3s" }}>
              <ScoreGauge score={result?.fraud_score ?? 0} threshold={result?.decision_threshold ?? 0.5} />
            </div>

            <div className="mt-6 grid w-full grid-cols-2 gap-3">
              <div
                className="rounded-lg border p-3"
                style={{
                  borderColor: result?.model_flag ? "var(--danger)" : "var(--border)",
                  background: result?.model_flag ? "var(--danger-soft)" : "var(--bg-sunken)",
                }}
              >
                <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  Model
                </div>
                <div
                  className="mt-0.5 text-sm font-medium"
                  style={{ color: result?.model_flag ? "var(--danger)" : "var(--safe)" }}
                >
                  {result?.model_flag ? "Flagged" : "Clear"}
                </div>
              </div>
              <div
                className="rounded-lg border p-3"
                style={{
                  borderColor: result?.static_rule_flag ? "var(--danger)" : "var(--border)",
                  background: result?.static_rule_flag ? "var(--danger-soft)" : "var(--bg-sunken)",
                }}
              >
                <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  Static rule
                </div>
                <div
                  className="mt-0.5 text-sm font-medium"
                  style={{ color: result?.static_rule_flag ? "var(--danger)" : "var(--safe)" }}
                >
                  {result?.static_rule_flag ? "Flagged" : "Clear"}
                </div>
              </div>
            </div>

            {result && !result.flags_agree && (
              <div
                className="mt-4 rounded-lg border px-3 py-2 text-xs"
                style={{ borderColor: "var(--warn)", background: "var(--warn-soft)", color: "var(--warn)" }}
              >
                They disagree — this is usually where the interesting fraud is.
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
