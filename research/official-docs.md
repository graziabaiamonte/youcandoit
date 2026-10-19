# Official docs and reliable free learning sources

A curated list for YouCanDoIt roadmap tracks.

**How the links were checked:** every URL got an HTTP request (curl, following redirects, browser user-agent) on **2026-10-19**. Where a URL redirected, the final canonical URL is listed.

| Status | Meaning |
|---|---|
| ✅ | HTTP 200 |
| 🛡️ | The site blocks scripts (403/202 bot challenge) but is a well-known live site that opens in a browser |
| ⚠️ | Note attached |

---

## Programming foundations

| Topic | Source | URL | Status |
|---|---|---|---|
| Python | Official docs | https://docs.python.org/3/ | ✅ |
| Python | Official tutorial | https://docs.python.org/3/tutorial/ | ✅ |
| Python | PEP 8 style guide | https://peps.python.org/pep-0008/ | ✅ |
| Python tooling | uv / Ruff (Astral) | https://docs.astral.sh/uv/ · https://docs.astral.sh/ruff/ | ✅ |
| Python | Pydantic docs | https://pydantic.dev/docs/validation/latest/get-started/ (old `docs.pydantic.dev` redirects here) | ✅ |
| Python | Real Python (tutorials) | https://realpython.com/ | 🛡️ |
| Intro CS | Harvard CS50x | https://cs50.harvard.edu/x/ | ✅ |
| Intro AI | Harvard CS50 AI | https://cs50.harvard.edu/ai/ | ✅ |
| Algorithms | MIT OCW 6.006 Introduction to Algorithms (Spring 2020) | https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/ | ✅ |
| Math for CS | MIT OCW 6.042J Mathematics for Computer Science (Spring 2015) | https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/ | ✅ |
| Discrete math | *Discrete Mathematics: An Open Introduction* (Levin) | https://discrete.openmathbooks.org/dmoi3.html | ✅ |
| Proofs | *Book of Proof* (Hammack) | https://richardhammack.github.io/BookOfProof/ | ✅ (the old `people.vcu.edu/~rhammack` URL is dead) |
| DS&A | *Open Data Structures* (Morin) | https://opendatastructures.org/ | ✅ |
| DS&A | *Algorithms* (Jeff Erickson, free book) | https://jeffe.cs.illinois.edu/teaching/algorithms/ | ✅ |
| OOP & design patterns | Refactoring.Guru, design patterns | https://refactoring.guru/design-patterns | ✅ |
| Refactoring / clean code | Refactoring.Guru, refactoring and code smells | https://refactoring.guru/refactoring | ✅ |
| Testing | pytest docs | https://docs.pytest.org/en/stable/ | ✅ |
| Testing | Martin Fowler, *The Practical Test Pyramid* | https://martinfowler.com/articles/practical-test-pyramid.html | ✅ |
| Dev tools | MIT *The Missing Semester* (shell, git, vim, debugging) | https://missing.csail.mit.edu/ | ✅ |
| Git | *Pro Git* book (official) | https://git-scm.com/book/en/v2 | ✅ |
| Git | Learn Git Branching (interactive) | https://learngitbranching.js.org/ | ✅ |
| Linux | *The Linux Command Line* (Shotts, free book) | https://linuxcommand.org/tlcl.php | ✅ |
| Linux | Linux Journey | https://linuxjourney.com/ → now redirects to `labex.io/linuxjourney` | ⚠️🛡️ (moved to LabEx) |

## Web, backend and data

