# Curricula research — reference programmes

Retrieved: 2026-10-19. Goal lens: junior front-end dev (no CS degree) → **senior software engineer with AI + DevOps expertise**.
Raw extracts and official PDFs live in `Resources/syllabi/<slug>/`.

## Retrieval status

| Programme | Status | Local files |
|---|---|---|
| Unimercatorum LM-66 Sicurezza Informatica | OK — study plan from web page; per-course schede (PDF) downloaded | `Resources/syllabi/unimercatorum-lm66/` (regolamento, SUA, 11 schede) |
| Uniroma5 LM-32 Ing. Informatica e IA Applicata | OK — study plan + lesson lists from each course page | `Resources/syllabi/uniroma5-magistrale-lm32/` (regolamento, SUA, curriculum.md) |
| Uniroma5 L-8 Ing. Informatica e IA | OK — study plan + lesson lists from each course page | `Resources/syllabi/uniroma5-triennale-l8/` (regolamento, SUA, curriculum.md) |
| Coursera Microsoft Full-Stack Developer | OK (web page only) | `Resources/syllabi/coursera-microsoft-fullstack/curriculum.md` |
| Coursera IBM DevOps and Software Engineering | OK (web page only) | `Resources/syllabi/coursera-ibm-devops-swe/curriculum.md` |
| HarvardX CS for AI (CS50x + CS50AI) | **edX page not retrievable** (JS-rendered, empty). Reconstructed from cs50.harvard.edu official course sites + search listings | `Resources/syllabi/harvardx-cs50-ai/curriculum.md` |
| Data Masters AI Engineer | OK (web page; no hours per module; brochure has no direct URL) | `Resources/syllabi/datamasters-ai-engineer/curriculum.md` |
| IBM PDF `15db45f02d520e35` | **Downloaded but contains no curriculum**: a single-page Photoshop brand graphic (IBM 8-bar 3D rendering, no text). Not kept. | — |

Note: the university PDFs are served from `assets.ctfassets.net` (the Contentful CDN the official university sites link to). No university offers a single "piano di studi" PDF; the study plan is in the regolamento + SUA.

---

## 1. Unimercatorum — LM-66 Sicurezza Informatica (Master's, 120 CFU)

Source: https://www.unimercatorum.it/corsi-di-laurea/sicurezza-informatica · course schede: `https://www.unimercatorum.it/programma/<code>` (return PDFs)

| Course | Year | CFU | Key topics (from scheda) |
|---|---|---|---|
| Statistical Learning e Analisi dei Big Data | 1 | 9 | Big data, EDA, R/SPSS, regression, PCA, correspondence/cluster analysis, Python for stats, intro ML, neural nets, time series |
| Sicurezza e protezione dei dati e dei sistemi informatici | 1 | 9 | Symmetric/asymmetric crypto, certificates, signatures, DDoS/botnets, malware, firewalls, IDS/IPS/SIEM, disaster recovery, ethical hacking (Wireshark, Metasploit, Burp), web security (XSS, SQLi, CSRF), DB security |
| Economia e gestione dell'innovazione | 1 | 9 | Microeconomics of innovation, markets, project management, Agile/Scrum/Kanban, portfolio/program mgmt, CIO role |
| Tecnologie e sicurezza delle reti di comunicazione | 1 | 9 | OSI/TCP-IP, switching, queueing, error detection, MAC protocols, routing (Dijkstra, Bellman-Ford), flow control, 802.11, TCP/IP, network security, NAT/MPLS, IPsec VPN |
| Elementi di diritto penale e criminalità informatica | 1 | 9 | Italian criminal law, computer crimes (unauthorised access, fraud, ransomware, cyberstalking), digital evidence |
| Gestione del rischio e continuità operativa | 1 | 6 | Governance, risk management, ISO 31000, ESG/sustainability reporting, business continuity, budgeting |
| Conoscenze linguistiche | 1 | 3 | (no scheda) |
| Altre conoscenze utili per il mondo del lavoro | 1 | 3 | Labour law, pensions, workplace safety |
| Cybersecurity | 2 | 9 | Threat landscape, cybercrime, CTI, OSINT, SOC/CSIRT, NIST incident response, MITRE frameworks, ethical hacking phases, web app hacking |
| Informatica giuridica ed etica digitale | 2 | 6 | Data security law, ENISA, CAD, digital identity, AI ethics, EU AI Act, open data |
| Principi e Metodi di Crittografia | 2 | 6 | Modular arithmetic, symmetric (DES/AES, modes), asymmetric (RSA, DH), hashes (SHA-2/3), PRNGs, MAC/HMAC, digital signatures, certificates |
| Informatica Forense e Sicurezza dell'IA | 2 | 9 | Digital forensics: evidence acquisition/preservation, ISO standards, VM-based analysis (scheda has no lesson list) |
| Electives (affine 12 + free 9), Prova finale | 2 | 33 | — |

