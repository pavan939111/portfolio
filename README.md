# AGENT.OS - Agentic AI Engineer Portfolio Web Application

A full-stack, premium, high-fidelity portfolio console built from scratch. Visitors can semantically search profile assets, interact with an autonomous chat guide showing live reasoning traces, and monitor agent cost, latency, and tool footprints via an interactive telemetry dashboard.

---

## 🛠 Tech Stack

- **Frontend**: React (v18+) + Vite + TypeScript + Tailwind CSS (v3) + Recharts + Framer Motion
- **Backend**: Node.js + Express + TypeScript + Zod
- **AI Stack**: Anthropic Claude-3.5-Sonnet + Voyage AI (`voyage-3` embeddings)
- **Database**: Supabase (PostgreSQL + `pgvector` semantic matching)
- **Package Manager**: npm

---

## 📂 Project Structure

```
portfolio/
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # UI components (Terminal, AgentChat, Navbar)
│   │   ├── pages/          # Page layouts (Home, Projects, Playground, Dashboard)
│   │   ├── services/       # Express API handlers
│   │   ├── data/           # Static fallback portfolio data
│   │   ├── types/          # TypeScript interface contracts
│   │   └── main.tsx        # Entry point
│   ├── vite.config.ts      # Vite proxy & build configuration
│   ├── tailwind.config.js  # Theme, fonts & cyan color customizations
│   └── package.json
├── backend/                # Express API
│   ├── src/
│   │   ├── config/         # Supabase & Env parsers
│   │   ├── services/       # Embeddings, Claude APIs & Agent loops
│   │   ├── routes/         # Controllers for chat, telemetry, and projects
│   │   └── index.ts        # Main server code
│   ├── schema.sql          # Supabase pgvector schema and matches
│   └── package.json
└── README.md
```

---

## 🚀 Setup & Execution

### 1. Database Configuration (Supabase)
1. Go to your **Supabase Workspace** -> **Database** -> **SQL Editor**.
2. Copy the contents of [`backend/schema.sql`](file:///c:/Users/mahip/OneDrive/Desktop/pk/portfolio/backend/schema.sql) and execute the query.
   - This script enables the `vector` extension, creates tables for portfolio items, agent runs telemetry, and embeds the `match_embeddings` pgvector search function.

### 2. Backend Environment Config
1. Navigate to the backend directory:
   ```bash
   cd portfolio/backend
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your credentials:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-supabase-url.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   VOYAGE_API_KEY=your-voyage-api-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```
   *Note: If credentials are not set, the backend will automatically enter **Mock Mode**, allowing you to browse the application with simulated data and local retrieval indices.*

4. Install backend dependencies and run the server:
   ```bash
   npm install
   npm run dev
   ```
   The backend API will start running on `http://localhost:5000`.

### 3. Frontend App Config
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite local dev server:
   ```bash
   npm run dev
   ```
   The Vite interface will start running on `http://localhost:5173`. 
   Vite is configured with a proxy redirection: any request starting with `/api` is routed to the Express server at `http://localhost:5000`.

---

## 📊 Features & Walkthrough

1. **Core Console (Home)**: Displays system health telemetry (latency, embeddings count, validation metrics) and embeds an interactive Command Line interface.
2. **Developer Terminal**: Type commands directly (e.g. `help`, `skills`, `projects`, `about`). Run `agent run <task>` to see real-time reasoning logs fetched from backend database queries.
3. **Agent Playground**: Connect to the live RAG chat loop. View collapsible developer thought steps logs (Embedding Vectorization ➜ pgvector similarity matching ➜ Context Synthesis ➜ Claude response output).
4. **Telemetry Dashboard**: Dynamic graphs showing daily visitor API requests, latency benchmarks, token metrics, cost outputs, and pie charts illustrating active tool usages.
