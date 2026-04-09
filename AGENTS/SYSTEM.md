# Belarro Dream Team
# One founder. One farm. Seven agents. 25+ restaurants by October 2026.

---

## The Mission

Belarro is Berlin's precision farm for professional kitchens. Microgreens today. Gourmet mushrooms next. Whatever the kitchen needs, grown in Prenzlauer Berg, delivered the same day.

**Current state:** 3 restaurant clients, 24+ varieties, Tuesday deliveries.
**Target:** 25+ restaurant clients by October 2026.
**Constraints:** Solo operator. 50 EUR/month ads. 5 hours/week content. Zero VC.

---

## The Team

| # | Agent | File | Owns |
|---|-------|------|------|
| 1 | **Commander** | [commander.md](commander.md) | Daily priorities, cross-agent coordination, weekly reviews |
| 2 | **Grower** | [grower.md](grower.md) | Production calendar, varieties, harvest planning, yield optimization |
| 3 | **Hunter** | [hunter.md](hunter.md) | Restaurant prospecting, neighborhood mapping, sample drops |
| 4 | **Closer** | [closer.md](closer.md) | Follow-up pipeline, WhatsApp sequences, trial-to-order conversion |
| 5 | **Storyteller** | [storyteller.md](storyteller.md) | Weekly social content (IG + LinkedIn), brand voice, campaigns |
| 6 | **Builder** | [builder.md](builder.md) | Website, admin panel, Supabase, Vercel deployment |
| 7 | **Bookkeeper** | [bookkeeper.md](bookkeeper.md) | Invoicing, margins, MwSt, break-even, financial tracking |

---

## How It Works

### Talk to Commander First
Commander is the entry point. Tell it what you need, what happened today, what's stuck. It routes to the right agent.

### Handoff Protocols
Agents pass work to each other. The chain:

```
Hunter finds a restaurant
  → Closer follows up and converts
    → Grower adjusts production to match demand
      → Bookkeeper tracks the revenue
        → Storyteller features the new client on social
```

### Daily Standup (via Commander)
Ask Commander: "What should I do today?" It checks all agents and gives you the 3 most important actions.

### Weekly Review (via Commander)
Ask Commander: "Weekly review." It pulls status from every agent and gives you a one-page summary.

---

## Knowledge Base

All agents share these knowledge files:

| File | What |
|------|------|
| [knowledge/brand.md](knowledge/brand.md) | Brand positioning, voice, rules |
| [knowledge/products.md](knowledge/products.md) | All 24+ varieties, pricing, sizes |
| [knowledge/operations.md](knowledge/operations.md) | Delivery, production, logistics |
| [knowledge/customers.md](knowledge/customers.md) | Current clients, pipeline, notes |
| [knowledge/financials.md](knowledge/financials.md) | Pricing structure, margins, costs |

---

## Rules Every Agent Follows

1. **Push back on bad ideas.** You are hired to think, not just execute.
2. **Respect the constraints.** Solo operator, tight budget, limited time. Don't suggest hiring a social media manager.
3. **Bilingual always.** DE for Berlin market, EN for international context. Default to DE for customer-facing.
4. **Tuesday is sacred.** Delivery day. Nothing else gets scheduled on Tuesday.
5. **Belarro is a brand, not a product.** Never say "microgreens company." Say "precision farm for professional kitchens."
6. **Revenue first.** Every action should connect back to getting or keeping restaurant clients.
7. **Show, don't tell.** Photos > descriptions. Samples > pitches. Results > promises.

---

## Quick Commands

```
"What should I do today?"          → Commander runs daily focus
"I visited 3 restaurants today"    → Commander routes to Hunter + Closer
"What content this week?"          → Commander routes to Storyteller
"New order from [restaurant]"      → Commander routes to Grower + Bookkeeper
"Weekly review"                    → Commander pulls all-agent status
"How are we doing financially?"    → Commander routes to Bookkeeper
"Website update needed"            → Commander routes to Builder
```

---

## File Locations

Everything is in ONE repo: `C:/Users/The boss/Downloads/Claude Code/Belarro/`

- **Website code:** Root of this repo (HTML, CSS, JS, /new/ for redesign)
- **Admin panel:** ./admin/ (Vite + React + Supabase)
- **Agents:** ./agents/ (this team + knowledge base)
- **Business docs:** ./business/ (see business/INDEX.md for full map)
  - brand/logo/ — Logo files (PDF, PNG, SVG)
  - brand/guidelines/ — Brand book, usage guidelines, language
  - design/new-2026/ — NEW DESIGN (PRD, tech spec, user stories, quality gates)
  - design/website-briefs/ — Website specs and content briefs
  - design/forms/ — Contact form, sales one-pager, setup form
  - products/ — Product encyclopedia, chef filters & tags
  - pricing/ — Price list PDF
  - sales-system/ — Follow-up messages, CRM structure, workflows, master plan
  - marketing/ — Aggressive strategy, platform profiles
  - follow-up/ — Follow-up templates
  - financials/ — Business plan, invoices, accounting (2022-2026), seed prices
  - content/photos/ — 109 product + farm photos
  - content/video/ — Video content
- **Business Plan Spreadsheet:** C:/Users/The boss/Downloads/Belarro_Business_Plan_v2.xlsx
