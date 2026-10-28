# AURA Estates — Luxury Property & Real Estate Platform

Full-stack Indian luxury property and real estate selling & leasing platform structured into dedicated `client` (React + Vite + Tailwind CSS) and `server` (Node.js + Express + MongoDB) directories within a single repository.

## Repository Structure

```text
├── client/                  # Frontend Application (React 19, TypeScript, Tailwind CSS, Vite)
│   ├── src/
│   │   ├── components/      # UI Components (Hero, PropertyCard, DetailModal, FilterBar, EMI Calc, Map)
│   │   ├── types/           # TypeScript interfaces for Properties, Inquiries, Tours
│   │   ├── utils/           # Indian Rupee (₹ Cr / Lakh) currency formatters
│   │   ├── App.tsx          # Main frontend application view
│   │   ├── main.tsx         # React DOM entry point
│   │   └── index.css        # Global Tailwind CSS styles
│   ├── index.html           # Standalone frontend HTML entry
│   ├── package.json         # Frontend dependencies & scripts
│   ├── tsconfig.json        # Frontend TypeScript configuration
│   └── vite.config.ts       # Frontend Vite configuration with /api proxy
│
├── server/                  # Backend Application (Node.js, Express, MongoDB)
│   ├── data/                # Persistent JSON document store fallback
│   ├── index.ts             # Express API server (/api/properties, /api/inquiries, /api/tours)
│   ├── db.ts                # MongoDB client & 19 curated Indian luxury properties seed store
│   ├── .env.example         # Backend environment variables template
│   ├── package.json         # Backend dependencies & scripts
│   └── tsconfig.json        # Backend TypeScript configuration
│
├── index.html               # Root HTML entry point
├── server.ts                # Root server entry point (delegates to ./server/index.ts)
├── package.json             # Monorepo root scripts & shared dependencies
└── vite.config.ts           # Root Vite build configuration
```

## Running the Project

### 1. Unified Full-Stack Development (Root)
```bash
npm install
npm run dev
```

### 2. Running `client` and `server` Independently
- **Backend (`/server`)**:
  ```bash
  cd server
  npm install
  npm run dev
  ```
- **Frontend (`/client`)**:
  ```bash
  cd client
  npm install
  npm run dev
  ```
