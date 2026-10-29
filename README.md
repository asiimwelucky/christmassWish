# 🎄 Paradigm Institute Christmas Wishes & Interactive Skit

> **Paradigm Institute — Kagadi, Uganda**  
> *Building Bright Futures with Community, Knowledge, and Hope.*

A festive, viral Christmas greeting platform and interactive multimedia holiday skit web application crafted for **Paradigm Institute** in Kagadi, Uganda.

---

## ✨ Features

- **🎁 Personalized Christmas Wish Maker (`/create`)**
  - Create customized festive greeting cards for friends, family, students, teachers, or colleagues.
  - Optional personalized message with character counter and holiday prompt suggestions.
  - Real-time live card preview with festive ornaments, gold shimmer typography, and school insignia.

- **🌟 Interactive Christmas Skit (`/skit`)**
  - "The Light of Kagadi" — an interactive multi-scene holiday story journey.
  - Web Audio API synthesized holiday bells, chords, and chimes (zero external MP3 dependencies).
  - Interactive Tree of Blessings: tap ornaments to uncover words of wisdom and encouragement.
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
- **npm** or **pnpm**

### 2. Installation
```bash
git clone <repo-url>
cd skit
npm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
# Base site URL for sharing links
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (Optional for local development; app will use mock store if not provided)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Dashboard Secret (minimum 16 characters)
ADMIN_AUTH_SECRET=paradigm-christmas-secret-key-2024-secure
```

### 4. Database Setup (Optional for Supabase production)
Run the SQL migration script located at:
```
supabase/migrations/20241201000000_init_christmas_schema.sql
```
This sets up the `campaign_config`, `wishes`, and `analytics_events` tables along with Row Level Security (RLS) policies and the `get_analytics_summary()` RPC function.

### 5. Running the Application
```bash
# Start development server
npm run dev

# Run production build
npm run build

# Start production server
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) to view the application!

---

## 🧭 Page Routes

| Route | Description |
|---|---|
| `/` | Landing page with public counter, Christmas tree, and campaign overview |
| `/create` | Interactive Wish Creator with live card preview |
| `/wish/[token]` | Personalized Greeting Card view with WhatsApp & download actions |
| `/skit` | Interactive Christmas Skit and holiday story experience |
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

Developed for **Paradigm Institute**, Kagadi, Uganda.  
All rights reserved © 2024–2025.