## 2. Uniroma5 (San Raffaele) — LM-32 Ingegneria Informatica e dell'IA Applicata (Master's, 120 CFU, A.Y. 2026/27)

Source: https://www.uniroma5.it/magistrale/ingegneria-informatica-e-intelligenza-artificiale-applicata · lessons: `Resources/syllabi/uniroma5-magistrale-lm32/curriculum.md`

| Course | Year | CFU | Key topics (from lesson list) |
|---|---|---|---|
| IoT e Sistemi intelligenti 3D | 1 | 9 | Embedded systems, memory, interrupts, GPIO/UART/SPI/I2C, IoT networking, TinyML, quantisation/pruning, ONNX, TensorRT, 3D sensors/point clouds |
| Apprendimento automatico e apprendimento profondo | 1 | 9 | Python ML stack, classic ML (NB, KNN, SVM, trees, RF, regression, regularisation), clustering, PCA/t-SNE, MLP/CNN/RNN, transformers & attention, fine-tuning, XAI |
| Introduzione al trattamento quantistico delle informazioni | 1 | 6 | Qubits, entanglement, quantum gates, Shor/Grover; FPGA & VHDL, Vivado |
| Visione computerizzata e sistemi cognitivi | 1 | 9 | Image filtering, features, geometry, RANSAC, CNNs, transfer learning, detection, segmentation, ViT, self-supervised, VAE/GAN/diffusion, 3D vision/NeRF/3DGS |
| Trattamento dei dati multimediali | 1 | 9 | Image/video/audio representation, compression (LZW, JPEG, wavelets), video codecs (MPEG, H.264/265/266), audio codecs |
| Intelligenza artificiale distribuita | 1 | 9 | Distributed systems (architectures, P2P, TCP/UDP, RPC/RMI, multicast, consensus, failure detectors, mutual exclusion, election), distributed transactions, replication/consistency, multi-agent systems |
| Intelligenza artificiale scalabile | 1 | 9 | Distributed ML patterns (ingestion, batching, sharding, caching, parameter server, model serving, event-driven, workflows), HPC & computer architecture (ILP, SIMD, multicore, warehouse-scale computers) |
| Robotica intelligente | 2 | 8 | Control (PID), kinematics/dynamics, Jacobians, mobile robots, motion planning, cognitive architectures |
| Intelligenza artificiale nella Bioinformatica | 2 | 8 | ML/DL on biological data, transformers, foundation models, AlphaFold, generative AI for drugs/proteins, AI agents for pipelines |
| Elementi di Bioinformatica (elective) | — | 8 | Statistics, molecular biology, biological databases, BLAST, GO, clustering, PCA |
| Electives (8+8), Internship 12, Prova finale 16 | 2 | 44 | — |

## 3. Uniroma5 (San Raffaele) — L-8 Ingegneria Informatica e IA (Bachelor's, 180 CFU, A.Y. 2026/27)

