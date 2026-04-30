# Sugar Journal — Frontend

React + Vite frontend for the Sugar Journal AI API.

**Backend:** https://fastapi-tv77.onrender.com

## Quick start

\```bash
npm install
npm run dev
\```

Open http://localhost:5173

## Features

- Journal list with search, activity filter, tag filter, pagination
- Entry detail with full metadata
- AI reflection panel on each entry
- Wired to the live Render backend

## Config

\```bash
cp .env.example .env.local
# Edit VITE_API_URL if pointing to a different backend
\```

## Build

\```bash
npm run build   # outputs to dist/
\```