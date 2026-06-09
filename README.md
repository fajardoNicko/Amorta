# Amorta 

**A financial awareness platform for Filipinos — built to expose the real cost of installment-based purchases and BNPL services.**

![Stack](https://img.shields.io/badge/React-TypeScript-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square)
![Stack](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square)
![Stack](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square)

---

## The Problem

A huge portion of Filipino consumers use Home Credit, BillEase, GGives, Atome, SPaylater, and credit card installments — but most:

- Underestimate how much they're actually paying in total
- Don't track multiple simultaneous installments
- Misunderstand effective interest rates
- Unknowingly overcommit future income

Most finance apps are too generic and not built for how Filipinos actually spend. **Amorta fills that gap.**

---

## Features

###  Installment Tracker
Add and manage all active installment plans in one place. Track monthly payments, due dates, remaining balance, and total repayment per item. Supports all major Filipino lending platforms.

###  Salary Lock Analyzer
See exactly what percentage of your monthly salary is already committed to installment payments — before your next paycheck even arrives.

###  Effective Interest Calculator
Move beyond the advertised monthly fee. Amorta computes the true effective interest rate and total repayment cost of every installment you hold.

###  Overlapping Debt Visualization
A 12-month bar chart showing your total payment obligations month by month — color-coded by intensity so you can spot heavy months before they hit.

###  Platform Breakdown Chart
A donut chart breaking down your monthly obligations by lending platform (Home Credit, BillEase, Atome, etc.).

###  "Can I Afford This?" Simulator
Input a product price, duration, and interest rate — Amorta simulates the impact on your salary commitment and gives you a risk rating: Safe, Moderate, or High Risk.

###  Notification & Reminder System
Auto-generated payment reminders when due dates are approaching, last payment alerts, and overcommitment warnings when your debt load gets too high.

###  Financial Health Score
A 0–100 score based on your debt-to-income ratio. Tracks how financially healthy you are at a glance.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| Components | Radix UI primitives |
| Charts | Recharts |
| Backend & DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth — Google OAuth + Email/Password |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, MobileNav, AppLayout
│   ├── dashboard/       # StatCard, SalaryLockBar, OverlapChart,
│   │                    # HealthScore, PlatformChart
│   └── installments/    # InstallmentCard, InstallmentForm
├── pages/
│   ├── Dashboard.tsx
│   ├── Tracker.tsx
│   ├── Simulator.tsx
│   ├── Notifications.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   └── Signup.tsx
├── hooks/
│   ├── useUser.ts
│   ├── useInstallments.ts
│   ├── useProfile.ts
│   └── useNotifications.ts
├── lib/
│   ├── supabase.ts
│   ├── calculations.ts
│   └── utils.ts
├── context/
│   └── AuthContext.tsx
└── types/
    └── index.ts
```

---

## Database Schema

```sql
profiles          → id, full_name, monthly_salary, currency
installments      → id, user_id, name, platform, downpayment,
                    monthly_payment, duration_months, interest_rate,
                    due_date, start_date, is_active
notifications     → id, user_id, installment_id, type,
                    message, scheduled_at, is_read
```

All tables use **Row Level Security (RLS)** — users can only access their own data.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Google Cloud OAuth 2.0 client (for Google login)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/amorta.git
cd amorta

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Fill in your `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the following in your Supabase SQL Editor:

```sql
-- Profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  monthly_salary numeric default 0,
  currency text default 'PHP',
  created_at timestamptz default now()
);

-- Installments
create table installments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  platform text,
  downpayment numeric default 0,
  monthly_payment numeric not null,
  duration_months int not null,
  interest_rate numeric default 0,
  due_date int not null,
  start_date date not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  installment_id uuid references installments(id) on delete cascade,
  type text not null,
  message text not null,
  scheduled_at timestamptz,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

Then enable RLS and add policies:

```sql
alter table profiles enable row level security;
alter table installments enable row level security;
alter table notifications enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can manage own installments" on installments for all using (auth.uid() = user_id);
create policy "Users can manage own notifications" on notifications for all using (auth.uid() = user_id);
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deployment

This project is deployed on **Vercel**.

1. Push your repo to GitHub
2. Import it on [vercel.com](https://vercel.com)
3. Add your environment variables in Vercel's project settings
4. Deploy

Add your Vercel production URL to:
- Supabase → Authentication → URL Configuration → Redirect URLs
- Google Cloud Console → Authorized redirect URIs

---

## Roadmap

- [ ] Debt Payoff Timeline (Gantt-style)
- [ ] "How Cooked Is Your Salary?" shareable meter
- [ ] Monthly Financial Recap card
- [ ] Installment history / completed tab
- [ ] CSV import for bulk installment entry
- [ ] PWA support — installable as mobile app
- [ ] AI Spending Insights (Claude-powered)
- [ ] OCR receipt scanning
- [ ] GCash / Maya integration

---

## Why "Amorta"?

*Amortization* — the process of paying off debt in regular installments over time. Amorta makes that process visible, understandable, and manageable for everyday Filipinos.

---

## License

MIT — feel free to use, modify, and build on this project.

---

*Built with heart for Filipino consumers navigating installment culture.*