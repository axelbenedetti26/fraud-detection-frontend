"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { ScoreGauge } from "./ScoreGauge";
import { predictTransaction, TransactionInput, TxnType, PredictionResult } from "@/lib/api";

const PRESETS: { label: string; input: TransactionInput }[] = [
  {
    label: "account_takeover",
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
    label: "everyday_payment",
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
    label: "large_legit_transfer",
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
    background: "transparent",
    borderColor: "var(--border-strong)",
    color: "var(--text-primary)",
    borderRadius: "3px",
  };
}

export function DemoSection() {
  const [input, setInput] = useState<TransactionInput>(PRESETS[0].input);
  const [activePreset, setActivePreset] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "waking" | "error">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <section id="demo" className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <div className="mb-1 font-mono-tab text-xs" style={{ color: "var(--text-muted)" }}>
          POST /predict
        </div>
        <h2 className="text-2xl font-medium sm:text-3xl" style={{ color: "var(--text-primary)" }}>
          Build a transaction, watch it get scored
        </h2>
        <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
          Calls the deployed model directly. First request may take a moment on a cold server.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-6 flex flex-wrap gap-2 font-mono-tab text-xs">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => {
              setActivePreset(i);
              setInput(p.input);
            }}
            className="border px-2.5 py-1.5 transition-colors"
            style={{
              borderRadius: "3px",
              borderColor: activePreset === i ? "var(--accent)" : "var(--border-strong)",
              color: activePreset === i ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            {p.label}
          </button>
        ))}
      </Reveal>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 font-mono-tab">
            <label className="col-span-2 sm:col-span-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              type
              <select
                value={input.type}
                onChange={(e) => update({ type: e.target.value as TxnType })}
                className="mt-1.5 w-full border px-3 py-2 text-sm"
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
              amount
              <input
                type="number"
                value={input.amount}
                onChange={(e) => update({ amount: Number(e.target.value) })}
                className="mt-1.5 w-full border px-3 py-2 text-sm"
                style={fieldStyle()}
              />
            </label>

            <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
              oldbalanceOrg
              <input
                type="number"
                value={input.oldbalanceOrg}
                onChange={(e) => update({ oldbalanceOrg: Number(e.target.value) })}
                className="mt-1.5 w-full border px-3 py-2 text-sm"
                style={fieldStyle()}
              />
            </label>

            <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
              newbalanceOrig
              <input
                type="number"
                value={input.newbalanceOrig}
                onChange={(e) => update({ newbalanceOrig: Number(e.target.value) })}
                className="mt-1.5 w-full border px-3 py-2 text-sm"
                style={fieldStyle()}
              />
            </label>

            <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
              oldbalanceDest
              <input
                type="number"
                value={input.oldbalanceDest}
                onChange={(e) => update({ oldbalanceDest: Number(e.target.value) })}
                className="mt-1.5 w-full border px-3 py-2 text-sm"
                style={fieldStyle()}
              />
            </label>

            <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
              newbalanceDest
              <input
                type="number"
                value={input.newbalanceDest}
                onChange={(e) => update({ newbalanceDest: Number(e.target.value) })}
                className="mt-1.5 w-full border px-3 py-2 text-sm"
                style={fieldStyle()}
              />
            </label>

            <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
              dest_txn_history
              <input
                type="number"
                min={0}
                value={input.dest_txn_history}
                onChange={(e) => update({ dest_txn_history: Number(e.target.value) })}
                className="mt-1.5 w-full border px-3 py-2 text-sm"
                style={fieldStyle()}
              />
            </label>

            <label className="col-span-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              hour_of_day = <span style={{ color: "var(--text-primary)" }}>{String(input.hour_of_day).padStart(2, "0")}:00</span>
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
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex h-full flex-col items-center justify-center text-center">
            {status === "waking" && (
              <p className="mb-3 font-mono-tab text-xs" style={{ color: "var(--warn)" }}>
                waking server…
              </p>
            )}
            {status === "error" && (
              <p className="mb-3 font-mono-tab text-xs" style={{ color: "var(--danger)" }}>
                request failed — retry in a moment
              </p>
            )}

            <div style={{ opacity: status === "loading" || status === "waking" ? 0.4 : 1, transition: "opacity 0.3s" }}>
              <ScoreGauge score={result?.fraud_score ?? 0} threshold={result?.decision_threshold ?? 0.5} />
            </div>

            <div className="mt-6 w-full max-w-[220px] border-t font-mono-tab text-sm" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-baseline justify-between border-b py-2" style={{ borderColor: "var(--border)" }}>
                <span style={{ color: "var(--text-muted)" }}>model</span>
                <span style={{ color: result?.model_flag ? "var(--danger)" : "var(--safe)" }}>
                  {result?.model_flag ? "flagged" : "clear"}
                </span>
              </div>
              <div className="flex items-baseline justify-between py-2">
                <span style={{ color: "var(--text-muted)" }}>rule</span>
                <span style={{ color: result?.static_rule_flag ? "var(--danger)" : "var(--safe)" }}>
                  {result?.static_rule_flag ? "flagged" : "clear"}
                </span>
              </div>
            </div>

            {result && !result.flags_agree && (
              <p className="mt-4 font-mono-tab text-xs" style={{ color: "var(--warn)" }}>
                disagreement — usually the interesting case
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
