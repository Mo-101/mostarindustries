⚡ MoStar Industries – Frontend Command Interface

Codename: MoGrid Sovereign
Purpose: Cybernetic Intelligence Dashboard & AI Command Center
Core Stack: React + Vite + TypeScript + Tailwind + shadcn-ui

🧠 Overview

The MoStar Industries Frontend is a high-performance, cyberpunk-styled AI Intelligence Control Interface.
It powers the Mostar Grid, connecting human operators to the Assessor, Judge, and Executor microservices — all running on FastAPI with NeonDB persistence.

🏗️ Architecture Summary
Layer	Role	Technology
🧠 Mind (Assessor)	/diagnose	FastAPI + NeonDB
⚖️ Judge (Verdict Engine)	/evaluate	FastAPI + NeonDB
⚡ Body (Executor)	/signal	FastAPI Router
💾 Data Layer	Grid & Audit logs	NeonDB (PostgreSQL)
💻 UI Layer	MoStar Industries Hub	React + TypeScript + Vite
🎨 UI Kit	Components + Styling	Tailwind CSS + shadcn-ui
🧰 Tech Stack

⚛️ React 18 — core UI framework

⚡ Vite — next-gen build tool for blazing fast dev

🌀 TypeScript — type safety and code clarity

🎨 Tailwind CSS — theme & utility styling

🧩 shadcn-ui — headless component system

📊 Recharts — real-time data visualization

🎧 Web Speech API — voice input + output (ChatBot)

🔐 NeonDB — primary database for Grid signals and verdicts

💾 Database Connection

Environment variable example:

DATABASE_URL=postgresql+asyncpg://<user>:<password>@ep-round-breeze-a1coj0uq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require


The frontend does not connect directly to the database — it communicates with your FastAPI services through REST endpoints.

🚀 Getting Started (Local Development)
1️⃣ Clone the Repository
git clone https://github.com/MoStarIndustries/MoGrid-UI.git
cd MoGrid-UI

2️⃣ Install Dependencies
npm install

3️⃣ Run Development Server
npm run dev


Access the dashboard locally at:

http://localhost:5173

⚙️ Environment Variables

Create a .env file in your project root:

VITE_API_ASSESSOR=https://assessor.mostar.industries
VITE_API_JUDGE=https://judge.mostar.industries
VITE_API_EXECUTOR=https://executor.mostar.industries


If testing locally:

VITE_API_ASSESSOR=http://127.0.0.1:8080
VITE_API_JUDGE=http://127.0.0.1:8081
VITE_API_EXECUTOR=http://127.0.0.1:8082

🧩 Folder Structure
src/
├── components/
│   ├── ui/                # shadcn-ui components
│   ├── hub/               # AI Hub tabs and visuals
│   ├── ChatBot.tsx        # Voice + text interface
│   ├── Dashboard.tsx      # Real-time metrics
│   ├── Navbar.tsx         # Navigation
│   └── Footer.tsx         # Footer + links
├── pages/
│   ├── Index.tsx          # Home landing page
│   └── MostarHub.tsx      # AI Hub main page
├── services/
│   └── gridService.ts     # API interface to /diagnose, /evaluate
├── types/
│   └── grid.ts            # Type definitions
└── index.css              # Theme + effects

💻 Build & Deployment
Build for Production
npm run build

Preview Production Build
npm run preview

Recommended Deployment Platforms

Vercel

Netlify

Fly.io (for backend FastAPI services)

NeonDB (database hosting)

🔗 Key Endpoints
Service	Route	Description
Assessor	/diagnose	Analyze signals and produce verdicts
Judge	/evaluate	Evaluate verdicts and define actions
Executor	/signal	Command orchestrator
TTS	/tts	Generate audio responses for ChatBot
🕹️ Example Command Flow
> diagnose Sector7 water fever diarrhea


1️⃣ UI Command → /diagnose
2️⃣ Assessor returns ODU & verdict
3️⃣ Judge evaluates → action plan
4️⃣ Verdicts stored in NeonDB
5️⃣ Real-time update to dashboard feed

🧱 Contributing

Fork or clone this repository

Make your changes

Run npm run lint to ensure code quality

Commit and push changes

Submit a PR

🕯️ MoStar Ethos

“Truth is the flame. Transparency the wick.
Humanity the hand that holds the light.”
— Doctrine of the Clear Flame, v2.0
