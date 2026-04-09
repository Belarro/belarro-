# Belarro — Berlin's Precision Farm for Professional Kitchens

## Project
- **Brand:** Belarro (brand of Citfarm UG)
- **What:** Vertical indoor farm growing microgreens for restaurants
- **Where:** Hufelandstraße 42, 10407 Berlin
- **Owner:** Ron Ben-Yohanan (solo operator)
- **Website:** belarro.com
- **Stage:** Production — 3 active clients, targeting 25+ by October 2026

## Agent Team
This project has a 7-agent team. See [agents/SYSTEM.md](agents/SYSTEM.md) for full documentation.

### Quick Access
| Command | Agent | Model | Purpose |
|---------|-------|-------|---------|
| `/commander` | Commander | opus | Orchestrate, prioritize, route |
| `/grower` | Grower | sonnet | Production, varieties, harvest |
| `/hunter` | Hunter | sonnet | Restaurant prospecting |
| `/closer` | Closer | sonnet | Follow-ups, pipeline, conversion |
| `/storyteller` | Storyteller | sonnet | Social content, brand voice |
| `/builder` | Builder | opus | Website, admin, tech |
| `/bookkeeper` | Bookkeeper | sonnet | Financials, invoicing, margins |
| `/team` | All (via Commander) | varies | Full team standup |

### Model Routing
- **opus:** Commander, Builder, strategic decisions
- **sonnet:** Grower, Hunter, Closer, Storyteller, Bookkeeper (default)
- **haiku:** Simple lookups, template fills, data formatting

## Business Files
All business docs consolidated in `./business/` — see [business/INDEX.md](business/INDEX.md)
- Brand, design, products, pricing, sales, marketing, financials, photos — all in one place
- New 2026 design docs: `business/design/new-2026/`
- Business plan spreadsheet: `C:/Users/The boss/Downloads/Belarro_Business_Plan_v2.xlsx`

## Tech Stack
- Static HTML + CSS + vanilla JS (main site)
- Vite + React 19 (admin panel)
- Supabase (database, auth)
- Vercel (hosting)
- Bilingual: DE + EN

## Key Rules
- Belarro is a BRAND, not "a microgreens company"
- Tuesday is delivery day — sacred, never schedule conflicts
- Prices not shown on website (intentional)
- No mushroom promotion until product is ready
- German for customer-facing, English for internal
