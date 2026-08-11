"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { pingHealth } from "@/lib/api";

const links = [
  { href: "#demo", label: "demo" },
  { href: "#results", label: "results" },
  { href: "#how-it-works", label: "model" },
  { href: "#limitations", label: "limits" },
];

export function Nav() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "waking">("checking");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    pingHealth(controller.signal).then((ok) => {
      clearTimeout(timeout);
      setApiStatus(ok ? "online" : "waking");
    });
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg) 88%, transparent)" }}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3 font-mono-tab text-xs">
        <a href="#top" className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <span
            className="status-dot"
            style={{ background: apiStatus === "online" ? "var(--safe)" : "var(--warn)" }}
          />
          fraud-detect/v1
        </a>

        <nav className="hidden items-center gap-5 sm:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} style={{ color: "var(--text-secondary)" }}>
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com/axelbenedetti26/fraud-detection-api"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--text-secondary)" }}
          >
            github
          </a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
