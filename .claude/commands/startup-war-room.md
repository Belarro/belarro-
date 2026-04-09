---
description: Crisis mode -- convene leadership to solve an urgent problem fast
argument-hint: <describe the crisis: outage, security breach, revenue drop, legal threat, etc.>
---

# /startup-war-room -- CRISIS MODE

All non-essential work stops. War room is open. We solve this now.

**CRISIS**: $ARGUMENTS

---

## War Room Activation

### Step 1: ASSESS -- Classify the Crisis (30 seconds)

Read the crisis description and classify immediately:

| Crisis Type | Auto-Selected Team | Incident Commander |
|-------------|-------------------|-------------------|
| **Production Outage** | StartupCTO, StartupDevOps, StartupBackend, StartupVPEng, StartupSecurity | StartupCTO |
| **Security Breach / Data Leak** | StartupSecurity, StartupCTO, StartupLegal, StartupDevOps, StartupCEO | StartupSecurity |
| **Performance Degradation** | StartupCTO, StartupBackend, StartupDBA, StartupDevOps, StartupFrontend | StartupCTO |
| **Data Loss / Corruption** | StartupDBA, StartupBackend, StartupCTO, StartupDevOps, StartupSecurity | StartupDBA |
| **Revenue Crisis / Churn Spike** | StartupCEO, StartupCFO, StartupSales, StartupSuccess, StartupData | StartupCEO |
| **Legal / Compliance Emergency** | StartupLegal, StartupCEO, StartupSecurity, StartupCFO, StartupCOO | StartupLegal |
| **PR / Brand Crisis** | StartupCEO, StartupCMO, StartupStoryteller, StartupLegal, StartupCOO | StartupCEO |
| **Key Person Departure** | StartupCEO, StartupCOO, StartupHR, StartupVPEng, StartupCFO | StartupCOO |
| **Funding / Cash Crisis** | StartupCEO, StartupCFO, StartupCOO, StartupLegal, StartupCMO | StartupCFO |
| **Competitive Threat** | StartupCEO, StartupCPO, StartupCMO, StartupCTO, StartupGrowth | StartupCEO |
| **Product-Breaking Bug** | StartupTechLead, StartupBackend, StartupFrontend, StartupDevOps, StartupPM | StartupTechLead |
| **Third-Party Service Failure** | StartupDevOps, StartupBackend, StartupCTO, StartupVPEng, StartupOps | StartupDevOps |

If the crisis spans multiple types, combine the teams (up to 6 members max) and assign the highest-authority Incident Commander.

Announce immediately:

```
WAR ROOM OPEN
Crisis: [one-line description]
Type: [classification]
Severity: [SEV-1 / SEV-2 / SEV-3]
Incident Commander: [AgentName]
Team: [Agent1], [Agent2], [Agent3], [Agent4], [Agent5]
Time: NOW
```

Severity levels:
- **SEV-1**: Customer-facing impact, revenue loss, data at risk, or legal exposure. All hands.
- **SEV-2**: Significant internal impact, degraded service, or emerging external risk. Key leads required.
- **SEV-3**: Contained issue with potential to escalate. Monitoring with designated responders.

---

### Step 2: TRIAGE -- Understand the Blast Radius (2 minutes)

The Incident Commander runs triage. Every team member answers in ONE sentence each:

```
TRIAGE REPORT

What is broken: [precise technical or business description]
Who is affected: [users, customers, internal teams, partners]
Since when: [timeline of when issue started or was detected]
Blast radius: [scope -- how many users, how much revenue, what systems]
Is it getting worse: [YES/NO -- is the damage actively expanding]
Root cause hypothesis: [best current theory -- "unknown" is acceptable]
```

No speculation, no blame, no history lessons. Facts only.

---

### Step 3: IMMEDIATE ACTIONS -- Stop the Bleeding (5 minutes)

The Incident Commander assigns immediate actions. These are STOP-THE-BLEEDING actions, not fixes:

```
IMMEDIATE ACTIONS

1. [Action] -- Owner: [AgentName] -- ETA: [minutes]
2. [Action] -- Owner: [AgentName] -- ETA: [minutes]
3. [Action] -- Owner: [AgentName] -- ETA: [minutes]
```

Common immediate actions by crisis type:

**Production Outage**:
- Roll back the last deployment
- Switch to fallback/redundant systems
- Enable maintenance mode if needed
- Scale up infrastructure if load-related

**Security Breach**:
- Isolate compromised systems
- Rotate affected credentials and tokens
- Preserve forensic evidence (logs, snapshots)
- Notify legal for disclosure timeline assessment

