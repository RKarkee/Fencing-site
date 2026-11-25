# Saltbush Fencing Co. — website prototype

A modular Next.js prototype for a WA fencing contractor: JSON-driven pages, a single source of truth for pricing, a fence price calculator, online booking, and an AI chat assistant that answers questions and books free measures.

> All business details (name, ABN, phone numbers, addresses, reviews, team) are **fictional demo data**. Phone numbers use the ACMA-reserved `(08) 5550 xxxx` range for fiction. Photos are loaded from Unsplash (free licence) and fall back to a branded placeholder when offline.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — the chat works without a key in demo mode
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build && npm start` | Production build |
| `npm run lint` | ESLint |

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · Zod 4 · TanStack Query · React Hook Form · Vercel AI SDK v7 (`ai`, `@ai-sdk/react`, `@ai-sdk/anthropic`) · Lucide icons · Fontsource (Inter, Bricolage Grotesque).

## Architecture

```
JSON (src/data) ──► Zod schemas ──► Repository interface ──► Server Components / Route Handlers
                                       ▲
                     json repo (now) ──┘└── api repo (DATA_SOURCE=api)
```

- **Components never import JSON.** They call `content.getServices()`, `content.getPricing()` etc. from `src/lib/data`.
- **Every JSON file is validated with Zod at build time** — a typo fails the build with a readable error.
- **Switch to a real backend** by setting `DATA_SOURCE=api` and `CONTENT_API_URL`. `src/lib/data/repositories/api/content.repository.ts` expects endpoints (`/site`, `/services`, `/pricing`, `/pages/:slug`, …) that return the same shapes as the JSON files.

### Folder structure

```
src/
├── app/                      # Routes only — thin pages that compose sections & features
│   ├── api/chat              # AI assistant (streaming, tool calling, demo mode)
│   ├── api/bookings          # POST booking
│   ├── api/availability      # GET measure slots
│   ├── api/enquiries         # POST enquiry
│   ├── services/[slug]  locations/[slug]  projects/[slug]
│   ├── calculator  book  contact  about  faqs
│   └── sitemap.ts  robots.ts
├── data/                     # ← all dummy content (edit these!)
│   ├── site.json  navigation.json  services.json  pricing.json
│   ├── locations.json  reviews.json  projects.json  faqs.json  team.json
│   └── pages/*.json          # page layouts as lists of sections
├── sections/                 # Page-builder blocks + registry.tsx + section-renderer.tsx
├── features/
│   ├── chat/                 # components/, hooks/, server/ (tools, system prompt, demo agent, model)
│   ├── booking/              # form, slot picker, React Query hooks, API client
│   ├── calculator/           # calculator UI + useFenceEstimate hook
│   ├── enquiry/  services/  projects/  reviews/  faq/
├── components/               # layout (header, footer, logo) + ui primitives
├── lib/
│   ├── schemas/              # Zod schemas = the single source of types
│   ├── data/                 # repositories (json / api / memory) + `content` entry point
│   ├── pricing/estimate.ts   # shared price maths (calculator, chatbot, teaser)
│   ├── booking/              # availability + booking service
│   └── seo/                  # metadata + JSON-LD builders
└── providers/                # React Query + chat provider
```

### Modular pages

Pages are JSON lists of sections:

```json
{ "type": "service-grid", "eyebrow": "What we build", "heading": "Fencing for every block", "showPrices": true }
```

To add a new section type:
1. Add its schema to `src/lib/schemas/page.ts`
2. Build the component in `src/sections/`
3. Register it in `src/sections/registry.tsx` (TypeScript errors until you do)

### One source of truth for prices

`src/data/pricing.json` holds every price, labelled `installed` vs `supply-only`, with unit (`lm` / `each`), GST flag, inclusions and exclusions. Service cards, service pages, the calculator and the chatbot all read it through `lib/pricing/estimate.ts`, so prices can never disagree across the site.

## AI chat assistant

- **With `ANTHROPIC_API_KEY`:** `streamText` with typed tools — `getServiceInfo`, `estimatePrice`, `checkAvailability`, `showBookingForm`, `createEnquiry`, `handoffToHuman`. The system prompt is generated from the same JSON the site renders.
- **Without a key:** a rule-based demo agent (`features/chat/server/demo-agent.ts`) speaks the same message protocol, so the UI behaves identically — handy for demos and teaching.
- **Booking flow:** the model calls `showBookingForm` (no server `execute`). The browser renders an interactive card (React Hook Form + Zod + live slot picker), posts to `/api/bookings`, then returns the result with `addToolOutput` and the assistant confirms. A booking only exists after the API succeeds — the model can't "pretend" to book.
- **Guardrails:** rate limiting, message length limits, abandoned booking cards auto-closed, prompt scoped to fencing topics, no payment details.
- **Swap provider:** edit `src/features/chat/server/model.ts` only.

## Going to production

| Prototype | Production swap |
|---|---|
| `memory` booking repository (resets on restart) | Postgres / Supabase / ServiceM8 API — implement `BookingRepository` |
| Generated availability | Calendar or ServiceM8 schedule lookup in `lib/booking/availability.ts` |
| In-memory rate limiter | Upstash Redis |
| Unsplash demo photos via `<img>` | Real job photos in a CDN + `next/image` in `components/ui/smart-image.tsx` |
| JSON content | Headless CMS (Sanity / Payload) via the `api` repository |

Also add: SMS/email notifications on booking, analytics events for chat & bookings, and an admin view of bookings.