Source: https://www.uniroma5.it/triennale/ingegneria-informatica-e-intelligenza-artificiale · lessons: `Resources/syllabi/uniroma5-triennale-l8/curriculum.md`

| Course | Year | CFU | Key topics (from lesson list) |
|---|---|---|---|
| Analisi matematica I e Geometria | 1 | 12 | Sets, functions, limits, series, continuity, derivatives, Taylor, integrals, vectors & vector spaces |
| Fondamenti di Informatica | 1 | 9 | Binary/number representation, IEEE 754, Boolean logic, Von Neumann architecture, algorithms & flowcharts, C basics, SQL DDL/DML |
| Fisica | 1 | 9 | Mechanics, fluids, thermodynamics, optics, electrostatics, circuits |
| Analisi Matematica II | 1 | 9 | Multivariable calculus, series, Fourier, differential forms, ODEs, multiple integrals |
| Metodi numerici per l'Ingegneria | 1 | 6 | Linear programming, simplex, duality, nonlinear optimisation, gradient descent, KKT, linear regression |
| Basi di dati | 1 | 9 | Relational model, relational algebra, SQL (PostgreSQL), transactions, ER modelling, normalisation, physical design |
| Programmazione Object Oriented | 1 | 6 | Python basics, functions, control flow, classes, inheritance, polymorphism, modules |
| Statistica e data analysis | 2 | 9 | Descriptive stats, regression, probability, Bayes, distributions, sampling, estimation, hypothesis tests, ANOVA |
| Algoritmi e strutture dati | 2 | 6 | Asymptotic complexity, sorting algorithms, lists/stacks/queues, trees, BST, BFS, graphs (C++) |
| Reti di calcolatori | 2 | 9 | *Page's lesson list is actually computer architecture*: MIPS assembly, number formats, Boolean circuits, ALU, CPU datapath |
| Fondamenti di elettronica | 2 | 6 | Semiconductors, diodes, BJT, MOSFET, amplifiers, digital electronics |
| IoT e sistemi connessi | 2 | 6 | *Lesson list is a mix*: databases/SQL, networking basics, security, crypto, software design, intro ML |
| Data Science | 2 | 6 | *Lesson list is mostly business strategy* + business statistics, data warehousing, data mining, big data |
| Sistemi Operativi e Cybersecurity | 2 | 9 | Threat landscape, CTI, SOC, incident response, MITRE, ethical hacking (same content as Unimercatorum "Cybersecurity"; no OS topics listed) |
| Machine Learning e Artificial Intelligence | 2 | 9 | Agents, search, logic, knowledge representation, probability, supervised/unsupervised ML, ensembles, RL intro, ML pipelines, fairness, deep learning (CNN, RNN, generative) |
| Robotica Intelligente e Sistemi Autonomi | 3 | 9 | Robot paradigms, reactive/hybrid architectures, navigation, ROS2, multi-robot |
| Ingegneria del Web | 3 | 6 | OSI/TCP-IP, HTTP/HTTPS, cookies, client-server, XML/JSON, HTML, forms, CSS (box model, layout) |
| Economia e organizzazione aziendale | 3 | 6 | Engineering economy (NPV, IRR), financial statements, project financing, microeconomics |
| Deep Learning per Applicazioni Avanzate | 3 | 9 | Prompt engineering, LLMs & transformers, function calling, LangChain, chains/agents, RAG, memory, diffusion models, AI-driven app design |
| Inglese | 3 | 3 | English grammar B1/B2 |
| Electives (6+6), Internship 12, Prova finale 3 | 3 | 27 | — |

Caveat: the lesson lists of "Reti di calcolatori", "IoT e sistemi connessi" and "Data Science" on the official pages do not match the course titles; reported as published.

## 4. Coursera — Microsoft Full-Stack Developer Professional Certificate

