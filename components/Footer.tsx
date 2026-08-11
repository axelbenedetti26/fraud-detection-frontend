export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p style={{ color: "var(--text-muted)" }}>
          Built by Axel Benedetti — FastAPI, scikit-learn, Next.js.
        </p>
        <div className="flex gap-5">
          <a
            href="https://github.com/axelbenedetti26/fraud-detection-api"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--text-secondary)" }}
          >
            Source on GitHub
          </a>
          <a
            href="https://fraud-detection-api-opiv.onrender.com/docs"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--text-secondary)" }}
          >
            API docs
          </a>
        </div>
      </div>
    </footer>
  );
}
