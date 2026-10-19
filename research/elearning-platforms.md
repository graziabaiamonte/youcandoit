# How major e-learning platforms are built, and what keeps learners coming back

Research notes for **YouCanDoIt**, a personal, gamified learning-roadmap app (Next.js + FastAPI + Postgres/pgvector + an Ollama RAG tutor).
Compiled 2026-10-19. Every link was checked with an HTTP request on that date. A few publisher pages (SAGE, Wiley, ACM, Khan support, Medium) return 403 to scripts. Their DOIs resolve, so they are still cited.

---

## 1. Open edX

**Sources:** [Platform overview](https://docs.openedx.org/en/latest/developers/concepts/platform_overview.html) · [OLX course building blocks](https://docs.openedx.org/en/latest/educators/olx/organizing-course/course-structure-overview.html) · [XBlock docs](https://docs.openedx.org/projects/xblock/en/latest/) · [Extending the platform](https://docs.openedx.org/en/latest/developers/references/developer_guide/extending_platform/extending.html) · [openedx-platform repo](https://github.com/openedx/openedx-platform) (formerly `edx-platform`) · [openedx-core](https://github.com/openedx/openedx-core) (formerly `openedx-learning`)

### Architecture
- Backend services are mostly Django. Frontends are React **micro-frontends (MFEs)** built on the shared `frontend-platform` library, which handles auth, logging, i18n and monitoring.
- `openedx-platform` is the original monolith. It runs in two modes:
  - **LMS**, which learners use. It stores learner state such as progress, grades and submissions.
  - **Studio (CMS)**, which authors use to build courses.
- Some legacy pages are still server-rendered with Mako templates.
- Extension points are designed so nobody has to fork the core:
  - **XBlocks** for new content types
  - **Frontend plugin slots** for the UI
  - The **Hooks Extension Framework** (events and filters) for behaviour
  - **Design tokens** for theming
- Content is authored in Studio and can be exported or imported as **OLX**, an XML course format. The newer `openedx-core` ("Learning Core") package is gradually taking over content storage from the older Mongo "modulestore".

### Content model
`Course → Section (chapter) → Subsection (sequential) → Unit (vertical) → Component (XBlock leaf: html, video, problem, discussion…)`
- **Section:** usually a time period, such as a week.
- **Subsection:** a topic. Grading is set here through an *assignment type* (homework, exam), and release dates and prerequisites also usually live here.
- **Unit:** one page the learner sees.
- **Component:** an XBlock instance. An XBlock is a Python class with fields scoped to the user or to the content, plus views (`student_view`, `author_view`) and handlers.

### Gamification and motivation
Open edX keeps this minimal on purpose:
- Progress page and completion checkmarks
- Graded subsections and certificates
- Optional badges (Open Badges / Credly integrations)
- Discussion forums

Motivation mostly comes from **course structure, deadlines and certificates** rather than game mechanics.

### Ideas to borrow for YouCanDoIt
1. **Adopt the 4-level hierarchy:** `Track → Module (section) → Topic (subsection, the graded/"mastery" level) → Lesson (unit/page) → Blocks (content items)`. Keep the leaf level polymorphic, like XBlocks: `markdown`, `video`, `quiz`, `exercise`, `project`, `external_link`. In practice this is one `blocks` table with `type` plus a `payload JSONB` column, and a React renderer for each type.
2. **Store progress per user at the leaf level and roll it up.** Completion and grade are computed per Topic, the way Open edX does it per subsection.
3. **Use hook points instead of if-statements.** Emit domain events (`lesson.completed`, `quiz.passed`, `streak.extended`) and let the gamification code (XP, badges, notifications) subscribe to them. This keeps the core learning logic clean.
4. **Make content portable.** Like OLX, keep the roadmap content exportable and importable as files (see freeCodeCamp below).

---

## 2. Khan Academy

**Sources:** [Go + Services = One Goliath Project (2019)](https://blog.khanacademy.org/go-services-one-goliath-project/) · [Incremental rewrites with GraphQL](https://blog.khanacademy.org/incremental-rewrites-with-graphql/) · [Half a million lines of Go](https://blog.khanacademy.org/half-a-million-lines-of-go/) · [genqlient](https://blog.khanacademy.org/genqlient-a-truly-type-safe-go-graphql-client/) · [Pragmatic Engineer case study](https://newsletter.pragmaticengineer.com/p/real-world-eng-8) · [Course & Unit Mastery (help center)](https://support.khanacademy.org/hc/en-us/articles/115002552631) · [Self-paced mastery](https://support.khanacademy.org/hc/en-us/articles/360007253831-What-is-self-paced-Mastery)

### Architecture
- **"Goliath" migration:** a Python 2 monolith on Google App Engine was rewritten as about 40+ Go services. It took roughly 3.5 years, about 100 engineers, and replaced about 1M lines of Python.
- **Why Go:** Python 2 reached end-of-life. Go used much less memory than Kotlin at similar speed, compiled faster, and had better editor support.
- **Hub:** an **Apollo GraphQL federation gateway**. Each GraphQL field could be marked *side-by-side*, *canary* (a percentage of traffic goes to Go) or *migrated*. This made the rewrite incremental and testable: the Python and Go results were compared on live traffic.
- **Stayed the same:** App Engine, Google Cloud Datastore and the Fastly CDN. React SSR became the only rendering path.
- **Stated lessons:** port working logic instead of redesigning (avoid the second-system effect), migrate gradually, and delete unused features before porting.

### Content model
`Course → Unit → Lesson → (Video | Article | Exercise)`. Each unit has quizzes and a unit test, and each course ends with a **Course Challenge**. Exercises map to **skills**.

### Gamification and motivation (the Mastery System)
- Each skill is worth **100 mastery points**. Skill levels go `Attempted → Familiar (50) → Proficient (80) → Mastered (100)`.
  - **Familiar:** about 70–85% on an exercise, or everything correct on a quiz or test.
  - **Proficient:** everything correct on an exercise, quiz, unit test or challenge, starting from Familiar.
  - **Mastered:** everything correct on a **Unit Test or Course Challenge**, starting from Proficient. Mastery can only be earned by mixed, spaced retrieval, not by grinding one exercise.
- **Levels can drop** when you miss questions later. This is built-in spaced retrieval.
- Units and courses show "% mastered" and "points earned / available".
- Energy points and badges sit alongside mastery but matter less.

### Ideas to borrow for YouCanDoIt
1. **Use mastery levels rather than a done/not-done flag.** Give each Topic a 4-level state (`new → familiar → proficient → mastered`). Reaching *mastered* should require passing a **mixed review quiz** taken later, not only the lesson's own quiz.
2. **Let mastery decay.** If a review is failed or overdue, drop the level one step. Show it honestly, because that is the motivation to review.
3. **Add a placement test ("Course Challenge").** It lets an experienced learner skip what they already know. This matters a lot for a personal roadmap that includes CS50-level topics the user may already know.
4. **Take the engineering lesson for later:** if the FastAPI backend ever needs splitting, migrate one endpoint at a time behind a facade and compare old and new results. Do not attempt a big-bang rewrite.

---

## 3. Duolingo

**Sources:** [How we learn how you learn (HLR, blog)](https://blog.duolingo.com/how-we-learn-how-you-learn/) · [Settles & Meeder, ACL 2016 paper](https://research.duolingo.com/papers/settles.acl16.pdf) · [HLR code + data](https://github.com/duolingo/halflife-regression) · [Birdbrain (blog)](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain/) · [Leagues (blog)](https://blog.duolingo.com/duolingo-leagues-leaderboards/) · [Jorge Mazal, "How Duolingo reignited user growth"](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth) · [Behind the product: Duolingo streaks](https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks)

### Architecture (public information)
- Services are mainly Python, Java and Kotlin on AWS. Job posts name services such as `session-generator` and `user-tree-backend`.
- The **Session Generator** builds each lesson from a pool of candidate exercises.
- **Birdbrain** (rolled out in 2020) predicts the probability that *this* learner gets *this* exercise right. That prediction filters the pool to the right difficulty. It covered more than 20% of lessons by October 2020, and A/B tests showed more learning and more return visits.
- Every feature ships behind **A/B tests**.

### Spaced repetition: Half-Life Regression (HLR)
- Predicted recall is `p = 2^(-Δ/h)`, where Δ is the time since the last practice and h is a per-word memory **half-life**. A regression on features (practice history, word difficulty) predicts h.
- **Before HLR (2012):** a Leitner-style rule where a correct answer roughly doubles h and a mistake halves it.
- **Results:**
  - HLR had about half the error of the Leitner approach on more than 12M sessions.
  - In A/B tests, daily retention rose by **+12% for overall activity**, +9.5% for practice sessions and +1.7% for lessons.
- The UI exposes this as **skill strength meters**. A skill is "due" once its meter drops to about half.

### Gamification and motivation
- **XP:** earned per lesson. It is the currency for streak goals and leagues.
- **Streaks:** count consecutive days with any activity.
  - The first big win was a **streak-saver notification** sent in the evening when the streak is at risk.
  - Later additions: a calendar view, animations, **streak freeze** (a bought or earned day off) and streak rewards.
  - The share of DAU with a 7+ day streak rose almost **3×**, to more than half of DAU (Mazal).
- **Leagues:**
  - Weekly leaderboards that start every Sunday in your local time zone.
  - Cohorts are matched by study habits and time zone. The top finishers are promoted and the bottom are demoted, across **10 tiers** up to Diamond.
  - Result: **+17% learning time** and **3×** as many highly engaged learners.
  - Learners can opt out, and XP cheating is detected.
- **Growth model:**
  - Users are split into states (new, current, reactivated, at-risk…) and the transitions between states are tracked.
  - **CURR** (Current User Retention Rate) became the North Star metric. Raising it by 21% cut churn among the best users by more than 40%, and DAU grew 4.5× over 4 years.
- **Notifications:** "Protect the channel." Teams may tune notification content and timing freely, but sending more notifications needs strong justification.
- **Things that failed:** a "moves counter" (neutral result) and referrals (+3% only).

### Ideas to borrow for YouCanDoIt
1. **Run spaced review on a recall model.** Start with a Leitner or SM-2 schedule per review card or Topic. Later move to **FSRS** ([py-fsrs](https://github.com/open-spaced-repetition/py-fsrs)), the modern open equivalent of HLR. Show it as a "strength" meter on each roadmap node.
2. **Reward consistency, not volume.** A daily goal sized in minutes or XP, a streak, and **streak freezes** earned by finishing a module, so one missed day doesn't wipe out months of work.
3. **Send at most one evening "streak at risk" nudge per day** (web push or email), and only if the user opted in.
4. **Leagues are less useful for a single user.** Compete against *your past self* instead: a "weekly league" of your last 4–8 weeks of XP, or friends if you ever add them.
5. **Let the RAG tutor generate retrieval questions at the right difficulty,** in the spirit of Birdbrain. Track each user's correctness per Topic and tell the LLM the target difficulty.
6. **Track your own CURR-style metric from day one** (active today and in the previous 6 days) on a small personal dashboard.

---

## 4. Coursera

**Sources:** [Naptime (GitHub)](https://github.com/coursera/naptime) · [Coursera's journey to GraphQL (Apollo blog, 2017)](https://www.apollographql.com/blog/courseras-journey-to-graphql-a5ad3b77f39a) · [Beyond REST: Coursera's journey to GraphQL (InfoQ/QCon talk)](https://www.infoq.com/presentations/coursera-graphql/) · [Coursera Engineering on Medium](https://medium.com/coursera-engineering) (`building.coursera.org` now redirects here, and Medium blocks scripted fetches)

### Architecture
- Coursera moved from PHP and Python to **Scala + Play Framework** around 2013. It grew to about 80+ Scala microservices.
- **Naptime** is Coursera's open-source Scala framework for consistent REST "resources" (Apache 2.0). It was used for more than 95% of new APIs.
- **2017:** an automatic **GraphQL assembly layer** (built on Sangria) stitched hundreds of REST resources into one GraphQL endpoint without rewriting them. The frontend is React.
- **Current job posts (2025–26)** describe modern Java, gRPC, GraphQL (Netflix DGS), Kafka, MySQL and DynamoDB, with Scala/Play as legacy. That comes from job ads, not an official architecture post.

### Content model
`Degree / Professional Certificate / Specialization → Course → Module (week) → Items` (video, reading, graded quiz, peer-reviewed assignment, programming assignment with an autograder, ungraded lab).
Each module has **learning objectives** and estimated times.

### Gamification and motivation
Coursera's motivators are mostly structural:
- Deadlines and sessions
- Weekly time estimates
- Course and specialization **progress bars**
- Shareable **certificates**
- **Peer review**
- "Coursera Coach", an AI study helper
- Reminders based on the learner's *learning plan* (target days per week)

### Ideas to borrow for YouCanDoIt
1. **Give each item an estimated duration and each module a weekly plan.** Let the user say "I study 5 h/week" and project a finish date for each track. The finish date motivates; an XP total alone does not.
2. **Write learning objectives for every Topic.** The RAG tutor and the quizzes can be generated against them, which gives you constructive alignment.
3. **Start schema-first.** Coursera wrapped existing REST in GraphQL. For a Next.js + FastAPI app the cheap equivalent is **OpenAPI → generated TypeScript client** (for example `openapi-typescript`). You get typed APIs with no GraphQL layer.

---

## 5. freeCodeCamp

**Sources:** [Curriculum file structure](https://contribute.freecodecamp.org/curriculum-file-structure/) · [How to work on coding challenges](https://contribute.freecodecamp.org/how-to-work-on-coding-challenges/) · [freeCodeCamp monorepo](https://github.com/freeCodeCamp/freeCodeCamp) · [Learn page](https://www.freecodecamp.org/learn)

### Architecture
- An open-source monorepo:
  - `api/`: a Fastify API server
  - `client/`: React frontend, historically Gatsby
  - `curriculum/`: all the challenge content
  - `e2e/`: Playwright tests
- MongoDB stores user data. The curriculum **lives in git as Markdown, YAML and JSON** and is built into the client.
- Translations live in an i18n git submodule, and only the `.md` files are translated.

### Content model (curriculum-as-code)
- **Hierarchy:** `superblock → chapter → module → block → challenge`. Legacy superblocks go straight to blocks.
- **Files:**
  - Each challenge is `curriculum/challenges/english/blocks/<block>/<id>.md`, with frontmatter (`id`, `title`, `challengeType`, `dashedName`) and sections for description, instructions, **hints, each paired with a test assertion**, seed code and solution.
  - Ordering lives in `curriculum/structure/`: `curriculum.json`, `superblocks/*.json`, and `blocks/*.json` with `challengeOrder`.
  - Each certification is a YAML file listing its required projects.
- `dashedName` becomes the URL slug, so renaming one requires a redirect.
- Modules can be typed as `review` or `cert-project`, and a chapter can be an `exam`.

### Gamification and motivation
- Free **certifications**: about 5 required projects plus an exam.
- A visible **map of blocks** with checkmarks.
- Progress heatmaps and streaks on the profile.
- Instant feedback from in-browser tests: each "hint" is a test that turns green.
- Building real projects makes progress concrete.

### Ideas to borrow for YouCanDoIt
1. **Write the curriculum as Markdown in git, which is the strongest single idea in this research.** `content/tracks/<track>/<module>/<topic>.md`, with YAML frontmatter for `id`, `title`, `estimate_min`, `prerequisites`, `objectives`, `resources` (official-docs URLs) and `quiz`. A FastAPI startup or CLI step **syncs it into Postgres**, then **chunks and embeds it into pgvector** for the RAG tutor. You get git history, diffs, offline editing, and LLM-assisted authoring.
2. **Use stable IDs in frontmatter and treat slugs as presentation only.** Progress rows reference the ID, so renaming a lesson never breaks a user's history.
3. **Make the capstone the "certificate".** Each track ends with a project checklist (acceptance criteria as checkboxes, optionally with automated checks like freeCodeCamp's hint/test pairs). Finishing it unlocks a track badge.
4. **Add `review` and `exam` module types.** They map directly to Khan's unit tests and to spaced review.

---

## Cross-platform patterns (summary table)

| Concern | Open edX | Khan | Duolingo | Coursera | freeCodeCamp | → YouCanDoIt |
|---|---|---|---|---|---|---|
| Content storage | Learning Core / modulestore, OLX export | Datastore | Course trees + sessions | Services + DB | **Markdown in git** | Markdown in git → Postgres + pgvector |
| Hierarchy depth | 4 + leaf | 3 + items | Unit → level → lesson | 3 + items | 4–5 levels | Track → Module → Topic → Lesson → Block |
| Progress unit | Subsection grade | **Skill mastery (4 levels)** | **Word/skill strength (HLR)** | Item completion | Challenge pass | Topic mastery + review strength |
| Main motivator | Certificates | Mastery points | **Streak, XP, leagues** | Deadlines, certificates | Projects, certificates | Streak + mastery + capstones |
| API style | REST (DRF) | GraphQL federation | Services | REST → GraphQL | REST | REST + OpenAPI-typed client |

---

## Consolidated e-learning principles (with sources)

| Principle | What it says | How YouCanDoIt applies it | Sources |
|---|---|---|---|
| **Spaced repetition / distributed practice** | Spreading reviews over time beats massed study, and the best gap grows as the retention interval grows. | A review queue per Topic (Leitner → FSRS) with strength meters on roadmap nodes. | Cepeda et al. 2006, *Psychological Bulletin* [doi:10.1037/0033-2909.132.3.354](https://doi.org/10.1037/0033-2909.132.3.354) · Dunlosky et al. 2013 (rated "high utility") [doi:10.1177/1529100612453266](https://journals.sagepub.com/doi/10.1177/1529100612453266) · Settles & Meeder 2016 [PDF](https://research.duolingo.com/papers/settles.acl16.pdf) · [FSRS](https://github.com/open-spaced-repetition/fsrs4anki/wiki/ABC-of-FSRS) |
| **Retrieval practice (testing effect)** | Recalling information strengthens memory more than re-reading it. | Every lesson ends with 3–5 recall questions. The tutor asks before it tells ("explain X in your own words"). | Roediger & Karpicke 2006 [doi:10.1111/j.1467-9280.2006.01693.x](https://doi.org/10.1111/j.1467-9280.2006.01693.x) · Dunlosky 2013 (above) · [retrievalpractice.org](https://www.retrievalpractice.org/) |
| **Interleaving** | Mixing related topics in practice improves discrimination and transfer. | Weekly mixed reviews draw from several Topics, like Khan's unit tests. | Dunlosky 2013 (rated "moderate") · [Learning Scientists materials](https://www.learningscientists.org/downloadable-materials) |
| **Chunking and cognitive load** | Working memory is small, so present small, coherent units and remove extra load. | Lessons of 10–25 minutes, one objective each, and progressive disclosure in the UI. | Miller 1956 [doi:10.1037/h0043158](https://doi.org/10.1037/h0043158) · Sweller 1988 [doi:10.1207/s15516709cog1202_4](https://doi.org/10.1207/s15516709cog1202_4) |
| **Dual coding / multimedia** | Words plus relevant visuals beat words alone, as long as the visuals carry meaning rather than decoration. | Diagrams (Mermaid) in lessons, plus the roadmap graph itself as a visual map. | Clark & Paivio 1991, *Educational Psychology Review* [doi:10.1007/BF01320076](https://doi.org/10.1007/BF01320076) · Mayer's multimedia principles (see the Learning Scientists materials above) |
| **Immediate, specific feedback** | Feedback about the task and the process, given quickly, has large effects. Vague praise does little. | Instant quiz feedback with an explanation, and the tutor cites the official-docs passage it used. | Hattie & Timperley 2007 [doi:10.3102/003465430298487](https://doi.org/10.3102/003465430298487) |
| **Mastery learning** | Learners move on only after showing mastery, and the time allowed varies by learner. | 4-level Topic mastery. Prerequisites unlock dependent nodes. | Khan mastery system ([help center](https://support.khanacademy.org/hc/en-us/articles/115002552631)); Bloom's mastery learning (via Dunlosky/Learning Scientists) |
| **Streaks and habit formation** | Daily consistency cues improve retention. Loss aversion makes streaks sticky, so add freezes to avoid burnout. | Daily goal, streak, earned freezes, one opt-in reminder. | [Mazal / Lenny's](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth) · [Duolingo streaks](https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks) |
| **Progress visualization / goal gradient** | Visible progress toward a goal increases effort as the goal gets closer. | Roadmap fill by track, % mastered, projected finish date, weekly XP chart. | Kivetz, Urminsky & Zheng 2006, goal-gradient effect, *J. Marketing Research* [doi:10.1509/jmkr.43.1.39](https://doi.org/10.1509/jmkr.43.1.39); Khan "% mastered" UI; Duolingo leagues ([blog](https://blog.duolingo.com/duolingo-leagues-leaderboards/)) |
| **Gamification works when it supports learning** | Points and badges help when they reward learning behaviours. Effects vary, and extrinsic-only designs fade. | XP only for retrieval, reviews and projects, never for opening a page. | Hamari, Koivisto & Sarsa 2014, "Does gamification work?" (HICSS, [doi:10.1109/HICSS.2014.377](https://doi.org/10.1109/HICSS.2014.377)) |

> Note: every DOI above resolves to its publisher. Several publishers (SAGE, Wiley, Springer, IEEE) put up bot challenges (HTTP 403/202), so the pages load in a browser but not from a script.
