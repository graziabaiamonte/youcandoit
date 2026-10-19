# Senior Engineer Job Requirements (research snapshot, 19 Oct 2026)

**What this is:** 21 job postings for senior (and a few staff) engineering roles that were actually read in full, mostly published or updated in 2026. They cover backend/general SWE, AI/LLM engineering, and platform/DevOps/SRE, with an EU/remote focus.

**How the postings were collected**
- Full text was pulled from company applicant-tracking systems: Greenhouse, Ashby and Workable public job APIs.
- Three postings were read through aggregator pages: bestjobs.eu and Built In.
- LinkedIn, Indeed, Glassdoor and InfoJobs were not used, because they need a login or block scraping.
- One Jooble listing (Newesis, Turin, Senior Platform Engineer) returned only site navigation, so it was skipped. Two Workable/Lever aggregator copies returned 404 and were also skipped.

**Caveats**
- Italy-based postings were hard to find in readable form. Both Satispay (Milan) postings had already been removed when read. The Datadog REDAPL role is the one live posting that is explicitly "Italy, Remote".
- Some roles are US/UK-located but remote-first (GitLab, Docker). They are included because their requirements are representative.
- Counts are judgement-based: one posting counts once per skill, required or nice-to-have, and synonyms are merged.

## 1. Postings read

"Date" is the first-published date from the ATS, unless noted otherwise.

| # | Company | Title | Location / remote | Date | URL |
|---|---|---|---|---|---|
| 1 | GitLab | Senior AI Engineer | Remote, US (all-remote company) | 2026-05-29 | https://job-boards.greenhouse.io/gitlab/jobs/8565469002 |
| 2 | GitLab | Senior Backend Engineer, AI Engineering: Chat | Remote, UK / Canada | 2026-07-20 | https://job-boards.greenhouse.io/gitlab/jobs/8621733002 |
| 3 | GitLab | Senior Backend Engineer, Core DevOps | Remote, UK | 2026-10-07 | https://job-boards.greenhouse.io/gitlab/jobs/8689243002 |
| 4 | MongoDB | Site Reliability Engineer (Senior or Staff), Storage Layer Services | Dublin / Cork / remote in Ireland | 2026-04-10 | https://www.mongodb.com/careers/job/?gh_jid=6984814 |
| 5 | MongoDB | Senior Software Engineer, Forward Deployed AI Engineer | Dublin / Cork, hybrid | 2025-11-20 (still open Oct 2026) | https://www.mongodb.com/careers/job/?gh_jid=7392902 |
| 6 | Anthropic | Senior Software Engineer, Inference | Dublin, IE | 2025-05-20 (updated 2026-10-13) | https://job-boards.greenhouse.io/anthropic/jobs/4641822008 |
| 7 | Anthropic | Staff Software Engineer, AI Reliability Engineering | Dublin, IE | 2026-02-05 | https://job-boards.greenhouse.io/anthropic/jobs/5101169008 |
| 8 | Datadog | Senior Software Engineer - Distributed Systems | France (several cities) / Madrid | evergreen (updated 2026-09-29) | https://careers.datadoghq.com/detail/4599111/?gh_jid=4599111 |
| 9 | Datadog | Senior Software Engineer - REDAPL Graph Engine | Remote: Italy, France, Germany, Spain, CH, UK | 2026-05-27 | https://careers.datadoghq.com/detail/7959966/?gh_jid=7959966 |
| 10 | Datadog | Senior Software Engineer, Chaos Engineering | Paris, FR | 2026-09-30 | https://careers.datadoghq.com/detail/8242722/?gh_jid=8242722 |
| 11 | Databricks | Senior Software Engineer - Backend | Amsterdam, NL | 2025-06-08 (updated 2026-09-21) | https://databricks.com/company/careers/open-positions/job?gh_jid=8029671002 |
| 12 | Stripe | Staff Backend Engineer - API Platform | Dublin, IE | 2026-03-13 | https://stripe.com/jobs/search?gh_jid=7716032 |
| 13 | Docker | Senior Software Engineer, Sandboxes | London / EU or US-East remote | 2026-08-12 | https://jobs.ashbyhq.com/docker/aa9dac2f-ad93-4aa8-ab07-851685725806 |
| 14 | Docker | Senior Software Engineer, Infrastructure | Seattle (remote-first) | 2026-04-03 | https://jobs.ashbyhq.com/docker/ae03031e-7080-472c-bcc6-207833a8d2f9 |
| 15 | Docker | Senior Software Engineer, AI Gateway | SF / Seattle (remote-first) | 2026-10-15 | https://jobs.ashbyhq.com/docker/ed0ec3c2-aa74-4d81-97d9-f99e6b47d078 |
| 16 | n8n | Senior Product Engineer (TS/NodeJS/Vue) | Berlin (remote-first team) | 2026-03-04 | https://jobs.ashbyhq.com/n8n/896c58a8-0388-4037-b265-82b15633a568 |
| 17 | Hugging Face | Senior Machine Learning Engineer, Voice Agents | EMEA remote | 2026-09-02 | https://apply.workable.com/j/9E2A4C02C7 |
| 18 | Hugging Face | Senior Open-Source Python Engineer, ML Developer Tools | EMEA remote | 2026-09-21 | https://apply.workable.com/j/DB4D7C0EC8 |
| 19 | DoiT | Senior Platform Engineer | Remote (EU countries incl. Eastern Europe, Portugal) | not shown; archived | https://www.bestjobs.eu/en/job/senior-platform-engineer-30 |
| 20 | Satispay | Senior Front End Developer - Tech Lead | Milan, hybrid | removed 2025-11-19 | https://builtin.com/job/senior-software-engineer-front-end-developer/6656016 |
| 21 | Satispay | Senior Software Engineer, Back End Developer | Milan, hybrid | removed 2026-02-02 | https://builtin.com/job/senior-software-engineer-back-end-developer/6841030 |

