export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-10 font-mono-tab text-xs sm:flex-row sm:items-center sm:justify-between">
        <p style={{ color: "var(--text-muted)" }}>axel benedetti · fastapi · scikit-learn · next.js</p>
        <div className="flex gap-5">
          <a
            href="https://github.com/axelbenedetti26/fraud-detection-api"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--text-secondary)" }}
          >
            source
          </a>
          <a
            href="https://fraud-detection-api-opiv.onrender.com/docs"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--text-secondary)" }}
          >
            api docs
          </a>
        </div>
      </div>
    </footer>
  );
}
