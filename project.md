# UZ CS2 Boost - Project Overview & Technical Documentation

## 1. Project Description
UZ CS2 Boost is a premium web application and platform designed for Counter-Strike 2 (CS2) players, specifically tailored for the Uzbekistan community (but supporting English and Russian). The platform provides tools for performance diagnostics (jitter, network latency), training servers, community hubs, a skins catalog, and an academy for skill improvement. The application features a high-end, responsive, gaming-oriented UI with dark aesthetics, sleek animations, and procedural sonic feedback that mimics CS2 in-game sounds.

## 2. Tech Stack & Architecture
- **Framework:** Next.js (App Router) with React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion (for complex layout animations and page transitions)
- **Backend & Database:** Convex (Serverless real-time database, cloud functions, and backend)
- **Authentication:** `@convex-dev/auth` (Email/Password implemented; Steam and FACEIT integrations planned/stubbed)
- **Internationalization (i18n):** `next-intl` (Supported locales: `en`, `uz`, `ru`)
- **Deployment:** Vercel (Frontend & Serverless API bridging), Convex Cloud (Database & Backend logic)
- **Future Game Infrastructure:** Kamatera VPS (4 vCPU, 8GB RAM, 150GB SSD) destined to host CS2 Dedicated Servers and FastDL (via Cloudflare) for up to 10,000 custom skins.

## 3. Project Structure
The project follows standard Next.js App Router conventions with internationalization middleware:

- `/src/app/[locale]/`: The main application routes, internationalized.
  - `page.tsx`: Landing page with dynamic hero, features, stats, and CTA.
  - `auth/`: Authentication flow (Login/Signup).
  - `dashboard/`: User "Command Center" dashboard.
  - `jitter-diagnostic/` & `advanced-diagnostics/`: Network and performance testing tools for CS2 connection.
  - `skins/`, `training/`, `community/`, `academy/`: Placeholder/stubbed feature pages.
  - `profile/`: User profile management.
- `/src/components/`: Reusable React components.
  - `AuthProvider.tsx`: Wraps Convex auth, handles `useAuth` hook and redirects.
  - `ConvexClientProvider.tsx`: Initializes the Convex client connection.
  - `AudioProvider.tsx`: Web Audio API implementation for procedural CS2-like UI sound effects.
  - `Navigation.tsx`, `Sidebar.tsx`, `LanguageToggle.tsx`: Core shell components.
- `/messages/`: JSON dictionaries for `next-intl` translations (`en.json`, `uz.json`, `ru.json`).
- `/convex/`: Convex backend configuration and API endpoints.
  - `auth.ts`: Providers setup (`Password` enabled).
  - `auth.config.ts`: Internal auth config routing to `CONVEX_SITE_URL`.
  - `users.ts`: User-related queries and mutations.

## 4. Current State & Recent Fixes
- **Authentication:** Fully migrated to `@convex-dev/auth`. Fixed issues with legacy `useConvexAuth` conflicts and resolved `JWKS` & `JWT_PRIVATE_KEY` formatting errors (now using proper RSA RS256 keys).
- **Protected Routes:** Pages like `/dashboard`, `/profile`, `/training` are protected. They properly handle `isLoading` states from Convex auth before redirecting unauthenticated users to the `/auth` page.
- **Landing Page:** Publicly accessible, dynamically redirects logged-in users to `/dashboard` only after auth state is fully loaded.
- **Audio System:** Implemented a fully procedural Web Audio API system in `AudioProvider.tsx` that synthesizes CS2 sound cues (UI clicks, weapon reloads, headshot "dinks", win motifs, dry fires) to avoid large media payloads.

## 5. Upcoming Milestones & Roadmap
For any AI Agent picking up this project, these are the primary objectives:
1. **Kamatera Server Integration:** Setup the 8GB RAM / 150GB SSD Kamatera server to host the actual CS2 Dedicated Server instances. This includes configuring SteamCMD, SourceMod/MetaMod, and setting up the FastDL server behind Cloudflare for skin distribution without blowing out bandwidth.
2. **Skin Catalog Logic:** Implement the `/skins` page. Fetch metadata from Convex, but ensure high-res assets are served via the Cloudflare-backed Kamatera node.
3. **Steam & FACEIT Authentication:** Complete the OAuth implementation for Steam and FACEIT in `@convex-dev/auth` so users can link their CS2 personas.
4. **Dashboard Stats:** Connect live CS2 stats (likely via Faceit API or Steam API) into the user dashboard (`/dashboard` and `/profile`).
5. **Training Rooms:** Build the logic in `/training` to spin up or allocate instances on the Kamatera server via SSH commands or a container orchestration API.

## 6. Development Guidelines
- Always use **Vercel** for frontend previews/production deployments.
- Always use `npx convex deploy` or `npm run dev` (which runs `convex dev`) to keep the schema and backend functions in sync.
- **Do not mix** `useConvexAuth` from `convex/react` with `@convex-dev/auth/react` — strictly use `@convex-dev/auth` for user session state.
- Keep the `en`, `uz`, and `ru` JSON dictionaries in sync whenever adding new static text to the UI.
- Preserve the high-quality dark gaming aesthetic (Tailwind) and use Framer Motion for mounting/unmounting animations.
