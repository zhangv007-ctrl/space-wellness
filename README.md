# Space Wellness Studio — Management System

A full-stack Pilates studio management system built with **Next.js 15**, **Supabase**, and **next-intl** (English / 中文).

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Styling | Custom CSS (no Tailwind needed) |
| i18n | next-intl — `/en/*` and `/zh/*` routes |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Email | Resend |
| SMS | Twilio (optional) |
| Deploy | Vercel (free tier) |

---

## Quick Start

### 1. Clone and install
```bash
git clone https://github.com/yourname/space-wellness.git
cd space-wellness
npm install
```

### 2. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste and run `space_wellness_schema.sql`
3. Copy your Project URL and anon key from **Settings → API**

### 3. Configure environment
```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, etc.
```

### 4. Run locally
```bash
npm run dev
# Open http://localhost:3000 → redirects to /en/dashboard
```

### 5. Deploy to Vercel
```bash
npx vercel
# Add your env vars in Vercel Dashboard → Settings → Environment Variables
```

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/              ← i18n routes (/en/* and /zh/*)
│   │   ├── layout.tsx         ← Topbar + Sidebar shell
│   │   ├── dashboard/         ← Admin overview
│   │   ├── clients/           ← Client management
│   │   ├── classes/           ← Class management + waitlist
│   │   ├── spaces/            ← Space/zone management
│   │   ├── bookings/          ← All bookings view
│   │   ├── book-class/        ← Client booking portal
│   │   ├── my-schedule/       ← Client's own bookings
│   │   └── rent-space/        ← Teacher space rental
│   └── api/
│       ├── bookings/          ← Booking CRUD + waitlist logic
│       ├── classes/           ← Class CRUD
│       └── rentals/           ← Space rental CRUD
├── components/
│   ├── layout/
│   │   ├── Topbar.tsx         ← Header with language switcher
│   │   └── Sidebar.tsx        ← Navigation
│   └── ui/
│       └── LanguageSwitcher.tsx
├── i18n/
│   ├── routing.ts             ← Locale config
│   └── request.ts             ← Server-side message loading
├── lib/supabase/
│   ├── client.ts              ← Browser client
│   └── server.ts              ← Server component client
└── types/index.ts             ← TypeScript types

messages/
├── en.json                    ← English strings
└── zh.json                    ← 中文字串

supabase/functions/
└── send-notification/
    └── index.ts               ← Edge Function: email + SMS
```

---

## Deploy the Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref your-project-ref

# Set secrets
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set STUDIO_EMAIL=hello@spacewellness.ca
supabase secrets set TWILIO_ACCOUNT_SID=ACxxx   # optional
supabase secrets set TWILIO_AUTH_TOKEN=xxx        # optional
supabase secrets set TWILIO_FROM_NUMBER=+1xxx     # optional

# Deploy
supabase functions deploy send-notification
```

---

## Language Switching

URLs are locale-prefixed:
- `https://spacewellness.ca/en/dashboard` — English
- `https://spacewellness.ca/zh/dashboard` — 中文

The language switcher in the top bar swaps the locale segment in the URL. The `middleware.ts` handles detection and redirection. All strings live in `messages/en.json` and `messages/zh.json`.

To add a language (e.g. French), add `'fr'` to `routing.ts` locales and create `messages/fr.json`.

---

## Role Permissions (Summary)

| Feature | Admin | Teacher | Client |
|---------|-------|---------|--------|
| View dashboard | ✓ | — | — |
| Manage clients | ✓ | — | — |
| Create/edit classes | ✓ | — | — |
| Manage spaces | ✓ | — | — |
| View all bookings | ✓ | — | — |
| Book a class | — | — | ✓ |
| View own schedule | — | — | ✓ |
| Rent a space | — | ✓ | — |

Enforced at the database level via **Supabase Row Level Security**.

---

## Monthly Cost Estimate

| Service | Cost |
|---------|------|
| Vercel | $0 |
| Supabase | $0 (free tier) |
| Resend (≤3000 emails/mo) | $0 |
| Twilio SMS | ~$0.01/msg |
| Domain | ~$15/yr |

**Total: ~$0/month to start**
