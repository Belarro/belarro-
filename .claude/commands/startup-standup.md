---
description: Run a quick standup with relevant Dream Startup Team members
argument-hint: <optional: focus area or team filter, e.g. "engineering" or "growth">
---

# /startup-standup -- Dream Startup Team Daily Standup

Quick standup. Each relevant team member reports status. No speeches, no tangents -- 15 minutes or less.

**Focus**: $ARGUMENTS

---

## Standup Protocol

### Step 1: Determine Scope
Based on the focus area provided (or lack thereof), select the relevant team members:

- **No focus specified**: Pull in leads only -- StartupCEO, StartupCTO, StartupCPO, StartupCMO, StartupCOO
- **"engineering"**: StartupCTO, StartupVPEng, StartupTechLead, StartupFullStack, StartupBackend, StartupFrontend, StartupDevOps, StartupMobile, StartupDBA
- **"product"**: StartupCPO, StartupPM, StartupUIUX, StartupResearcher, StartupData
- **"growth" or "marketing"**: StartupCMO, StartupGrowth, StartupSEO, StartupStoryteller, StartupBrand
- **"business"**: StartupCEO, StartupCFO, StartupCOO, StartupSales, StartupPricing, StartupLegal
- **"operations"**: StartupCOO, StartupOps, StartupHR, StartupSuccess
- **"security"**: StartupSecurity, StartupLegal, StartupDevOps, StartupCTO
- **"all"**: Every agent with active work (check MEMORY.md for recent activity)

### Step 2: Gather Context
For each selected agent, read their state files in this order:
1. `Dream Team/<AgentName>/MEMORY.md` -- current state, recent decisions, active work
2. `Dream Team/<AgentName>/Sessions/` -- most recent session file for latest activity (if directory exists)

If MEMORY.md is empty or has no recent entries, that agent has nothing to report -- skip them.

### Step 3: Each Agent Reports
For each agent with active work, generate their standup report in this exact format:

```
### [AgentName] -- [Role]

DONE: [What was completed since last standup. Be specific -- name the feature, fix, decision, or deliverable.]

DOING: [What is actively being worked on right now. Include expected completion if known.]

BLOCKED: [What is preventing progress. Name the dependency, the missing input, or the person needed. "Nothing" if unblocked.]

FLAG: [Anything the team needs to know -- risks, changes in priority, unexpected findings, schedule concerns. "None" if nothing to flag.]
```

Rules for each report:
- **One line per section.** This is a standup, not a status novel.
- **Be specific.** "Working on the backend" is useless. "Implementing the payment webhook handler for Stripe integration" is useful.
- **BLOCKED must name the blocker.** "Waiting on API spec from StartupBackend" not "waiting on stuff."
- **FLAG is for risks, not status.** "Deadline may slip by 2 days due to scope creep on auth flow" is a flag. "Everything is fine" is not a flag -- just say "None."

### Step 4: Overall Status

After all individual reports, provide a team-level summary:

```
---

## STANDUP SUMMARY

**Overall Status**: [GREEN / YELLOW / RED]

- GREEN: All workstreams on track, no critical blockers
- YELLOW: Minor blockers or risks that need attention this week
- RED: Critical blockers, missed deadlines, or urgent issues requiring immediate action

**Active Blockers** (if any):
- [Blocker description] -- Affects: [AgentName(s)] -- Needs: [what is required to unblock]

**Key Decisions Needed**:
- [Decision description] -- Owner: [who needs to decide] -- Deadline: [when]

**Cross-Team Dependencies**:
- [Agent A] waiting on [Agent B] for [deliverable] -- ETA: [when expected]

**Priorities for Today**:
1. [Top priority item]
2. [Second priority]
3. [Third priority]
```

---

## Standup Rules

1. **15 minutes maximum.** If it takes longer, scope was too broad. Narrow the focus.
2. **No problem-solving during standup.** Flag the issue, schedule a separate discussion.
3. **Skip agents with nothing to report.** Silence is acceptable. Filler is not.
4. **Blockers get escalated immediately.** If someone is blocked, the standup should trigger action to unblock them.
5. **Read from MEMORY.md, not from imagination.** Only report what is actually documented in the agent's state files. Do not fabricate status.
6. **If no MEMORY.md has recent data**, report: "No recent activity documented. Status unknown -- needs check-in."