| Topic | Source | URL | Status |
|---|---|---|---|
| HTTP | MDN, HTTP | https://developer.mozilla.org/en-US/docs/Web/HTTP | ✅ |
| FastAPI | Official docs / tutorial | https://fastapi.tiangolo.com/ · https://fastapi.tiangolo.com/tutorial/ | ✅ |
| SQL | SQLBolt (interactive) | https://sqlbolt.com/ | ✅ |
| PostgreSQL | Official docs (current) | https://www.postgresql.org/docs/current/ | ✅ |
| PostgreSQL | Official tutorial | https://www.postgresql.org/docs/current/tutorial.html | ✅ |
| Indexing | *Use The Index, Luke* | https://use-the-index-luke.com/ | ✅ |
| Databases | CMU 15-445 Database Systems | https://15445.courses.cs.cmu.edu/ (redirects to the current term) | ✅ |
| SQLAlchemy | 2.0 docs / unified tutorial | https://docs.sqlalchemy.org/en/20/ · https://docs.sqlalchemy.org/en/20/tutorial/index.html | ✅ |
| Migrations | Alembic | https://alembic.sqlalchemy.org/en/latest/ | ✅ |
| Redis | Official docs | https://redis.io/docs/latest/ | ✅ |
| Redis | Redis University (free) | https://university.redis.io/ | ✅ |
| App design | The Twelve-Factor App | https://12factor.net/ | ✅ |
| Frontend (project stack) | Next.js · React · shadcn/ui · Tailwind · TypeScript | https://nextjs.org/docs · https://react.dev/learn · https://ui.shadcn.com/docs · https://tailwindcss.com/docs · https://www.typescriptlang.org/docs/handbook/intro.html | ✅ |

## Systems, networking, distributed systems

| Topic | Source | URL | Status |
|---|---|---|---|
| OS | *OSTEP: Operating Systems: Three Easy Pieces* | https://pages.cs.wisc.edu/~remzi/OSTEP/ | ✅ |
| Networking | Kurose & Ross video lectures (official) | https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm | ✅ |
| Networking | *Computer Networks: A Systems Approach* (free) | https://book.systemsapproach.org/ | ✅ |
| Networking | Beej's Guide to Network Programming | https://beej.us/guide/bgnet/ | ✅ |
| Distributed systems | MIT 6.5840 (formerly 6.824) | https://pdos.csail.mit.edu/6.824/ (hosts the current 6.5840 schedule) | ✅ |
| Distributed systems | *Designing Data-Intensive Applications* (book site) | https://dataintensive.net/ | ✅ |
| DDIA notes | Chapter-by-chapter notes (keyvanakbary) | https://github.com/keyvanakbary/learning-notes/blob/master/books/designing-data-intensive-applications.md | ✅ |
| System design | System Design Primer | https://github.com/donnemartin/system-design-primer | ✅ |
| Reliability | Google SRE books (free online) | https://sre.google/books/ · https://sre.google/sre-book/table-of-contents/ | ✅ |

## DevOps and cloud

| Topic | Source | URL | Status |
|---|---|---|---|
| Docker | Get started | https://docs.docker.com/get-started/ | ✅ |
| Kubernetes | Docs home / basics tutorial | https://kubernetes.io/docs/home/ · https://kubernetes.io/docs/tutorials/kubernetes-basics/ | ✅ |
| Terraform | Tutorials / docs | https://developer.hashicorp.com/terraform/tutorials · https://developer.hashicorp.com/terraform/docs | ✅ |
| GitHub Actions | Official docs | https://docs.github.com/en/actions | ✅ |
| AWS | Cloud Practitioner learning path | https://aws.amazon.com/training/learn-about/cloud-practitioner/ (old *digital/…essentials* URL redirects here) | ✅ |
| AWS | AWS Skill Builder | https://skillbuilder.aws/ | ✅ |
| Azure | AZ-900 fundamentals path / certification page | https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/ · https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/ | ✅ |
| GCP | Google Cloud training | https://cloud.google.com/learn/training | ✅ |
| GCP | Google Skills (formerly Cloud Skills Boost) | https://www.skills.google/ (`cloudskillsboost.google` redirects here) | ✅ |

## Observability

| Topic | Source | URL | Status |
|---|---|---|---|
| Sentry | Docs / FastAPI integration | https://docs.sentry.io/ · https://docs.sentry.io/platforms/python/integrations/fastapi/ | ✅ |
| OpenTelemetry | Docs / Python | https://opentelemetry.io/docs/ · https://opentelemetry.io/docs/languages/python/ | ✅ |
| Prometheus | Overview | https://prometheus.io/docs/introduction/overview/ | ✅ |
| Grafana | Docs | https://grafana.com/docs/grafana/latest/ | ✅ |
| Grafana | Tutorials | https://grafana.com/tutorials/ | 🛡️ |

## Security and privacy

