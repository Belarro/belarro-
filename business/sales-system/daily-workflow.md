# BELARRO — Daily Sales Workflow

## YOUR WEEK AT A GLANCE

### Sunday Evening
- [ ] Check Google Sheet for all Tuesday deliveries
- [ ] Send order confirmations to all scheduled customers
- [ ] Check which leads need "would you like a delivery this Tuesday?" message
- [ ] Plan your harvest list for Tuesday morning

### Monday
- [ ] SALES DAY: Visit restaurants, collect leads
- [ ] After each visit: immediately add to Google Sheet (name, restaurant, phone, language, notes)
- [ ] Same evening: Open Claude, paste AI prompt + each new lead's info, generate follow-up messages
- [ ] Send all same-day follow-ups via WhatsApp Business

### Tuesday
- [ ] DELIVERY DAY: Harvest, pack, deliver
- [ ] While delivering samples to new leads: take note of chef reactions, update Notes column
- [ ] After deliveries: update Google Sheet statuses (Sample Delivered, etc.)

### Wednesday
- [ ] FOLLOW-UP DAY: Send post-delivery check-ins (Stage 4) to everyone who got samples yesterday
- [ ] Check for any replies from Monday's outreach — respond personally or use AI for template
- [ ] Update statuses in Google Sheet

### Thursday
- [ ] Visit restaurants for new leads (sales day 2 if needed)
- [ ] Send any overdue follow-ups flagged in the sheet

### Friday
- [ ] Send Stage 5 messages (3 days after Tuesday delivery) to sample recipients
- [ ] Check for "not now" leads that need 2-week re-engagement
- [ ] Review the week: how many leads, samples, conversions?

### Saturday
- [ ] Rest or plan next week's target restaurants/neighborhoods

---

## WHEN YOU ADD A NEW LEAD — CHECKLIST

1. Open Google Sheet "Leads" tab
2. Fill in: Date, Restaurant, Chef Name, Phone, Language, Source, Notes
3. Set Status = "New"
4. Set Scenario based on how they reacted
5. Set Follow-up Stage = 1
6. Open Claude, paste the AI prompt, paste the lead info
7. Copy the generated message
8. Send via WhatsApp Business
9. Update Last Contact date and Next Follow-up date
10. Move Follow-up Stage to 2

---

## WHEN YOU GET A REPLY — DECISION TREE

Chef replies positively ("yes, Tuesday works"):
-> Schedule the sample delivery
-> Update Status to "Sample Scheduled"
-> Add their address, time preference
-> Add to Weekly Plan sheet

Chef replies with a question:
-> Check Quick Responses in follow-up-messages.md
-> Or use AI to generate a personalized answer
-> Update Last Contact date

Chef replies "not now" / "maybe later":
-> Update Scenario to "2-Not now"
-> Set Next Follow-up to 2 weeks from now
-> Update Status to "Paused"

Chef doesn't reply at all:
-> Follow the stage progression (24h -> 3 days -> pause)
-> After Stage 3 with no reply, set Status to "Paused"
-> Set Next Follow-up to 2 weeks later for re-engagement

Chef says "send price list":
-> Send price list PDF + Stage 1 message from Scenario 5
-> Update Scenario to "5-Price list"

Chef places first order:
-> Update Status to "Converted"
-> Record in Orders sheet
-> Set up in Weekly Plan
-> Set Scenario to "7-Active customer"

---

## USING AI FOR FOLLOW-UPS — STEP BY STEP

1. Open claude.ai (or Claude app)
2. Paste the full AI prompt from ai-follow-up-prompt.md
3. Then type the lead info:

```
Name: Marco
Restaurant: Rutz
Language: DE
Source: Cold visit
Scenario: 1-Interested
Stage: 2
Notes: Met Monday, liked pea shoots, no reply to first message
```

4. Claude generates the message
5. Copy it, paste into WhatsApp, send
6. Update Google Sheet: Last Contact, Next Follow-up, Stage +1

For multiple leads, just keep pasting lead info one after another in the same conversation.

---

## KEY NUMBERS TO HIT WEEKLY

- Restaurants visited: 10-15
- New leads added: 5-10
- Samples delivered (Tuesday): 3-5
- Follow-ups sent: all pending ones, zero missed
- Conversions target: 1-2 new paying customers per week
