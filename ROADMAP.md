# YouCanDoIt — Roadmap to Senior Software Engineer (AI + DevOps)

A progressive study plan from zero CS background to a senior software engineering role with
AI and DevOps expertise. It consolidates:

- the AI-engineer roadmap and themes in `Resources/`,
- university and certificate curricula (`research/curricula.md`, syllabi in `Resources/syllabi/`),
- 21 senior job postings (`research/job-requirements.md`),
- official documentation and reliable free courses (`research/official-docs.md`).

**How to read it.** Tracks → Modules → Sessions → Subchapters. A *session* covers one whole topic;
study its subchapters in order and tick them off in the app. Every session ends with a
**Practice** subchapter: you only own what you have built or explained. Tracks 0–6 build the
engineer; 7–9 build the AI specialist; 10 builds the senior; 11 turns it all into a portfolio.
Tracks 7–8 can run in parallel with Tracks 4–6 once Track 1 is done.

**Format contract (parsed by the app — keep it exact).** `# Track N — `, `## Module N.M — `,
`### Session N.M.K — `, a `> Outcomes:` line, `- ` subchapters, one `Sources:` line.
Session IDs are permanent: append new sessions, never renumber.

# Track 0 — Foundations

## Module 0.1 — Learning and the profession

### Session 0.1.1 — How to learn effectively
> Outcomes: Plan your study with spaced repetition and retrieval practice, and keep going when it gets hard.
- How memory works: encoding, forgetting curve, consolidation
- Retrieval practice and spaced repetition
- Chunking, interleaving and dual coding
- Deliberate practice and the growth mindset
- Building a sustainable study routine (streaks, small daily goals)
- Practice: design your weekly study plan and review schedule
Sources: [Google Tech Writing](https://developers.google.com/tech-writing), [Khan Academy](https://www.khanacademy.org/), [Teach Yourself CS](https://teachyourselfcs.com/)

### Session 0.1.2 — What software engineers actually do
> Outcomes: Describe the software development lifecycle, team roles and what separates junior, mid and senior engineers.
- The software development lifecycle (SDLC)
- Roles in a product team: engineering, product, design, SRE, data
- The engineering career ladder: junior → mid → senior → staff
- What senior job postings ask for in 2026
- Practice: map your current skills against a senior job posting
Sources: [StaffEng](https://staffeng.com/guides/), [roadmap.sh Backend](https://roadmap.sh/backend), [roadmap.sh AI Engineer](https://roadmap.sh/ai-engineer)

### Session 0.1.3 — Technical English and reading documentation
> Outcomes: Read official docs, RFCs and error messages efficiently and write clear technical English.
- Anatomy of official documentation: tutorials, how-tos, reference, explanation
- Reading error messages and stack traces
- Searching effectively and judging source reliability
- Writing clear technical English: short sentences, active voice
- Practice: summarise one documentation page in 10 lines
Sources: [Google Technical Writing courses](https://developers.google.com/tech-writing), [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP), [Python docs](https://docs.python.org/3/)

## Module 0.2 — How computers work

### Session 0.2.1 — Data representation
> Outcomes: Convert between binary, hexadecimal and decimal and explain how text, numbers and images are stored.
- Bits, bytes and number bases (binary, hex)
- Integers, overflow and two's complement
- Floating point (IEEE 754) and why 0.1 + 0.2 ≠ 0.3
- Text encoding: ASCII, Unicode, UTF-8
- Images, sound and compression in one picture
- Practice: write a Python base converter
Sources: [CS50x](https://cs50.harvard.edu/x/), [Nand2Tetris](https://www.nand2tetris.org/), [MIT 6.042J Mathematics for CS](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/)

### Session 0.2.2 — Computer architecture
> Outcomes: Explain how a CPU executes instructions and why the memory hierarchy drives performance.
- Logic gates to CPU: ALU, registers, control unit
- The fetch–decode–execute cycle
- Memory hierarchy: registers, caches, RAM, disk
- A taste of C: pointers and memory addresses
- Practice: complete the first Nand2Tetris project or CS50 week on memory
Sources: [Nand2Tetris](https://www.nand2tetris.org/), [CS50x](https://cs50.harvard.edu/x/), [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)

### Session 0.2.3 — From source code to running program
> Outcomes: Explain compilation, interpretation and what happens when a program runs.
- Compilers, interpreters and bytecode (how CPython runs your code)
- Processes, memory layout: stack and heap
- Standard input/output, exit codes, environment variables
- Libraries, linking and package managers
- Practice: trace one Python script from file to process
Sources: [CS50x](https://cs50.harvard.edu/x/), [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/), [Python docs](https://docs.python.org/3/)

## Module 0.3 — Developer tools

### Session 0.3.1 — The terminal and the shell
> Outcomes: Navigate, inspect and manipulate files and processes confidently from the command line.
- Shells, prompts and the file system tree
- Core commands: ls, cd, cp, mv, rm, find, grep
- Pipes, redirection and composing commands
- Permissions, users and sudo
- Processes and jobs: ps, top, kill
- Practice: complete the Missing Semester shell lecture exercises
Sources: [MIT The Missing Semester](https://missing.csail.mit.edu/), [The Linux Command Line](https://linuxcommand.org/tlcl.php)

### Session 0.3.2 — Shell scripting and automation
> Outcomes: Automate repetitive tasks with Bash scripts.
- Variables, quoting and expansion
- Conditionals, loops and functions in Bash
- Exit codes and error handling (set -euo pipefail)
- Text processing: sed, awk, jq
- Scheduling with cron
- Practice: a backup script that runs nightly
Sources: [The Linux Command Line](https://linuxcommand.org/tlcl.php), [MIT The Missing Semester](https://missing.csail.mit.edu/)

### Session 0.3.3 — Git fundamentals
> Outcomes: Track changes, branch and recover from mistakes with Git.
- Why version control: snapshots, history, collaboration
- The three areas: working tree, staging, repository
- Commits, branches, merges and resolving conflicts
- Undoing things: restore, reset, revert, reflog
- Practice: Learn Git Branching main levels
Sources: [Pro Git](https://git-scm.com/book/en/v2), [Learn Git Branching](https://learngitbranching.js.org/)

### Session 0.3.4 — Collaborating with Git and GitHub
> Outcomes: Work in a team repository using pull requests, branching strategies and clear commit history.
- Remotes, fetch, pull, push
- Pull requests and review flow
- Branching strategies: trunk-based vs GitFlow
- Rebase, squash and a clean history
- Conventional Commits and semantic versioning
- Practice: open a PR with a feature branch and address review comments
Sources: [Pro Git](https://git-scm.com/book/en/v2), [GitHub Docs](https://docs.github.com/en/get-started), [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), [Semantic Versioning](https://semver.org/)

### Session 0.3.5 — Editor, debugger and productivity
> Outcomes: Debug programs systematically with breakpoints and logs instead of guesswork.
- Editor setup: extensions, formatting on save, linters
- Using a debugger: breakpoints, stepping, watches
- Debugging method: reproduce, isolate, hypothesise, verify
- Keyboard-driven workflow and dotfiles
- Practice: find a planted bug using only the debugger
Sources: [MIT The Missing Semester](https://missing.csail.mit.edu/), [Python pdb docs](https://docs.python.org/3/library/pdb.html)

## Module 0.4 — Python from zero

### Session 0.4.1 — Python basics
> Outcomes: Write small Python programs using variables, types, operators and input/output.
- Installing Python and running scripts vs the REPL
- Variables, numbers, strings and booleans
- Operators and expressions
- Input, output and f-strings
- Practice: a tip calculator and a unit converter
Sources: [Python Tutorial](https://docs.python.org/3/tutorial/), [CS50x Python week](https://cs50.harvard.edu/x/), [roadmap.sh Python](https://roadmap.sh/python)

### Session 0.4.2 — Control flow and functions
> Outcomes: Structure logic with conditionals, loops and reusable functions.
- if / elif / else and boolean logic
- for and while loops, break and continue
- Defining functions, parameters, return values
- Scope, default arguments, *args and **kwargs
- Practice: FizzBuzz, prime checker, number guessing game
Sources: [Python Tutorial](https://docs.python.org/3/tutorial/), [CS50x](https://cs50.harvard.edu/x/)

### Session 0.4.3 — Built-in collections
> Outcomes: Choose and use lists, tuples, dictionaries and sets appropriately.
- Lists and tuples: indexing, slicing, mutability
- Dictionaries: key–value modelling
- Sets and membership tests
- Comprehensions for lists, dicts and sets
- Practice: word frequency counter for a text file
Sources: [Python Tutorial — Data Structures](https://docs.python.org/3/tutorial/datastructures.html), [Python docs](https://docs.python.org/3/)

### Session 0.4.4 — Files, errors and exceptions
> Outcomes: Read and write files and handle errors robustly.
- Reading and writing text, CSV and JSON files
- Exceptions: try / except / else / finally
- Raising and defining custom exceptions
- Context managers and the with statement
- Practice: a CSV-to-JSON converter with error handling
Sources: [Python Tutorial — Errors](https://docs.python.org/3/tutorial/errors.html), [Python Tutorial — I/O](https://docs.python.org/3/tutorial/inputoutput.html)

### Session 0.4.5 — Modules, packages and environments
> Outcomes: Organise code into packages and manage dependencies reproducibly.
- Modules, imports and the standard library tour
- Packages and project layout
- Virtual environments and dependency management with uv
- pyproject.toml and lock files
- Practice: turn a script into an installable package
Sources: [Python Tutorial — Modules](https://docs.python.org/3/tutorial/modules.html), [uv docs](https://docs.astral.sh/uv/)

### Session 0.4.6 — Pythonic Python
> Outcomes: Write idiomatic Python using iterators, generators, decorators and the standard library.
- Iterators and generators
- Decorators and higher-order functions
- dataclasses and enums
- Useful standard library: pathlib, collections, itertools, datetime
- PEP 8 and readable code
- Practice: refactor an old script to idiomatic Python
Sources: [Python docs](https://docs.python.org/3/), [PEP 8](https://peps.python.org/pep-0008/)

### Session 0.4.7 — Type hints, Pydantic and tooling
> Outcomes: Add static types and validation to Python code and keep it clean with automated tools.
- Type hints, generics and Protocols
- Static checking with mypy or pyright
- Data validation with Pydantic models
- Linting and formatting with Ruff
- Practice: type and validate the CSV converter, add Ruff to the project
Sources: [Python typing docs](https://docs.python.org/3/library/typing.html), [Pydantic](https://pydantic.dev/docs/validation/latest/get-started/), [Ruff](https://docs.astral.sh/ruff/)

## Module 0.5 — TypeScript (bridge from front end)

### Session 0.5.1 — TypeScript fundamentals
> Outcomes: Type JavaScript code with interfaces, unions and narrowing.
- Why static typing: catching bugs before runtime
- Primitive types, arrays, objects, interfaces and type aliases
- Unions, literal types and narrowing
- Functions and strict mode
- Practice: convert a small JS project to strict TypeScript
Sources: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [React Learn](https://react.dev/learn)

### Session 0.5.2 — Advanced TypeScript
> Outcomes: Use generics and utility types to build type-safe APIs and components.
- Generics and constraints
- Utility and mapped types
- Discriminated unions for state modelling
- Typing API responses (generated types from OpenAPI)
- Practice: a typed API client generated from an OpenAPI schema
Sources: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

# Track 1 — Computer Science Fundamentals

## Module 1.1 — Discrete mathematics

### Session 1.1.1 — Logic and proofs
> Outcomes: Read and write simple proofs and reason with propositional and predicate logic.
- Propositions, connectives and truth tables
- Predicates and quantifiers
- Direct proof, contradiction and contrapositive
- Logic in code: boolean algebra and De Morgan's laws
- Practice: prove three small statements and simplify boolean conditions in code
Sources: [Book of Proof](https://richardhammack.github.io/BookOfProof/), [Discrete Mathematics: An Open Introduction](https://discrete.openmathbooks.org/dmoi3.html), [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/)

### Session 1.1.2 — Sets, functions and relations
> Outcomes: Use set notation, functions and relations to model data precisely.
- Sets and set operations
- Functions: injective, surjective, bijective
- Relations, equivalence and ordering
- How sets and relations map to databases and types
- Practice: model a small domain (students, courses) with sets and relations
Sources: [Discrete Mathematics: An Open Introduction](https://discrete.openmathbooks.org/dmoi3.html), [Book of Proof](https://richardhammack.github.io/BookOfProof/)

### Session 1.1.3 — Induction and recursion
> Outcomes: Prove statements by induction and design recursive definitions.
- Mathematical induction and strong induction
- Recursive definitions and recurrences
- From induction to recursive programs
- Practice: prove a sum formula and implement it recursively
Sources: [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/), [Book of Proof](https://richardhammack.github.io/BookOfProof/)

### Session 1.1.4 — Counting and combinatorics
> Outcomes: Count possibilities with permutations, combinations and the pigeonhole principle.
- Sum and product rules
- Permutations and combinations
- Pigeonhole principle
- Binomial coefficients and Pascal's triangle
- Practice: estimate the size of a brute-force search space
Sources: [Discrete Mathematics: An Open Introduction](https://discrete.openmathbooks.org/dmoi3.html), [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/)

### Session 1.1.5 — Graph theory
> Outcomes: Describe problems as graphs and reason about paths, trees and connectivity.
- Vertices, edges, directed and weighted graphs
- Paths, cycles and connectivity
- Trees and spanning trees
- Graphs in real systems: networks, dependencies, social graphs
- Practice: model your project's module dependencies as a graph
Sources: [Discrete Mathematics: An Open Introduction](https://discrete.openmathbooks.org/dmoi3.html), [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/)

## Module 1.2 — Complexity analysis

### Session 1.2.1 — Big-O and algorithm analysis
> Outcomes: Analyse the time and space complexity of code and compare algorithms.
- Why measure growth instead of seconds
- Big-O, Big-Θ and Big-Ω
- Common classes: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)
- Space complexity and trade-offs
- Amortised analysis (dynamic arrays)
- Practice: annotate the complexity of ten code snippets
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [Big-O Cheat Sheet](https://www.bigocheatsheet.com/), [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)

### Session 1.2.2 — Analysing recursive algorithms
> Outcomes: Solve recurrences to find the complexity of recursive algorithms.
- Recurrence relations
- Recursion trees
- The Master Theorem
- Practice: analyse merge sort and binary search
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)

## Module 1.3 — Data structures

### Session 1.3.1 — Arrays and dynamic arrays
> Outcomes: Explain how arrays are laid out in memory and how dynamic arrays grow.
- Contiguous memory and indexing in O(1)
- Static vs dynamic arrays and resizing
- Python lists under the hood
- Strings as arrays
- Practice: implement a dynamic array class with tests
Sources: [Open Data Structures](https://opendatastructures.org/), [VisuAlgo](https://visualgo.net/en), [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)

### Session 1.3.2 — Linked lists, stacks and queues
> Outcomes: Implement linked structures and use stacks and queues to solve problems.
- Singly and doubly linked lists
- Stacks (LIFO) and the call stack
- Queues and deques (FIFO)
- Choosing between arrays and linked lists
- Practice: balanced-parentheses checker and a task queue
Sources: [Open Data Structures](https://opendatastructures.org/), [VisuAlgo](https://visualgo.net/en)

### Session 1.3.3 — Hash tables
> Outcomes: Explain hashing and collisions and use dictionaries and sets with confidence.
- Hash functions and buckets
- Collision handling: chaining and open addressing
- Load factor and resizing
- Python dict and set internals
- Practice: implement a hash map and compare with dict
Sources: [Open Data Structures](https://opendatastructures.org/), [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)

### Session 1.3.4 — Trees and binary search trees
> Outcomes: Implement tree traversals and binary search trees and explain balancing.
- Tree terminology and binary trees
- Traversals: pre-order, in-order, post-order, level-order
- Binary search trees: insert, search, delete
- Balanced trees (AVL, red-black) and B-trees in databases
- Practice: implement a BST with all traversals
Sources: [Open Data Structures](https://opendatastructures.org/), [VisuAlgo](https://visualgo.net/en), [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)

### Session 1.3.5 — Heaps and priority queues
> Outcomes: Use heaps for priority scheduling and top-k problems.
- Binary heap property and array representation
- Push, pop and heapify
- Python heapq
- Use cases: schedulers, top-k, median streams
- Practice: top-k frequent words with a heap
Sources: [Open Data Structures](https://opendatastructures.org/), [Python heapq docs](https://docs.python.org/3/library/heapq.html)

### Session 1.3.6 — Graphs as data structures
> Outcomes: Represent graphs in code and choose the right representation.
- Adjacency list vs adjacency matrix
- Directed, weighted and implicit graphs
- Union–find (disjoint sets)
- Tries for prefix search
- Practice: build an autocomplete with a trie
Sources: [Open Data Structures](https://opendatastructures.org/), [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)

## Module 1.4 — Algorithms

### Session 1.4.1 — Searching and binary search
> Outcomes: Apply binary search to sorted data and to "search on the answer" problems.
- Linear vs binary search
- Binary search invariants and off-by-one errors
- Binary search on the answer space
- Practice: five binary search problems
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [NeetCode Roadmap](https://neetcode.io/roadmap)

### Session 1.4.2 — Sorting algorithms
> Outcomes: Implement and compare the main sorting algorithms.
- Selection, insertion and bubble sort
- Merge sort and quicksort
- Stability and in-place sorting
- Counting and radix sort; Python's Timsort
- Practice: implement and benchmark four sorts
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [VisuAlgo](https://visualgo.net/en)

### Session 1.4.3 — Problem-solving patterns
> Outcomes: Recognise common patterns and apply them to new problems.
- Two pointers and sliding window
- Prefix sums and hashing tricks
- Fast and slow pointers
- Intervals and sorting-based approaches
- Practice: one problem per pattern
Sources: [NeetCode Roadmap](https://neetcode.io/roadmap), [Tech Interview Handbook](https://www.techinterviewhandbook.org/)

### Session 1.4.4 — Graph traversal
> Outcomes: Use BFS and DFS to explore graphs, detect cycles and sort dependencies.
- Breadth-first search and shortest paths in unweighted graphs
- Depth-first search, recursion and iterative stacks
- Cycle detection and topological sort
- Connected components
- Practice: a dependency resolver using topological sort
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)

### Session 1.4.5 — Shortest paths and spanning trees
> Outcomes: Find shortest paths and minimum spanning trees in weighted graphs.
- Dijkstra's algorithm
- Bellman–Ford and negative weights
- Minimum spanning trees: Prim and Kruskal
- Practice: route planner on a small city map
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [VisuAlgo](https://visualgo.net/en)

### Session 1.4.6 — Recursion, backtracking and greedy algorithms
> Outcomes: Solve search problems with backtracking and know when greedy choices are optimal.
- Thinking recursively: base case and progress
- Backtracking: permutations, subsets, N-queens
- Greedy algorithms and exchange arguments
- Practice: sudoku solver and interval scheduling
Sources: [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/), [NeetCode Roadmap](https://neetcode.io/roadmap)

### Session 1.4.7 — Dynamic programming
> Outcomes: Turn exponential recursive solutions into efficient dynamic programs.
- Overlapping subproblems and optimal substructure
- Memoisation (top-down) vs tabulation (bottom-up)
- Classic problems: Fibonacci, knapsack, longest common subsequence, edit distance
- Practice: five DP problems, each solved both ways
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)

## Module 1.5 — Programming paradigms and design

### Session 1.5.1 — Object-oriented programming fundamentals
> Outcomes: Model problems with classes and objects using encapsulation and clear interfaces.
- Classes, objects, attributes and methods
- Encapsulation and information hiding
- Special methods (__init__, __repr__, __eq__)
- Class vs instance state, properties
- Practice: model a library system with classes
Sources: [Python Tutorial — Classes](https://docs.python.org/3/tutorial/classes.html), [Refactoring.Guru](https://refactoring.guru/design-patterns)

### Session 1.5.2 — Inheritance, composition and polymorphism
> Outcomes: Choose between inheritance and composition and use polymorphism to remove conditionals.
- Inheritance and method overriding
- Polymorphism and duck typing
- Abstract base classes and Protocols
- Composition over inheritance
- Practice: refactor a type-switching function into polymorphic classes
Sources: [Python Tutorial — Classes](https://docs.python.org/3/tutorial/classes.html), [Refactoring.Guru](https://refactoring.guru/refactoring)

### Session 1.5.3 — SOLID principles
> Outcomes: Apply the SOLID principles to keep code easy to change.
- Single responsibility
- Open/closed
- Liskov substitution
- Interface segregation
- Dependency inversion and dependency injection
- Practice: review a codebase for SOLID violations
Sources: [Refactoring.Guru](https://refactoring.guru/design-patterns), [Martin Fowler](https://martinfowler.com/)

### Session 1.5.4 — Creational and structural design patterns
> Outcomes: Recognise and apply the most useful creational and structural patterns.
- What patterns are (and when not to use them)
- Factory, builder and singleton (and its pitfalls)
- Adapter, decorator, facade and proxy
- Practice: add an adapter to switch between two LLM providers
Sources: [Refactoring.Guru — Design Patterns](https://refactoring.guru/design-patterns)

### Session 1.5.5 — Behavioural design patterns
> Outcomes: Use behavioural patterns to organise how objects collaborate.
- Strategy and template method
- Observer and publish/subscribe
- Command and state
- Iterator and chain of responsibility
- Practice: implement a plugin system with strategy and observer
Sources: [Refactoring.Guru — Design Patterns](https://refactoring.guru/design-patterns)

### Session 1.5.6 — Functional programming
> Outcomes: Write pure functions, avoid shared mutable state and use functional tools.
- Pure functions and side effects
- Immutability
- Map, filter, reduce and comprehensions
- Closures and partial application
- Practice: rewrite a data pipeline in functional style
Sources: [Python Functional Programming HOWTO](https://docs.python.org/3/howto/functional.html), [Python docs](https://docs.python.org/3/)

# Track 2 — Software Engineering Craft

## Module 2.1 — Clean code

### Session 2.1.1 — Readable code
> Outcomes: Write code that others understand quickly through naming, small functions and clear structure.
- Meaningful names
- Small functions that do one thing
- Comments: when they help and when they hurt
- Formatting and consistency
- Practice: rewrite a messy function and get feedback
Sources: [Refactoring.Guru — Refactoring](https://refactoring.guru/refactoring), [PEP 8](https://peps.python.org/pep-0008/), [Google Engineering Practices](https://google.github.io/eng-practices/)

### Session 2.1.2 — Code smells and refactoring
> Outcomes: Detect code smells and refactor safely in small steps.
- Common smells: long method, duplicated code, feature envy
- Refactoring catalogue: extract, inline, move, rename
- Refactoring safely with tests
- Practice: refactor a legacy module kata
Sources: [Refactoring.Guru — Refactoring](https://refactoring.guru/refactoring), [Martin Fowler — Refactoring](https://martinfowler.com/)

## Module 2.2 — Testing

### Session 2.2.1 — Unit testing with pytest
> Outcomes: Write fast, readable unit tests with pytest.
- Why tests: confidence, design feedback, documentation
- Arrange–act–assert
- pytest fixtures and parametrisation
- Testing exceptions and edge cases
- Practice: test the data structures you built in Track 1
Sources: [pytest docs](https://docs.pytest.org/en/stable/), [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)

### Session 2.2.2 — Test doubles and test-driven development
> Outcomes: Isolate units with mocks and fakes and drive design with TDD.
- Stubs, mocks, fakes and spies
- unittest.mock and monkeypatch
- The red–green–refactor cycle
- When TDD helps and when it doesn't
- Practice: build a small feature test-first
Sources: [pytest docs](https://docs.pytest.org/en/stable/), [Martin Fowler — Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)

### Session 2.2.3 — Integration and end-to-end testing
> Outcomes: Test components together and drive the real UI with Playwright.
- Integration tests with real databases (containers)
- Contract tests for APIs
- End-to-end testing with Playwright
- Flaky tests: causes and cures
- Practice: one integration and one Playwright test for a web app
Sources: [Playwright docs](https://playwright.dev/docs/intro), [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)

### Session 2.2.4 — Testing strategy
> Outcomes: Choose what to test at which level and measure test quality.
- The test pyramid and the testing trophy
- Coverage: useful signal, bad target
- Property-based testing (Hypothesis)
- Tests in CI and test data management
- Practice: write a testing strategy for a project
Sources: [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html), [Hypothesis docs](https://hypothesis.readthedocs.io/en/latest/)

## Module 2.3 — Process

### Session 2.3.1 — Agile and Scrum
> Outcomes: Work effectively in an Agile team and explain Scrum roles, events and artefacts.
- The Agile Manifesto and its principles
- Scrum: roles, sprints, ceremonies
- Kanban and flow
- Practice: run a personal two-week sprint on your study plan
Sources: [Agile Manifesto](https://agilemanifesto.org/), [The Scrum Guide](https://scrumguides.org/scrum-guide.html)

### Session 2.3.2 — Requirements and user stories
> Outcomes: Turn vague ideas into clear, testable requirements.
- Functional vs non-functional requirements
- User stories and acceptance criteria
- Slicing work into small deliverables
- Practice: write stories for a YouCanDoIt feature
Sources: [Agile Manifesto](https://agilemanifesto.org/), [Martin Fowler — User Story](https://martinfowler.com/bliki/UserStory.html)

### Session 2.3.3 — Estimation and planning
> Outcomes: Estimate work honestly, communicate uncertainty and plan incremental delivery.
- Why estimates are hard and what they are for
- Relative estimation and ranges
- Breaking down work and identifying risks
- Practice: estimate and track a feature, then review accuracy
Sources: [Martin Fowler — Purpose of Estimation](https://martinfowler.com/bliki/PurposeOfEstimation.html), [The Scrum Guide](https://scrumguides.org/scrum-guide.html)

## Module 2.4 — Collaboration

### Session 2.4.1 — Code review
> Outcomes: Give and receive code reviews that improve code and help people grow.
- What reviewers look for: design, correctness, tests, readability
- Writing helpful comments
- Small PRs and review speed
- Receiving feedback without ego
- Practice: review an open-source PR and write your comments
Sources: [Google Engineering Practices — Code Review](https://google.github.io/eng-practices/review/)

### Session 2.4.2 — Technical documentation and decision records
> Outcomes: Write READMEs, design docs, ADRs and RFCs that people actually read.
- Types of documentation and their audience
- READMEs and onboarding docs
- Architecture Decision Records
- Design docs and RFCs
- Practice: write an ADR for a YouCanDoIt decision
Sources: [Architecture Decision Records](https://adr.github.io/), [Write the Docs](https://www.writethedocs.org/guide/), [Google Tech Writing](https://developers.google.com/tech-writing)

### Session 2.4.3 — Working with AI coding tools
> Outcomes: Use AI assistants to go faster while validating everything they produce.
- What AI coding tools are good and bad at
- Prompting for code: context, constraints, examples
- Reviewing and testing AI-generated code
- Security and licensing pitfalls
- Practice: build a small feature with an AI assistant and document what you corrected
Sources: [Claude Code docs](https://code.claude.com/docs/en/overview), [Anthropic prompt engineering](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

### Session 2.4.4 — Open-source contribution
> Outcomes: Find, propose and land a contribution in an open-source project.
- How open-source projects are organised
- Finding good first issues
- Contribution etiquette: issues, PRs, CLA, code of conduct
- Practice: land one documentation or bug-fix PR
Sources: [Open Source Guides](https://opensource.guide/), [GitHub Docs](https://docs.github.com/en/get-started)

## Module 2.5 — Software architecture

### Session 2.5.1 — Architecture fundamentals
> Outcomes: Structure applications into layers with clear boundaries and dependencies.
- What architecture is: the decisions that are hard to change
- Layered architecture
- Hexagonal / ports-and-adapters and clean architecture
- Modular monoliths
- Practice: draw the architecture of YouCanDoIt with the C4 model
Sources: [Martin Fowler — Software Architecture Guide](https://martinfowler.com/architecture/), [The C4 model](https://c4model.com/), [The Twelve-Factor App](https://12factor.net/)

### Session 2.5.2 — Domain-driven design basics
> Outcomes: Model complex domains with ubiquitous language, bounded contexts and aggregates.
- Ubiquitous language
- Entities, value objects and aggregates
- Bounded contexts and context maps
- Practice: identify the bounded contexts of an e-learning platform
Sources: [Martin Fowler — Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html), [microservices.io](https://microservices.io/)

### Session 2.5.3 — Monoliths, microservices and serverless
> Outcomes: Choose an architectural style based on team size, scale and constraints.
- Monolith first
- Microservices: benefits and costs
- Service boundaries and communication (sync vs async)
- Serverless architectures
- Practice: write a trade-off analysis for splitting a monolith
Sources: [Martin Fowler — Microservices](https://martinfowler.com/articles/microservices.html), [microservices.io](https://microservices.io/)

### Session 2.5.4 — Event-driven architecture
> Outcomes: Design systems that communicate through events and handle eventual consistency.
- Events, commands and messages
- Publish/subscribe and event buses
- Event sourcing and CQRS (overview)
- Enterprise integration patterns
- Practice: redesign a synchronous workflow as events
Sources: [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/), [Martin Fowler — Event-Driven](https://martinfowler.com/articles/201701-event-driven.html)

# Track 3 — Backend and Data

## Module 3.1 — Web foundations

### Session 3.1.1 — How the web works
> Outcomes: Explain what happens from typing a URL to seeing a page, end to end.
- Clients, servers and the request/response model
- DNS resolution
- TCP/IP and TLS in one picture
- Browsers, rendering and the backend's role
- Practice: trace a request with curl -v and browser dev tools
Sources: [MDN — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP), [Cloudflare Learning Center](https://www.cloudflare.com/learning/)

### Session 3.1.2 — HTTP in depth
> Outcomes: Use HTTP methods, status codes, headers, caching and cookies correctly.
- Methods and idempotency
- Status codes families
- Headers, content negotiation and caching (ETag, Cache-Control)
- Cookies, sessions and CORS
- HTTP/2 and HTTP/3
- Practice: build a tiny HTTP server with the Python standard library
Sources: [MDN — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP), [RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)

## Module 3.2 — APIs

### Session 3.2.1 — REST API design
> Outcomes: Design resource-oriented APIs with consistent naming, errors, pagination and versioning.
- Resources, URIs and representations
- Error format and status codes
- Pagination, filtering and sorting
- Versioning, idempotency keys and rate limiting
- OpenAPI as the contract
- Practice: design the API for a to-do app in OpenAPI
Sources: [Google API Design Guide](https://cloud.google.com/apis/design), [OpenAPI Specification](https://spec.openapis.org/oas/latest.html), [OWASP API Security Top 10](https://owasp.org/API-Security/)

### Session 3.2.2 — FastAPI fundamentals
> Outcomes: Build a typed REST API with FastAPI, Pydantic validation and automatic docs.
- Path operations, parameters and request bodies
- Pydantic models for input and output
- Automatic OpenAPI docs
- Error handling and status codes
- Practice: implement the to-do API in FastAPI
Sources: [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/), [Pydantic](https://pydantic.dev/docs/validation/latest/get-started/)

### Session 3.2.3 — FastAPI in production
> Outcomes: Structure larger FastAPI apps with dependencies, middleware, background tasks and settings.
- Dependency injection with Depends
- Routers and project structure
- Middleware, CORS and lifespan events
- Background tasks and settings management
- Testing FastAPI apps
- Practice: add auth-ready dependencies and tests to the to-do API
Sources: [FastAPI docs](https://fastapi.tiangolo.com/), [The Twelve-Factor App](https://12factor.net/)

### Session 3.2.4 — GraphQL
> Outcomes: Explain when GraphQL fits better than REST and build a basic GraphQL API.
- Schemas, queries and mutations
- Resolvers and the N+1 problem (DataLoader)
- REST vs GraphQL trade-offs
- Practice: expose the to-do model through GraphQL
Sources: [GraphQL Learn](https://graphql.org/learn/)

### Session 3.2.5 — Streaming and RPC: SSE, WebSockets and gRPC
> Outcomes: Choose between polling, SSE, WebSockets and gRPC for real-time and service-to-service APIs.
- Polling vs server-sent events vs WebSockets
- Streaming LLM responses with SSE
- gRPC and Protocol Buffers
- Practice: stream progress updates to a browser with SSE
Sources: [MDN — WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), [gRPC docs](https://grpc.io/docs/), [FastAPI WebSockets](https://fastapi.tiangolo.com/advanced/websockets/)

## Module 3.3 — Relational databases

### Session 3.3.1 — Relational model and SQL basics
> Outcomes: Query and modify relational data with SQL.
- Tables, rows, keys and the relational model
- SELECT, WHERE, ORDER BY, LIMIT
- INSERT, UPDATE, DELETE
- NULL and three-valued logic
- Practice: complete SQLBolt
Sources: [SQLBolt](https://sqlbolt.com/), [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)

### Session 3.3.2 — Advanced SQL
> Outcomes: Write complex analytical queries with joins, aggregation, CTEs and window functions.
- Joins: inner, left, full, self
- GROUP BY, HAVING and aggregate functions
- Subqueries and common table expressions
- Window functions
- Practice: answer ten business questions on a sample database
Sources: [PostgreSQL docs](https://www.postgresql.org/docs/current/), [SQLBolt](https://sqlbolt.com/)

### Session 3.3.3 — Database design and normalisation
> Outcomes: Design a normalised schema from requirements using ER modelling.
- Entity–relationship modelling
- Primary and foreign keys, constraints
- Normal forms (1NF–3NF) and when to denormalise
- Practice: design the schema of a learning platform
Sources: [CMU 15-445 Database Systems](https://15445.courses.cs.cmu.edu/), [PostgreSQL docs](https://www.postgresql.org/docs/current/)

### Session 3.3.4 — Indexes and query performance
> Outcomes: Read query plans and add the right indexes to make slow queries fast.
- How B-tree indexes work
- EXPLAIN and EXPLAIN ANALYZE
- Composite, partial and covering indexes
- Common anti-patterns
- Practice: speed up three slow queries on a large table
Sources: [Use The Index, Luke](https://use-the-index-luke.com/), [PostgreSQL docs — Indexes](https://www.postgresql.org/docs/current/indexes.html)

### Session 3.3.5 — Transactions and concurrency control
> Outcomes: Use transactions and isolation levels to keep data correct under concurrency.
- ACID properties
- Isolation levels and anomalies (dirty read, lost update, phantom)
- Locks and MVCC in PostgreSQL
- Optimistic vs pessimistic concurrency
- Practice: reproduce and fix a lost-update bug
Sources: [PostgreSQL docs — Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html), [CMU 15-445 Database Systems](https://15445.courses.cs.cmu.edu/)

## Module 3.4 — ORM and migrations

### Session 3.4.1 — SQLAlchemy ORM
> Outcomes: Map Python classes to tables and query efficiently with SQLAlchemy 2.0.
- Core vs ORM
- Declarative models and relationships
- Sessions and the unit of work
- Loading strategies and the N+1 problem
- Async SQLAlchemy
- Practice: connect the to-do API to PostgreSQL with SQLAlchemy
Sources: [SQLAlchemy Unified Tutorial](https://docs.sqlalchemy.org/en/20/tutorial/index.html), [SQLAlchemy 2.0 docs](https://docs.sqlalchemy.org/en/20/)

### Session 3.4.2 — Schema migrations
> Outcomes: Evolve a production schema safely with Alembic migrations.
- Why migrations
- Alembic revisions, upgrade and downgrade
- Zero-downtime migration patterns (expand/contract)
- Data migrations
- Practice: add a column and backfill it without downtime
Sources: [Alembic docs](https://alembic.sqlalchemy.org/en/latest/)

## Module 3.5 — Beyond relational

### Session 3.5.1 — NoSQL data models
> Outcomes: Choose between document, key–value, wide-column and graph databases.
- Document stores
- Key–value stores
- Wide-column stores
- Graph databases
- Polyglot persistence trade-offs
- Practice: model the same data in relational and document form
Sources: [Designing Data-Intensive Applications](https://dataintensive.net/), [Redis docs](https://redis.io/docs/latest/)

### Session 3.5.2 — Caching with Redis
> Outcomes: Add caching to an application and handle invalidation correctly.
- Cache-aside, write-through and write-behind
- TTLs, eviction and invalidation
- Redis data structures beyond strings
- Rate limiting and sessions with Redis
- Practice: cache an expensive endpoint and measure the speed-up
Sources: [Redis docs](https://redis.io/docs/latest/), [Redis University](https://university.redis.io/)

### Session 3.5.3 — Message queues and background jobs
> Outcomes: Move slow work to background workers with reliable queues.
- Why asynchronous processing
- Queues, workers, acknowledgements and retries
- RabbitMQ basics
- Celery and RQ in Python
- Idempotent consumers and dead-letter queues
- Practice: send emails from a background worker
Sources: [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials), [Celery docs](https://docs.celeryq.dev/en/stable/)

### Session 3.5.4 — Event streaming with Kafka
> Outcomes: Explain logs, topics, partitions and consumer groups and when to use streaming.
- The log as a data structure
- Topics, partitions and consumer groups
- Delivery guarantees
- Streams vs queues
- Practice: produce and consume events locally with Docker
Sources: [Apache Kafka docs](https://kafka.apache.org/documentation/), [Designing Data-Intensive Applications](https://dataintensive.net/)

### Session 3.5.5 — Data warehousing and analytics basics
> Outcomes: Explain OLTP vs OLAP and build a simple analytics pipeline.
- OLTP vs OLAP
- ETL vs ELT
- Star schemas and columnar storage
- Practice: build a daily report from application data
Sources: [Designing Data-Intensive Applications](https://dataintensive.net/), [PostgreSQL docs](https://www.postgresql.org/docs/current/)

## Module 3.6 — Communication features

### Session 3.6.1 — Real-time private chat
> Outcomes: Build a private one-to-one chat with WebSockets, persistence and presence.
- WebSocket connection lifecycle and authentication
- Message persistence and history
- Fan-out with Redis pub/sub
- Read receipts and presence
- Practice: private chat between two users
Sources: [FastAPI WebSockets](https://fastapi.tiangolo.com/advanced/websockets/), [MDN — WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), [Redis docs](https://redis.io/docs/latest/)

### Session 3.6.2 — Automatic emails and notifications
> Outcomes: Send reliable transactional emails and notifications from background jobs.
- SMTP and transactional email providers
- Templates and personalisation
- Deliverability: SPF, DKIM, DMARC
- Scheduling, retries and unsubscribe compliance
- Practice: weekly progress email for YouCanDoIt
Sources: [Python email docs](https://docs.python.org/3/library/email.html), [Celery docs](https://docs.celeryq.dev/en/stable/), [Cloudflare Learning — DMARC](https://www.cloudflare.com/learning/dns/dns-records/dns-dmarc-record/)

### Session 3.6.3 — File uploads and object storage
> Outcomes: Handle file uploads securely and store them in S3-compatible object storage.
- Multipart uploads and streaming
- Validation: size, type and malware concerns
- Object storage and presigned URLs
- Practice: avatar upload with MinIO locally
Sources: [FastAPI — Request Files](https://fastapi.tiangolo.com/tutorial/request-files/), [MinIO docs](https://min.io/docs/minio/linux/index.html), [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

## Module 3.7 — Go as a second backend language

### Session 3.7.1 — Go fundamentals
> Outcomes: Write Go programs with structs, interfaces, errors and modules.
- Why Go: simplicity, static binaries, concurrency
- Types, structs and methods
- Interfaces and composition
- Error handling and modules
- Practice: a CLI tool in Go
Sources: [A Tour of Go](https://go.dev/tour/), [Go by Example](https://gobyexample.com/), [Go docs](https://go.dev/doc/)

### Session 3.7.2 — Concurrency and services in Go
> Outcomes: Build a concurrent HTTP service in Go with goroutines and channels.
- Goroutines and channels
- sync primitives and context cancellation
- net/http and JSON
- Testing in Go
- Practice: rewrite one API endpoint as a Go microservice
Sources: [A Tour of Go](https://go.dev/tour/), [Go by Example](https://gobyexample.com/)

# Track 4 — Systems

## Module 4.1 — Operating systems

### Session 4.1.1 — Processes and threads
> Outcomes: Explain processes, threads, scheduling and context switching.
- The process abstraction
- Threads and shared memory
- CPU scheduling basics
- System calls and the kernel boundary
- Practice: observe processes and threads with ps and htop
Sources: [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)

### Session 4.1.2 — Memory management
> Outcomes: Explain virtual memory, paging and why programs run out of memory.
- Address spaces and virtual memory
- Paging and the TLB
- Heap allocation and garbage collection
- Memory leaks and OOM kills
- Practice: profile memory usage of a Python program
Sources: [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/), [Python tracemalloc docs](https://docs.python.org/3/library/tracemalloc.html)

### Session 4.1.3 — File systems and I/O
> Outcomes: Explain how files, buffers and disks work and their performance implications.
- Files, directories and inodes
- Buffered vs direct I/O, fsync
- Disks and SSDs
- Practice: measure sequential vs random I/O
Sources: [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)

### Session 4.1.4 — Linux for developers and operators
> Outcomes: Administer a Linux server: users, services, logs and packages.
- Users, groups and permissions
- systemd services and journald logs
- Package managers
- Signals and process lifecycle
- SSH and remote administration
- Practice: deploy a service with systemd on a VM
Sources: [The Linux Command Line](https://linuxcommand.org/tlcl.php), [roadmap.sh DevOps](https://roadmap.sh/devops)

## Module 4.2 — Computer networks

### Session 4.2.1 — Network layers and TCP/IP
> Outcomes: Explain the network stack and how data travels reliably across the internet.
- The layered model (OSI vs TCP/IP)
- IP addressing, subnets and routing
- TCP vs UDP, handshakes and congestion control
- Practice: inspect traffic with tcpdump or Wireshark
Sources: [Computer Networks: A Systems Approach](https://book.systemsapproach.org/), [Kurose & Ross lectures](https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm)

### Session 4.2.2 — DNS, TLS, proxies and load balancers
> Outcomes: Configure DNS, HTTPS and reverse proxies for a web application.
- DNS records and propagation
- TLS certificates and Let's Encrypt
- Reverse proxies (Nginx) and load balancing algorithms
- CDNs
- Practice: put a FastAPI app behind Nginx with HTTPS
Sources: [Cloudflare Learning Center](https://www.cloudflare.com/learning/), [Let's Encrypt docs](https://letsencrypt.org/docs/), [Nginx docs](https://nginx.org/en/docs/)

### Session 4.2.3 — Network programming
> Outcomes: Write client/server programs with sockets.
- Sockets API
- Blocking vs non-blocking I/O
- Building a TCP echo server
- Practice: a tiny chat server with sockets
Sources: [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/), [Python socket docs](https://docs.python.org/3/library/socket.html)

## Module 4.3 — Concurrency

### Session 4.3.1 — Concurrency fundamentals
> Outcomes: Identify race conditions and deadlocks and fix them with synchronisation.
- Concurrency vs parallelism
- Race conditions and critical sections
- Locks, semaphores and condition variables
- Deadlocks and how to avoid them
- Python's GIL, threads and processes
- Practice: reproduce and fix a race condition
Sources: [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/), [Python threading docs](https://docs.python.org/3/library/threading.html)

### Session 4.3.2 — Asynchronous Python
> Outcomes: Write efficient I/O-bound code with asyncio.
- The event loop
- async/await and coroutines
- Tasks, gather and timeouts
- Async HTTP and databases
- Practice: fetch 100 URLs concurrently with httpx
Sources: [Python asyncio docs](https://docs.python.org/3/library/asyncio.html), [FastAPI — Concurrency and async](https://fastapi.tiangolo.com/async/)

## Module 4.4 — Distributed systems

### Session 4.4.1 — Distributed systems fundamentals
> Outcomes: Explain why distributed systems fail and the trade-offs between consistency and availability.
- Partial failures, latency and the fallacies of distributed computing
- Clocks and ordering
- CAP and PACELC
- Consistency models
- Practice: summarise one MIT 6.5840 lecture
Sources: [MIT 6.5840 Distributed Systems](https://pdos.csail.mit.edu/6.824/), [Designing Data-Intensive Applications](https://dataintensive.net/), [DDIA notes](https://github.com/keyvanakbary/learning-notes/blob/master/books/designing-data-intensive-applications.md)

### Session 4.4.2 — Replication and partitioning
> Outcomes: Design data replication and sharding strategies.
- Leader–follower and multi-leader replication
- Replication lag and read-your-writes
- Partitioning by key and by hash
- Rebalancing and hot spots
- Practice: set up PostgreSQL streaming replication locally
Sources: [Designing Data-Intensive Applications](https://dataintensive.net/), [DDIA notes](https://github.com/keyvanakbary/learning-notes/blob/master/books/designing-data-intensive-applications.md)

### Session 4.4.3 — Consensus and coordination
> Outcomes: Explain consensus, leader election and distributed locks.
- The consensus problem
- Raft in plain words
- Leader election, leases and distributed locks
- Coordination services (etcd, ZooKeeper)
- Practice: visualise Raft and explain it in your own words
Sources: [MIT 6.5840 Distributed Systems](https://pdos.csail.mit.edu/6.824/), [The Raft site](https://raft.github.io/)

### Session 4.4.4 — Distributed transactions and data consistency patterns
> Outcomes: Keep data consistent across services with sagas, outbox and idempotency.
- Two-phase commit and its limits
- Sagas: orchestration vs choreography
- Transactional outbox
- Idempotency and exactly-once myths
- Practice: implement an outbox for a payment-like flow
Sources: [microservices.io — Saga](https://microservices.io/patterns/data/saga.html), [microservices.io — Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html)

## Module 4.5 — System design and reliability

### Session 4.5.1 — The system design process
> Outcomes: Approach an open-ended design problem methodically.
- Clarifying requirements and constraints
- Back-of-the-envelope estimation
- High-level design, deep dives and trade-offs
- Practice: design a URL shortener end to end
Sources: [System Design Primer](https://github.com/donnemartin/system-design-primer), [roadmap.sh System Design](https://roadmap.sh/system-design)

### Session 4.5.2 — Scalability building blocks
> Outcomes: Combine load balancers, caches, CDNs, queues and sharding to scale a system.
- Vertical vs horizontal scaling and statelessness
- Load balancing and CDNs
- Caching layers
- Database scaling: read replicas, sharding
- Asynchronism with queues
- Practice: scale your URL shortener to 100M users on paper
Sources: [System Design Primer](https://github.com/donnemartin/system-design-primer), [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/)

### Session 4.5.3 — Designing classic systems
> Outcomes: Design common large-scale systems and defend your trade-offs.
- Chat system
- News feed
- Rate limiter
- Notification system
- Practice: write a design doc for one of them
Sources: [System Design Primer](https://github.com/donnemartin/system-design-primer), [Designing Data-Intensive Applications](https://dataintensive.net/)

### Session 4.5.4 — Performance engineering
> Outcomes: Measure, profile and optimise performance with data instead of guesses.
- Latency vs throughput, percentiles
- Profiling CPU and memory in Python
- Load testing with k6 or Locust
- The USE and RED methods
- Practice: load-test an API, find and fix the bottleneck
Sources: [Grafana k6 docs](https://grafana.com/docs/k6/latest/), [Brendan Gregg — USE Method](https://www.brendangregg.com/usemethod.html), [Python profilers](https://docs.python.org/3/library/profile.html)

### Session 4.5.5 — Reliability engineering
> Outcomes: Define SLIs and SLOs, use error budgets and design for failure.
- SLIs, SLOs, SLAs and error budgets
- Timeouts, retries with backoff, circuit breakers
- Graceful degradation and bulkheads
- Chaos engineering basics
- Practice: define SLOs for YouCanDoIt
Sources: [Google SRE Book](https://sre.google/sre-book/table-of-contents/), [Google SRE Workbook](https://sre.google/workbook/table-of-contents/)

### Session 4.5.6 — Disaster recovery and business continuity
> Outcomes: Plan backups, restores and failover with clear RPO and RTO targets.
- RPO and RTO
- Backup strategies and restore drills
- Multi-region and failover
- Runbooks
- Practice: back up and restore the YouCanDoIt database
Sources: [Google SRE Book](https://sre.google/sre-book/table-of-contents/), [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/), [PostgreSQL docs — Backup](https://www.postgresql.org/docs/current/backup.html)

# Track 5 — DevOps and Cloud

## Module 5.1 — Containers

### Session 5.1.1 — Docker fundamentals
> Outcomes: Explain containers vs virtual machines and run, inspect and debug containers.
- Containers vs VMs: namespaces and cgroups
- Images, layers and registries
- Running, stopping and inspecting containers
- Volumes and networking
- Practice: run PostgreSQL and pgAdmin in containers
Sources: [Docker — Get started](https://docs.docker.com/get-started/)

### Session 5.1.2 — Writing good Dockerfiles
> Outcomes: Build small, fast, secure images with multi-stage builds.
- Dockerfile instructions
- Layer caching and build order
- Multi-stage builds and slim base images
- Non-root users and .dockerignore
- Practice: containerise the FastAPI to-do API under 200 MB
Sources: [Docker build best practices](https://docs.docker.com/build/building/best-practices/), [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)

### Session 5.1.3 — Docker Compose for multi-service apps
> Outcomes: Run a full local stack (API, database, cache, frontend) with Docker Compose.
- Services, networks and volumes in Compose
- Health checks and dependencies
- Environment variables and profiles
- Development workflow with bind mounts
- Practice: Compose stack for API + Postgres + Redis
Sources: [Docker Compose docs](https://docs.docker.com/compose/)

## Module 5.2 — CI/CD

### Session 5.2.1 — Continuous integration with GitHub Actions
> Outcomes: Automate linting, testing and building on every push.
- CI principles: small commits, fast feedback
- Workflows, jobs, steps and runners
- Caching, matrices and secrets
- Building and pushing images
- Practice: CI pipeline for your API repo
Sources: [GitHub Actions docs](https://docs.github.com/en/actions)

### Session 5.2.2 — Continuous delivery and deployment strategies
> Outcomes: Release safely with blue/green, canary and feature flags.
- Continuous delivery vs deployment
- Blue/green and canary releases
- Feature flags and dark launches
- Rollbacks and database changes
- Practice: automatic deploy on merge to main
Sources: [Martin Fowler — Continuous Delivery](https://martinfowler.com/bliki/ContinuousDelivery.html), [Martin Fowler — Feature Toggles](https://martinfowler.com/articles/feature-toggles.html)

### Session 5.2.3 — GitOps
> Outcomes: Manage deployments declaratively from Git with Argo CD.
- GitOps principles
- Argo CD architecture
- Environments and promotion
- Practice: deploy to a local Kubernetes cluster with Argo CD
Sources: [Argo CD docs](https://argo-cd.readthedocs.io/en/stable/), [OpenGitOps](https://opengitops.dev/)

## Module 5.3 — Cloud computing

### Session 5.3.1 — Cloud computing concepts
> Outcomes: Explain IaaS, PaaS, SaaS, regions and the shared responsibility model.
- What the cloud is and why it won
- Service models: IaaS, PaaS, SaaS, FaaS
- Regions, availability zones and edge
- Shared responsibility and pricing models
- Practice: map YouCanDoIt's components to cloud services
Sources: [AWS Cloud Practitioner path](https://aws.amazon.com/training/learn-about/cloud-practitioner/), [Azure Fundamentals](https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/)

### Session 5.3.2 — Core cloud services on AWS
> Outcomes: Use the core compute, storage, database and networking services of AWS.
- IAM: users, roles and least privilege
- Compute: EC2, containers (ECS/Fargate), Lambda
- Storage: S3, EBS
- Databases: RDS, DynamoDB
- Networking: VPC, subnets, security groups
- Practice: deploy the API with the free tier and tear it down
Sources: [AWS Skill Builder](https://skillbuilder.aws/), [AWS Cloud Practitioner path](https://aws.amazon.com/training/learn-about/cloud-practitioner/)

### Session 5.3.3 — Azure and Google Cloud equivalents
> Outcomes: Translate architectures between AWS, Azure and Google Cloud.
- Service mapping across providers
- Azure fundamentals (AZ-900 topics)
- Google Cloud fundamentals
- Practice: redraw your AWS architecture for Azure and GCP
Sources: [Azure Fundamentals](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/), [Google Cloud training](https://cloud.google.com/learn/training), [Google Skills](https://www.skills.google/)

### Session 5.3.4 — Serverless
> Outcomes: Build event-driven serverless functions and know their limits.
- Functions as a service and event triggers
- Cold starts, limits and pricing
- Serverless databases and queues
- Practice: an image-thumbnail function triggered by uploads
Sources: [AWS Lambda docs](https://docs.aws.amazon.com/lambda/), [microservices.io](https://microservices.io/)

### Session 5.3.5 — PaaS deployment with logging and monitoring
> Outcomes: Deploy a full-stack app to a free PaaS with logs, health checks and alerts.
- PaaS options: Render, Fly.io, Vercel, Neon
- Environment configuration and secrets
- Logs, health checks and alerting on PaaS
- Practice: deploy the to-do app to a free PaaS with monitoring
Sources: [Render docs](https://render.com/docs), [Fly.io docs](https://fly.io/docs/), [Vercel docs](https://vercel.com/docs), [Neon docs](https://neon.com/docs/introduction)

### Session 5.3.6 — Cloud cost management
> Outcomes: Estimate, monitor and reduce cloud costs.
- Cost drivers: compute, storage, egress
- Budgets, alerts and tagging
- Right-sizing and reserved capacity
- Practice: estimate the monthly cost of your architecture
Sources: [FinOps Foundation](https://www.finops.org/introduction/what-is-finops/), [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/)

## Module 5.4 — Infrastructure as code

### Session 5.4.1 — Terraform fundamentals
> Outcomes: Provision infrastructure declaratively with Terraform.
- Infrastructure as code principles
- Providers, resources and variables
- Plan, apply and state
- Practice: provision a container and a database with Terraform
Sources: [Terraform tutorials](https://developer.hashicorp.com/terraform/tutorials), [OpenTofu docs](https://opentofu.org/docs/)

### Session 5.4.2 — Terraform at scale
> Outcomes: Organise Terraform code with modules, remote state and environments.
- Modules and composition
- Remote state and locking
- Workspaces and environment separation
- Policy and drift detection
- Practice: refactor your Terraform into reusable modules
Sources: [Terraform docs](https://developer.hashicorp.com/terraform/docs)

### Session 5.4.3 — Configuration management with Ansible
> Outcomes: Configure servers repeatably with Ansible playbooks.
- Inventories and playbooks
- Idempotent tasks and roles
- Ansible vs Terraform
- Practice: configure a VM with Nginx using Ansible
Sources: [Ansible docs](https://docs.ansible.com/)

## Module 5.5 — Kubernetes

### Session 5.5.1 — Kubernetes architecture and core objects
> Outcomes: Explain the Kubernetes control plane and core objects.
- Why orchestration
- Control plane and nodes
- Pods, ReplicaSets and Deployments
- Running a local cluster with kind or minikube
- Practice: deploy your API to kind
Sources: [Kubernetes Basics tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/), [Kubernetes docs](https://kubernetes.io/docs/home/)

### Session 5.5.2 — Deploying applications on Kubernetes
> Outcomes: Expose and configure applications with Services, Ingress, ConfigMaps and Secrets.
- Services and service discovery
- Ingress and TLS
- ConfigMaps and Secrets
- Persistent volumes and StatefulSets
- Practice: full stack (API + Postgres) on kind
Sources: [Kubernetes docs](https://kubernetes.io/docs/home/)

### Session 5.5.3 — Packaging with Helm
> Outcomes: Package and version Kubernetes applications with Helm charts.
- Charts, values and templates
- Releases, upgrades and rollbacks
- Practice: write a Helm chart for your API
Sources: [Helm docs](https://helm.sh/docs/)

### Session 5.5.4 — Operating Kubernetes workloads
> Outcomes: Make workloads resilient with probes, resource limits and autoscaling.
- Liveness, readiness and startup probes
- Requests, limits and quality of service
- Horizontal Pod Autoscaler
- Rolling updates and disruption budgets
- Practice: autoscale your API under load
Sources: [Kubernetes docs](https://kubernetes.io/docs/home/), [Google SRE Workbook](https://sre.google/workbook/table-of-contents/)

## Module 5.6 — Observability and operations

### Session 5.6.1 — Structured logging
> Outcomes: Produce structured, searchable logs with correlation IDs.
- Log levels and what to log
- Structured JSON logs
- Correlation and request IDs
- Log aggregation (Loki)
- Practice: structured logging in the FastAPI app
Sources: [Python logging HOWTO](https://docs.python.org/3/howto/logging.html), [Grafana Loki docs](https://grafana.com/docs/loki/latest/)

### Session 5.6.2 — Metrics with Prometheus and Grafana
> Outcomes: Instrument services with metrics and build dashboards and alerts.
- Metric types: counters, gauges, histograms
- Prometheus scraping and PromQL
- Grafana dashboards
- Alerting on symptoms (RED, golden signals)
- Practice: dashboard for API latency and errors
Sources: [Prometheus overview](https://prometheus.io/docs/introduction/overview/), [Grafana docs](https://grafana.com/docs/grafana/latest/)

### Session 5.6.3 — Distributed tracing with OpenTelemetry
> Outcomes: Trace requests across services to find latency and errors.
- Traces, spans and context propagation
- OpenTelemetry SDK and auto-instrumentation
- Collectors and backends (Jaeger, Tempo)
- Practice: trace a request from frontend to database
Sources: [OpenTelemetry docs](https://opentelemetry.io/docs/), [OpenTelemetry Python](https://opentelemetry.io/docs/languages/python/)

### Session 5.6.4 — Error tracking with Sentry
> Outcomes: Capture, triage and fix production errors with Sentry.
- Error tracking vs logging
- Sentry SDK for FastAPI and Next.js
- Releases, source maps and performance monitoring
- Alert rules and triage workflow
- Practice: integrate Sentry into YouCanDoIt
Sources: [Sentry docs](https://docs.sentry.io/), [Sentry FastAPI integration](https://docs.sentry.io/platforms/python/integrations/fastapi/)

### Session 5.6.5 — On-call and incident response
> Outcomes: Respond to incidents calmly and run blameless postmortems.
- On-call practices and alert fatigue
- Incident roles and communication
- Runbooks
- Blameless postmortems
- Practice: write a postmortem for a simulated outage
Sources: [Google SRE Book](https://sre.google/sre-book/table-of-contents/), [PagerDuty Incident Response](https://response.pagerduty.com/)

# Track 6 — Security and Compliance

## Module 6.1 — Security foundations

### Session 6.1.1 — Security mindset and threat modelling
> Outcomes: Identify assets, threats and mitigations for a system before writing code.
- CIA triad and attack surface
- Threat modelling with STRIDE
- Security by design and defence in depth
- Practice: threat model YouCanDoIt
Sources: [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html), [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Session 6.1.2 — Cryptography for developers
> Outcomes: Use hashing, encryption and signatures correctly without inventing your own crypto.
- Hashing vs encryption vs encoding
- Symmetric and asymmetric encryption
- Digital signatures and certificates
- Password hashing (Argon2, bcrypt)
- Practice: sign and verify a payload; hash passwords correctly
Sources: [Practical Cryptography for Developers](https://cryptobook.nakov.com/), [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## Module 6.2 — Web application security

### Session 6.2.1 — The OWASP Top 10
> Outcomes: Recognise and prevent the most critical web application security risks.
- Broken access control
- Cryptographic failures
- Injection
- Insecure design and misconfiguration
- Vulnerable components and logging failures
- Practice: audit a sample app against the Top 10
Sources: [OWASP Top 10](https://top10.owasp.org/), [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Session 6.2.2 — Preventing SQL injection
> Outcomes: Prevent SQL injection with parameterised queries and safe ORM use.
- How SQL injection works
- Parameterised queries and prepared statements
- ORM pitfalls: raw SQL and string formatting
- Least-privilege database users
- Practice: exploit and then fix a vulnerable endpoint locally
Sources: [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), [SQLAlchemy docs](https://docs.sqlalchemy.org/en/20/)

### Session 6.2.3 — XSS, CSRF and browser security
> Outcomes: Prevent cross-site scripting and request forgery with escaping, CSP and cookies.
- Stored, reflected and DOM XSS
- Output encoding and React's protections (and dangerouslySetInnerHTML)
- Content Security Policy
- CSRF and SameSite cookies
- Security headers
- Practice: add CSP and security headers to a Next.js app
Sources: [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [MDN — CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

### Session 6.2.4 — API security
> Outcomes: Secure APIs against the OWASP API Top 10.
- Object-level and function-level authorisation
- Rate limiting and resource exhaustion
- Mass assignment and input validation
- Practice: security review of your FastAPI project
Sources: [OWASP API Security Top 10](https://owasp.org/API-Security/), [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

## Module 6.3 — Identity and access

### Session 6.3.1 — Authentication
> Outcomes: Implement secure login with sessions or tokens.
- Password-based login done right
- Sessions vs JWTs
- Token storage and expiry, refresh tokens
- Practice: add login to the to-do API
Sources: [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [JWT introduction](https://jwt.io/introduction), [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

### Session 6.3.2 — Two-factor authentication and passkeys
> Outcomes: Add TOTP-based 2FA and understand passkeys/WebAuthn.
- Why MFA
- TOTP (RFC 6238) and recovery codes
- Passkeys and WebAuthn
- Practice: add TOTP 2FA to your login
Sources: [OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html), [RFC 6238 TOTP](https://www.rfc-editor.org/rfc/rfc6238), [WebAuthn Guide](https://webauthn.guide/)

### Session 6.3.3 — OAuth 2.0 and OpenID Connect
> Outcomes: Integrate social login and delegated access with OAuth 2.0 and OIDC.
- OAuth roles and flows (authorization code + PKCE)
- OpenID Connect and ID tokens
- Scopes and consent
- Practice: "Sign in with GitHub"
Sources: [OAuth 2.0](https://oauth.net/2/), [OpenID Connect](https://openid.net/developers/how-connect-works/)

### Session 6.3.4 — Authorisation models
> Outcomes: Design role- and attribute-based access control.
- RBAC, ABAC and ReBAC
- Enforcing authorisation in APIs
- Multi-tenancy isolation
- Practice: roles for admin, mentor and learner
Sources: [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## Module 6.4 — Secure delivery

### Session 6.4.1 — Secrets management
> Outcomes: Keep secrets out of code and rotate them safely.
- Environment variables and their limits
- Secret managers (Vault, cloud KMS)
- Secret scanning and rotation
- Practice: remove a leaked secret from git history and rotate it
Sources: [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning)

### Session 6.4.2 — Software supply chain security
> Outcomes: Reduce dependency risk with scanning, pinning, SBOMs and provenance.
- Dependency vulnerabilities and Dependabot
- Pinning, lock files and reproducible builds
- SBOMs and SLSA provenance
- Image scanning (Trivy)
- Practice: add dependency and image scanning to CI
Sources: [SLSA](https://slsa.dev/), [Trivy docs](https://trivy.dev/docs/latest/), [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot)

### Session 6.4.3 — Hardening cloud and containers
> Outcomes: Apply least privilege and hardening to containers, Kubernetes and cloud accounts.
- Least-privilege IAM
- Container hardening: non-root, read-only filesystems
- Network policies and segmentation
- Security logging and monitoring
- Practice: harden your Compose and Kubernetes manifests
Sources: [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html), [Kubernetes security docs](https://kubernetes.io/docs/concepts/security/)

## Module 6.5 — Privacy and regulation

### Session 6.5.1 — GDPR for developers
> Outcomes: Build features that comply with GDPR: lawful basis, consent, data rights and retention.
- Personal data and lawful bases
- Privacy by design and data minimisation
- Data subject rights: access, deletion, portability
- Retention, DPAs and breach notification
- Practice: implement data export and account deletion
Sources: [GDPR — Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj), [OWASP User Privacy Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html)

### Session 6.5.2 — The EU AI Act and responsible AI
> Outcomes: Classify an AI system's risk level and apply responsible-AI practices.
- Risk categories under the AI Act
- Transparency obligations for chatbots and generated content
- Bias, fairness and explainability
- AI risk management frameworks
- Practice: write a short AI impact assessment for YouCanDoIt's tutor
Sources: [EU AI Act — Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj), [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)

# Track 7 — Mathematics for AI

## Module 7.1 — Linear algebra

### Session 7.1.1 — Vectors and vector spaces
> Outcomes: Manipulate vectors and explain dot products and similarity geometrically.
- Vectors as arrows and as lists of numbers
- Addition, scaling and linear combinations
- Dot product, norms and cosine similarity
- Practice: compute cosine similarity between word vectors with NumPy
Sources: [3Blue1Brown — Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra), [Khan Academy — Linear Algebra](https://www.khanacademy.org/math/linear-algebra)

### Session 7.1.2 — Matrices and linear transformations
> Outcomes: Interpret matrices as transformations and multiply them confidently.
- Matrices as transformations
- Matrix multiplication and composition
- Determinant, inverse and rank
- Practice: implement matrix multiplication and compare with NumPy
Sources: [3Blue1Brown — Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra), [Khan Academy — Linear Algebra](https://www.khanacademy.org/math/linear-algebra)

### Session 7.1.3 — Eigenvectors and decompositions
> Outcomes: Explain eigenvectors, SVD and PCA and why they matter in ML.
- Eigenvalues and eigenvectors
- Singular value decomposition
- Principal component analysis
- Practice: reduce a dataset to 2D with PCA and plot it
Sources: [3Blue1Brown — Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra), [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course)

## Module 7.2 — Calculus

### Session 7.2.1 — Derivatives and gradients
> Outcomes: Compute derivatives and partial derivatives and interpret gradients.
- Limits and the derivative as rate of change
- Rules of differentiation
- Partial derivatives and the gradient
- Practice: numerically approximate gradients in Python
Sources: [3Blue1Brown — Essence of Calculus](https://www.3blue1brown.com/topics/calculus), [Khan Academy — Calculus 1](https://www.khanacademy.org/math/calculus-1)

### Session 7.2.2 — Chain rule and optimisation
> Outcomes: Apply the chain rule and gradient descent — the engine of neural network training.
- The chain rule and computational graphs
- Gradient descent and learning rate
- Stochastic and mini-batch gradient descent
- Practice: fit a line with hand-written gradient descent
Sources: [3Blue1Brown — Essence of Calculus](https://www.3blue1brown.com/topics/calculus), [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html)

## Module 7.3 — Probability and statistics

### Session 7.3.1 — Probability fundamentals
> Outcomes: Reason about uncertainty with probability rules, conditional probability and Bayes' theorem.
- Events, sample spaces and probability rules
- Conditional probability and independence
- Bayes' theorem
- Random variables and expectation
- Practice: simulate a medical-test Bayes problem in Python
Sources: [Khan Academy — Statistics and Probability](https://www.khanacademy.org/math/statistics-probability), [CS50 AI](https://cs50.harvard.edu/ai/)

### Session 7.3.2 — Distributions
> Outcomes: Recognise common distributions and where they appear in data and models.
- Discrete: Bernoulli, binomial, Poisson
- Continuous: uniform, normal, exponential
- Central limit theorem
- Practice: sample and plot distributions with NumPy
Sources: [OpenStax Introductory Statistics](https://openstax.org/details/books/introductory-statistics-2e), [StatQuest](https://statquest.org/)

### Session 7.3.3 — Descriptive and inferential statistics
> Outcomes: Summarise data and draw conclusions with confidence intervals and hypothesis tests.
- Mean, median, variance and correlation
- Sampling and confidence intervals
- Hypothesis testing and p-values
- A/B testing in product work
- Practice: analyse an A/B test result
Sources: [OpenStax Introductory Statistics](https://openstax.org/details/books/introductory-statistics-2e), [StatQuest](https://statquest.org/)

## Module 7.4 — Data tools

### Session 7.4.1 — NumPy
> Outcomes: Work with arrays, broadcasting and vectorised operations.
- ndarrays, shapes and dtypes
- Indexing and slicing
- Broadcasting and vectorisation
- Practice: rewrite loops as vectorised NumPy
Sources: [NumPy — absolute beginners](https://numpy.org/doc/stable/user/absolute_beginners.html)

### Session 7.4.2 — pandas and data visualisation
> Outcomes: Load, clean, explore and visualise tabular data.
- DataFrames, selection and filtering
- Cleaning missing and messy data
- Grouping and aggregation
- Plotting with matplotlib
- Practice: exploratory data analysis of a public dataset
Sources: [pandas — Getting started](https://pandas.pydata.org/docs/getting_started/index.html), [Matplotlib tutorials](https://matplotlib.org/stable/tutorials/index.html)

# Track 8 — Machine Learning and Deep Learning

## Module 8.1 — Classical AI

### Session 8.1.1 — Search, knowledge and reasoning
> Outcomes: Explain classical AI techniques: search, logic and probabilistic reasoning.
- Uninformed and informed search (BFS, A*)
- Adversarial search (minimax)
- Knowledge representation and logic
- Probabilistic reasoning
- Practice: complete one CS50 AI project
Sources: [CS50 AI](https://cs50.harvard.edu/ai/), [AIMA](https://aima.cs.berkeley.edu/)

## Module 8.2 — Machine learning fundamentals

### Session 8.2.1 — What machine learning is
> Outcomes: Frame problems as supervised, unsupervised or reinforcement learning.
- Learning from data vs writing rules
- Supervised, unsupervised, reinforcement learning
- Features, labels, training and inference
- The ML project lifecycle
- Practice: frame three real problems as ML tasks
Sources: [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course), [StatQuest](https://statquest.org/)

### Session 8.2.2 — Regression
> Outcomes: Train and evaluate linear and polynomial regression models.
- Linear regression and loss functions
- Training with gradient descent
- Regularisation (L1, L2)
- Metrics: MAE, MSE, R²
- Practice: predict house prices
Sources: [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course), [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)

### Session 8.2.3 — Classification
> Outcomes: Train classifiers and pick metrics that match the business problem.
- Logistic regression
- Decision trees, random forests and gradient boosting
- Precision, recall, F1, ROC-AUC
- Class imbalance
- Practice: spam classifier
Sources: [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course), [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html), [StatQuest](https://statquest.org/)

### Session 8.2.4 — Model evaluation and generalisation
> Outcomes: Detect overfitting and evaluate models honestly.
- Train, validation and test splits
- Cross-validation
- Bias–variance trade-off
- Data leakage
- Practice: fix a leaky evaluation
Sources: [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course), [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)

### Session 8.2.5 — Unsupervised learning
> Outcomes: Cluster data and reduce dimensionality to find structure.
- k-means and hierarchical clustering
- Dimensionality reduction (PCA, t-SNE, UMAP)
- Anomaly detection
- Practice: cluster articles by topic using embeddings
Sources: [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html), [StatQuest](https://statquest.org/)

### Session 8.2.6 — Feature engineering and ML pipelines
> Outcomes: Build reproducible scikit-learn pipelines with preprocessing and tuning.
- Encoding, scaling and missing values
- Pipelines and ColumnTransformer
- Hyperparameter search
- Saving and loading models
- Practice: end-to-end pipeline for a tabular dataset
Sources: [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)

## Module 8.3 — Neural networks

### Session 8.3.1 — From perceptron to multilayer networks
> Outcomes: Explain neurons, activation functions and why depth helps.
- The perceptron and linear separability
- Activation functions
- Multilayer perceptrons as function approximators
- Practice: classify handwritten digits with an MLP
Sources: [3Blue1Brown — Neural Networks](https://www.3blue1brown.com/topics/neural-networks), [StatQuest](https://statquest.org/)

### Session 8.3.2 — Backpropagation from scratch
> Outcomes: Implement backpropagation and a tiny autograd engine.
- Computational graphs
- Backpropagation via the chain rule
- Building micrograd
- Practice: train a small network with your own autograd
Sources: [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html), [3Blue1Brown — Neural Networks](https://www.3blue1brown.com/topics/neural-networks)

## Module 8.4 — Deep learning with PyTorch

### Session 8.4.1 — Tensors and autograd
> Outcomes: Use PyTorch tensors, autograd and GPUs/MPS.
- Tensors and operations
- Autograd
- Devices: CPU, CUDA, Apple MPS
- Practice: reimplement your micrograd network in PyTorch
Sources: [PyTorch tutorials](https://docs.pytorch.org/tutorials/)

### Session 8.4.2 — Training neural networks
> Outcomes: Write training loops, track loss and tune training.
- Datasets and DataLoaders
- nn.Module, optimisers and loss functions
- Training/validation loops and loss curves
- Overfitting remedies: dropout, weight decay, early stopping
- Practice: train a network and track loss with TensorBoard
Sources: [PyTorch tutorials](https://docs.pytorch.org/tutorials/), [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html)

### Session 8.4.3 — Convolutional networks and computer vision
> Outcomes: Build image classifiers with CNNs and transfer learning.
- Convolutions and pooling
- Classic architectures (ResNet)
- Transfer learning
- Practice: fine-tune a pretrained CNN on your own images
Sources: [PyTorch tutorials](https://docs.pytorch.org/tutorials/), [Dive into Deep Learning](https://d2l.ai/)

### Session 8.4.4 — Sequence models
> Outcomes: Explain how RNNs process sequences and why transformers replaced them.
- Embeddings for tokens
- RNNs, LSTMs and vanishing gradients
- From sequence-to-sequence to attention
- Practice: character-level language model (makemore)
Sources: [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html), [Dive into Deep Learning](https://d2l.ai/)

## Module 8.5 — Transformers and LLMs

### Session 8.5.1 — Attention and the transformer architecture
> Outcomes: Explain self-attention, multi-head attention and the transformer block.
- Queries, keys and values
- Self-attention and multi-head attention
- Positional encoding
- The transformer block: residuals and layer norm
- Practice: draw the transformer from memory and explain each part
Sources: [Attention Is All You Need](https://arxiv.org/abs/1706.03762), [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/), [3Blue1Brown — Neural Networks](https://www.3blue1brown.com/topics/neural-networks)

### Session 8.5.2 — Build a tiny GPT
> Outcomes: Implement and train a small GPT-style language model.
- Decoder-only architecture
- Causal masking
- Training on a text corpus
- Sampling: temperature, top-k, top-p
- Practice: train a tiny GPT on your favourite author
Sources: [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html)

### Session 8.5.3 — Tokenisation
> Outcomes: Implement byte-pair encoding and explain how tokenisation affects LLM behaviour.
- Characters, words and subwords
- Byte-pair encoding
- Tokenisers in practice (tiktoken, Hugging Face)
- Tokenisation quirks: numbers, code, languages
- Practice: build a BPE tokenizer with minbpe
Sources: [Karpathy — minbpe](https://github.com/karpathy/minbpe), [Hugging Face LLM Course](https://huggingface.co/learn/llm-course)

### Session 8.5.4 — How LLMs are trained and aligned
> Outcomes: Describe pretraining, scaling, instruction tuning and alignment.
- Pretraining and scaling laws
- Instruction tuning and RLHF/RLAIF
- Constitutional AI and safety
- Context windows and reasoning models
- Practice: explain the life of an LLM in a one-page diagram
Sources: [Hugging Face LLM Course](https://huggingface.co/learn/llm-course), [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html), [Anthropic research](https://www.anthropic.com/research)

## Module 8.6 — Open models and fine-tuning

### Session 8.6.1 — Hugging Face Transformers and the Hub
> Outcomes: Load, run and share pretrained models with the Transformers library.
- The Hub: models, datasets, Spaces
- Pipelines and AutoModel
- Model cards and licences
- Practice: build a small app with an open-source model
Sources: [Hugging Face Transformers docs](https://huggingface.co/docs/transformers/index), [Hugging Face Learn](https://huggingface.co/learn)

### Session 8.6.2 — Running open models locally
> Outcomes: Run open LLMs locally with Ollama and understand quantisation trade-offs.
- Model sizes, memory and hardware
- Quantisation (GGUF, 4-bit)
- Ollama and its REST API
- Practice: compare three local models on the same prompts
Sources: [Ollama docs](https://docs.ollama.com/), [Ollama API](https://docs.ollama.com/api/introduction)

### Session 8.6.3 — Fine-tuning small models
> Outcomes: Fine-tune a small model efficiently with LoRA and evaluate the result.
- When to fine-tune vs prompt vs RAG
- Full fine-tuning vs PEFT (LoRA, QLoRA)
- Supervised fine-tuning with TRL
- Practice: fine-tune a small model on a custom dataset
Sources: [Hugging Face PEFT](https://huggingface.co/docs/peft/index), [Hugging Face smol-course](https://github.com/huggingface/smol-course), [Hugging Face TRL](https://huggingface.co/docs/trl/index)

# Track 9 — AI Engineering

## Module 9.1 — Working with LLM APIs

### Session 9.1.1 — How LLM APIs work
> Outcomes: Explain tokens, context windows, sampling and pricing for LLM APIs.
- Messages, roles and system prompts
- Tokens, context windows and costs
- Sampling parameters and determinism
- Model families and choosing a model
- Practice: compare cost and latency of three models on the same task
Sources: [Claude Developer Platform docs](https://platform.claude.com/docs/en/home), [OpenAI API docs](https://developers.openai.com/api/docs)

### Session 9.1.2 — The Claude API
> Outcomes: Build features with the Claude API using the official SDKs.
- Messages API and the Python/TypeScript SDKs
- System prompts, multi-turn conversations
- Thinking, effort and model selection
- Prompt caching and the Batch API
- Practice: an article summariser with Claude
Sources: [Claude Developer Platform docs](https://platform.claude.com/docs/en/home), [Anthropic courses](https://github.com/anthropics/courses)

### Session 9.1.3 — The OpenAI API
> Outcomes: Use the OpenAI API and compare its design with other providers.
- Responses API and chat
- Embeddings endpoints
- Assistants, files and tools
- Practice: port your summariser to OpenAI and compare
Sources: [OpenAI API docs](https://developers.openai.com/api/docs), [OpenAI Cookbook](https://developers.openai.com/cookbook)

### Session 9.1.4 — Structured outputs and tool calling
> Outcomes: Get reliable JSON and call functions from LLMs.
- JSON mode and structured outputs
- Tool (function) calling: definitions, calls and results
- Validating model output with Pydantic
- Practice: extract structured data from invoices
Sources: [Claude tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview), [OpenAI API docs](https://developers.openai.com/api/docs)

### Session 9.1.5 — LLMs in production
> Outcomes: Handle streaming, errors, rate limits, cost and latency in real applications.
- Streaming responses to the UI
- Retries, timeouts and rate limits
- Caching and cost control
- Provider abstraction and fallbacks
- Practice: streaming chat endpoint with retries and a cost dashboard
Sources: [Claude Developer Platform docs](https://platform.claude.com/docs/en/home), [OpenAI Cookbook](https://developers.openai.com/cookbook)

## Module 9.2 — Prompt engineering

### Session 9.2.1 — Prompt engineering fundamentals
> Outcomes: Write clear, specific prompts that produce reliable results.
- Clarity, context and constraints
- Roles and system prompts
- Examples (few-shot)
- Output formatting with XML tags
- Practice: the Anthropic interactive tutorial
Sources: [Anthropic prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview), [Anthropic interactive tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial), [Prompt Engineering Guide](https://www.promptingguide.ai/)

### Session 9.2.2 — Advanced prompting techniques
> Outcomes: Use chain-of-thought, prompt chaining and self-critique for complex tasks.
- Step-by-step reasoning and thinking models
- Prompt chaining and decomposition
- Self-consistency and self-critique
- Long-context prompting
- Practice: a multi-step research prompt chain
Sources: [Prompt Engineering Guide](https://www.promptingguide.ai/), [Anthropic prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

### Session 9.2.3 — Testing and iterating prompts
> Outcomes: Treat prompts as code: version, test and measure them.
- Prompt versioning
- Test sets and regression checks
- A/B testing prompts
- Practice: build a small prompt test suite
Sources: [Anthropic courses](https://github.com/anthropics/courses), [OpenAI Cookbook](https://developers.openai.com/cookbook)

## Module 9.3 — Retrieval-augmented generation

### Session 9.3.1 — Embeddings and semantic search
> Outcomes: Explain embeddings and build semantic search over documents.
- What embeddings are and how they are trained
- Similarity measures
- Embedding models (local and hosted)
- Practice: semantic search over your notes
Sources: [Hugging Face LLM Course](https://huggingface.co/learn/llm-course), [Ollama docs](https://docs.ollama.com/)

### Session 9.3.2 — Vector databases
> Outcomes: Store and query embeddings at scale with pgvector and Qdrant.
- Exact vs approximate nearest neighbour search
- Index types: HNSW, IVF
- pgvector in PostgreSQL
- Dedicated vector databases: Qdrant
- Metadata filtering
- Practice: the same search on pgvector and Qdrant, compared
Sources: [pgvector](https://github.com/pgvector/pgvector), [Qdrant docs](https://qdrant.tech/documentation/)

### Session 9.3.3 — Building a RAG pipeline
> Outcomes: Build a RAG system with ingestion, chunking, retrieval and cited answers.
- RAG architecture
- Ingestion and text extraction
- Chunking strategies
- Retrieval and prompt assembly
- Citations and grounding
- Practice: chatbot for your own documents
Sources: [LlamaIndex docs](https://developers.llamaindex.ai/python/framework/), [Hugging Face Learn](https://huggingface.co/learn), [pgvector](https://github.com/pgvector/pgvector)

### Session 9.3.4 — Advanced RAG
> Outcomes: Improve retrieval quality with hybrid search, reranking and query transformation.
- Hybrid search (BM25 + vectors)
- Reranking with cross-encoders
- Query rewriting and HyDE
- Contextual retrieval and parent-document strategies
- Practice: measure the quality gain of reranking
Sources: [LlamaIndex docs](https://developers.llamaindex.ai/python/framework/), [Qdrant docs](https://qdrant.tech/documentation/)

### Session 9.3.5 — Evaluating RAG
> Outcomes: Measure retrieval and answer quality with datasets and metrics.
- Retrieval metrics: recall@k, MRR
- Answer metrics: faithfulness, relevance
- Building an evaluation dataset
- Ragas
- Practice: evaluate your document chatbot
Sources: [Ragas docs](https://docs.ragas.io/), [Hugging Face Evaluate](https://huggingface.co/docs/evaluate/index)

## Module 9.4 — Vision and smart context

### Session 9.4.1 — OCR and document processing
> Outcomes: Extract text and structure from scanned documents and PDFs.
- OCR with Tesseract
- Layout-aware extraction from PDFs
- Cleaning and structuring extracted text
- Practice: OCR pipeline feeding your RAG index
Sources: [Tesseract docs](https://tesseract-ocr.github.io/tessdoc/), [OpenCV tutorials](https://docs.opencv.org/4.x/d9/df8/tutorial_root.html)

### Session 9.4.2 — Multimodal LLMs
> Outcomes: Use vision-capable LLMs to understand images, charts and documents.
- How vision models see images
- Image and PDF inputs in LLM APIs
- Use cases and limits
- Practice: extract data from screenshots and charts
Sources: [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision), [OpenAI API docs](https://developers.openai.com/api/docs)

### Session 9.4.3 — Memory for AI applications
> Outcomes: Give AI applications short- and long-term memory.
- Conversation history and summarisation
- Long-term memory stores
- Retrieval-based memory and user profiles
- Privacy considerations for memory
- Practice: add memory to your chatbot
Sources: [Claude Developer Platform docs](https://platform.claude.com/docs/en/home), [LlamaIndex docs](https://developers.llamaindex.ai/python/framework/)

## Module 9.5 — Agents

### Session 9.5.1 — How agents work
> Outcomes: Explain the agent loop and when an agent is the right tool.
- Workflows vs agents
- The agent loop: think, act, observe
- Common agent patterns (routing, orchestrator–workers, evaluator–optimiser)
- When not to build an agent
- Practice: diagram three agent patterns with examples
Sources: [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), [Hugging Face Agents Course](https://huggingface.co/learn/agents-course)

### Session 9.5.2 — Build an agent from scratch
> Outcomes: Implement a tool-using agent loop without frameworks.
- Tool definitions and schemas
- The manual tool-use loop
- Error handling and stopping conditions
- Practice: a research agent with web search and a calculator
Sources: [Claude tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview), [Hugging Face smol-course](https://github.com/huggingface/smol-course)

### Session 9.5.3 — The Model Context Protocol (MCP)
> Outcomes: Build and connect MCP servers to expose tools and data to AI applications.
- MCP architecture: hosts, clients, servers
- Tools, resources and prompts
- Transports and authentication
- Practice: an MCP server exposing your YouCanDoIt progress
Sources: [MCP specification](https://modelcontextprotocol.io/specification/latest), [Model Context Protocol](https://modelcontextprotocol.io/)

### Session 9.5.4 — Multi-agent systems
> Outcomes: Design multi-agent architectures with clear roles and coordination.
- Orchestrator and sub-agents
- Communication and shared state
- Frameworks overview (LangGraph, OpenAI Agents SDK, Claude Agent SDK)
- Cost and failure modes
- Practice: a planner–executor–reviewer system
Sources: [Hugging Face Agents Course](https://huggingface.co/learn/agents-course), [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), [GitHub — Agentic engineering system](https://github.com/resources/insights/agentic-engineering-system)

### Session 9.5.5 — Agent infrastructure you can trust
> Outcomes: Run agents safely with sandboxing, guardrails, tracing and human oversight — knowing exactly what they do.
- Sandboxing and permissions
- Guardrails and human-in-the-loop approval
- Tracing and observability of agent runs
- Git and infrastructure for agent-scale development
- Practice: add tracing and approval gates to your agent
Sources: [GitHub Blog — Git infrastructure for agent-scale development](https://github.blog/engineering/architecture-optimization/building-git-infrastructure-for-agent-scale-development/), [Claude Code docs](https://code.claude.com/docs/en/overview), [OpenTelemetry docs](https://opentelemetry.io/docs/)

### Session 9.5.6 — Claude Code and agentic coding
> Outcomes: Use Claude Code CLI effectively and extend it with hooks, skills, subagents and MCP.
- Claude Code workflows: plan, edit, test
- CLAUDE.md, memory and project context
- Hooks, skills, subagents and slash commands
- MCP servers in Claude Code
- Headless mode and CI automation
- Practice: automate a repetitive task in your repo with Claude Code
Sources: [Claude Code docs](https://code.claude.com/docs/en/overview), [Model Context Protocol](https://modelcontextprotocol.io/)

### Session 9.5.7 — Specialised agents and smart suggestions
> Outcomes: Build focused agents that suggest, draft and automate inside real products.
- Designing a specialised agent: scope, tools, evaluation
- Smart suggestions and auto-drafting (emails, replies)
- Triggering agents from events and schedules
- Practice: an agent that drafts your weekly study email
Sources: [Claude Developer Platform docs](https://platform.claude.com/docs/en/home), [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

## Module 9.6 — Evaluation and LLMOps

### Session 9.6.1 — Evaluating LLM applications
> Outcomes: Build evals that tell you whether a change made your AI feature better.
- Why evals: vibes don't scale
- Golden datasets and graders (code, human, LLM-as-judge)
- Offline vs online evaluation
- Practice: an eval suite for your tutor feature
Sources: [Hugging Face Evaluate](https://huggingface.co/docs/evaluate/index), [Anthropic courses](https://github.com/anthropics/courses), [OpenAI Cookbook](https://developers.openai.com/cookbook)

### Session 9.6.2 — Observability and cost for LLM apps
> Outcomes: Trace prompts, responses, latency and cost in production.
- What to log (and what not to)
- Tracing LLM calls with OpenTelemetry
- Cost and token dashboards
- Practice: add LLM tracing to YouCanDoIt
Sources: [OpenTelemetry docs](https://opentelemetry.io/docs/), [Claude Developer Platform docs](https://platform.claude.com/docs/en/home)

### Session 9.6.3 — Deploying AI applications
> Outcomes: Serve AI apps with FastAPI, Gradio and model servers.
- Serving patterns: API, batch, streaming
- Gradio demos and Hugging Face Spaces
- Model servers (vLLM) and GPUs
- Scaling and caching strategies
- Practice: deploy your RAG app with a demo UI
Sources: [FastAPI docs](https://fastapi.tiangolo.com/), [Gradio guides](https://www.gradio.app/guides), [vLLM docs](https://docs.vllm.ai/en/latest/)

### Session 9.6.4 — MLOps fundamentals
> Outcomes: Track experiments, version models and monitor them in production.
- The ML lifecycle in production
- Experiment tracking and model registry (MLflow)
- Data and model drift monitoring
- Practice: track your fine-tuning runs with MLflow
Sources: [MLflow docs](https://mlflow.org/docs/latest/), [ml-ops.org](https://ml-ops.org/)

### Session 9.6.5 — Security for AI applications
> Outcomes: Defend AI apps against prompt injection, data leakage and excessive agency.
- OWASP Top 10 for LLM applications
- Prompt injection (direct and indirect)
- Data leakage and PII handling
- Excessive agency and tool permissions
- Practice: red-team your own chatbot
Sources: [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/), [Claude Developer Platform docs](https://platform.claude.com/docs/en/home)

# Track 10 — Senior Engineer Skills

## Module 10.1 — Thinking like a senior

### Session 10.1.1 — Systems thinking
> Outcomes: See software, teams and organisations as systems with feedback loops and second-order effects.
- Stocks, flows and feedback loops
- Second-order effects and unintended consequences
- Conway's law and socio-technical systems
- Practice: map the feedback loops of an incident
Sources: [Google SRE Book](https://sre.google/sre-book/table-of-contents/), [Martin Fowler — Conway's Law](https://martinfowler.com/bliki/ConwaysLaw.html), [lethain.com](https://lethain.com/)

### Session 10.1.2 — Architecture trade-offs and decision making
> Outcomes: Make and communicate technical decisions with explicit trade-offs.
- Reversible vs irreversible decisions
- Trade-off analysis and decision matrices
- Build vs buy
- Practice: an ADR for a real trade-off you faced
Sources: [Architecture Decision Records](https://adr.github.io/), [Martin Fowler — Software Architecture Guide](https://martinfowler.com/architecture/), [StaffEng](https://staffeng.com/guides/)

### Session 10.1.3 — Managing technical debt
> Outcomes: Identify, prioritise and pay down technical debt strategically.
- Kinds of technical debt
- Measuring and communicating debt
- Incremental modernisation (strangler fig)
- Practice: a technical debt register for a project
Sources: [Martin Fowler — Technical Debt](https://martinfowler.com/bliki/TechnicalDebt.html), [Martin Fowler — Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html)

## Module 10.2 — Ownership

### Session 10.2.1 — End-to-end ownership and product mindset
> Outcomes: Own features from problem to production metrics, thinking like a product engineer.
- Understanding users and business goals
- Defining success metrics
- Shipping, measuring and iterating
- Practice: define metrics for a YouCanDoIt feature and review them after release
Sources: [The Pragmatic Engineer](https://blog.pragmaticengineer.com/), [StaffEng](https://staffeng.com/guides/)

### Session 10.2.2 — Working with ambiguity
> Outcomes: Turn vague problems into clear plans and make progress without full information.
- Framing problems and asking the right questions
- Spikes and prototypes
- Writing a one-page proposal
- Practice: write a proposal for an ambiguous feature request
Sources: [StaffEng](https://staffeng.com/guides/), [lethain.com](https://lethain.com/)

## Module 10.3 — Working with people

### Session 10.3.1 — Mentoring and teaching
> Outcomes: Help other engineers grow through mentoring, pairing and knowledge sharing.
- Mentoring vs coaching vs sponsoring
- Pair programming
- Giving feedback
- Practice: mentor a junior or write a tutorial
Sources: [StaffEng](https://staffeng.com/guides/), [Google Engineering Practices](https://google.github.io/eng-practices/)

### Session 10.3.2 — Cross-team collaboration and influence
> Outcomes: Drive alignment across teams without formal authority.
- Stakeholder mapping
- Building trust and influence
- Running effective meetings and async communication
- Practice: lead a cross-team decision in writing
Sources: [StaffEng](https://staffeng.com/guides/), [lethain.com](https://lethain.com/)

### Session 10.3.3 — Communicating as a senior engineer
> Outcomes: Write design docs, RFCs and postmortems and present technical ideas clearly.
- Writing for decision makers
- Design docs and RFC process
- Presenting to technical and non-technical audiences
- Practice: present your YouCanDoIt architecture in 10 minutes
Sources: [Google Tech Writing](https://developers.google.com/tech-writing), [Write the Docs](https://www.writethedocs.org/guide/)

## Module 10.4 — Career

### Session 10.4.1 — Technical interviews
> Outcomes: Prepare for coding, system design and behavioural interviews.
- Coding interviews: patterns and communication
- System design interviews
- Behavioural interviews and the STAR method
- Practice: three mock interviews
Sources: [Tech Interview Handbook](https://www.techinterviewhandbook.org/), [System Design Primer](https://github.com/donnemartin/system-design-primer), [NeetCode Roadmap](https://neetcode.io/roadmap)

### Session 10.4.2 — Portfolio and professional presence
> Outcomes: Present your work so recruiters and engineers see your level.
- Portfolio projects that show senior skills
- READMEs, demos and write-ups
- Writing and speaking publicly
- Practice: publish a write-up about YouCanDoIt
Sources: [Open Source Guides](https://opensource.guide/), [The Pragmatic Engineer](https://blog.pragmaticengineer.com/)

### Session 10.4.3 — Growing to senior and beyond
> Outcomes: Plan your growth along the engineering ladder towards senior and staff.
- Career ladders and expectations
- Staff archetypes: tech lead, architect, solver, right hand
- Building a brag document
- Practice: write your one-year growth plan
Sources: [StaffEng](https://staffeng.com/guides/), [lethain.com](https://lethain.com/)

# Track 11 — Capstone Projects

## Module 11.1 — Portfolio builds

### Session 11.1.1 — Python data analysis project
> Outcomes: Ship a complete data analysis on a public dataset with clean, tested Python.
- Choose a dataset and questions
- Clean and explore with pandas
- Visualise and write conclusions
- Package, test and publish the repository
Sources: [pandas — Getting started](https://pandas.pydata.org/docs/getting_started/index.html), [AI Engineer Roadmap (Resources)](https://roadmap.sh/ai-engineer)

### Session 11.1.2 — Data structures and algorithms library
> Outcomes: Publish a tested library of the data structures and algorithms from Track 1.
- Implement core structures with type hints
- Property-based and unit tests
- Benchmarks and complexity notes
- Documentation site
Sources: [Open Data Structures](https://opendatastructures.org/), [pytest docs](https://docs.pytest.org/en/stable/)

### Session 11.1.3 — Production-grade REST API
> Outcomes: Build a FastAPI + PostgreSQL service with auth, migrations and tests.
- Domain model and API design
- Persistence with SQLAlchemy and Alembic
- Authentication with 2FA
- Test suite and OpenAPI docs
Sources: [FastAPI docs](https://fastapi.tiangolo.com/), [SQLAlchemy 2.0 docs](https://docs.sqlalchemy.org/en/20/)

### Session 11.1.4 — Ship it: containers, CI/CD, IaC and Kubernetes
> Outcomes: Deliver the API with Docker, GitHub Actions, Terraform and Kubernetes.
- Multi-stage Docker image
- CI pipeline with tests and scanning
- Infrastructure with Terraform
- Deployment to Kubernetes with Helm
Sources: [Docker — Get started](https://docs.docker.com/get-started/), [GitHub Actions docs](https://docs.github.com/en/actions), [Kubernetes docs](https://kubernetes.io/docs/home/)

### Session 11.1.5 — Observe and harden
> Outcomes: Add observability and security hardening to your API.
- Logs, metrics, traces and Sentry
- SLOs and alerts
- OWASP review and fixes
- GDPR data export and deletion
Sources: [OpenTelemetry docs](https://opentelemetry.io/docs/), [OWASP Top 10](https://top10.owasp.org/)

### Session 11.1.6 — Machine learning model
> Outcomes: Train, evaluate and serve a regression or classification model.
- Problem framing and data
- Pipeline and evaluation
- Serve the model behind an API
Sources: [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html), [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course)

### Session 11.1.7 — Neural network and tiny GPT
> Outcomes: Train a neural network and a small language model and track the loss.
- Micrograd network
- PyTorch training with loss tracking
- Tiny GPT trained on your corpus
Sources: [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html), [PyTorch tutorials](https://docs.pytorch.org/tutorials/)

### Session 11.1.8 — Fine-tune a small model
> Outcomes: Fine-tune and evaluate a small open model for a narrow task.
- Dataset preparation
- LoRA fine-tuning
- Before/after evaluation
- Publish on the Hugging Face Hub
Sources: [Hugging Face smol-course](https://github.com/huggingface/smol-course), [Hugging Face PEFT](https://huggingface.co/docs/peft/index)

### Session 11.1.9 — RAG chatbot for your documents
> Outcomes: Build and evaluate a RAG chatbot over your own documents.
- Ingestion with OCR
- Retrieval with reranking
- Cited answers and memory
- Evaluation with Ragas
Sources: [LlamaIndex docs](https://developers.llamaindex.ai/python/framework/), [Ragas docs](https://docs.ragas.io/)

### Session 11.1.10 — Tool-using agent with MCP
> Outcomes: Build an agent that uses tools through MCP with tracing and guardrails.
- MCP server for your data
- Agent loop with tools
- Guardrails and approval
- Tracing and evals
Sources: [Model Context Protocol](https://modelcontextprotocol.io/), [Hugging Face Agents Course](https://huggingface.co/learn/agents-course)

### Session 11.1.11 — Evaluate and deploy your AI app
> Outcomes: Put an AI app into production with evals, monitoring and a public demo.
- Eval suite in CI
- Deployment with monitoring and cost tracking
- Public demo and write-up
Sources: [Hugging Face Evaluate](https://huggingface.co/docs/evaluate/index), [Gradio guides](https://www.gradio.app/guides)

### Session 11.1.12 — Flagship: YouCanDoIt
> Outcomes: Grow this platform into a senior-level portfolio piece.
- Full lessons with diagrams and quizzes
- Spaced-repetition reviews
- Optional: port RAG from pgvector to Qdrant and compare speed, filtering and setup
- Auth, multi-user and public deployment
- Architecture write-up and demo video
Sources: [Next.js docs](https://nextjs.org/docs), [FastAPI docs](https://fastapi.tiangolo.com/), [Qdrant docs](https://qdrant.tech/documentation/)

### Session 11.1.13 — Open-source contribution
> Outcomes: Land a meaningful contribution to an open-source project you use.
- Choose a project and issue
- Discuss, implement and test
- Respond to review and get it merged
Sources: [Open Source Guides](https://opensource.guide/)

# Sources

Every source referenced above, grouped by type. Research behind the plan:
`research/curricula.md`, `research/job-requirements.md`, `research/elearning-platforms.md`,
`research/official-docs.md`, `Resources/syllabi/`.

## Provided by the learner
- [Data Masters — AI Engineer career path](https://datamasters.it/catalogo/percorsi-di-carriera/ai-engineer-50/)
- [IBM Think — Topics](https://www.ibm.com/think/topics)
- [GitHub Blog](https://github.blog/) and [Git infrastructure for agent-scale development](https://github.blog/engineering/architecture-optimization/building-git-infrastructure-for-agent-scale-development/)
- [GitHub — Agentic engineering system](https://github.com/resources/insights/agentic-engineering-system)
- [Coursera — Microsoft Full-Stack Developer](https://www.coursera.org/professional-certificates/microsoft-full-stack-developer)
- [Coursera — IBM DevOps and Software Engineering](https://www.coursera.org/professional-certificates/devops-and-software-engineering)
- [edX — HarvardX Computer Science for AI](https://www.edx.org/certificates/professional-certificate/harvardx-computer-science-for-artifical-intelligence)
- [Unimercatorum — Sicurezza Informatica](https://www.unimercatorum.it/corsi-di-laurea/sicurezza-informatica)
- [Uniroma5 — Ingegneria Informatica e IA (triennale)](https://www.uniroma5.it/triennale/ingegneria-informatica-e-intelligenza-artificiale)
- [Uniroma5 — Ingegneria Informatica e IA applicata (magistrale)](https://www.uniroma5.it/magistrale/ingegneria-informatica-e-intelligenza-artificiale-applicata)

## University courses and textbooks
- [Harvard CS50x](https://cs50.harvard.edu/x/) · [Harvard CS50 AI](https://cs50.harvard.edu/ai/)
- [MIT 6.006 Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) · [MIT 6.042J Mathematics for CS](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/) · [MIT 6.5840 Distributed Systems](https://pdos.csail.mit.edu/6.824/) · [MIT The Missing Semester](https://missing.csail.mit.edu/)
- [CMU 15-445 Database Systems](https://15445.courses.cs.cmu.edu/) · [Nand2Tetris](https://www.nand2tetris.org/) · [Teach Yourself CS](https://teachyourselfcs.com/)
- [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/) · [Computer Networks: A Systems Approach](https://book.systemsapproach.org/) · [Kurose & Ross lectures](https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm) · [Beej's Guide](https://beej.us/guide/bgnet/)
- [Open Data Structures](https://opendatastructures.org/) · [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/) · [Book of Proof](https://richardhammack.github.io/BookOfProof/) · [Discrete Mathematics: An Open Introduction](https://discrete.openmathbooks.org/dmoi3.html)
- [Designing Data-Intensive Applications](https://dataintensive.net/) · [Google SRE books](https://sre.google/books/) · [AIMA](https://aima.cs.berkeley.edu/) · [Dive into Deep Learning](https://d2l.ai/) · [OpenStax Introductory Statistics](https://openstax.org/details/books/introductory-statistics-2e) · [Practical Cryptography for Developers](https://cryptobook.nakov.com/)

## Official documentation
- Languages: [Python](https://docs.python.org/3/) · [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html) · [Go](https://go.dev/doc/)
- Backend: [FastAPI](https://fastapi.tiangolo.com/) · [Pydantic](https://pydantic.dev/docs/validation/latest/get-started/) · [SQLAlchemy](https://docs.sqlalchemy.org/en/20/) · [Alembic](https://alembic.sqlalchemy.org/en/latest/) · [PostgreSQL](https://www.postgresql.org/docs/current/) · [Redis](https://redis.io/docs/latest/) · [RabbitMQ](https://www.rabbitmq.com/tutorials) · [Celery](https://docs.celeryq.dev/en/stable/) · [Kafka](https://kafka.apache.org/documentation/) · [GraphQL](https://graphql.org/learn/) · [gRPC](https://grpc.io/docs/) · [OpenAPI](https://spec.openapis.org/oas/latest.html)
- Web: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP) · [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) · [Next.js](https://nextjs.org/docs) · [React](https://react.dev/learn) · [Playwright](https://playwright.dev/docs/intro)
- DevOps: [Docker](https://docs.docker.com/get-started/) · [Docker Compose](https://docs.docker.com/compose/) · [Kubernetes](https://kubernetes.io/docs/home/) · [Helm](https://helm.sh/docs/) · [Argo CD](https://argo-cd.readthedocs.io/en/stable/) · [Terraform](https://developer.hashicorp.com/terraform/docs) · [OpenTofu](https://opentofu.org/docs/) · [Ansible](https://docs.ansible.com/) · [GitHub Actions](https://docs.github.com/en/actions) · [Nginx](https://nginx.org/en/docs/) · [Let's Encrypt](https://letsencrypt.org/docs/)
- Cloud: [AWS Cloud Practitioner](https://aws.amazon.com/training/learn-about/cloud-practitioner/) · [AWS Skill Builder](https://skillbuilder.aws/) · [AWS Lambda](https://docs.aws.amazon.com/lambda/) · [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/) · [Azure Fundamentals](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/) · [Google Cloud training](https://cloud.google.com/learn/training) · [Render](https://render.com/docs) · [Fly.io](https://fly.io/docs/) · [Vercel](https://vercel.com/docs) · [Neon](https://neon.com/docs/introduction)
- Observability: [Sentry](https://docs.sentry.io/) · [OpenTelemetry](https://opentelemetry.io/docs/) · [Prometheus](https://prometheus.io/docs/introduction/overview/) · [Grafana](https://grafana.com/docs/grafana/latest/) · [Loki](https://grafana.com/docs/loki/latest/) · [k6](https://grafana.com/docs/k6/latest/)
- Security: [OWASP Top 10](https://top10.owasp.org/) · [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/) · [OWASP API Security](https://owasp.org/API-Security/) · [OWASP Top 10 for LLM](https://genai.owasp.org/llm-top-10/) · [SLSA](https://slsa.dev/) · [Trivy](https://trivy.dev/docs/latest/) · [OAuth 2.0](https://oauth.net/2/) · [OpenID Connect](https://openid.net/developers/how-connect-works/) · [WebAuthn Guide](https://webauthn.guide/)
- Regulation: [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj) · [EU AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) · [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)
- Data and ML: [NumPy](https://numpy.org/doc/stable/user/absolute_beginners.html) · [pandas](https://pandas.pydata.org/docs/getting_started/index.html) · [scikit-learn](https://scikit-learn.org/stable/user_guide.html) · [PyTorch](https://docs.pytorch.org/tutorials/) · [Hugging Face Transformers](https://huggingface.co/docs/transformers/index) · [PEFT](https://huggingface.co/docs/peft/index) · [TRL](https://huggingface.co/docs/trl/index) · [MLflow](https://mlflow.org/docs/latest/) · [vLLM](https://docs.vllm.ai/en/latest/) · [Gradio](https://www.gradio.app/guides)
- AI engineering: [Claude Developer Platform](https://platform.claude.com/docs/en/home) · [Claude Code](https://code.claude.com/docs/en/overview) · [MCP](https://modelcontextprotocol.io/) · [OpenAI API](https://developers.openai.com/api/docs) · [OpenAI Cookbook](https://developers.openai.com/cookbook) · [LlamaIndex](https://developers.llamaindex.ai/python/framework/) · [pgvector](https://github.com/pgvector/pgvector) · [Qdrant](https://qdrant.tech/documentation/) · [Ollama](https://docs.ollama.com/) · [Ragas](https://docs.ragas.io/) · [HF Evaluate](https://huggingface.co/docs/evaluate/index) · [Tesseract](https://tesseract-ocr.github.io/tessdoc/) · [OpenCV](https://docs.opencv.org/4.x/d9/df8/tutorial_root.html)

## Courses, guides and roadmaps
- [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course) · [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html) · [Karpathy — minbpe](https://github.com/karpathy/minbpe) · [3Blue1Brown](https://www.3blue1brown.com/topics/linear-algebra) · [StatQuest](https://statquest.org/) · [Khan Academy](https://www.khanacademy.org/)
- [Hugging Face Learn](https://huggingface.co/learn) · [HF LLM Course](https://huggingface.co/learn/llm-course) · [HF Agents Course](https://huggingface.co/learn/agents-course) · [HF smol-course](https://github.com/huggingface/smol-course)
- [Anthropic prompt engineering](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) · [Anthropic interactive tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial) · [Anthropic courses](https://github.com/anthropics/courses) · [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) · [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [roadmap.sh](https://roadmap.sh/backend) · [System Design Primer](https://github.com/donnemartin/system-design-primer) · [Tech Interview Handbook](https://www.techinterviewhandbook.org/) · [NeetCode](https://neetcode.io/roadmap) · [VisuAlgo](https://visualgo.net/en) · [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
- [Refactoring.Guru](https://refactoring.guru/design-patterns) · [Martin Fowler](https://martinfowler.com/) · [microservices.io](https://microservices.io/) · [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) · [The Twelve-Factor App](https://12factor.net/) · [C4 model](https://c4model.com/) · [ADR](https://adr.github.io/)
- [Google Engineering Practices](https://google.github.io/eng-practices/) · [Google Tech Writing](https://developers.google.com/tech-writing) · [Write the Docs](https://www.writethedocs.org/guide/) · [Agile Manifesto](https://agilemanifesto.org/) · [Scrum Guide](https://scrumguides.org/scrum-guide.html) · [Open Source Guides](https://opensource.guide/)
- [StaffEng](https://staffeng.com/guides/) · [lethain.com](https://lethain.com/) · [The Pragmatic Engineer](https://blog.pragmaticengineer.com/) · [PagerDuty Incident Response](https://response.pagerduty.com/) · [FinOps Foundation](https://www.finops.org/introduction/what-is-finops/) · [Cloudflare Learning Center](https://www.cloudflare.com/learning/)

# Changelog

- 2026-10-19 — Initial roadmap: 12 tracks, built from the learner's resources, 7 curricula, 21 senior job postings and verified official documentation. Weekly review: Saturdays 10:00 Europe/Rome.