**Mix of roles**
- AI/LLM-centred: #1, 2, 5, 6, 7, 15, 17, 18
- Platform/DevOps/SRE: #3, 4, 7, 10, 14, 19
- Backend/general: #8, 9, 11, 12, 16, 21
- Frontend lead: #20

**Stated experience**, where a number is given:
- 3+ (#11), 4+ (#5), 5+ (#18), 6+ (#4, 14, 15, 19), 7+ (#21), 8+ (#13, 20), 10+ (#12, staff)
- The typical senior bar is **5–8 years**.

## 2. Skill frequency (N = 21)

| Skill (normalized) | Category | Count | Example phrasing |
|---|---|---|---|
| Distributed systems & scalability (failure modes, consistency, high scale) | CS fundamentals | 16 | "reason about consistency, failure modes, backpressure, idempotency, quorum, retries" (Datadog #10) |
| Observability (metrics, logging, tracing, dashboards, OpenTelemetry/Prometheus/Grafana) | cloud/devops | 12 | "Design and implement monitoring and observability systems across the token path" (Anthropic #7) |
| End-to-end ownership | soft/senior | 11 | "Own AI initiatives end-to-end, from stakeholder discovery and technical design through implementation, deployment, and iteration" (GitLab #1) |
| System design / architecture & technical direction | soft/senior | 11 | "Experience designing or evolving modular backend boundaries, bounded contexts, and migration-safe architectures" (GitLab #3) |
| Mentoring / growing other engineers | soft/senior | 11 | "Mentor engineers on the team and set the bar in design reviews and code reviews" (Docker #13) |
| Written communication (design docs, RFCs, postmortems, async) | soft/senior | 11 | "Clear written and verbal communication in a remote environment (RFCs, design docs, incident writeups)" (Docker #14) |
| Cross-team collaboration / influence / stakeholders | soft/senior | 11 | "Ability to lead through influence, technical judgment, and clear written communication" (GitLab #3) |
| API design (REST, GraphQL, streaming protocols, platform APIs) | backend | 10 | "Designing or extending REST or GraphQL APIs with attention to scalability, maintainability, and backward compatibility" (GitLab #2) |
| CS degree or equivalent experience | CS fundamentals | 9 | "BS/MS/PhD in a Computer Science, Engineering or related scientific field or equivalent experience" (Datadog #9) |
| Databases & data modelling (SQL, PostgreSQL, multiple data stores) | data | 8 | "Strong SQL skills and familiarity with relational databases such as PostgreSQL, including efficient queries and data modeling" (GitLab #2) |
| Reliability engineering (SLOs, fault tolerance, resilience, self-healing) | cloud/devops | 8 | "Build for reliability, making services and infrastructure available, resilient, fault-tolerant, and self-healing" (MongoDB #4) |
| On-call & incident response / postmortems | cloud/devops | 8 | "Participate in Tier 2 on-call rotations to troubleshoot production issues, contribute to root cause analysis" (GitLab #2) |
| Performance diagnosis & optimization | CS fundamentals | 8 | "Ability to find, diagnose, and prevent performance and reliability problems at scale" (GitLab #2) |
| Security by design (auth/IAM, RBAC, secrets, isolation, guardrails) | security | 8 | "Ability to reason about isolation and security boundaries: what a sandbox should and shouldn't expose" (Docker #13) |
| Using AI coding/ops tools daily and validating their output | AI/LLM | 8 | "Demonstrated ability to use AI coding tools in day-to-day workflows and validate, critique, and refine AI-generated output" (Datadog #8) |
| Kubernetes | cloud/devops | 7 | "Understand Kubernetes workload lifecycles, including how pods, controllers, scheduling, draining, and eviction interact" (Datadog #10) |
| Public cloud (AWS / GCP / Azure) | cloud/devops | 7 | "Expertise in cloud infrastructure platforms, including AWS, GCP, or Azure" (MongoDB #4) |
| Python | language | 7 | "Significant experience building and maintaining production Python backends, including APIs, data models, and asynchronous or long-running workloads" (GitLab #2) |
| Agentic systems (tool use, multi-agent orchestration, MCP, human-in-the-loop) | AI/LLM | 7 | "Proven experience building or operating agentic systems in production — architecting loops, tool-use, and error-handling strategies" (GitLab #3) |
| Go | language | 6 | "Build self-service capabilities and platform APIs (primarily in Go)" (Docker #14) |
| Product mindset / business impact | soft/senior | 6 | "You talk about users, workflows, and outcomes rather than only implementation details" (n8n #16) |
| Code review & setting engineering standards | soft/senior | 6 | "Define backend standards for style, maintainability, testing, APIs, and operational readiness" (GitLab #3) |
| Autonomy under ambiguity | soft/senior | 6 | "Turn ambiguous infrastructure problems into clear designs and working systems" (Docker #14) |
| Open-source contribution (often a bonus) | soft/senior | 6 | "Substantial open-source contributions to a Python library" (Hugging Face #17) |
| LLM API integration (OpenAI/Anthropic/open models) | AI/LLM | 5 | "Prior experience with OpenAI, Anthropic, or similar LLM APIs" (Docker #15) |
| Java | language | 5 | "Deep experience with Java and a strong understanding of cloud platforms" (Satispay #21) |
| TypeScript / JavaScript (Node.js) | language | 5 | "Hands-on experience with TypeScript, Node.js, and either Vue or React" (n8n #16) |
| Automated testing (unit/integration/E2E, pytest) | backend | 5 | "Maintaining unit, integration, and E2E tests" (Satispay #20) |
| Linux & networking (TCP/IP, DNS, TLS, proxies) | cloud/devops | 5 | "Understanding of Linux operating system internals and networking concepts (e.g., TCP/IP, DNS, TLS, routing)" (MongoDB #4) |
| CI/CD & GitOps (GitHub Actions, Argo CD) | cloud/devops | 4 | "Delivery standards with Terraform, GitOps on Argo CD, progressive rollout" (Docker #14) |
| Model serving / inference infrastructure | AI/LLM | 4 | "LLM inference optimization, batching, and caching strategies" (Anthropic #6) |
| Automation over toil | cloud/devops | 4 | "Prefer automation over manual processes ... strong bias towards software solutions to avoid toil" (MongoDB #4) |
| Containers / Docker | cloud/devops | 3 | "Experience with Kubernetes, Docker, and microservices architecture" (Docker #15) |
| Rust | language | 3 | "Fluency in Go, and/or Rust" (Docker #15) |
| Evaluation of LLM output (evals, replay, backtesting) | AI/LLM | 3 | "Infrastructure to support evaluation, telemetry, replay, and backtesting for agents and LLM workflows" (Docker #15) |
| AI safety & guardrails (prompt injection, policy enforcement) | AI/LLM / security | 3 | "Input validation, output filtering, access controls, prompt injection defences, and data leakage prevention" (GitLab #1) |
| Realtime streaming (WebSockets, WebRTC) | backend | 3 | "Design the developer API and the streaming protocol: session lifecycle, transport (WebSockets/WebRTC)" (Hugging Face #17) |
| Frontend framework (React / Vue / Svelte) | language | 3 | "Professional experience with a modern frontend framework such as React or Svelte" (Hugging Face #18) |
| Terraform / Infrastructure as Code | cloud/devops | 2 | "Design and implement Infrastructure as Code using Terraform" (DoiT #19) |
| RAG / vector databases | AI/LLM | 2 | "When RAG is the right architecture versus expanding the context window" (GitLab #1) |
| Prompt & context engineering | AI/LLM | 2 | "Designing effective system prompts, managing context windows, structuring multi-turn interactions" (GitLab #1) |
| Agent frameworks (LangGraph / LangChain) | AI/LLM | 2 | "Hands-on experience with agent frameworks such as LangGraph or LangChain is a strong plus" (GitLab #2) |
| Microservices / service-oriented architecture | backend | 2 | "Building and maintaining microservices and complex cloud environments" (Satispay #21) |

**Notes**
- **"At least one backend language" beats any single language.** Almost every posting accepts a range, for example "Python, Go, or a similar language" or "We value the ability to learn and adapt over mastery of a single language". Python and Go are the most common, followed by Java and TypeScript.
- **AI is now a cross-cutting expectation, not only a specialty.** 8/21 postings expect daily use of AI coding or ops tools, including non-AI roles at Datadog and Docker. 7/21 ask for agentic-system experience, including the Core DevOps and Infrastructure roles.
- **Classic ML (training, PyTorch, statistics) barely appears.** "AI engineer" in 2026 postings means building production systems on top of LLMs, not training models.

## 3. Seniority signals: what separates senior from mid

1. **Owning outcomes, not tasks.**
   - "Move beyond 'assigned work' to actively improve the quality, reliability, and performance of our systems" (GitLab #3).
   - Ownership runs from discovery through production adoption, and success is measured by outcomes for users or consuming teams (Docker #14, GitLab #1).
2. **Designing systems and making trade-offs.**
   - Seniors choose between a modular monolith and services, design migration-safe architectures, and evaluate tools and models on cost against capability.
   - They write the RFCs and design docs that others build from (GitLab #3, Docker #14, GitLab #1).
3. **Diagnosing before building.**
   - "Be prepared to say 'this doesn't need AI'" (GitLab #1).
   - "Reach for the simplest solution". "Care about simple designs and performance" (Datadog #8).
4. **Running production.**
   - On-call, incident leadership, postmortems, SLOs, and preventing problems rather than heroically fixing them: "less dependent on heroics" (Docker #14).
   - This shows up in backend roles too, not only SRE.
5. **Multiplying the team.**
   - Mentoring, setting the bar in code and design reviews, and defining team standards (GitLab #3, Docker #13, Datadog #10).
   - Mentoring appears in more than half of the postings.
6. **Leading through influence across teams.**
   - Driving consensus on "hard, ambiguous problems that cross team and component boundaries" (Docker #13).
   - Building relationships so you are "welcomed as teammates, not outsiders with opinions" (Anthropic #7).
7. **Communicating in writing, asynchronously.**
   - Design docs, runbooks, postmortems and documentation are named explicitly. This matters most at remote-first companies (GitLab, Docker, Hugging Face, n8n).
8. **Handling ambiguity and autonomy.**
   - Seniors work "with minimal guidance" (GitLab #3) and "drive it forward autonomously" (Hugging Face #17).
   - Docker's 30/60/90-day plans expect a new hire to become "a recognized technical owner of key parts of the codebase" within a year.
9. **Thinking about product and business.**
   - Seniors scope MVPs, instrument what they ship, and tie work to measurable impact (n8n #16, GitLab #1, Stripe #12).
10. **Judging AI use.**
    - Seniors use AI tools, then "validate, critique, and refine AI-generated output" (Datadog #8).
    - They coach others "on responsible, high-judgment use" (GitLab #3) and keep a human in the loop for production changes (Docker #14).
11. **Showing a public track record (a differentiator, not a requirement).**
    - Open-source maintenance, talks and blog posts are explicitly valued at Hugging Face and Docker.

**Senior compared with staff:** staff postings (Stripe #12, Anthropic #7) add leading technical vision for a whole area, 5+ years of strategic leadership, and coaching a team.

## 4. Must-cover list for the roadmap (≥ 25% of postings, i.e. ≥ 6 of 21)

Ordered by frequency, with ties grouped:

1. Distributed systems & scalability fundamentals (16)
2. Observability: metrics, logs, traces, dashboards (12)
3. End-to-end ownership (11)
4. System design / architecture & technical direction (11)
5. Mentoring (11)
6. Written communication: design docs, RFCs, postmortems (11)
7. Cross-team collaboration & influence (11)
8. API design: REST, GraphQL, streaming (10)
9. CS fundamentals (degree or equivalent) (9)
10. Databases & data modelling: SQL / PostgreSQL (8)
11. Reliability engineering: SLOs, fault tolerance (8)
12. On-call & incident response (8)
13. Performance diagnosis & optimization (8)
14. Security by design: auth, IAM, secrets, isolation (8)
15. Using AI coding/ops tools and validating their output (8)
16. Kubernetes (7)
17. Public cloud: AWS / GCP / Azure (7)
18. Python (7)
19. Agentic systems: tool use, multi-agent, MCP (7)
20. Go (6)
21. Product mindset / business impact (6)
22. Code review & engineering standards (6)
23. Autonomy under ambiguity (6)
24. Open-source contribution (6, mostly listed as a bonus)

**Just below the threshold, but worth covering for an AI + DevOps profile:**
- At 5: LLM API integration, TypeScript/Node.js (the learner's existing strength), Java, automated testing, Linux & networking.
- At 4: CI/CD & GitOps, model serving.
- At 3: Docker/containers, LLM evals, AI guardrails.
- At 2: Terraform/IaC, RAG.
