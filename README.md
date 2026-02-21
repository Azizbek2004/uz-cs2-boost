# UZ CS2 Boost

> Competitive edge for Counter-Strike 2 players in Uzbekistan.

A responsive, immersive web app built with **Next.js 14+** (App Router) and **Convex** for backend/database/real-time features. Enhances the CS2 experience with ping optimization, spray training, FACEIT community tools, and more.

![CS2 Inspired Dark Theme](https://img.shields.io/badge/Theme-CS2_Dark-ff6b00) ![Next.js 14+](https://img.shields.io/badge/Next.js-14+-black) ![Convex](https://img.shields.io/badge/Backend-Convex-blue) ![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8)

## Features

- **🎯 Ping Booster Hub** — Diagnose and optimize network connection to CS2 servers. GearUp Booster affiliate integration.
- **📊 Jitter Diagnostic** — Before/after jitter analysis with Recharts visualizations and actionable fix suggestions.
- **🔫 Spray Simulator** — Canvas-based spray pattern trainer for AK-47, M4A4, and M4A1-S with scoring and accuracy tracking.
- **🏆 FACEIT UZ Community** — Local leaderboards, scrim finder with Elo matching, and tournament hub with UZS prizes.
- **🎓 Esports Academy** — Free coaching sessions via IT Park Game Dev Academy partnership.
- **⭐ Premium Subscription** — $2-5/mo via Stripe for advanced analytics and premium leaderboards.
- **🔊 Audio System** — CS2-inspired procedural sounds (Web Audio API) with mute toggle.
- **📱 Responsive** — Mobile-first with bottom tab bar; desktop sidebar navigation.
- **🔒 Privacy** — GDPR-aligned privacy policy, affiliate disclosures, server-side API key storage.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router, SSR) |
| Backend/DB | Convex (serverless functions, real-time) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Payments | Stripe |
| Audio | Web Audio API |
| Icons | react-icons |
| Testing | Jest + React Testing Library |

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- Convex account ([dashboard.convex.dev](https://dashboard.convex.dev))

### Setup

```bash
# 1. Clone and install
cd cs2-skin-changer-and-more
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 3. Set up Convex
npx convex dev
# This will create your Convex deployment and generate types

# 4. Start development server (in a separate terminal)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL |
| `FACEIT_API_KEY` | FACEIT Developer API key |
| `STEAM_API_KEY` | Steam Web API key |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout with SEO
│   │   ├── client-layout.tsx   # Client providers wrapper
│   │   ├── auth/               # Sign up / Login
│   │   ├── dashboard/          # Home dashboard
│   │   ├── ping-booster/       # Ping diagnostic tool
│   │   ├── jitter-diagnostic/  # Jitter analysis
│   │   ├── spray-simulator/    # Spray pattern trainer
│   │   ├── community/          # FACEIT leaderboard/scrims/tournaments
│   │   ├── academy/            # Esports Academy
│   │   ├── profile/            # User profile & settings
│   │   └── privacy/            # Privacy policy
│   ├── components/             # Reusable components
│   │   ├── AudioProvider.tsx   # Web Audio API context
│   │   ├── AuthProvider.tsx    # Auth context
│   │   ├── ConvexClientProvider.tsx
│   │   ├── DashboardCard.tsx   # HUD-framed stat cards
│   │   ├── LeaderboardTable.tsx # Sortable leaderboard
│   │   ├── Navigation.tsx      # Sidebar + bottom tabs
│   │   ├── SprayCanvas.tsx     # Canvas spray trainer
│   │   └── VideoBackground.tsx # Animated gradient bg
│   └── lib/                    # Utility functions
├── convex/                     # Convex backend
│   ├── schema.ts               # Database schema
│   ├── users.ts                # User queries/mutations
│   ├── leaderboards.ts         # Leaderboard queries
│   ├── scrims.ts               # Scrim management
│   ├── tournaments.ts          # Tournament management
│   ├── sprayScores.ts          # Spray score tracking
│   ├── pingResults.ts          # Ping result history
│   ├── academy.ts              # Academy signups
│   ├── faceit.ts               # FACEIT API actions
│   └── stripe.ts               # Stripe checkout action
├── public/
│   ├── sw.js                   # Service worker
│   └── offline.html            # Offline fallback
├── __tests__/                  # Jest unit tests
└── .env.example                # Environment template
```

## Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables in Vercel dashboard
# Add all variables from .env.example
```

### Convex Production

```bash
npx convex deploy
```

## Monetization

- **Freemium**: Free access to basic diagnostics, spray sim, and community features
- **Premium ($3/mo)**: Advanced analytics, personalized tips, premium leaderboards, priority matching
- **Affiliates**: GearUp Booster referral commission (transparent disclosure)

## License

MIT
