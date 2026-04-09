# BELARRO — Financial Model Documentation
> Version: March 2026
> Purpose: Complete business financial plan for Belarro vertical farm (microgreens, sprouts, herbs)
> Prepared by: CFO Model — All prices excl. MwSt

---

## 1. Model Overview

Belarro is a vertical farm producing 33 products (microgreens, sprouts, herbs, and custom mixes) in Germany. This financial model tracks:

- Full cost breakdown per product per tray (seeds, soil, labor, electricity, containers, stickers)
- Pricing & profitability per product per pack size (750ml and 2000ml containers)
- Weekly production planning → feeds monthly P&L automatically
- Monthly P&L (BWA) with revenue, COGS, gross profit, OpEx, EBITDA
- 5-year forecast (2025–2029)
- Dashboard with break-even analysis, capacity analysis, and scenario modeling

### Core Design Principles

1. Single source of truth: All editable inputs live in Product_Master (rows 2–8). Every other sheet links back.
2. Full traceability: Every calculated number shows HOW it was derived via visible formulas.
3. No hard-coded numbers: Business assumptions are in labeled cells, referenced by formulas.
4. Color coded: Brown (#FFF2CC) = editable input, Green (#E2EFDA) = calculated formula, Blue headers.

---

## 2. Sheet Structure (10 Sheets)

| # | Sheet Name | Purpose | Editable? |
|---|-----------|---------|-----------|
| 1 | Dashboard | KPIs, break-even, capacity, scenarios | Read-only (formulas) |
| 2 | Product_Master | Master cost database — ALL inputs here | Brown cells only |
| 3 | Pricing_Matrix | Product x pack size profitability | Pack counts, prices |
| 4 | Sales_Input_2025 | Monthly tray volumes 2025 | Historical data |
| 5 | Sales_Input_2026 | Monthly tray volumes 2026 | NO — Auto from Weekly_Planner |
| 6 | BWA_2025_Monate | Monthly P&L 2025 | Read-only (formulas) |
| 7 | BWA_2026_Monate | Monthly P&L 2026 | Read-only (formulas) |
| 8 | Forecast | 5-year P&L projection | Growth assumptions |
| 9 | Mix_Builder | Custom mix recipes & production | Recipes & orders |
| 10 | Weekly_Planner_2026 | 52 weeks x 33 products | Weekly tray counts |

---

## 3. Product_Master — Cost Database

Location: Product_Master sheet
Purpose: Central hub for ALL cost inputs. Change a number here → it cascades everywhere.

### Input Panel (Rows 2–8)

| Input | Cell | Value | Description |
|-------|------|-------|-------------|
| Labor Rate | B3 | 20 EUR/hr | Hourly labor cost |
| Time per Tray | B4 | 5 min | Minutes to process one tray |
| Labor EUR/Tray | B8 | 1.67 | = B3 x B4 / 60 |
| Bulk Soil Cost | D3 | 469.92 | Cost of bulk soil order |
| Bulk Shipping | D4 | 74.49 | Shipping for soil order |
| Bags in Order | D5 | 65 | Number of bags |
| Bag Size | D6 | 50L | Liters per bag |
| Liters per Tray | D7 | 3L | Soil needed per tray |
| Soil EUR/Tray | D8 | 0.50 | = (D3+D4) / (D5xD6) x D7 |
| Sticker Cost | F3 | 102.99 | Pack of stickers |
| Sticker Units | F4 | 2500 | Stickers per pack |
| Sticker EUR/Unit | F8 | 0.041 | = F3 / F4 |
| 750ml Container | H5 | 58.04 | Pack cost |
| 750ml Units | H6 | 400 | Units per pack |
| 750ml EUR/Unit | I9 | 0.145 | = H5 / H6 |
| 2000ml Container | H7 | 75.90 | Pack cost |
| 2000ml Units | H8 | 300 | Units per pack |
| 2000ml EUR/Unit | I10 | 0.253 | = H7 / H8 |
| kWh Price | J3 | 0.3697 | Electricity price per kWh |
| Watts per Light | J4 | 22W | LED light wattage |
| Lights per Shelf | J5 | 2 | Light fixtures per shelf |
| Trays per Shelf | J6 | 4 | Tray slots per shelf |
| Light Hours/Day | J7 | 16 hrs | Daily light schedule |

### Fixed Costs (L3:L8)

| Cost | Monthly EUR |
|------|-------------|
| Rent | 1,390.65 |
| Electricity | 103.00 |
| Gas | 54.00 |
| Bank + Google + Other | 84.07 |
| TOTAL FIXED | 1,631.72 |

### Product Table (Rows 11–43): 33 products

| Column | Field | Type |
|--------|-------|------|
| A | Product Name | Text |
| B | Active (1/0.5/0) | Input |
| C | Yield (g/tray) | Input |
| D | Light Days | Input |
| E | Total Days (grow cycle) | Input |
| F | Seeds (g/tray) | Input |
| G | Seed Cost EUR/kg | Input |
| H | Seed+Ship EUR/kg | Input |
| I | Seed Cost EUR/Tray | Calculated |
| J | Electricity EUR/Tray | Calculated |
| K | Soil EUR/Tray | Calculated |
| L | Sticker EUR/Tray | Calculated |
| M | Labor EUR/Tray | Calculated |
| N | Container Size (ml) | Input |
| O | Containers per Tray | Input |
| P | Container Cost EUR/Tray | Calculated |
| Q | COGS EUR/Tray (incl. pkg) | Calculated |

### Key Formulas

Electricity per Tray:
= (Light_Hours x Light_Days x Watts x Lights x kWh_Price) / (1000 x Trays_per_Shelf)

Seed Cost per Tray:
= Seeds_g_per_Tray x Seed_Cost_per_kg / 1000

Total COGS per Tray:
= Seed_Cost + Electricity + Soil + Sticker + Labor + Container_Cost

---

## 4. Pricing_Matrix — Profitability Analysis

Location: Pricing_Matrix sheet
Purpose: Analyze profitability per product per pack size

### Rows 10–64: Individual product x pack size combinations (~80+ rows)

| Column | Field |
|--------|-------|
| A | Product |
| B | Category (Sprossen/Mikrogreens/Feinkrauter/Mischungen) |
| C | Pack Size (e.g., 225g, 100g, 50g) |
| D | Container (750ml / 2000ml) |
| E | # Containers per Pack (editable) |
| F | Yield (g/tray) — linked from Product_Master |
| G | Packs per Tray — calculated |
| H–L | Cost breakdown (seeds, electricity, soil, labor, base COGS) |
| M | COGS per Pack |
| N | Container + Sticker cost |
| O | Total COGS per Pack |
| P | Sale Price EUR |
| Q | Margin % |
| R | Profit EUR/Pack |
| S | Revenue EUR/Tray |
| T | Profit EUR/Tray |

### Summary Section (Rows 68–91)

Best-performing pack size per product (highest margin %). Used by Sales_Input for revenue/tray lookups.

---

## 5. Mix_Builder — Custom Mix Recipes

Location: Mix_Builder sheet
Purpose: Define custom mix recipes, auto-calculate tray requirements

### 5 Mix Slots (each block ~14 rows)

- Mix Name (editable)
- Pack Size in grams (editable)
- Sale Price (editable)
- Up to 6 ingredients per mix with grams per pack
- Auto-calculated: cost per gram, COGS, yield, trays needed per pack

### Production Summary (Rows 77–81)

| Column | Field |
|--------|-------|
| F | Mix Name |
| G | Tray Requirements (auto-calculated) |
| H | Packs Ordered (editable, brown) |
| I | Revenue per pack |
| J | COGS per pack |
| K | Profit per pack |

---

## 6. Weekly_Planner_2026 — Production Planning

Location: Weekly_Planner_2026 sheet
Purpose: Enter what you grow each week → auto-feeds monthly Sales_Input

### Layout

- Columns A–C: Product name, COGS/Tray, Total Trays (yearly auto-sum)
- Columns D–BC: 52 weeks (W1–W52), grouped by month

### Two Sections

1. ORDERS (Rows 5–37): 33 products — trays grown for customer orders (brown cells)
2. SAMPLES (Rows 42–74): 33 products — trays grown as free samples (orange cells)
   - Sample COGS flows to BWA as a separate expense line

### Week-to-Month Mapping

- Jan = W1–W4 (cols D–G)
- Feb = W5–W8 (cols H–K)
- Mar = W9–W13 (cols L–P)
- Apr = W14–W17 (cols Q–T)
- May = W18–W21 (cols U–X)
- Jun = W22–W26 (cols Y–AC)
- Jul = W27–W30 (cols AD–AG)
- Aug = W31–W34 (cols AH–AK)
- Sep = W35–W39 (cols AL–AP)
- Oct = W40–W43 (cols AQ–AT)
- Nov = W44–W47 (cols AU–AX)
- Dec = W48–W52 (cols AY–BC)

---

## 7. Sales_Input — Monthly Volumes

### Sales_Input_2025: Manually editable tray counts (historical)

### Sales_Input_2026: Auto-calculated from Weekly_Planner (DO NOT EDIT green cells)

Monthly trays = SUM of corresponding weeks from Weekly_Planner_2026

| Column | Field |
|--------|-------|
| A | Product Name |
| B | COGS EUR/Tray (from Product_Master) |
| C | Revenue EUR/Tray (from Pricing_Matrix) |
| D–O | Monthly tray counts (Jan–Dec) |
| P | Total Trays |
| Q | Total Revenue EUR |
| R | Total COGS EUR |
| S | Total Profit EUR |
| Row 40 | Monthly Revenue Totals |
| Row 41 | Monthly COGS Totals |

---

## 8. BWA — Monthly P&L

Structure (BWA_2025_Monate & BWA_2026_Monate):

| Column | Line Item | Source |
|--------|-----------|--------|
| A | Monat (Month) | Jan–Dec + GESAMT |
| B | Umsatz (Revenue) | = Sales_Input Row40 |
| C | COGS | = Sales_Input Row41 |
| D | Rohertrag (Gross Profit) | = B - C |
| E | Rohertrag % | = D / B |
| F | Personalkosten (Personnel) | = B x 5% |
| G | Miete + Fixkosten (Rent+Fix) | = Product_Master L3 |
| H | Marketing | = B x 3% |
| I | Samples COGS (2026 only) | = Weekly_Planner sample totals |
| J | Sonstige (Other) | = B x 1% |
| K | Gesamtkosten (Total Expenses) | = C + F + G + H + I + J |
| L | EBITDA | = B - K |
| M | EBITDA % | = L / B |
| Row 16 | GESAMT (Annual Total) | Sum of all months |

---

## 9. Forecast — 5-Year Projection

### Growth Assumptions (Editable)

| Assumption | Value |
|-----------|-------|
| Revenue Growth YoY | 15% |
| COGS % of Revenue | 0 (= use Year 2 actual ratio) |
| Personnel % | 5% |
| Marketing % | 3% |
| Other Expenses % | 1% |
| Rent+Fix EUR/month | 1,631.72 |

### P&L Forecast

| Line | Year 1 (2025) | Year 2 (2026) | Year 3 (2027) | Year 4 (2028) | Year 5 (2029) |
|------|--------------|--------------|--------------|--------------|--------------|
| Revenue | 4,933 | 4,658 | 5,357 | 6,160 | 7,084 |
| COGS | 651 | 653 | 751 | 863 | 993 |
| Gross Profit | 4,282 | 4,005 | 4,606 | 5,297 | 6,091 |
| Gross Margin | 86.8% | 86.0% | 86.0% | 86.0% | 86.0% |
| Total OpEx | 20,123 | 20,000 | 20,063 | 20,135 | 20,218 |
| EBITDA | -15,841 | -15,995 | -15,457 | -14,838 | -14,127 |

Note: Years 1–2 pull actual/planned data. Years 3–5 project with growth assumptions. Model is negative because only 3 months of 2026 have data entered.

---

## 10. Dashboard — KPIs & Break-Even

### Key Metrics (2026 YTD)

| Metric | Value |
|--------|-------|
| Annual Revenue | 4,658 |
| Annual COGS | 653 |
| Gross Profit | 4,005 |
| Gross Margin | 86.0% |
| EBITDA | -16,019 |

### Break-Even Analysis

| Metric | Value |
|--------|-------|
| Fixed Costs / Month | 1,631.72 |
| Avg Revenue / Tray | 27.08 |
| Avg COGS / Tray | 3.80 |
| Contribution Margin / Tray | 20.85 |
| BREAK-EVEN: Trays / Month | 79 |
| BREAK-EVEN: Revenue / Month | 2,139 |

### Capacity Analysis

| Metric | Current (4 racks) | Max (14 racks) |
|--------|-------------------|----------------|
| Tray Slots | 80 | 280 |
| Max Trays / Month | 168 | 588 |
| Max Revenue / Month | 4,550 | 15,924 |

### Scenario Analysis (Monthly EBITDA)

| Scenario | Trays/Mo | EBITDA |
|----------|---------|--------|
| Current Pace | 57 | -436 |
| Break-Even | 79 | +15 |
| Full Capacity (4 racks) | 168 | +1,871 |
| Max Capacity (14 racks) | 588 | +10,627 |

---

## 11. How Data Flows

Product_Master (all input costs)
|
+--> Pricing_Matrix (cost + price = margin per product per pack)
|    |
|    +--> Sales_Input (revenue/tray lookup)
|
+--> Mix_Builder (ingredient costs, tray needs)
|
+--> Weekly_Planner_2026 (COGS/tray per product)
     |
     +--> Sales_Input_2026 (monthly tray sums)
          |
          +--> BWA_2026_Monate (monthly P&L)
               |
               +--> Forecast (annual figures)
                    |
                    +--> Dashboard (KPIs, break-even, scenarios)

---

## 12. How to Use the Model

### Daily/Weekly:
Open Weekly_Planner_2026, enter tray counts per product. Everything auto-updates.

### When costs change:
Update Product_Master input cells (brown). All downstream auto-cascades.

### New mix:
Use Mix_Builder empty slots, enter ingredients + grams + price.

### Price changes:
Update Pricing_Matrix column P (sale prices).

### Forecasting:
Adjust Forecast growth assumptions.

---

## 13. Farm Configuration

| Parameter | Value |
|-----------|-------|
| Current Racks | 4 |
| Max Racks (space) | 14 |
| Shelves per Rack | 5 |
| Trays per Shelf | 4 |
| Trays per Rack | 20 |
| Total Slots (current) | 80 |
| Total Slots (max) | 280 |
| Light Hours / Day | 16 |
| Lights per Shelf | 2 |
| Watts per Light | 22W |
| Avg Grow Cycle | ~14.3 days |
| Harvests per Slot / Month | ~2.1 |
| Container Strategy | 750ml & 2000ml only |

---

## 14. Product List (33 Products)

| # | Product | Category | Yield g/tray | Grow Days | COGS EUR/Tray |
|---|---------|----------|-------------|-----------|--------------|
| 1 | Pea Shoots | Sprossen | 600 | 14 | 4.27 |
| 2 | Pea Salad | Sprossen | 600 | 14 | 4.13 |
| 3 | Sunflower | Sprossen | 550 | 10 | 3.45 |
| 4 | Popcorn Shoots | Sprossen | 350 | 10 | 4.64 |
| 5 | Red Beet (Bull's Blood) | Mikrogreens | 120 | 21 | 3.91 |
| 6 | Yellow Beet | Mikrogreens | 120 | 21 | 4.35 |
| 7 | Coriander | Feinkrauter | 120 | 21 | 3.48 |
| 8 | Dill | Feinkrauter | 120 | 21 | 3.45 |
| 9 | Wheatgrass | Sprossen | 160 | 14 | 3.97 |
| 10 | Broccoli | Mikrogreens | 220 | 10 | 3.39 |
| 11 | Radish Daikon | Mikrogreens | 330 | 10 | 3.24 |
| 12 | Radish Mix | Mikrogreens | 350 | 10 | 3.38 |
| 13 | Red Rambo Radish | Mikrogreens | 400 | 10 | 3.65 |
| 14 | Amaranth | Mikrogreens | 80 | 14 | 3.41 |
| 15 | Leek | Feinkrauter | 180 | 14 | 5.15 |
| 16 | Garlic Chives | Feinkrauter | 100 | 14 | 3.98 |
| 17 | Red Kohlrabi | Mikrogreens | 200 | 10 | 3.32 |
| 18 | Red Cabbage | Mikrogreens | 220 | 10 | 3.40 |
| 19 | Black Kale / Russian Kale | Mikrogreens | 200 | 10 | 3.37 |
| 20 | Fennel | Feinkrauter | 120 | 21 | 3.75 |
| 21 | Wild Rocket | Mikrogreens | 80 | 10 | 2.99 |
| 22 | Nasturtium Alaska | Mikrogreens | 100 | 10 | 3.65 |
| 23 | Pak Choi | Mikrogreens | 120 | 10 | 3.25 |
| 24 | White Mustard | Mikrogreens | 220 | 10 | 3.11 |
| 25 | Spinach | Mikrogreens | 100 | 14 | 3.63 |
| 26 | Parsley | Feinkrauter | 80 | 28 | 4.02 |
| 27 | Mizuna | Mikrogreens | 200 | 10 | 3.27 |
| 28 | Red Mustard | Mikrogreens | 200 | 10 | 2.75 |
| 29 | Shungiku | Mikrogreens | 200 | 10 | 2.75 |
| 30 | Komatsuna | Mikrogreens | 200 | 21 | 3.40 |
| 31 | Celery Leaves | Feinkrauter | 120 | 28 | 3.72 |
| 32 | Beet Mix | Mikrogreens | 100 | 21 | 3.27 |
| 33 | Asian Mix | Mikrogreens | 200 | 10 | 3.39 |

Average COGS per Tray: 3.60 EUR

---

## 15. Rules for Editing

DO:
- Edit brown cells only (inputs)
- Enter weekly trays in Weekly_Planner (auto-feeds everything)
- Update Product_Master when costs change
- Use Pricing_Matrix for price analysis

DO NOT:
- Edit green cells (they contain formulas)
- Edit Sales_Input_2026 directly (it pulls from Weekly_Planner)
- Hard-code numbers in BWA or Dashboard
- Change product names without updating ALL sheets

---

## 16. Color Coding

| Color | Meaning |
|-------|---------|
| Brown (#FFF2CC) | Editable input |
| Green (#E2EFDA) | Calculated formula — do not edit |
| Orange | Sample trays (free product) |
| Blue headers | Section titles |
| Black text | Formula results |