Source: https://www.coursera.org/professional-certificates/microsoft-full-stack-developer — 12 courses, ~417 h.

| Course | Order | Hours | Key topics |
|---|---|---|---|
| Foundations of Coding Full-Stack | 1 | 39 | Problem solving, algorithms, control flow, functions, Git, debugging, Copilot |
| Introduction to Programming With C# | 2 | 30 | C#, .NET, OOP, async |
| Introduction to Web Development | 3 | 38 | HTML, CSS, JS, responsive, accessibility, DOM, JSON |
| Blazor for Front-End Development | 4 | 33 | Components, binding, routing, state |
| Back-End Development with .NET | 5 | 44 | ASP.NET Core APIs, middleware, DI, API design |
| Database Integration and Management | 6 | 26 | EF Core, SQL, transactions, concurrency, tuning |
| Full-Stack Integration | 7 | 34 | REST integration, async, full-stack architecture |
| Security and Authentication | 8 | 39 | Identity, JWT, RBAC, encryption, secure coding |
| Performance Optimization and Scalability | 9 | 44 | Caching, indexing, load balancing, scalable architecture |
| Data Structures and Algorithms | 10 | 48 | Lists, trees, graphs, sorting/searching, complexity |
| Deployment and DevOps | 11 | 37 | Azure, CI/CD, monitoring, scaling |
| Capstone | 12 | 5 | End-to-end app |

## 5. Coursera — IBM DevOps and Software Engineering Professional Certificate

Source: https://www.coursera.org/professional-certificates/devops-and-software-engineering — 15 courses, ~235 h.

| Course | Order | Hours | Key topics |
|---|---|---|---|
| Introduction to DevOps | 1 | 9 | Culture, CI/CD, IaC, TDD/BDD |
| Introduction to Cloud Computing | 2 | 12 | IaaS/PaaS/SaaS, deployment models, cloud security |
| Agile Development and Scrum | 3 | 13 | Scrum, user stories, Kanban |
| Introduction to Software Engineering | 4 | 15 | SDLC, architecture, design patterns |
| Git and GitHub | 5 | 11 | Branching, PRs |
| Linux Commands and Shell Scripting | 6 | 17 | Bash, pipes, cron |
| Python for Data Science, AI & Development | 7 | 24 | Python, Pandas, NumPy, APIs |
| AI Applications with Python and Flask | 8 | 12 | Flask, REST, unit tests, packaging |
| Containers: Docker, Kubernetes & OpenShift | 9 | 17 | Docker, K8s, OpenShift, Istio |
| Microservices and Serverless | 10 | 16 | Microservices, Swagger, serverless |
| Test and Behavior Driven Development | 11 | 21 | TDD, BDD, mocks, coverage |
| CI/CD | 12 | 15 | Terraform, Jenkins, GitHub Actions, Argo CD |
| Application Security for Devs & DevOps | 13 | 17 | OWASP, threat modelling, container scanning |
| Monitoring and Observability | 14 | 16 | OpenTelemetry, Prometheus, Grafana |
| Capstone | 15 | 20 | Microservice + CI/CD deploy |

## 6. HarvardX — Computer Science for Artificial Intelligence (CS50x + CS50AI)

Program page https://www.edx.org/certificates/professional-certificate/harvardx-computer-science-for-artifical-intelligence **could not be retrieved** (JS-rendered). Data from https://cs50.harvard.edu/x/ and https://cs50.harvard.edu/ai/ ; effort from Harvard Online / edX listings.

| Course | Order | Effort | Key topics |
|---|---|---|---|
| CS50x Introduction to Computer Science (2026) | 1 | 12 weeks, 6–18 h/wk | Scratch, C, arrays, algorithms, memory, data structures, Python, SQL, AI lecture, HTML/CSS/JS, Flask, final project |
| CS50AI Introduction to AI with Python | 2 | 7 weeks, 10–30 h/wk | Search, knowledge/logic, uncertainty, optimisation, learning, neural networks, language |

