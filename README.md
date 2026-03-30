# Trailmap — Marketing Platform for Financial Advisors

A premium, fully-functional Next.js frontend prototype for event-driven marketing campaigns.

## Features

### Core Pages
- **Dashboard** — KPI cards, upcoming events, recent orders, pending approvals table, quick actions
- **Campaigns** — Filterable grid with search, status badges, budget progress bars
- **Campaign Detail** — Tabbed view (Overview, Confirmation, Settings, Links) with editable forms
- **Orders** — Searchable table (desktop) / card list (mobile) with full status lifecycle
- **Order Detail** — Visual status stepper, role-based action buttons, detailed info
- **New Order Wizard** — 5-step guided flow with progress bar, validation, event type cards, targeting profiles
- **Reporting** — Interactive Recharts charts, KPI summaries, channel & campaign performance tables, CSV export
- **Notifications** — Categorized feed (Unread/Read/Archived) with type-colored icons, relative timestamps
- **Profiles & Preferences** — 4 tabs (Contacts, Personas, Targeting, Communication) with editable cards

### Polish
- Dark/Light mode toggle (via next-themes)
- Role-based demo switcher (Client / Internal / Admin) — changes visible actions
- Toast notifications on every action (via Sonner)
- Loading skeletons on all pages
- Empty states with icons
- Responsive design — sidebar collapses on mobile
- Persistent state via Zustand + localStorage
- Status lifecycle: Draft -> Submitted -> Under Review -> Approved -> In Progress -> Completed

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4** (CSS-based config)
- **Radix UI** primitives (shadcn-style components)
- **Lucide React** icons
- **Recharts** for charts
- **Zustand** for state management (with localStorage persistence)
- **Sonner** for toast notifications
- **next-themes** for dark mode
- **date-fns** for date formatting

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── campaigns/         # Campaign list + [id] detail
│   ├── orders/            # Order list + [id] detail
│   ├── new-order/         # Multi-step wizard
│   ├── reporting/         # Charts & tables
│   ├── notifications/     # Notification feed
│   └── profiles/          # Profiles & preferences
├── components/
│   ├── ui/                # Reusable UI components (shadcn-style)
│   ├── layout/            # Sidebar, TopBar, AppShell
│   └── providers.tsx      # Theme + Toast providers
└── lib/
    ├── mock-data.ts       # All mock data
    ├── store.ts           # Zustand store
    ├── types.ts           # TypeScript types
    └── utils.ts           # Utility functions
```
