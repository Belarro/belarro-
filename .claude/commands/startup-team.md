---
description: Assemble the right Dream Startup Team members for any task
argument-hint: <describe the task, problem, or initiative>
---

# /startup-team -- Dream Startup Team Coordinator

Analyze the task, select the right team members, coordinate their work, and synthesize the output.

**Task**: $ARGUMENTS

---

## Full Roster (30 Agents)

| # | Agent | Role | Invoke When |
|---|-------|------|-------------|
| 1 | **StartupCEO** | Chief Executive Officer | Vision, strategy, fundraising, pivots, board decisions, company narrative |
| 2 | **StartupCTO** | Chief Technology Officer | Architecture decisions, tech stack, build vs buy, system design, technical vision |
| 3 | **StartupCOO** | Chief Operating Officer | Operations, OKRs, process design, org structure, cross-functional coordination |
| 4 | **StartupCFO** | Chief Financial Officer | Financial models, unit economics, budgets, runway, fundraising numbers, pricing |
| 5 | **StartupCMO** | Chief Marketing Officer | Brand strategy, go-to-market, demand gen, marketing analytics, channel strategy |
| 6 | **StartupCPO** | Chief Product Officer | Product vision, roadmap, product-market fit, feature prioritization, product strategy |
| 7 | **StartupVPEng** | VP of Engineering | Eng management, sprint planning, delivery cadence, team scaling, process design |
| 8 | **StartupTechLead** | Technical Lead | Code architecture, code reviews, implementation decisions, technical standards |
| 9 | **StartupFullStack** | Senior Full-Stack Developer | End-to-end feature implementation, rapid prototyping, MVPs, API design |
| 10 | **StartupFrontend** | Senior Frontend Developer | UI implementation, component architecture, design systems, performance |
| 11 | **StartupBackend** | Senior Backend Developer | API design, backend architecture, database design, distributed systems |
| 12 | **StartupDevOps** | DevOps & Infrastructure Lead | CI/CD, cloud infrastructure, monitoring, deployment, reliability engineering |
| 13 | **StartupMobile** | Senior Mobile Developer | iOS/Android development, cross-platform, mobile UX, app store optimization |
| 14 | **StartupUIUX** | UI/UX Design Lead | Interface design, user flows, information architecture, accessibility, design systems |
| 15 | **StartupPM** | Product Manager | PRDs, user stories, sprint coordination, metrics, feature specs, stakeholder alignment |
| 16 | **StartupStoryteller** | Brand Storyteller & Content Lead | Brand narrative, content strategy, copywriting, messaging, editorial |
| 17 | **StartupResearcher** | User Research & Insights Lead | User interviews, usability testing, behavioral analytics, research design |
| 18 | **StartupGrowth** | Head of Growth | User acquisition, retention loops, growth experiments, funnel optimization |
| 19 | **StartupBrand** | Brand & Identity Designer | Visual identity, brand guidelines, logo, typography, brand consistency |
| 20 | **StartupSEO** | SEO & Organic Growth Lead | Search optimization, keyword strategy, technical SEO, content SEO, link building |
| 21 | **StartupPricing** | Pricing & Monetization Strategist | Pricing models, packaging, willingness-to-pay, revenue optimization |
| 22 | **StartupData** | Head of Data & Analytics | Dashboards, analytics pipelines, data modeling, metrics frameworks, BI |
| 23 | **StartupAI** | AI/ML Engineering Lead | Machine learning, LLM integration, recommendation systems, model deployment |
| 24 | **StartupDBA** | Database & Data Architecture Lead | Schema design, query optimization, database selection, data integrity, migrations |
| 25 | **StartupSecurity** | CISO | Security architecture, threat modeling, compliance, incident response, pen testing |
| 26 | **StartupLegal** | Legal & Compliance Advisor | Contracts, IP, privacy regulation, open source licensing, corporate governance |
| 27 | **StartupHR** | Head of People & Culture | Hiring, onboarding, compensation, culture, performance reviews, team health |
| 28 | **StartupOps** | Operations Manager | Day-to-day operations, vendor management, tooling, internal systems, logistics |
| 29 | **StartupSales** | Head of Sales | Sales strategy, pipeline management, deal closing, sales process, CRM |
| 30 | **StartupSuccess** | Head of Customer Success | Onboarding, retention, churn prevention, customer health, NPS, support escalation |

---

## Common Team Compositions

### New Feature Build
StartupPM + StartupTechLead + StartupFullStack + StartupUIUX
> PM defines the spec, TechLead architects, FullStack implements, UIUX designs the experience.

### Product Launch / Go-to-Market
StartupCPO + StartupCMO + StartupGrowth + StartupStoryteller + StartupPricing
> CPO owns the product story, CMO builds the launch plan, Growth sets up acquisition loops, Storyteller crafts messaging, Pricing sets the model.

### Architecture / System Design
StartupCTO + StartupTechLead + StartupBackend + StartupDevOps + StartupDBA
> CTO sets the vision, TechLead details the design, Backend builds the services, DevOps handles infra, DBA designs the data layer.