## 7. Data Masters — AI Engineer career path

Source: https://datamasters.it/catalogo/percorsi-di-carriera/ai-engineer-50/ — no hours per module (FAQ: ~3 months, 3–5 h/week).

| Module | Order | Hours | Key topics |
|---|---|---|---|
| Data Driven Mindset | 1 | n/a | AI fundamentals, data culture, cloud & AI |
| Fondamenti di Python | 2 | n/a | Syntax, data structures, encoding, JSON, HTTP/Requests, OOP |
| GenAI for Developers | 3 | n/a | Prompt/context/harness engineering, Claude Code, MCP, Copilot/Cursor |
| AI Agents | 4 | n/a | n8n, LLM fundamentals, embeddings, OpenAI Agents SDK, LangChain/LangGraph, RAG, evals, RLHF/GRPO, DSPy |
| Agentic AI Security | 5 | n/a | OWASP LLM Top 10, MITRE ATLAS |
| ML Operations | 6 | n/a | Git, uv, pytest, containers, GCP/IAM, Cloud Run, GitHub Actions, MLflow |

---

## Consolidated subject decisions

| Subject (sources) | Decision | Reason |
|---|---|---|
| Computational thinking & programming fundamentals (CS50x, MS Foundations, Fondamenti di Informatica) | KEEP | Foundation a self-taught dev usually lacks |
| Data representation, Boolean logic, computer architecture (Fondamenti di Informatica, "Reti di calcolatori" MIPS, CS50 Memory) | KEEP | Explains memory, floats, performance — needed for senior-level reasoning |
| C & memory management (CS50x) | MERGE into Computer architecture & memory | Learn it as a vehicle for memory, not as a career language |
| Python (OOP course, IBM Python, Data Masters Python) | KEEP | Lingua franca of AI and DevOps tooling |
| Object-oriented programming & design patterns (OOP, C#, IBM SWE intro) | KEEP | Core design skill |
| C# / .NET / Blazor (MS) | MERGE into Back-end development | Stack choice is optional; JS/TS + Python cover the goal |
| Algorithms & data structures + complexity (ASD, MS DSA, CS50) | KEEP | Interviews and scalable code |
| Discrete math / linear algebra / calculus essentials (Analisi I & II, Geometria) | MERGE into Math for ML | Only the parts ML needs (vectors, matrices, derivatives, gradients); drop full analysis |
| Numerical optimisation (Metodi numerici) | MERGE into Math for ML | Gradient descent & regression are what matter |
| Probability & statistics (Statistica, Statistical Learning) | KEEP | Required for ML and for metrics/observability |
| Physics (Fisica) | DROP | Not relevant to SWE/AI/DevOps |
| Electronics (Fondamenti di elettronica) | DROP | Hardware design, off-goal |
| Quantum computing / FPGA-VHDL | DROP | Niche research topic |
| Web fundamentals: HTTP, HTML, CSS, JS, accessibility (Ingegneria del Web, MS Web Dev, CS50) | KEEP | Learner's base; deepen HTTP/protocol side |
| Front-end framework (Blazor) | MERGE into Web fundamentals | Learner already does front-end; React/TS instead |
| Back-end & APIs (ASP.NET, Flask, Django, REST, microservices) | KEEP | Full-stack is the path to senior |
| Databases: relational model, SQL, ER, normalisation, transactions (Basi di dati, MS DB) | KEEP | Every backend and AI app needs it |
| Data warehousing / data mining / big data (Data Science, Statistical Learning) | MERGE into Data engineering basics | Useful context, short treatment |
| Business strategy content (Data Science lesson list) | DROP | Off-goal |
| Computer networks: OSI/TCP-IP, routing, TCP/UDP, NAT, VPN (Tecnologie reti, Ingegneria del Web) | KEEP | DevOps and cloud need networking |
| Operating systems & Linux, shell scripting (IBM Linux) | KEEP | DevOps foundation (note: Uniroma5 "SO e Cybersecurity" lists no OS topics) |
| Git & version control (all certificates) | KEEP | Daily tool |
| Software engineering: SDLC, architecture, Agile/Scrum (IBM, Economia innovazione PM part) | KEEP | Senior engineers drive process |
| Testing: unit, TDD/BDD, pytest (IBM, Data Masters) | KEEP | Quality is a senior responsibility |
| Security for developers: OWASP, auth (JWT, RBAC), web vulns (MS Security, IBM AppSec, Sicurezza dati) | KEEP | Non-negotiable for production code |
| Cryptography (Crittografia, Sicurezza dati) | MERGE into Security for developers | Concepts (hashing, TLS, signatures), not maths proofs |
| Offensive security / CTI / SOC / incident response (Cybersecurity) | MERGE into Security for developers | Awareness level only; incident response feeds SRE |
| Digital forensics | DROP | Legal/investigative specialisation |
| Cloud computing (IaaS/PaaS/SaaS, Azure, GCP, IAM) | KEEP | DevOps core |
| Containers & orchestration (Docker, Kubernetes) | KEEP | DevOps core |
| CI/CD & Infrastructure as Code (GitHub Actions, Jenkins, Terraform, Argo CD) | KEEP | DevOps core |
| Microservices & serverless | KEEP | Modern architecture |
| Monitoring & observability (Prometheus, Grafana, OpenTelemetry) | KEEP | DevOps/SRE core |
| Performance & scalability (caching, load balancing, indexing) | KEEP | Senior-level system design |
| Distributed systems (consistency, consensus, replication, transactions) (IA distribuita) | KEEP | Backbone of system design |
| Scalable ML systems & serving patterns (IA scalabile) | MERGE into MLOps | Keep the patterns, drop HPC microarchitecture |
| HPC / processor microarchitecture (IA scalabile part 2) | DROP | Hardware-level, off-goal |
| Classical AI: search, logic, planning (CS50AI, ML e AI) | KEEP (light) | Good grounding, short |
| Machine learning (supervised/unsupervised, evaluation, pipelines) | KEEP | Core AI |
| Deep learning (NNs, CNN, RNN, transformers/attention) | KEEP | Needed to understand LLMs |
| Computer vision | MERGE into Deep learning | One project-level module, not a full course |
| Multimedia data processing / codecs | DROP | Niche |
| LLMs, prompt engineering, function calling, RAG (Deep Learning App. Avanzate, Data Masters) | KEEP | Core of AI engineering today |
| AI agents & agent frameworks, MCP, Claude Code/harness engineering (Data Masters) | KEEP | Directly on-goal |
| LLM evaluation & alignment (evals, LLM-as-judge, RLHF/GRPO, DSPy) | KEEP | Senior AI engineers own quality |
| AI/LLM security (OWASP LLM Top 10, MITRE ATLAS, "Sicurezza dell'IA") | KEEP | Agentic systems need it |
| MLOps (MLflow, model deployment, Cloud Run) | KEEP | Where AI meets DevOps |
| Edge AI / TinyML / model quantisation, ONNX (IoT 3D) | MERGE into MLOps | Only quantisation/ONNX deployment concepts |
| IoT / embedded systems | DROP | Hardware-oriented |
| Robotics (both Uniroma5 courses) | DROP | Off-goal |
| Bioinformatics | DROP | Domain-specific |
| AI ethics, EU AI Act, GDPR/privacy (Informatica giuridica ed etica digitale) | KEEP (light) | Compliance matters for AI products |
| Criminal law / computer crime | DROP | Legal-only |
| Risk management & business continuity | MERGE into Observability & reliability | Keep disaster recovery/BCP only |
| Economics / engineering economy / innovation management | DROP | Except PM/Agile, merged above |
| Labour law (Altre conoscenze) | DROP | Off-goal |
| Technical English | KEEP (ongoing) | Docs and community are in English |
| Data-driven mindset / AI in business (Data Masters mod. 1) | MERGE into LLM fundamentals | Short orientation only |

---

## Consolidated subject list (progressive learning path from zero)

1. **Computational thinking & programming fundamentals** — algorithms, control flow, functions, debugging (CS50x weeks 0–1).
2. **Technical English** (ongoing throughout).
3. **Git & version control** — branching, PRs, GitHub workflow.
4. **Web fundamentals revisited** — HTTP/HTTPS, cookies, JSON, HTML/CSS/JS, accessibility; then TypeScript.
5. **Python** — syntax, data structures, OOP, exceptions, packaging (uv), files/JSON/HTTP requests.
6. **Object-oriented design & design patterns.**
7. **Computer architecture & memory** — binary, IEEE 754, Boolean logic, CPU/memory, a taste of C pointers.
8. **Algorithms & data structures** — complexity, sorting, lists/stacks/queues, trees, graphs.
9. **Linux & shell scripting** — processes, filesystem, Bash, cron, OS concepts.
10. **Computer networks** — OSI/TCP-IP, DNS, routing, TCP/UDP, NAT, TLS, VPN.
11. **Databases** — relational model, SQL, ER design, normalisation, transactions, indexing; then data-warehousing/big-data basics.
12. **Back-end development & APIs** — REST, a framework (Node/Express or FastAPI/Flask), auth integration, full-stack integration.
13. **Software engineering practice** — SDLC, Agile/Scrum/Kanban, architecture.
14. **Testing** — unit/integration, TDD/BDD, pytest/Jest, mocks, coverage.
15. **Security for developers** — OWASP Top 10, JWT/RBAC, crypto concepts (hashing, signatures, PKI), threat modelling, incident-response awareness.
16. **Cloud computing** — IaaS/PaaS/SaaS, IAM, one provider (Azure/GCP/AWS).
17. **Containers & Kubernetes** — Docker, registries, K8s.
18. **CI/CD & Infrastructure as Code** — GitHub Actions, Terraform, GitOps (Argo CD).
19. **Microservices & serverless.**
20. **Monitoring, observability & reliability** — golden signals, OpenTelemetry, Prometheus/Grafana, logs, disaster recovery/BCP.
21. **Performance, scalability & distributed systems** — caching, load balancing, replication, consistency, consensus, distributed transactions → system design.
22. **Math for ML** — linear algebra, derivatives/gradients, optimisation (gradient descent).
23. **Probability & statistics** — distributions, Bayes, estimation, hypothesis testing, regression.
24. **Classical AI (light)** — search, logic, uncertainty, optimisation (CS50AI weeks 0–3).
25. **Machine learning** — supervised/unsupervised, evaluation metrics, pipelines, fairness.
26. **Deep learning** — neural nets, CNN (incl. a computer-vision project), RNN, attention & transformers.
27. **LLM fundamentals** — tokenisation, embeddings, how LLMs work, AI in business context.
28. **LLM application engineering** — prompt & context engineering, function calling, structured output, RAG (LangChain/LangGraph).
29. **AI agents** — agent loop, tools, memory, MCP, multi-agent orchestration, agent SDKs, Claude Code/harness engineering.
30. **LLM evaluation & alignment** — evals, LLM-as-judge, benchmarks, RLHF/GRPO overview, DSPy.
31. **AI/LLM security** — OWASP LLM Top 10, prompt injection, MITRE ATLAS.
32. **MLOps** — experiment tracking (MLflow), model serving patterns, CI/CD for models, quantisation/ONNX deployment.
33. **AI ethics & regulation (light)** — EU AI Act, GDPR/privacy.
34. **Capstone** — full-stack AI app deployed via CI/CD on cloud with observability.
