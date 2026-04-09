# BELARRO — Sales Tracker Google Sheet Structure

## SHEET 1: "Leads" (Main tracker)

| Column | Name | What to fill | Example |
|--------|------|-------------|---------|
| A | Date Added | Date you met/got the lead | 2026-03-10 |
| B | Restaurant | Restaurant name | Nobelhart & Schmutzig |
| C | Chef Name | Contact person name | Marco |
| D | Phone | WhatsApp number | +49 170 1234567 |
| E | Email | Email address | marco@nobelhart.com |
| F | Language | DE or EN | DE |
| G | Source | How you got the lead | Cold visit / Website form / Referral / Call |
| H | Referred By | If referral, who referred | Hans from Rutz |
| I | Status | Current stage | New / Sample scheduled / Sample delivered / Follow-up 1 / Follow-up 2 / Converted / Lost / Paused |
| J | Scenario | Which follow-up scenario | 1-Interested / 2-Not now / 3-Inbound / 4-Reactivation / 5-Price list / 6-Referral |
| K | Last Contact | Date of last message sent | 2026-03-10 |
| L | Next Follow-up | Date for next follow-up | 2026-03-11 |
| M | Follow-up Stage | Which stage number next | 2 |
| N | Sample Date | Date samples were delivered | 2026-03-11 |
| O | First Order Date | Date of first paid order | 2026-03-18 |
| P | Weekly Order | Their recurring order | Pea Shoots 225g, Radish 113g |
| Q | Notes | Anything useful | Liked spicy varieties, busy Fri-Sat, enter from back door |
| R | Address | Delivery address | Friedrichstr. 218, 10969 Berlin |

## Status Flow

```
New
  -> Sample Scheduled (delivery date set)
    -> Sample Delivered (you brought it)
      -> Follow-up 1 (day after delivery)
        -> Follow-up 2 (3 days after)
          -> Converted (they placed first order)
          -> Lost (not interested after all follow-ups)
          -> Paused (said "not now", will re-engage later)
```

## SHEET 2: "Orders" (Track deliveries)

| Column | Name | Example |
|--------|------|---------|
| A | Date | 2026-03-11 |
| B | Restaurant | Nobelhart & Schmutzig |
| C | Items | Pea Shoots 225g x2, Radish 113g x1 |
| D | Total (excl MwSt) | 36 EUR |
| E | Type | Sample / Paid |
| F | Invoiced | Yes / No |
| G | Notes | Added extra sunflower as bonus |

## SHEET 3: "Weekly Plan" (Tuesday delivery planning)

| Column | Name | Example |
|--------|------|---------|
| A | Restaurant | Nobelhart & Schmutzig |
| B | Contact | Marco |
| C | Phone | +49 170 1234567 |
| D | Address | Friedrichstr. 218, 10969 Berlin |
| E | Order | Pea Shoots 225g x2, Radish 113g |
| F | Type | Paid / Sample |
| G | Time Window | Morning / Afternoon |
| H | Delivery Notes | Back entrance, ring bell |
| I | Confirmed | Yes / No |

## SHEET 4: "Dashboard" (At a glance)

Key numbers to track (can be formulas):
- Total leads this week
- Total leads this month
- Samples delivered this week
- Conversion rate (samples -> paying customers)
- Active weekly customers
- Revenue this week (excl MwSt)
- Leads needing follow-up today
- Leads with no contact in 7+ days

## COLOR CODING (optional)

- Green row = Converted (paying customer)
- Yellow row = Follow-up needed today
- Red row = Overdue follow-up (2+ days late)
- Gray row = Lost / Paused