### Fundraising / Investor Prep
StartupCEO + StartupCFO + StartupStoryteller + StartupData
> CEO owns the narrative, CFO builds the model, Storyteller polishes the deck, Data provides the proof points.

### Security & Compliance Review
StartupSecurity + StartupLegal + StartupCTO + StartupDevOps
> Security runs threat models, Legal checks compliance, CTO owns technical accountability, DevOps audits infrastructure.

### Growth & Retention
StartupGrowth + StartupData + StartupPM + StartupResearcher + StartupSEO
> Growth runs experiments, Data measures results, PM prioritizes features, Researcher validates with users, SEO drives organic.

### Hiring & Team Scaling
StartupCOO + StartupHR + StartupVPEng + StartupCEO
> COO designs org structure, HR runs the hiring process, VPEng defines engineering roles, CEO makes final calls.

### Crisis / Incident Response
StartupCTO + StartupDevOps + StartupBackend + StartupSecurity + StartupVPEng
> CTO leads, DevOps diagnoses infra, Backend fixes services, Security assesses exposure, VPEng coordinates the team.

### Pricing & Monetization
StartupPricing + StartupCFO + StartupData + StartupPM + StartupSales
> Pricing designs the model, CFO validates unit economics, Data provides usage insights, PM aligns with product, Sales validates with market.

### Full-Stack Feature (Frontend + Backend + Mobile)
StartupFrontend + StartupBackend + StartupMobile + StartupTechLead + StartupDBA
> Frontend builds the web UI, Backend builds APIs, Mobile builds the app, TechLead ensures consistency, DBA handles the schema.

---

## Execution Protocol

### Phase 1: ANALYZE the Task
Read the task description carefully. Determine:
1. **Task type**: Is this a build, review, strategy, research, launch, crisis, or operational task?
2. **Domains involved**: Engineering? Product? Marketing? Finance? Legal? Operations?
3. **Urgency**: Standard, high-priority, or crisis?
4. **Scope**: Single-domain or cross-functional?

### Phase 2: SELECT the Team (2-5 members)
Based on analysis:
1. Check the Common Team Compositions above for a matching pattern.
2. If no pattern matches, select agents by matching task domains to the "Invoke When" column.
3. **Minimum 2, maximum 5** agents per task. More agents means more coordination overhead.
4. Always include a **lead** -- the agent whose domain is most central to the task.
5. If the task is ambiguous, default to: StartupCEO (strategy) or StartupTechLead (technical).

Announce the team selection:

```
TEAM ASSEMBLED for: [task summary]
Lead: [AgentName] -- [role]
Members: [Agent1] ([role]), [Agent2] ([role]), ...
Rationale: [1-2 sentences on why these agents]
```

### Phase 3: COORDINATE Execution
For each selected agent, use the Task tool to invoke them. Each agent's instructions are in:

```
Dream Team/<AgentName>/<agentname-lowercase>-instructions.md
```

Load the agent's instruction file, MEMORY.md, and CONTEXT_INJECTION.md (if present) for full context.

**Invoke each agent with**:
1. The original task
2. Their specific role in this task (what you need from them)
3. Context from other agents' outputs (if sequential dependency exists)

**Coordination patterns**:
- **Parallel**: When agents work on independent aspects (e.g., PM writes spec while UIUX designs wireframes)
- **Sequential**: When one agent's output feeds the next (e.g., TechLead architects before FullStack implements)
- **Review loop**: When an agent should review another's output (e.g., Security reviews Backend's API design)

### Phase 4: SYNTHESIZE the Output
After all agents have responded:

1. **Merge outputs** into a unified deliverable. Do not just concatenate -- integrate.
2. **Resolve conflicts**: If agents disagree, note the disagreement and provide a recommendation. Defer to the domain expert.
3. **Identify gaps**: Flag anything no agent addressed that the task requires.
4. **Action items**: List concrete next steps with owners.
5. **Dependencies**: Note any cross-agent dependencies or sequencing requirements.

Present the final output as:

```
## TEAM OUTPUT: [Task Summary]

### Team
[Lead]: [role] | [Members]: [roles]

### Synthesized Deliverable
[Integrated output from all agents]

### Key Decisions
- [Decision 1]: [rationale]
- [Decision 2]: [rationale]

### Conflicts & Resolutions
- [If any disagreements, how they were resolved]

### Action Items
1. [Action] -- Owner: [AgentName] -- Priority: [H/M/L]
2. [Action] -- Owner: [AgentName] -- Priority: [H/M/L]

### Open Questions
- [Anything still unresolved that needs human decision]
```

---

## Rules

1. **Never invoke all 30 agents.** Be surgical. The right 2-5 beats a noisy crowd.
2. **The lead agent speaks last** in synthesis -- their perspective integrates everything.
3. **Respect agent expertise.** Do not override a domain expert with a generalist's opinion.
4. **If in doubt, ask the CEO.** StartupCEO is the tiebreaker for strategic ambiguity.
5. **If in doubt technically, ask the CTO.** StartupCTO is the tiebreaker for technical ambiguity.
6. **Ship over perfection.** A good answer now beats a perfect answer next week.
