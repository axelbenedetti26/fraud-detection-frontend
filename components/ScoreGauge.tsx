"use client";

import { useEffect, useState } from "react";

export function ScoreGauge({ score, threshold = 0.5 }: { score: number; threshold?: number }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const radius = 70;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference * (1 - animated);

  const color = score >= threshold ? "var(--danger)" : score >= 0.25 ? "var(--warn)" : "var(--safe)";

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="104" viewBox="0 0 180 104">
        <path
          d="M 15 95 A 75 75 0 0 1 165 95"
          fill="none"
          stroke="var(--border)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 15 95 A 75 75 0 0 1 165 95"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1), stroke 0.4s" }}
        />
      </svg>
      <div className="-mt-10 text-3xl font-medium font-mono-tab" style={{ color }}>
        {(animated * 100).toFixed(1)}
        <span className="text-lg">%</span>
      </div>
      <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
        fraud_score
      </div>
    </div>
  );
}