**Revenue Crisis**:
- Pull real-time revenue and churn dashboards
- Contact top 10 at-risk accounts immediately
- Freeze any pricing or billing changes in flight
- Identify the revenue cohort most affected

**Legal Emergency**:
- Preserve all relevant documents and communications
- Stop any activity related to the legal issue
- Engage outside counsel if severity warrants
- Prepare a factual timeline of events

---

### Step 4: ROOT CAUSE -- Find the Source (10 minutes)

The team investigates in parallel. Each member reports findings in this format:

```
[AgentName] FINDING:
- Investigated: [what they looked at]
- Found: [what they discovered]
- Confidence: [HIGH/MED/LOW]
- Next step: [what to check next, or "root cause confirmed"]
```

The Incident Commander synthesizes findings and declares root cause when confidence is HIGH:

```
ROOT CAUSE IDENTIFIED:
[Clear, specific description of what caused the crisis]
Confidence: [HIGH/MED]
Evidence: [what proves this is the root cause]
```

If root cause cannot be identified within 10 minutes:
- Implement the best available mitigation
- Assign a dedicated investigator to continue root cause analysis
- Move to Step 5 with mitigation-focused actions

---

### Step 5: EXECUTE -- Fix It (time-boxed)

The Incident Commander assigns fix actions with hard time limits:

```
FIX PLAN

Root Cause: [from Step 4]
Fix Strategy: [how we fix it]

1. [Action] -- Owner: [AgentName] -- ETA: [time] -- Verify: [how to confirm it worked]
2. [Action] -- Owner: [AgentName] -- ETA: [time] -- Verify: [how to confirm it worked]
3. [Action] -- Owner: [AgentName] -- ETA: [time] -- Verify: [how to confirm it worked]

Rollback Plan: [if the fix makes things worse, what do we do]
Success Criteria: [how we know the crisis is resolved]
```

---

### Step 6: VERIFY -- Confirm Resolution

After fix is deployed:

```
VERIFICATION

Fix deployed: [YES/NO]
Customer impact resolved: [YES/NO]
Monitoring confirms stability: [YES/NO]
Rollback still available: [YES/NO]

Status: [RESOLVED / MITIGATED / ONGOING]
```

- **RESOLVED**: Root cause fixed, full service restored, no ongoing risk
- **MITIGATED**: Bleeding stopped but root cause not fully addressed, follow-up needed
- **ONGOING**: Still working on it, update in [X minutes]

---

### Step 7: POSTMORTEM -- Learn From It (after resolution)

Once the crisis is resolved, the team produces a postmortem:

```
## POSTMORTEM

**Crisis**: [description]
**Duration**: [start time to resolution time]
**Severity**: [SEV-1/2/3]
**Incident Commander**: [AgentName]
**Team**: [who was involved]

### Timeline
- [time]: [event -- what happened]
- [time]: [event -- what happened]
- [time]: [event -- resolution]

### Root Cause
[Clear, blameless description of what caused the crisis]

### What Went Well
- [Things the team did right during the crisis]

### What Went Wrong
- [Things that made the crisis worse or slowed resolution]

### Action Items to Prevent Recurrence
1. [Action] -- Owner: [AgentName] -- Due: [date] -- Priority: [P0/P1/P2]
2. [Action] -- Owner: [AgentName] -- Due: [date] -- Priority: [P0/P1/P2]
3. [Action] -- Owner: [AgentName] -- Due: [date] -- Priority: [P0/P1/P2]

### Process Improvements
- [Changes to monitoring, alerting, runbooks, or processes]
```

---

## War Room Rules

1. **No blame. Only facts and fixes.** "Who did this?" is banned. "What happened and how do we fix it?" is the only question.
2. **The Incident Commander has absolute authority.** During a crisis, the IC overrides normal hierarchy. If the IC says jump, ask how high.
3. **One conversation at a time.** No side threads. Everything goes through the war room.
4. **Time-box everything.** If triage takes more than 2 minutes, move on with best available info. If root cause takes more than 10 minutes, mitigate and investigate in parallel.
5. **Communicate externally early.** If customers are affected, StartupSuccess or StartupCMO drafts a status update within 5 minutes. Silence is worse than "we are investigating."
6. **Document as you go.** The timeline is written in real-time, not reconstructed from memory after the crisis.
7. **No heroics.** If the fix is risky, test it first. A bad fix on top of a crisis is two crises.
8. **Stay until it is resolved.** War room does not close until status is RESOLVED or MITIGATED with a clear follow-up plan.
