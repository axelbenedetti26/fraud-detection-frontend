# Fraud Detection API — portfolio frontend

Next.js + Tailwind frontend for the [Fraud Detection API](https://github.com/axelbenedetti26/fraud-detection-api).
Live demo calls the deployed FastAPI backend on Render in real time — nothing here is
pre-canned.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-variable based theming, light/dark switch)
- Framer Motion for scroll reveals and animated stats

## Running locally

```bash
npm install
npm run dev
```

Set the backend URL in `.env.local` (see `.env.example`):

```
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
```

## Deploying

Deploy on [Vercel](https://vercel.com) — connect this repo, set the
`NEXT_PUBLIC_API_URL` environment variable to your deployed backend, and deploy.
No other configuration needed.