| Topic | Source | URL | Status |
|---|---|---|---|
| OWASP Top 10 | Current edition | https://top10.owasp.org/ (`owasp.org/Top10/` redirects here) | ✅ |
| OWASP Top 10 | Project page | https://owasp.org/www-project-top-ten/ (redirects to `owasp.org/projects/top-ten`) | ✅ |
| OWASP | Cheat Sheet Series | https://cheatsheetseries.owasp.org/ | ✅ |
| OWASP | API Security Top 10 | https://owasp.org/API-Security/ (redirects to `api-security.owasp.org`) | ✅ (`owasp.org/www-project-api-security/` → **404**) |
| GDPR | Regulation (EU) 2016/679, EUR-Lex ELI | https://eur-lex.europa.eu/eli/reg/2016/679/oj | 🛡️ (202 bot challenge; this is the official permanent link) |

## Math, statistics and ML

| Topic | Source | URL | Status |
|---|---|---|---|
| Linear algebra | 3Blue1Brown, *Essence of Linear Algebra* | https://www.3blue1brown.com/topics/linear-algebra | ✅ |
| Calculus | 3Blue1Brown, *Essence of Calculus* | https://www.3blue1brown.com/topics/calculus | ✅ |
| Linear algebra / calculus / stats | Khan Academy | https://www.khanacademy.org/math/linear-algebra · https://www.khanacademy.org/math/calculus-1 · https://www.khanacademy.org/math/statistics-probability | ✅ |
| Statistics | StatQuest (YouTube / site) | https://www.youtube.com/@statquest · https://statquest.org/ | ✅ |
| Statistics | OpenStax *Introductory Statistics 2e* | https://openstax.org/details/books/introductory-statistics-2e | ✅ |
| ML | Google Machine Learning Crash Course | https://developers.google.com/machine-learning/crash-course | ✅ |
| Deep learning | PyTorch tutorials | https://docs.pytorch.org/tutorials/ (`pytorch.org/tutorials` redirects here) | ✅ |
| Deep learning / LLMs | Karpathy, *Neural Networks: Zero to Hero* | https://karpathy.ai/zero-to-hero.html | ✅ |
| LLMs | Hugging Face LLM Course | https://huggingface.co/learn/llm-course | ✅ |
| Agents | Hugging Face Agents Course | https://huggingface.co/learn/agents-course | ✅ |
| Small models / fine-tuning | Hugging Face smol-course | https://github.com/huggingface/smol-course | ✅ |
| All HF courses | Hugging Face Learn hub | https://huggingface.co/learn | ✅ |
| Fine-tuning | PEFT docs | https://huggingface.co/docs/peft/index | ✅ |

## LLM engineering, RAG and agents

| Topic | Source | URL | Status |
|---|---|---|---|
| Anthropic | Claude Developer Platform docs | https://platform.claude.com/docs/en/home (`docs.anthropic.com` redirects here) | ✅ |
| Anthropic | Prompt engineering overview | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview | ✅ |
| Anthropic | Interactive prompt-engineering tutorial / courses | https://github.com/anthropics/prompt-eng-interactive-tutorial · https://github.com/anthropics/courses | ✅ |
| Claude Code | Docs | https://code.claude.com/docs/en/overview (`docs.claude.com/en/docs/claude-code/overview` redirects here) | ✅ |
| MCP | Model Context Protocol specification (latest) | https://modelcontextprotocol.io/specification/latest (resolves to dated version `2026-07-28`) | ✅ |
| MCP | Site / getting started | https://modelcontextprotocol.io/ | ✅ |
| OpenAI | API docs | https://developers.openai.com/api/docs (`platform.openai.com/docs` redirects here) | ✅ |
| OpenAI | Cookbook | https://developers.openai.com/cookbook (`cookbook.openai.com` redirects here) | ✅ |
| LlamaIndex | Framework docs | https://developers.llamaindex.ai/python/framework/ (`docs.llamaindex.ai` redirects here) | ✅ |
| pgvector | README / docs | https://github.com/pgvector/pgvector | ✅ |
| Qdrant | Documentation | https://qdrant.tech/documentation/ | ✅ |
| Ollama | Docs / REST API | https://docs.ollama.com/ · https://docs.ollama.com/api/introduction | ✅ |
| Evaluation | Hugging Face Evaluate | https://huggingface.co/docs/evaluate/index | ✅ |
| RAG evaluation | Ragas | https://docs.ragas.io/ (redirects to `/en/stable/`) | ✅ |

