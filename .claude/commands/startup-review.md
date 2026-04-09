---
description: Full team review on code, product, strategy, or any deliverable
argument-hint: <what to review: code PR, product spec, architecture, strategy doc, etc.>
---

# /startup-review -- Dream Startup Team Review

Convene the relevant team members to provide a comprehensive, multi-perspective review.

**Subject**: $ARGUMENTS

---

## Review Protocol

### Step 1: Classify the Review Type

Analyze the subject and classify it:

| Review Type | Primary Reviewers | Supporting Reviewers |
|-------------|-------------------|---------------------|
| **Code / Pull Request** | StartupTechLead, StartupBackend or StartupFrontend | StartupSecurity, StartupDBA, StartupDevOps |
| **Architecture / System Design** | StartupCTO, StartupTechLead, StartupBackend | StartupDevOps, StartupDBA, StartupSecurity, StartupAI (if ML involved) |
| **Product Spec / PRD** | StartupCPO, StartupPM, StartupUIUX | StartupResearcher, StartupTechLead, StartupData |
| **UI/UX Design** | StartupUIUX, StartupFrontend, StartupResearcher | StartupPM, StartupBrand, StartupMobile (if mobile) |
| **Go-to-Market / Launch Plan** | StartupCMO, StartupGrowth, StartupStoryteller | StartupCEO, StartupPricing, StartupSales, StartupSEO |
| **Business Strategy** | StartupCEO, StartupCFO, StartupCOO | StartupCMO, StartupCPO, StartupLegal |
| **Pricing / Monetization** | StartupPricing, StartupCFO, StartupData | StartupCEO, StartupSales, StartupPM |
| **Financial Model / Budget** | StartupCFO, StartupCEO, StartupCOO | StartupData, StartupPricing |
| **Security / Compliance** | StartupSecurity, StartupLegal, StartupCTO | StartupDevOps, StartupBackend, StartupDBA |
| **Hiring / Org Change** | StartupCOO, StartupHR, StartupVPEng | StartupCEO, StartupCFO |
| **Content / Copy** | StartupStoryteller, StartupBrand, StartupCMO | StartupSEO, StartupGrowth |
| **Data / Analytics** | StartupData, StartupDBA, StartupAI | StartupPM, StartupCTO |
| **Infrastructure / DevOps** | StartupDevOps, StartupCTO, StartupBackend | StartupSecurity, StartupDBA, StartupVPEng |

Select 3-5 reviewers based on the type. Primary reviewers are mandatory. Supporting reviewers are included if the subject touches their domain.

### Step 2: Load Reviewer Context

For each selected reviewer, read:
1. `Dream Team/<AgentName>/<agentname-lowercase>-instructions.md` -- their expertise and review criteria
2. `Dream Team/<AgentName>/MEMORY.md` -- relevant context from ongoing work

### Step 3: Each Reviewer Provides Their Perspective

Use the Task tool to invoke each reviewer. Each reviewer evaluates the subject through their specific lens:

**StartupCTO** reviews for:
- Architecture soundness and scalability
- Technology choices and long-term maintainability
- Build vs buy decisions
- System-level implications

**StartupTechLead** reviews for:
- Code quality, patterns, and best practices
- Test coverage and edge cases
- Naming, abstractions, and readability
- Performance implications

**StartupBackend** reviews for:
- API design and consistency
- Data integrity and error handling
- Scalability and failure modes
- Database query efficiency

**StartupFrontend** reviews for:
- Component architecture and reusability
- Performance (Core Web Vitals)
- Accessibility (WCAG compliance)
- Responsive design and cross-browser compatibility

**StartupSecurity** reviews for:
- Authentication and authorization
- Input validation and injection prevention
- Data exposure and privacy risks
- Dependency vulnerabilities

**StartupPM** reviews for:
- User impact and value delivered
- Alignment with product roadmap
- Success metrics and measurement plan
- Edge cases from user perspective

**StartupUIUX** reviews for:
- Usability and information hierarchy
- Consistency with design system
- Accessibility and inclusive design
- User flow completeness

