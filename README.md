# 🎄 ASMART.TEC Christmas Wishes & Interactive Skit

> **ASMART.TEC — Kagadi, Uganda**
> *Building Bright Futures with Community, Knowledge, and Hope.*

A festive Christmas greeting platform and interactive multimedia holiday skit web application by **ASMART.TEC**.

---

## ✨ Features

- **🎁 Personalized Christmas Wish Maker (`/create`)**
  - Create customized festive greeting cards for friends, family, students, teachers, or colleagues.
  - Optional personalized message with character counter and holiday prompt suggestions.
  - Real-time live card preview with festive ornaments, gold shimmer typography, and the ASMART.TEC logo.
  - Festive animations: falling snowflakes, twinkling starfield, glowing Christmas lights, and celebration confetti.

- **📲 Viral Share Engine (`/wish/[token]`)**
  - Instant one-click **WhatsApp** sharing with pre-formatted greeting message and card link.
  - **Native Web Share API** support for mobile devices (iOS / Android).
  - One-click link copying with feedback.
  - **Digital Greeting Card Downloader**: exports high-resolution PNG image cards via `html2canvas`.
  - Dynamic OpenGraph preview tags for rich link previews in messaging apps and social media.
  - Built-in viral loop passing greetings forward.

- **🔒 Privacy-First Architecture**
  - No email addresses, phone numbers, or user registrations required.
  - First-party, anonymous session telemetry with SHA-256 hashed keys.
  - 90-day automatic data retention.

- **📊 Protected Admin Analytics Console (`/admin`)**
  - Real-time campaign telemetry: Page views, wishes created, WhatsApp shares, link copies, PNG card downloads, and skit completion rates.
  - Time-range filtering (`Today`, `7 Days`, `30 Days`, `All Time`).
  - Protected by `ADMIN_AUTH_SECRET` bearer authentication and rate limiting.

- **🗄️ Resilient Backend & Database**
  - **Supabase PostgreSQL**: Full database schema migration included in `supabase/migrations/`.
  - **Zero-Setup Local Mode**: Automatically falls back to an in-memory mock data store when Supabase credentials are not configured, allowing instantaneous testing and previewing out of the box!

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** 20.x or higher
- **npm**

### 2. Install and run on Windows

Open PowerShell in the project folder:
```powershell
cd C:\path\to\skit
npm ci
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
notepad .env.local
npm run dev
```

Or use Command Prompt:
```cmd
cd /d C:\path\to\skit
npm ci
if not exist .env.local copy .env.example .env.local
notepad .env.local
npm run dev
```

The local example values use the in-memory mock store, so Supabase is optional for a local preview. Open [http://localhost:3000](http://localhost:3000).

To test a production build locally:
```bash
npm run build
npm run start
```

### 3. Production deployment on Vercel

1. Create a Supabase project for persistent production wishes and analytics.
2. In its SQL Editor, run `supabase/migrations/20241201000000_init_christmas_schema.sql`, then `supabase/migrations/20261031000000_rename_campaign_to_asmart.sql`. If the first migration was already applied, run only the second.
3. Sign in and link this folder to your Vercel project:
   ```bash
   npx vercel login
   npx vercel link
   ```
4. In the Vercel project settings, add these environment variables for **Production** (and Preview if needed):
   - `NEXT_PUBLIC_SITE_URL` — the final `https://` production domain
   - `NEXT_PUBLIC_SUPABASE_URL` — the Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the Supabase publishable/anon key
   - `SUPABASE_SERVICE_ROLE_KEY` — the Supabase service-role key; keep it private
   - `ADMIN_AUTH_SECRET` — a new, private random value (at least 32 characters)
5. Deploy:
   ```bash
   npx vercel --prod
   ```

Generate a private admin secret locally with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set it in Vercel; do not commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY`. Production needs a real Supabase project: without it, the app uses an in-memory demo store that is not persistent.

---

## 🧭 Page Routes

| Route | Description |
|---|---|
| `/` | Landing page with public counter, Christmas tree, and campaign overview |
| `/create` | Interactive Wish Creator with live card preview |
| `/wish/[token]` | Personalized Greeting Card view with WhatsApp & download actions |
| `/admin` | Protected administrative telemetry and analytics console |
| `/api/campaign` | Public endpoint for campaign status & live counter |
| `/api/wish` | API endpoint for creating and retrieving personalized wishes |
| `/api/analytics` | Privacy-friendly telemetry event ingestion |
| `/api/admin/login` | Secure admin login & authentication |
| `/api/admin/stats` | Protected telemetry aggregation endpoint |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript 5
- **UI & Styling**: React 19, Tailwind CSS 4, Lucide Icons, Framer Motion
- **Card Generation**: HTML2Canvas
- **Audio Synthesizer**: Web Audio API (Chimes, Twinkles, Celebratory chords)
- **Database & Auth**: Supabase PostgreSQL + SSR SDK / In-Memory Resilient Store

---

## 📄 License & Attribution

Built by **ASMART.TEC**.
All rights reserved.