## Roadmaps and career

| Topic | Source | URL | Status |
|---|---|---|---|
| Backend | roadmap.sh | https://roadmap.sh/backend | ✅ |
| DevOps | roadmap.sh | https://roadmap.sh/devops | ✅ |
| AI engineer | roadmap.sh | https://roadmap.sh/ai-engineer | ✅ |
| System design | roadmap.sh | https://roadmap.sh/system-design | ✅ |
| Python | roadmap.sh | https://roadmap.sh/python | ✅ |
| Staff engineer | StaffEng (Will Larson) | https://staffeng.com/ · https://staffeng.com/guides/ | ✅ |
| Engineering leadership | Will Larson's blog | https://lethain.com/ | ✅ |

---

## RSS / Atom feeds for daily news

Each feed was fetched and its payload checked for `<rss>` or `<feed>` (Atom) and a channel title.

| Source | Feed URL | Format | Status |
|---|---|---|---|
| Hacker News (Best) | https://hnrss.org/best | RSS | ✅ (hnrss.org is a widely used third-party service; HN itself only offers the front page) |
| Hacker News (front page, official) | https://news.ycombinator.com/rss | RSS | ✅ |
| GitHub Blog | https://github.blog/feed/ | RSS | ✅ |
| Anthropic News | *No official feed.* `anthropic.com/rss.xml`, `/news/rss.xml`, `/news/feed` and `/feed` all return **404** | n/a | ❌ official |
| Anthropic News (community mirror) | https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_news.xml | RSS | ⚠️ unofficial; scraped; last build 2026-10-18 |
| Anthropic Engineering (community mirror) | https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_engineering.xml | RSS | ⚠️ unofficial |
| Hugging Face Blog | https://huggingface.co/blog/feed.xml | RSS | ✅ |
| Martin Fowler | https://martinfowler.com/feed.atom | Atom | ✅ |
| InfoQ | https://feed.infoq.com/ (`infoq.com/feed` redirects here) | RSS | ✅ |
| CNCF | https://www.cncf.io/feed/ | RSS | ✅ |
| AWS Architecture Blog | https://aws.amazon.com/blogs/architecture/feed/ | RSS | ✅ |
| Kubernetes Blog | https://kubernetes.io/feed.xml | RSS | ✅ |
| Docker Blog | https://www.docker.com/blog/feed/ (redirects to `docker.com/feed/`) | RSS | ✅ |
| The Pragmatic Engineer (newsletter) | https://newsletter.pragmaticengineer.com/feed | RSS | ✅ (Substack feed: free posts in full, paid posts as previews) |
| The Pragmatic Engineer (blog) | https://blog.pragmaticengineer.com/rss/ | RSS | ✅ (free long-form blog) |
| Simon Willison (everything) | https://simonwillison.net/atom/everything/ | Atom | ✅ |
| Simon Willison (long-form entries only) | https://simonwillison.net/atom/entries/ | Atom | ✅ |
| dev.to #ai | https://dev.to/feed/tag/ai | RSS | ✅ |
| dev.to #devops | https://dev.to/feed/tag/devops | RSS | ✅ |
| dev.to #python | https://dev.to/feed/tag/python | RSS | ✅ |
| OpenAI News | https://openai.com/news/rss.xml (`openai.com/blog/rss.xml` redirects here) | RSS | ✅ |

### Failed or not found
- **Anthropic official RSS:** does not exist. All 4 candidate paths return 404. Use the community mirror above or scrape `https://www.anthropic.com/news` yourself.
- **OWASP API Security project page** (`owasp.org/www-project-api-security/`): 404. Use `https://owasp.org/API-Security/`.
- **Book of Proof** at `people.vcu.edu/~rhammack/BookOfProof/`: connection failed. Use the GitHub Pages URL above.
- **Linux Journey:** the site moved to LabEx, which blocks scripts.