**StartupCPO** reviews for:
- Strategic alignment with product vision
- Market positioning impact
- Competitive differentiation
- Business model implications

**StartupCFO** reviews for:
- Unit economics impact
- Cost implications (infra, headcount, vendor)
- Revenue impact and ROI
- Budget alignment

**StartupCEO** reviews for:
- Strategic alignment with company vision
- Market timing and competitive positioning
- Investor narrative impact
- Resource allocation priority

**StartupCMO** reviews for:
- Brand consistency and messaging
- Market positioning impact
- Customer communication requirements
- Launch and adoption strategy

**StartupData** reviews for:
- Analytics and tracking requirements
- Data quality and integrity
- Dashboard and reporting needs
- A/B test design

**StartupDBA** reviews for:
- Schema design and normalization
- Query performance and indexing
- Migration safety and rollback plan
- Data consistency guarantees

**StartupDevOps** reviews for:
- Deployment strategy and rollback plan
- Infrastructure requirements and cost
- Monitoring and alerting coverage
- CI/CD pipeline impact

**StartupLegal** reviews for:
- Compliance requirements (GDPR, CCPA, etc.)
- IP and licensing implications
- Terms of service impact
- Contractual obligations

**StartupGrowth** reviews for:
- Impact on acquisition and retention metrics
- Experimentation opportunities
- Viral and referral loop potential
- Onboarding friction

### Step 4: Each Reviewer Reports

Each reviewer provides their assessment in this format:

```
### [AgentName] -- [Role] Review

**Verdict**: [APPROVE / APPROVE WITH CHANGES / REQUEST CHANGES / BLOCK]

**Summary**: [2-3 sentence assessment from this reviewer's perspective]

**Strengths**:
- [What is good about this deliverable from this perspective]

**Concerns**:
- [SEVERITY: HIGH/MED/LOW] [Specific concern with explanation]

**Required Changes** (if any):
1. [Specific, actionable change required]

**Suggestions** (optional, non-blocking):
- [Nice-to-have improvements]
```

### Step 5: Unified Verdict

After all reviewers have reported, synthesize:

```
---

## REVIEW VERDICT

**Subject**: [What was reviewed]
**Reviewers**: [List of agents who reviewed]

### Overall Verdict: [APPROVE / APPROVE WITH CHANGES / REQUEST CHANGES / BLOCK]

Determination rules:
- **APPROVE**: All reviewers approve, no high-severity concerns
- **APPROVE WITH CHANGES**: All reviewers approve or approve-with-changes, only medium/low concerns
- **REQUEST CHANGES**: Any reviewer requests changes with high-severity concerns
- **BLOCK**: Any reviewer blocks (security vulnerability, data loss risk, legal issue, architectural flaw)

### Consensus Points
- [Things all reviewers agreed on]

### Conflicts
- [Where reviewers disagreed, with both perspectives noted]
- Resolution: [Recommended resolution, deferring to domain expert]

### Required Action Items
1. [MUST-DO] [Action] -- Owner: [AgentName] -- Severity: [HIGH/MED]
2. [MUST-DO] [Action] -- Owner: [AgentName] -- Severity: [HIGH/MED]

### Suggested Improvements
1. [NICE-TO-HAVE] [Suggestion] -- Proposed by: [AgentName]

### Follow-Up Reviews Needed
- [If changes are requested, who needs to re-review after changes]
```

---

## Review Rules

1. **Every review must have a clear verdict.** No wishy-washy "it depends" without a recommendation.
2. **Concerns must be severity-rated.** HIGH = must fix before merge/launch. MED = should fix soon. LOW = nice to have.
3. **Be specific.** "The code could be better" is not a review. "The authentication middleware on line 47 does not validate token expiry" is a review.
4. **Praise what is good.** Strengths section is not optional. Good work deserves recognition.
5. **BLOCK is reserved for real danger.** Security holes, data loss risks, legal violations, and fundamental architecture flaws. Not style preferences.
6. **The domain expert wins ties.** If StartupSecurity says "block for security reasons" and StartupPM says "ship it," Security wins on security questions.
