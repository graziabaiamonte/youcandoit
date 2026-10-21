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
`### Session N.M.K — `, a `> Outcomes:` line, `- ` subchapters ending in a `{#N}` key, one `Sources:`
line. Session IDs and subchapter keys are permanent: append new sessions, never renumber; a new
subchapter takes the next unused key in its session, and bullets can be reordered freely.

# Track 0 — Foundations

## Module 0.1 — Learning and the profession

### Session 0.1.1 — How to learn effectively
> Outcomes: Plan your study with spaced repetition and retrieval practice, and keep going when it gets hard.
- How memory works: encoding, forgetting curve, consolidation {#1}
- Retrieval practice and spaced repetition {#2}
- Chunking, interleaving and dual coding {#3}
- Deliberate practice and the growth mindset {#4}
- Building a sustainable study routine (streaks, small daily goals) {#5}
- Practice: design your weekly study plan and review schedule {#6}
Sources: [Google Tech Writing](https://developers.google.com/tech-writing), [Khan Academy](https://www.khanacademy.org/), [Teach Yourself CS](https://teachyourselfcs.com/)

### Session 0.1.2 — What software engineers actually do
> Outcomes: Describe the software development lifecycle, team roles and what separates junior, mid and senior engineers.
- The software development lifecycle (SDLC) {#1}
- Roles in a product team: engineering, product, design, SRE, data {#2}
- The engineering career ladder: junior → mid → senior → staff {#3}
- What senior job postings ask for in 2026 {#4}
- Practice: map your current skills against a senior job posting {#5}
Sources: [StaffEng](https://staffeng.com/guides/), [roadmap.sh Backend](https://roadmap.sh/backend), [roadmap.sh AI Engineer](https://roadmap.sh/ai-engineer)

### Session 0.1.3 — Technical English and reading documentation
> Outcomes: Read official docs, RFCs and error messages efficiently and write clear technical English.
- Anatomy of official documentation: tutorials, how-tos, reference, explanation {#1}
- Reading error messages and stack traces {#2}
- Searching effectively and judging source reliability {#3}
- Writing clear technical English: short sentences, active voice {#4}
- Practice: summarise one documentation page in 10 lines {#5}
Sources: [Google Technical Writing courses](https://developers.google.com/tech-writing), [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP), [Python docs](https://docs.python.org/3/)

## Module 0.2 — How computers work

### Session 0.2.1 — Data representation
> Outcomes: Convert between binary, hexadecimal and decimal and explain how text, numbers and images are stored.
- Bits, bytes and number bases (binary, hex) {#1}
- Integers, overflow and two's complement {#2}
- Floating point (IEEE 754) and why 0.1 + 0.2 ≠ 0.3 {#3}
- Text encoding: ASCII, Unicode, UTF-8 {#4}
- Images, sound and compression in one picture {#5}
- Practice: write a Python base converter {#6}
Sources: [CS50x](https://cs50.harvard.edu/x/), [Nand2Tetris](https://www.nand2tetris.org/), [MIT 6.042J Mathematics for CS](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/)

### Session 0.2.2 — Computer architecture
> Outcomes: Explain how a CPU executes instructions and why the memory hierarchy drives performance.
- Logic gates to CPU: ALU, registers, control unit {#1}
- The fetch–decode–execute cycle {#2}
- Memory hierarchy: registers, caches, RAM, disk {#3}
- A taste of C: pointers and memory addresses {#4}
- Practice: complete the first Nand2Tetris project or CS50 week on memory {#5}
Sources: [Nand2Tetris](https://www.nand2tetris.org/), [CS50x](https://cs50.harvard.edu/x/), [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)

### Session 0.2.3 — From source code to running program
> Outcomes: Explain compilation, interpretation and what happens when a program runs.
- Compilers, interpreters and bytecode (how CPython runs your code) {#1}
- Processes, memory layout: stack and heap {#2}
- Standard input/output, exit codes, environment variables {#3}
- Libraries, linking and package managers {#4}
- Practice: trace one Python script from file to process {#5}
Sources: [CS50x](https://cs50.harvard.edu/x/), [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/), [Python docs](https://docs.python.org/3/)

## Module 0.3 — Developer tools

### Session 0.3.1 — The terminal and the shell
> Outcomes: Navigate, inspect and manipulate files and processes confidently from the command line.
- Shells, prompts and the file system tree {#1}
- Core commands: ls, cd, cp, mv, rm, find, grep {#2}
- Pipes, redirection and composing commands {#3}
- Permissions, users and sudo {#4}
- Processes and jobs: ps, top, kill {#5}
- Practice: complete the Missing Semester shell lecture exercises {#6}
Sources: [MIT The Missing Semester](https://missing.csail.mit.edu/), [The Linux Command Line](https://linuxcommand.org/tlcl.php)

### Session 0.3.2 — Shell scripting and automation
> Outcomes: Automate repetitive tasks with Bash scripts.
- Variables, quoting and expansion {#1}
- Conditionals, loops and functions in Bash {#2}
- Exit codes and error handling (set -euo pipefail) {#3}
- Text processing: sed, awk, jq {#4}
- Scheduling with cron {#5}
- Practice: a backup script that runs nightly {#6}
Sources: [The Linux Command Line](https://linuxcommand.org/tlcl.php), [MIT The Missing Semester](https://missing.csail.mit.edu/)

### Session 0.3.3 — Git fundamentals
> Outcomes: Track changes, branch and recover from mistakes with Git.
- Why version control: snapshots, history, collaboration {#1}
- The three areas: working tree, staging, repository {#2}
- Commits, branches, merges and resolving conflicts {#3}
- Undoing things: restore, reset, revert, reflog {#4}
- Practice: Learn Git Branching main levels {#5}
Sources: [Pro Git](https://git-scm.com/book/en/v2), [Learn Git Branching](https://learngitbranching.js.org/)

### Session 0.3.4 — Collaborating with Git and GitHub
> Outcomes: Work in a team repository using pull requests, branching strategies and clear commit history.
- Remotes, fetch, pull, push {#1}
- Pull requests and review flow {#2}
- Branching strategies: trunk-based vs GitFlow {#3}
- Rebase, squash and a clean history {#4}
- Conventional Commits and semantic versioning {#5}
- Practice: open a PR with a feature branch and address review comments {#6}
Sources: [Pro Git](https://git-scm.com/book/en/v2), [GitHub Docs](https://docs.github.com/en/get-started), [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), [Semantic Versioning](https://semver.org/)

### Session 0.3.5 — Editor, debugger and productivity
> Outcomes: Debug programs systematically with breakpoints and logs instead of guesswork.
- Editor setup: extensions, formatting on save, linters {#1}
- Using a debugger: breakpoints, stepping, watches {#2}
- Debugging method: reproduce, isolate, hypothesise, verify {#3}
- Keyboard-driven workflow and dotfiles {#4}
- Practice: find a planted bug using only the debugger {#5}
Sources: [MIT The Missing Semester](https://missing.csail.mit.edu/), [Python pdb docs](https://docs.python.org/3/library/pdb.html)

## Module 0.4 — Python from zero

### Session 0.4.1 — Python basics
> Outcomes: Write small Python programs using variables, types, operators and input/output.
- Installing Python and running scripts vs the REPL {#1}
- Variables, numbers, strings and booleans {#2}
- Operators and expressions {#3}
- Input, output and f-strings {#4}
- Practice: a tip calculator and a unit converter {#5}
Sources: [Python Tutorial](https://docs.python.org/3/tutorial/), [CS50x Python week](https://cs50.harvard.edu/x/), [roadmap.sh Python](https://roadmap.sh/python)

### Session 0.4.2 — Control flow and functions
> Outcomes: Structure logic with conditionals, loops and reusable functions.
- if / elif / else and boolean logic {#1}
- for and while loops, break and continue {#2}
- Defining functions, parameters, return values {#3}
- Scope, default arguments, *args and **kwargs {#4}
- Practice: FizzBuzz, prime checker, number guessing game {#5}
Sources: [Python Tutorial](https://docs.python.org/3/tutorial/), [CS50x](https://cs50.harvard.edu/x/)

### Session 0.4.3 — Built-in collections
> Outcomes: Choose and use lists, tuples, dictionaries and sets appropriately.
- Lists and tuples: indexing, slicing, mutability {#1}
- Dictionaries: key–value modelling {#2}
- Sets and membership tests {#3}
- Comprehensions for lists, dicts and sets {#4}
- Practice: word frequency counter for a text file {#5}
Sources: [Python Tutorial — Data Structures](https://docs.python.org/3/tutorial/datastructures.html), [Python docs](https://docs.python.org/3/)

### Session 0.4.4 — Files, errors and exceptions
> Outcomes: Read and write files and handle errors robustly.
- Reading and writing text, CSV and JSON files {#1}
- Exceptions: try / except / else / finally {#2}
- Raising and defining custom exceptions {#3}
- Context managers and the with statement {#4}
- Practice: a CSV-to-JSON converter with error handling {#5}
Sources: [Python Tutorial — Errors](https://docs.python.org/3/tutorial/errors.html), [Python Tutorial — I/O](https://docs.python.org/3/tutorial/inputoutput.html)

### Session 0.4.5 — Modules, packages and environments
> Outcomes: Organise code into packages and manage dependencies reproducibly.
- Modules, imports and the standard library tour {#1}
- Packages and project layout {#2}
- Virtual environments and dependency management with uv {#3}
- pyproject.toml and lock files {#4}
- Practice: turn a script into an installable package {#5}
Sources: [Python Tutorial — Modules](https://docs.python.org/3/tutorial/modules.html), [uv docs](https://docs.astral.sh/uv/)

### Session 0.4.6 — Pythonic Python
> Outcomes: Write idiomatic Python using iterators, generators, decorators and the standard library.
- Iterators and generators {#1}
- Decorators and higher-order functions {#2}
- dataclasses and enums {#3}
- Useful standard library: pathlib, collections, itertools, datetime {#4}
- PEP 8 and readable code {#5}
- Practice: refactor an old script to idiomatic Python {#6}
Sources: [Python docs](https://docs.python.org/3/), [PEP 8](https://peps.python.org/pep-0008/)

### Session 0.4.7 — Type hints, Pydantic and tooling
> Outcomes: Add static types and validation to Python code and keep it clean with automated tools.
- Type hints, generics and Protocols {#1}
- Static checking with mypy or pyright {#2}
- Data validation with Pydantic models {#3}
- Linting and formatting with Ruff {#4}
- Practice: type and validate the CSV converter, add Ruff to the project {#5}
Sources: [Python typing docs](https://docs.python.org/3/library/typing.html), [Pydantic](https://pydantic.dev/docs/validation/latest/get-started/), [Ruff](https://docs.astral.sh/ruff/)

## Module 0.5 — TypeScript (bridge from front end)

### Session 0.5.1 — TypeScript fundamentals
> Outcomes: Type JavaScript code with interfaces, unions and narrowing.
- Why static typing: catching bugs before runtime {#1}
- Primitive types, arrays, objects, interfaces and type aliases {#2}
- Unions, literal types and narrowing {#3}
- Functions and strict mode {#4}
- Practice: convert a small JS project to strict TypeScript {#5}
Sources: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [React Learn](https://react.dev/learn)

### Session 0.5.2 — Advanced TypeScript
> Outcomes: Use generics and utility types to build type-safe APIs and components.
- Generics and constraints {#1}
- Utility and mapped types {#2}
- Discriminated unions for state modelling {#3}
- Typing API responses (generated types from OpenAPI) {#4}
- Practice: a typed API client generated from an OpenAPI schema {#5}
Sources: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

# Track 1 — Computer Science Fundamentals

## Module 1.1 — Discrete mathematics

### Session 1.1.1 — Logic and proofs
> Outcomes: Read and write simple proofs and reason with propositional and predicate logic.
- Propositions, connectives and truth tables {#1}
- Predicates and quantifiers {#2}
- Direct proof, contradiction and contrapositive {#3}
- Logic in code: boolean algebra and De Morgan's laws {#4}
- Practice: prove three small statements and simplify boolean conditions in code {#5}
Sources: [Book of Proof](https://richardhammack.github.io/BookOfProof/), [Discrete Mathematics: An Open Introduction](https://discrete.openmathbooks.org/dmoi3.html), [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/)

### Session 1.1.2 — Sets, functions and relations
> Outcomes: Use set notation, functions and relations to model data precisely.
- Sets and set operations {#1}
- Functions: injective, surjective, bijective {#2}
- Relations, equivalence and ordering {#3}
- How sets and relations map to databases and types {#4}
- Practice: model a small domain (students, courses) with sets and relations {#5}
Sources: [Discrete Mathematics: An Open Introduction](https://discrete.openmathbooks.org/dmoi3.html), [Book of Proof](https://richardhammack.github.io/BookOfProof/)

### Session 1.1.3 — Induction and recursion
> Outcomes: Prove statements by induction and design recursive definitions.
- Mathematical induction and strong induction {#1}
- Recursive definitions and recurrences {#2}
- From induction to recursive programs {#3}
- Practice: prove a sum formula and implement it recursively {#4}
Sources: [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/), [Book of Proof](https://richardhammack.github.io/BookOfProof/)

### Session 1.1.4 — Counting and combinatorics
> Outcomes: Count possibilities with permutations, combinations and the pigeonhole principle.
- Sum and product rules {#1}
- Permutations and combinations {#2}
- Pigeonhole principle {#3}
- Binomial coefficients and Pascal's triangle {#4}
- Practice: estimate the size of a brute-force search space {#5}
Sources: [Discrete Mathematics: An Open Introduction](https://discrete.openmathbooks.org/dmoi3.html), [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/)

### Session 1.1.5 — Graph theory
> Outcomes: Describe problems as graphs and reason about paths, trees and connectivity.
- Vertices, edges, directed and weighted graphs {#1}
- Paths, cycles and connectivity {#2}
- Trees and spanning trees {#3}
- Graphs in real systems: networks, dependencies, social graphs {#4}
- Practice: model your project's module dependencies as a graph {#5}
Sources: [Discrete Mathematics: An Open Introduction](https://discrete.openmathbooks.org/dmoi3.html), [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/)

## Module 1.2 — Complexity analysis

### Session 1.2.1 — Big-O and algorithm analysis
> Outcomes: Analyse the time and space complexity of code and compare algorithms.
- Why measure growth instead of seconds {#1}
- Big-O, Big-Θ and Big-Ω {#2}
- Common classes: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ) {#3}
- Space complexity and trade-offs {#4}
- Amortised analysis (dynamic arrays) {#5}
- Practice: annotate the complexity of ten code snippets {#6}
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [Big-O Cheat Sheet](https://www.bigocheatsheet.com/), [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)

### Session 1.2.2 — Analysing recursive algorithms
> Outcomes: Solve recurrences to find the complexity of recursive algorithms.
- Recurrence relations {#1}
- Recursion trees {#2}
- The Master Theorem {#3}
- Practice: analyse merge sort and binary search {#4}
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)

## Module 1.3 — Data structures

### Session 1.3.1 — Arrays and dynamic arrays
> Outcomes: Explain how arrays are laid out in memory and how dynamic arrays grow.
- Contiguous memory and indexing in O(1) {#1}
- Static vs dynamic arrays and resizing {#2}
- Python lists under the hood {#3}
- Strings as arrays {#4}
- Practice: implement a dynamic array class with tests {#5}
Sources: [Open Data Structures](https://opendatastructures.org/), [VisuAlgo](https://visualgo.net/en), [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)

### Session 1.3.2 — Linked lists, stacks and queues
> Outcomes: Implement linked structures and use stacks and queues to solve problems.
- Singly and doubly linked lists {#1}
- Stacks (LIFO) and the call stack {#2}
- Queues and deques (FIFO) {#3}
- Choosing between arrays and linked lists {#4}
- Practice: balanced-parentheses checker and a task queue {#5}
Sources: [Open Data Structures](https://opendatastructures.org/), [VisuAlgo](https://visualgo.net/en)

### Session 1.3.3 — Hash tables
> Outcomes: Explain hashing and collisions and use dictionaries and sets with confidence.
- Hash functions and buckets {#1}
- Collision handling: chaining and open addressing {#2}
- Load factor and resizing {#3}
- Python dict and set internals {#4}
- Practice: implement a hash map and compare with dict {#5}
Sources: [Open Data Structures](https://opendatastructures.org/), [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)

### Session 1.3.4 — Trees and binary search trees
> Outcomes: Implement tree traversals and binary search trees and explain balancing.
- Tree terminology and binary trees {#1}
- Traversals: pre-order, in-order, post-order, level-order {#2}
- Binary search trees: insert, search, delete {#3}
- Balanced trees (AVL, red-black) and B-trees in databases {#4}
- Practice: implement a BST with all traversals {#5}
Sources: [Open Data Structures](https://opendatastructures.org/), [VisuAlgo](https://visualgo.net/en), [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)

### Session 1.3.5 — Heaps and priority queues
> Outcomes: Use heaps for priority scheduling and top-k problems.
- Binary heap property and array representation {#1}
- Push, pop and heapify {#2}
- Python heapq {#3}
- Use cases: schedulers, top-k, median streams {#4}
- Practice: top-k frequent words with a heap {#5}
Sources: [Open Data Structures](https://opendatastructures.org/), [Python heapq docs](https://docs.python.org/3/library/heapq.html)

### Session 1.3.6 — Graphs as data structures
> Outcomes: Represent graphs in code and choose the right representation.
- Adjacency list vs adjacency matrix {#1}
- Directed, weighted and implicit graphs {#2}
- Union–find (disjoint sets) {#3}
- Tries for prefix search {#4}
- Practice: build an autocomplete with a trie {#5}
Sources: [Open Data Structures](https://opendatastructures.org/), [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)

## Module 1.4 — Algorithms

### Session 1.4.1 — Searching and binary search
> Outcomes: Apply binary search to sorted data and to "search on the answer" problems.
- Linear vs binary search {#1}
- Binary search invariants and off-by-one errors {#2}
- Binary search on the answer space {#3}
- Practice: five binary search problems {#4}
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [NeetCode Roadmap](https://neetcode.io/roadmap)

### Session 1.4.2 — Sorting algorithms
> Outcomes: Implement and compare the main sorting algorithms.
- Selection, insertion and bubble sort {#1}
- Merge sort and quicksort {#2}
- Stability and in-place sorting {#3}
- Counting and radix sort; Python's Timsort {#4}
- Practice: implement and benchmark four sorts {#5}
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [VisuAlgo](https://visualgo.net/en)

### Session 1.4.3 — Problem-solving patterns
> Outcomes: Recognise common patterns and apply them to new problems.
- Two pointers and sliding window {#1}
- Prefix sums and hashing tricks {#2}
- Fast and slow pointers {#3}
- Intervals and sorting-based approaches {#4}
- Practice: one problem per pattern {#5}
Sources: [NeetCode Roadmap](https://neetcode.io/roadmap), [Tech Interview Handbook](https://www.techinterviewhandbook.org/)

### Session 1.4.4 — Graph traversal
> Outcomes: Use BFS and DFS to explore graphs, detect cycles and sort dependencies.
- Breadth-first search and shortest paths in unweighted graphs {#1}
- Depth-first search, recursion and iterative stacks {#2}
- Cycle detection and topological sort {#3}
- Connected components {#4}
- Practice: a dependency resolver using topological sort {#5}
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)

### Session 1.4.5 — Shortest paths and spanning trees
> Outcomes: Find shortest paths and minimum spanning trees in weighted graphs.
- Dijkstra's algorithm {#1}
- Bellman–Ford and negative weights {#2}
- Minimum spanning trees: Prim and Kruskal {#3}
- Practice: route planner on a small city map {#4}
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [VisuAlgo](https://visualgo.net/en)

### Session 1.4.6 — Recursion, backtracking and greedy algorithms
> Outcomes: Solve search problems with backtracking and know when greedy choices are optimal.
- Thinking recursively: base case and progress {#1}
- Backtracking: permutations, subsets, N-queens {#2}
- Greedy algorithms and exchange arguments {#3}
- Practice: sudoku solver and interval scheduling {#4}
Sources: [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/), [NeetCode Roadmap](https://neetcode.io/roadmap)

### Session 1.4.7 — Dynamic programming
> Outcomes: Turn exponential recursive solutions into efficient dynamic programs.
- Overlapping subproblems and optimal substructure {#1}
- Memoisation (top-down) vs tabulation (bottom-up) {#2}
- Classic problems: Fibonacci, knapsack, longest common subsequence, edit distance {#3}
- Practice: five DP problems, each solved both ways {#4}
Sources: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), [Jeff Erickson — Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)

## Module 1.5 — Programming paradigms and design

### Session 1.5.1 — Object-oriented programming fundamentals
> Outcomes: Model problems with classes and objects using encapsulation and clear interfaces.
- Classes, objects, attributes and methods {#1}
- Encapsulation and information hiding {#2}
- Special methods (__init__, __repr__, __eq__) {#3}
- Class vs instance state, properties {#4}
- Practice: model a library system with classes {#5}
Sources: [Python Tutorial — Classes](https://docs.python.org/3/tutorial/classes.html), [Refactoring.Guru](https://refactoring.guru/design-patterns)

### Session 1.5.2 — Inheritance, composition and polymorphism
> Outcomes: Choose between inheritance and composition and use polymorphism to remove conditionals.
- Inheritance and method overriding {#1}
- Polymorphism and duck typing {#2}
- Abstract base classes and Protocols {#3}
- Composition over inheritance {#4}
- Practice: refactor a type-switching function into polymorphic classes {#5}
Sources: [Python Tutorial — Classes](https://docs.python.org/3/tutorial/classes.html), [Refactoring.Guru](https://refactoring.guru/refactoring)

### Session 1.5.3 — SOLID principles
> Outcomes: Apply the SOLID principles to keep code easy to change.
- Single responsibility {#1}
- Open/closed {#2}
- Liskov substitution {#3}
- Interface segregation {#4}
- Dependency inversion and dependency injection {#5}
- Practice: review a codebase for SOLID violations {#6}
Sources: [Refactoring.Guru](https://refactoring.guru/design-patterns), [Martin Fowler](https://martinfowler.com/)

### Session 1.5.4 — Creational and structural design patterns
> Outcomes: Recognise and apply the most useful creational and structural patterns.
- What patterns are (and when not to use them) {#1}
- Factory, builder and singleton (and its pitfalls) {#2}
- Adapter, decorator, facade and proxy {#3}
- Practice: add an adapter to switch between two LLM providers {#4}
Sources: [Refactoring.Guru — Design Patterns](https://refactoring.guru/design-patterns)

### Session 1.5.5 — Behavioural design patterns
> Outcomes: Use behavioural patterns to organise how objects collaborate.
- Strategy and template method {#1}
- Observer and publish/subscribe {#2}
- Command and state {#3}
- Iterator and chain of responsibility {#4}
- Practice: implement a plugin system with strategy and observer {#5}
Sources: [Refactoring.Guru — Design Patterns](https://refactoring.guru/design-patterns)

### Session 1.5.6 — Functional programming
> Outcomes: Write pure functions, avoid shared mutable state and use functional tools.
- Pure functions and side effects {#1}
- Immutability {#2}
- Map, filter, reduce and comprehensions {#3}
- Closures and partial application {#4}
- Practice: rewrite a data pipeline in functional style {#5}
Sources: [Python Functional Programming HOWTO](https://docs.python.org/3/howto/functional.html), [Python docs](https://docs.python.org/3/)

# Track 2 — Software Engineering Craft

## Module 2.1 — Clean code

### Session 2.1.1 — Readable code
> Outcomes: Write code that others understand quickly through naming, small functions and clear structure.
- Meaningful names {#1}
- Small functions that do one thing {#2}
- Comments: when they help and when they hurt {#3}
- Formatting and consistency {#4}
- Practice: rewrite a messy function and get feedback {#5}
Sources: [Refactoring.Guru — Refactoring](https://refactoring.guru/refactoring), [PEP 8](https://peps.python.org/pep-0008/), [Google Engineering Practices](https://google.github.io/eng-practices/)

### Session 2.1.2 — Code smells and refactoring
> Outcomes: Detect code smells and refactor safely in small steps.
- Common smells: long method, duplicated code, feature envy {#1}
- Refactoring catalogue: extract, inline, move, rename {#2}
- Refactoring safely with tests {#3}
- Practice: refactor a legacy module kata {#4}
Sources: [Refactoring.Guru — Refactoring](https://refactoring.guru/refactoring), [Martin Fowler — Refactoring](https://martinfowler.com/)

## Module 2.2 — Testing

### Session 2.2.1 — Unit testing with pytest
> Outcomes: Write fast, readable unit tests with pytest.
- Why tests: confidence, design feedback, documentation {#1}
- Arrange–act–assert {#2}
- pytest fixtures and parametrisation {#3}
- Testing exceptions and edge cases {#4}
- Practice: test the data structures you built in Track 1 {#5}
Sources: [pytest docs](https://docs.pytest.org/en/stable/), [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)

### Session 2.2.2 — Test doubles and test-driven development
> Outcomes: Isolate units with mocks and fakes and drive design with TDD.
- Stubs, mocks, fakes and spies {#1}
- unittest.mock and monkeypatch {#2}
- The red–green–refactor cycle {#3}
- When TDD helps and when it doesn't {#4}
- Practice: build a small feature test-first {#5}
Sources: [pytest docs](https://docs.pytest.org/en/stable/), [Martin Fowler — Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)

### Session 2.2.3 — Integration and end-to-end testing
> Outcomes: Test components together and drive the real UI with Playwright.
- Integration tests with real databases (containers) {#1}
- Contract tests for APIs {#2}
- End-to-end testing with Playwright {#3}
- Flaky tests: causes and cures {#4}
- Practice: one integration and one Playwright test for a web app {#5}
Sources: [Playwright docs](https://playwright.dev/docs/intro), [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)

### Session 2.2.4 — Testing strategy
> Outcomes: Choose what to test at which level and measure test quality.
- The test pyramid and the testing trophy {#1}
- Coverage: useful signal, bad target {#2}
- Property-based testing (Hypothesis) {#3}
- Tests in CI and test data management {#4}
- Practice: write a testing strategy for a project {#5}
Sources: [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html), [Hypothesis docs](https://hypothesis.readthedocs.io/en/latest/)

## Module 2.3 — Process

### Session 2.3.1 — Agile and Scrum
> Outcomes: Work effectively in an Agile team and explain Scrum roles, events and artefacts.
- The Agile Manifesto and its principles {#1}
- Scrum: roles, sprints, ceremonies {#2}
- Kanban and flow {#3}
- Practice: run a personal two-week sprint on your study plan {#4}
Sources: [Agile Manifesto](https://agilemanifesto.org/), [The Scrum Guide](https://scrumguides.org/scrum-guide.html)

### Session 2.3.2 — Requirements and user stories
> Outcomes: Turn vague ideas into clear, testable requirements.
- Functional vs non-functional requirements {#1}
- User stories and acceptance criteria {#2}
- Slicing work into small deliverables {#3}
- Practice: write stories for a YouCanDoIt feature {#4}
Sources: [Agile Manifesto](https://agilemanifesto.org/), [Martin Fowler — User Story](https://martinfowler.com/bliki/UserStory.html)

### Session 2.3.3 — Estimation and planning
> Outcomes: Estimate work honestly, communicate uncertainty and plan incremental delivery.
- Why estimates are hard and what they are for {#1}
- Relative estimation and ranges {#2}
- Breaking down work and identifying risks {#3}
- Practice: estimate and track a feature, then review accuracy {#4}
Sources: [Martin Fowler — Purpose of Estimation](https://martinfowler.com/bliki/PurposeOfEstimation.html), [The Scrum Guide](https://scrumguides.org/scrum-guide.html)

## Module 2.4 — Collaboration

### Session 2.4.1 — Code review
> Outcomes: Give and receive code reviews that improve code and help people grow.
- What reviewers look for: design, correctness, tests, readability {#1}
- Writing helpful comments {#2}
- Small PRs and review speed {#3}
- Receiving feedback without ego {#4}
- Practice: review an open-source PR and write your comments {#5}
Sources: [Google Engineering Practices — Code Review](https://google.github.io/eng-practices/review/)

### Session 2.4.2 — Technical documentation and decision records
> Outcomes: Write READMEs, design docs, ADRs and RFCs that people actually read.
- Types of documentation and their audience {#1}
- READMEs and onboarding docs {#2}
- Architecture Decision Records {#3}
- Design docs and RFCs {#4}
- Practice: write an ADR for a YouCanDoIt decision {#5}
Sources: [Architecture Decision Records](https://adr.github.io/), [Write the Docs](https://www.writethedocs.org/guide/), [Google Tech Writing](https://developers.google.com/tech-writing)

### Session 2.4.3 — Working with AI coding tools
> Outcomes: Use AI assistants to go faster while validating everything they produce.
- What AI coding tools are good and bad at {#1}
- Prompting for code: context, constraints, examples {#2}
- Reviewing and testing AI-generated code {#3}
- Security and licensing pitfalls {#4}
- Practice: build a small feature with an AI assistant and document what you corrected {#5}
Sources: [Claude Code docs](https://code.claude.com/docs/en/overview), [Anthropic prompt engineering](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

### Session 2.4.4 — Open-source contribution
> Outcomes: Find, propose and land a contribution in an open-source project.
- How open-source projects are organised {#1}
- Finding good first issues {#2}
- Contribution etiquette: issues, PRs, CLA, code of conduct {#3}
- Practice: land one documentation or bug-fix PR {#4}
Sources: [Open Source Guides](https://opensource.guide/), [GitHub Docs](https://docs.github.com/en/get-started)

## Module 2.5 — Software architecture

### Session 2.5.1 — Architecture fundamentals
> Outcomes: Structure applications into layers with clear boundaries and dependencies.
- What architecture is: the decisions that are hard to change {#1}
- Layered architecture {#2}
- Hexagonal / ports-and-adapters and clean architecture {#3}
- Modular monoliths {#4}
- Practice: draw the architecture of YouCanDoIt with the C4 model {#5}
Sources: [Martin Fowler — Software Architecture Guide](https://martinfowler.com/architecture/), [The C4 model](https://c4model.com/), [The Twelve-Factor App](https://12factor.net/)

### Session 2.5.2 — Domain-driven design basics
> Outcomes: Model complex domains with ubiquitous language, bounded contexts and aggregates.
- Ubiquitous language {#1}
- Entities, value objects and aggregates {#2}
- Bounded contexts and context maps {#3}
- Practice: identify the bounded contexts of an e-learning platform {#4}
Sources: [Martin Fowler — Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html), [microservices.io](https://microservices.io/)

### Session 2.5.3 — Monoliths, microservices and serverless
> Outcomes: Choose an architectural style based on team size, scale and constraints.
- Monolith first {#1}
- Microservices: benefits and costs {#2}
- Service boundaries and communication (sync vs async) {#3}
- Serverless architectures {#4}
- Practice: write a trade-off analysis for splitting a monolith {#5}
Sources: [Martin Fowler — Microservices](https://martinfowler.com/articles/microservices.html), [microservices.io](https://microservices.io/)

### Session 2.5.4 — Event-driven architecture
> Outcomes: Design systems that communicate through events and handle eventual consistency.
- Events, commands and messages {#1}
- Publish/subscribe and event buses {#2}
- Event sourcing and CQRS (overview) {#3}
- Enterprise integration patterns {#4}
- Practice: redesign a synchronous workflow as events {#5}
Sources: [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/), [Martin Fowler — Event-Driven](https://martinfowler.com/articles/201701-event-driven.html)

# Track 3 — Backend and Data

## Module 3.1 — Web foundations

### Session 3.1.1 — How the web works
> Outcomes: Explain what happens from typing a URL to seeing a page, end to end.
- Clients, servers and the request/response model {#1}
- DNS resolution {#2}
- TCP/IP and TLS in one picture {#3}
- Browsers, rendering and the backend's role {#4}
- Practice: trace a request with curl -v and browser dev tools {#5}
Sources: [MDN — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP), [Cloudflare Learning Center](https://www.cloudflare.com/learning/)

### Session 3.1.2 — HTTP in depth
> Outcomes: Use HTTP methods, status codes, headers, caching and cookies correctly.
- Methods and idempotency {#1}
- Status codes families {#2}
- Headers, content negotiation and caching (ETag, Cache-Control) {#3}
- Cookies, sessions and CORS {#4}
- HTTP/2 and HTTP/3 {#5}
- Practice: build a tiny HTTP server with the Python standard library {#6}
Sources: [MDN — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP), [RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)

## Module 3.2 — APIs

### Session 3.2.1 — REST API design
> Outcomes: Design resource-oriented APIs with consistent naming, errors, pagination and versioning.
- Resources, URIs and representations {#1}
- Error format and status codes {#2}
- Pagination, filtering and sorting {#3}
- Versioning, idempotency keys and rate limiting {#4}
- OpenAPI as the contract {#5}
- Practice: design the API for a to-do app in OpenAPI {#6}
Sources: [Google API Design Guide](https://cloud.google.com/apis/design), [OpenAPI Specification](https://spec.openapis.org/oas/latest.html), [OWASP API Security Top 10](https://owasp.org/API-Security/)

### Session 3.2.2 — FastAPI fundamentals
> Outcomes: Build a typed REST API with FastAPI, Pydantic validation and automatic docs.
- Path operations, parameters and request bodies {#1}
- Pydantic models for input and output {#2}
- Automatic OpenAPI docs {#3}
- Error handling and status codes {#4}
- Practice: implement the to-do API in FastAPI {#5}
Sources: [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/), [Pydantic](https://pydantic.dev/docs/validation/latest/get-started/)

### Session 3.2.3 — FastAPI in production
> Outcomes: Structure larger FastAPI apps with dependencies, middleware, background tasks and settings.
- Dependency injection with Depends {#1}
- Routers and project structure {#2}
- Middleware, CORS and lifespan events {#3}
- Background tasks and settings management {#4}
- Testing FastAPI apps {#5}
- Practice: add auth-ready dependencies and tests to the to-do API {#6}
Sources: [FastAPI docs](https://fastapi.tiangolo.com/), [The Twelve-Factor App](https://12factor.net/)

### Session 3.2.4 — GraphQL
> Outcomes: Explain when GraphQL fits better than REST and build a basic GraphQL API.
- Schemas, queries and mutations {#1}
- Resolvers and the N+1 problem (DataLoader) {#2}
- REST vs GraphQL trade-offs {#3}
- Practice: expose the to-do model through GraphQL {#4}
Sources: [GraphQL Learn](https://graphql.org/learn/)

### Session 3.2.5 — Streaming and RPC: SSE, WebSockets and gRPC
> Outcomes: Choose between polling, SSE, WebSockets and gRPC for real-time and service-to-service APIs.
- Polling vs server-sent events vs WebSockets {#1}
- Streaming LLM responses with SSE {#2}
- gRPC and Protocol Buffers {#3}
- Practice: stream progress updates to a browser with SSE {#4}
Sources: [MDN — WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), [gRPC docs](https://grpc.io/docs/), [FastAPI WebSockets](https://fastapi.tiangolo.com/advanced/websockets/)

## Module 3.3 — Relational databases

### Session 3.3.1 — Relational model and SQL basics
> Outcomes: Query and modify relational data with SQL.
- Tables, rows, keys and the relational model {#1}
- SELECT, WHERE, ORDER BY, LIMIT {#2}
- INSERT, UPDATE, DELETE {#3}
- NULL and three-valued logic {#4}
- Practice: complete SQLBolt {#5}
Sources: [SQLBolt](https://sqlbolt.com/), [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)

### Session 3.3.2 — Advanced SQL
> Outcomes: Write complex analytical queries with joins, aggregation, CTEs and window functions.
- Joins: inner, left, full, self {#1}
- GROUP BY, HAVING and aggregate functions {#2}
- Subqueries and common table expressions {#3}
- Window functions {#4}
- Practice: answer ten business questions on a sample database {#5}
Sources: [PostgreSQL docs](https://www.postgresql.org/docs/current/), [SQLBolt](https://sqlbolt.com/)

### Session 3.3.3 — Database design and normalisation
> Outcomes: Design a normalised schema from requirements using ER modelling.
- Entity–relationship modelling {#1}
- Primary and foreign keys, constraints {#2}
- Normal forms (1NF–3NF) and when to denormalise {#3}
- Practice: design the schema of a learning platform {#4}
Sources: [CMU 15-445 Database Systems](https://15445.courses.cs.cmu.edu/), [PostgreSQL docs](https://www.postgresql.org/docs/current/)

### Session 3.3.4 — Indexes and query performance
> Outcomes: Read query plans and add the right indexes to make slow queries fast.
- How B-tree indexes work {#1}
- EXPLAIN and EXPLAIN ANALYZE {#2}
- Composite, partial and covering indexes {#3}
- Common anti-patterns {#4}
- Practice: speed up three slow queries on a large table {#5}
Sources: [Use The Index, Luke](https://use-the-index-luke.com/), [PostgreSQL docs — Indexes](https://www.postgresql.org/docs/current/indexes.html)

### Session 3.3.5 — Transactions and concurrency control
> Outcomes: Use transactions and isolation levels to keep data correct under concurrency.
- ACID properties {#1}
- Isolation levels and anomalies (dirty read, lost update, phantom) {#2}
- Locks and MVCC in PostgreSQL {#3}
- Optimistic vs pessimistic concurrency {#4}
- Practice: reproduce and fix a lost-update bug {#5}
Sources: [PostgreSQL docs — Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html), [CMU 15-445 Database Systems](https://15445.courses.cs.cmu.edu/)

## Module 3.4 — ORM and migrations

### Session 3.4.1 — SQLAlchemy ORM
> Outcomes: Map Python classes to tables and query efficiently with SQLAlchemy 2.0.
- Core vs ORM {#1}
- Declarative models and relationships {#2}
- Sessions and the unit of work {#3}
- Loading strategies and the N+1 problem {#4}
- Async SQLAlchemy {#5}
- Practice: connect the to-do API to PostgreSQL with SQLAlchemy {#6}
Sources: [SQLAlchemy Unified Tutorial](https://docs.sqlalchemy.org/en/20/tutorial/index.html), [SQLAlchemy 2.0 docs](https://docs.sqlalchemy.org/en/20/)

### Session 3.4.2 — Schema migrations
> Outcomes: Evolve a production schema safely with Alembic migrations.
- Why migrations {#1}
- Alembic revisions, upgrade and downgrade {#2}
- Zero-downtime migration patterns (expand/contract) {#3}
- Data migrations {#4}
- Practice: add a column and backfill it without downtime {#5}
Sources: [Alembic docs](https://alembic.sqlalchemy.org/en/latest/)

## Module 3.5 — Beyond relational

### Session 3.5.1 — NoSQL data models
> Outcomes: Choose between document, key–value, wide-column and graph databases.
- Document stores {#1}
- Key–value stores {#2}
- Wide-column stores {#3}
- Graph databases {#4}
- Polyglot persistence trade-offs {#5}
- Practice: model the same data in relational and document form {#6}
Sources: [Designing Data-Intensive Applications](https://dataintensive.net/), [Redis docs](https://redis.io/docs/latest/)

### Session 3.5.2 — Caching with Redis
> Outcomes: Add caching to an application and handle invalidation correctly.
- Cache-aside, write-through and write-behind {#1}
- TTLs, eviction and invalidation {#2}
- Redis data structures beyond strings {#3}
- Rate limiting and sessions with Redis {#4}
- Practice: cache an expensive endpoint and measure the speed-up {#5}
Sources: [Redis docs](https://redis.io/docs/latest/), [Redis University](https://university.redis.io/)

### Session 3.5.3 — Message queues and background jobs
> Outcomes: Move slow work to background workers with reliable queues.
- Why asynchronous processing {#1}
- Queues, workers, acknowledgements and retries {#2}
- RabbitMQ basics {#3}
- Celery and RQ in Python {#4}
- Idempotent consumers and dead-letter queues {#5}
- Practice: send emails from a background worker {#6}
Sources: [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials), [Celery docs](https://docs.celeryq.dev/en/stable/)

### Session 3.5.4 — Event streaming with Kafka
> Outcomes: Explain logs, topics, partitions and consumer groups and when to use streaming.
- The log as a data structure {#1}
- Topics, partitions and consumer groups {#2}
- Delivery guarantees {#3}
- Streams vs queues {#4}
- Practice: produce and consume events locally with Docker {#5}
Sources: [Apache Kafka docs](https://kafka.apache.org/documentation/), [Designing Data-Intensive Applications](https://dataintensive.net/)

### Session 3.5.5 — Data warehousing and analytics basics
> Outcomes: Explain OLTP vs OLAP and build a simple analytics pipeline.
- OLTP vs OLAP {#1}
- ETL vs ELT {#2}
- Star schemas and columnar storage {#3}
- Practice: build a daily report from application data {#4}
Sources: [Designing Data-Intensive Applications](https://dataintensive.net/), [PostgreSQL docs](https://www.postgresql.org/docs/current/)

## Module 3.6 — Communication features

### Session 3.6.1 — Real-time private chat
> Outcomes: Build a private one-to-one chat with WebSockets, persistence and presence.
- WebSocket connection lifecycle and authentication {#1}
- Message persistence and history {#2}
- Fan-out with Redis pub/sub {#3}
- Read receipts and presence {#4}
- Practice: private chat between two users {#5}
Sources: [FastAPI WebSockets](https://fastapi.tiangolo.com/advanced/websockets/), [MDN — WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), [Redis docs](https://redis.io/docs/latest/)

### Session 3.6.2 — Automatic emails and notifications
> Outcomes: Send reliable transactional emails and notifications from background jobs.
- SMTP and transactional email providers {#1}
- Templates and personalisation {#2}
- Deliverability: SPF, DKIM, DMARC {#3}
- Scheduling, retries and unsubscribe compliance {#4}
- Practice: weekly progress email for YouCanDoIt {#5}
Sources: [Python email docs](https://docs.python.org/3/library/email.html), [Celery docs](https://docs.celeryq.dev/en/stable/), [Cloudflare Learning — DMARC](https://www.cloudflare.com/learning/dns/dns-records/dns-dmarc-record/)

### Session 3.6.3 — File uploads and object storage
> Outcomes: Handle file uploads securely and store them in S3-compatible object storage.
- Multipart uploads and streaming {#1}
- Validation: size, type and malware concerns {#2}
- Object storage and presigned URLs {#3}
- Practice: avatar upload with MinIO locally {#4}
Sources: [FastAPI — Request Files](https://fastapi.tiangolo.com/tutorial/request-files/), [MinIO docs](https://min.io/docs/minio/linux/index.html), [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

## Module 3.7 — Java as a second backend language

### Session 3.7.1 — Java fundamentals
> Outcomes: Write Java programs with classes, interfaces, generics, exceptions and Maven/Gradle builds.
- Why Java: the JVM, static typing, a huge enterprise ecosystem {#1}
- Classes, records and interfaces {#2}
- Generics and the Collections framework {#3}
- Exceptions, streams and lambdas {#4}
- Build tools: Maven or Gradle {#5}
- Practice: a CLI tool in Java {#6}
Sources: [Dev.java — Learn Java](https://dev.java/learn/), [The Java Tutorials](https://docs.oracle.com/javase/tutorial/), [Java SE docs](https://docs.oracle.com/en/java/javase/)

### Session 3.7.2 — Web services with Spring Boot
> Outcomes: Build and test a REST service in Spring Boot.
- Spring Boot basics: starters, dependency injection, configuration {#1}
- REST controllers and JSON {#2}
- Data access with Spring Data JPA {#3}
- Testing with JUnit 5 and Spring Boot Test {#4}
- Concurrency basics: threads, executors and virtual threads {#5}
- Practice: rewrite one API endpoint as a Spring Boot microservice {#6}
Sources: [Spring Boot docs](https://docs.spring.io/spring-boot/index.html), [Spring guides](https://spring.io/guides), [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)

# Track 4 — Systems

## Module 4.1 — Operating systems

### Session 4.1.1 — Processes and threads
> Outcomes: Explain processes, threads, scheduling and context switching.
- The process abstraction {#1}
- Threads and shared memory {#2}
- CPU scheduling basics {#3}
- System calls and the kernel boundary {#4}
- Practice: observe processes and threads with ps and htop {#5}
Sources: [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)

### Session 4.1.2 — Memory management
> Outcomes: Explain virtual memory, paging and why programs run out of memory.
- Address spaces and virtual memory {#1}
- Paging and the TLB {#2}
- Heap allocation and garbage collection {#3}
- Memory leaks and OOM kills {#4}
- Practice: profile memory usage of a Python program {#5}
Sources: [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/), [Python tracemalloc docs](https://docs.python.org/3/library/tracemalloc.html)

### Session 4.1.3 — File systems and I/O
> Outcomes: Explain how files, buffers and disks work and their performance implications.
- Files, directories and inodes {#1}
- Buffered vs direct I/O, fsync {#2}
- Disks and SSDs {#3}
- Practice: measure sequential vs random I/O {#4}
Sources: [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)

### Session 4.1.4 — Linux for developers and operators
> Outcomes: Administer a Linux server: users, services, logs and packages.
- Users, groups and permissions {#1}
- systemd services and journald logs {#2}
- Package managers {#3}
- Signals and process lifecycle {#4}
- SSH and remote administration {#5}
- Practice: deploy a service with systemd on a VM {#6}
Sources: [The Linux Command Line](https://linuxcommand.org/tlcl.php), [roadmap.sh DevOps](https://roadmap.sh/devops)

## Module 4.2 — Computer networks

### Session 4.2.1 — Network layers and TCP/IP
> Outcomes: Explain the network stack and how data travels reliably across the internet.
- The layered model (OSI vs TCP/IP) {#1}
- IP addressing, subnets and routing {#2}
- TCP vs UDP, handshakes and congestion control {#3}
- Practice: inspect traffic with tcpdump or Wireshark {#4}
Sources: [Computer Networks: A Systems Approach](https://book.systemsapproach.org/), [Kurose & Ross lectures](https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm)

### Session 4.2.2 — DNS, TLS, proxies and load balancers
> Outcomes: Configure DNS, HTTPS and reverse proxies for a web application.
- DNS records and propagation {#1}
- TLS certificates and Let's Encrypt {#2}
- Reverse proxies (Nginx) and load balancing algorithms {#3}
- CDNs {#4}
- Practice: put a FastAPI app behind Nginx with HTTPS {#5}
Sources: [Cloudflare Learning Center](https://www.cloudflare.com/learning/), [Let's Encrypt docs](https://letsencrypt.org/docs/), [Nginx docs](https://nginx.org/en/docs/)

### Session 4.2.3 — Network programming
> Outcomes: Write client/server programs with sockets.
- Sockets API {#1}
- Blocking vs non-blocking I/O {#2}
- Building a TCP echo server {#3}
- Practice: a tiny chat server with sockets {#4}
Sources: [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/), [Python socket docs](https://docs.python.org/3/library/socket.html)

## Module 4.3 — Concurrency

### Session 4.3.1 — Concurrency fundamentals
> Outcomes: Identify race conditions and deadlocks and fix them with synchronisation.
- Concurrency vs parallelism {#1}
- Race conditions and critical sections {#2}
- Locks, semaphores and condition variables {#3}
- Deadlocks and how to avoid them {#4}
- Python's GIL, threads and processes {#5}
- Practice: reproduce and fix a race condition {#6}
Sources: [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/), [Python threading docs](https://docs.python.org/3/library/threading.html)

### Session 4.3.2 — Asynchronous Python
> Outcomes: Write efficient I/O-bound code with asyncio.
- The event loop {#1}
- async/await and coroutines {#2}
- Tasks, gather and timeouts {#3}
- Async HTTP and databases {#4}
- Practice: fetch 100 URLs concurrently with httpx {#5}
Sources: [Python asyncio docs](https://docs.python.org/3/library/asyncio.html), [FastAPI — Concurrency and async](https://fastapi.tiangolo.com/async/)

## Module 4.4 — Distributed systems

### Session 4.4.1 — Distributed systems fundamentals
> Outcomes: Explain why distributed systems fail and the trade-offs between consistency and availability.
- Partial failures, latency and the fallacies of distributed computing {#1}
- Clocks and ordering {#2}
- CAP and PACELC {#3}
- Consistency models {#4}
- Practice: summarise one MIT 6.5840 lecture {#5}
Sources: [MIT 6.5840 Distributed Systems](https://pdos.csail.mit.edu/6.824/), [Designing Data-Intensive Applications](https://dataintensive.net/), [DDIA notes](https://github.com/keyvanakbary/learning-notes/blob/master/books/designing-data-intensive-applications.md)

### Session 4.4.2 — Replication and partitioning
> Outcomes: Design data replication and sharding strategies.
- Leader–follower and multi-leader replication {#1}
- Replication lag and read-your-writes {#2}
- Partitioning by key and by hash {#3}
- Rebalancing and hot spots {#4}
- Practice: set up PostgreSQL streaming replication locally {#5}
Sources: [Designing Data-Intensive Applications](https://dataintensive.net/), [DDIA notes](https://github.com/keyvanakbary/learning-notes/blob/master/books/designing-data-intensive-applications.md)

### Session 4.4.3 — Consensus and coordination
> Outcomes: Explain consensus, leader election and distributed locks.
- The consensus problem {#1}
- Raft in plain words {#2}
- Leader election, leases and distributed locks {#3}
- Coordination services (etcd, ZooKeeper) {#4}
- Practice: visualise Raft and explain it in your own words {#5}
Sources: [MIT 6.5840 Distributed Systems](https://pdos.csail.mit.edu/6.824/), [The Raft site](https://raft.github.io/)

### Session 4.4.4 — Distributed transactions and data consistency patterns
> Outcomes: Keep data consistent across services with sagas, outbox and idempotency.
- Two-phase commit and its limits {#1}
- Sagas: orchestration vs choreography {#2}
- Transactional outbox {#3}
- Idempotency and exactly-once myths {#4}
- Practice: implement an outbox for a payment-like flow {#5}
Sources: [microservices.io — Saga](https://microservices.io/patterns/data/saga.html), [microservices.io — Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html)

## Module 4.5 — System design and reliability

### Session 4.5.1 — The system design process
> Outcomes: Approach an open-ended design problem methodically.
- Clarifying requirements and constraints {#1}
- Back-of-the-envelope estimation {#2}
- High-level design, deep dives and trade-offs {#3}
- Practice: design a URL shortener end to end {#4}
Sources: [System Design Primer](https://github.com/donnemartin/system-design-primer), [roadmap.sh System Design](https://roadmap.sh/system-design)

### Session 4.5.2 — Scalability building blocks
> Outcomes: Combine load balancers, caches, CDNs, queues and sharding to scale a system.
- Vertical vs horizontal scaling and statelessness {#1}
- Load balancing and CDNs {#2}
- Caching layers {#3}
- Database scaling: read replicas, sharding {#4}
- Asynchronism with queues {#5}
- Practice: scale your URL shortener to 100M users on paper {#6}
Sources: [System Design Primer](https://github.com/donnemartin/system-design-primer), [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/)

### Session 4.5.3 — Designing classic systems
> Outcomes: Design common large-scale systems and defend your trade-offs.
- Chat system {#1}
- News feed {#2}
- Rate limiter {#3}
- Notification system {#4}
- Practice: write a design doc for one of them {#5}
Sources: [System Design Primer](https://github.com/donnemartin/system-design-primer), [Designing Data-Intensive Applications](https://dataintensive.net/)

### Session 4.5.4 — Performance engineering
> Outcomes: Measure, profile and optimise performance with data instead of guesses.
- Latency vs throughput, percentiles {#1}
- Profiling CPU and memory in Python {#2}
- Load testing with k6 or Locust {#3}
- The USE and RED methods {#4}
- Practice: load-test an API, find and fix the bottleneck {#5}
Sources: [Grafana k6 docs](https://grafana.com/docs/k6/latest/), [Brendan Gregg — USE Method](https://www.brendangregg.com/usemethod.html), [Python profilers](https://docs.python.org/3/library/profile.html)

### Session 4.5.5 — Reliability engineering
> Outcomes: Define SLIs and SLOs, use error budgets and design for failure.
- SLIs, SLOs, SLAs and error budgets {#1}
- Timeouts, retries with backoff, circuit breakers {#2}
- Graceful degradation and bulkheads {#3}
- Chaos engineering basics {#4}
- Practice: define SLOs for YouCanDoIt {#5}
Sources: [Google SRE Book](https://sre.google/sre-book/table-of-contents/), [Google SRE Workbook](https://sre.google/workbook/table-of-contents/)

### Session 4.5.6 — Disaster recovery and business continuity
> Outcomes: Plan backups, restores and failover with clear RPO and RTO targets.
- RPO and RTO {#1}
- Backup strategies and restore drills {#2}
- Multi-region and failover {#3}
- Runbooks {#4}
- Practice: back up and restore the YouCanDoIt database {#5}
Sources: [Google SRE Book](https://sre.google/sre-book/table-of-contents/), [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/), [PostgreSQL docs — Backup](https://www.postgresql.org/docs/current/backup.html)

# Track 5 — DevOps and Cloud

## Module 5.1 — Containers

### Session 5.1.1 — Docker fundamentals
> Outcomes: Explain containers vs virtual machines and run, inspect and debug containers.
- Containers vs VMs: namespaces and cgroups {#1}
- Images, layers and registries {#2}
- Running, stopping and inspecting containers {#3}
- Volumes and networking {#4}
- Practice: run PostgreSQL and pgAdmin in containers {#5}
Sources: [Docker — Get started](https://docs.docker.com/get-started/)

### Session 5.1.2 — Writing good Dockerfiles
> Outcomes: Build small, fast, secure images with multi-stage builds.
- Dockerfile instructions {#1}
- Layer caching and build order {#2}
- Multi-stage builds and slim base images {#3}
- Non-root users and .dockerignore {#4}
- Practice: containerise the FastAPI to-do API under 200 MB {#5}
Sources: [Docker build best practices](https://docs.docker.com/build/building/best-practices/), [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)

### Session 5.1.3 — Docker Compose for multi-service apps
> Outcomes: Run a full local stack (API, database, cache, frontend) with Docker Compose.
- Services, networks and volumes in Compose {#1}
- Health checks and dependencies {#2}
- Environment variables and profiles {#3}
- Development workflow with bind mounts {#4}
- Practice: Compose stack for API + Postgres + Redis {#5}
Sources: [Docker Compose docs](https://docs.docker.com/compose/)

## Module 5.2 — CI/CD

### Session 5.2.1 — Continuous integration with GitHub Actions
> Outcomes: Automate linting, testing and building on every push.
- CI principles: small commits, fast feedback {#1}
- Workflows, jobs, steps and runners {#2}
- Caching, matrices and secrets {#3}
- Building and pushing images {#4}
- Practice: CI pipeline for your API repo {#5}
Sources: [GitHub Actions docs](https://docs.github.com/en/actions)

### Session 5.2.2 — Continuous delivery and deployment strategies
> Outcomes: Release safely with blue/green, canary and feature flags.
- Continuous delivery vs deployment {#1}
- Blue/green and canary releases {#2}
- Feature flags and dark launches {#3}
- Rollbacks and database changes {#4}
- Practice: automatic deploy on merge to main {#5}
Sources: [Martin Fowler — Continuous Delivery](https://martinfowler.com/bliki/ContinuousDelivery.html), [Martin Fowler — Feature Toggles](https://martinfowler.com/articles/feature-toggles.html)

### Session 5.2.3 — GitOps
> Outcomes: Manage deployments declaratively from Git with Argo CD.
- GitOps principles {#1}
- Argo CD architecture {#2}
- Environments and promotion {#3}
- Practice: deploy to a local Kubernetes cluster with Argo CD {#4}
Sources: [Argo CD docs](https://argo-cd.readthedocs.io/en/stable/), [OpenGitOps](https://opengitops.dev/)

## Module 5.3 — Cloud computing

### Session 5.3.1 — Cloud computing concepts
> Outcomes: Explain IaaS, PaaS, SaaS, regions and the shared responsibility model.
- What the cloud is and why it won {#1}
- Service models: IaaS, PaaS, SaaS, FaaS {#2}
- Regions, availability zones and edge {#3}
- Shared responsibility and pricing models {#4}
- Practice: map YouCanDoIt's components to cloud services {#5}
Sources: [AWS Cloud Practitioner path](https://aws.amazon.com/training/learn-about/cloud-practitioner/), [Azure Fundamentals](https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/)

### Session 5.3.2 — Core cloud services on AWS
> Outcomes: Use the core compute, storage, database and networking services of AWS.
- IAM: users, roles and least privilege {#1}
- Compute: EC2, containers (ECS/Fargate), Lambda {#2}
- Storage: S3, EBS {#3}
- Databases: RDS, DynamoDB {#4}
- Networking: VPC, subnets, security groups {#5}
- Practice: deploy the API with the free tier and tear it down {#6}
Sources: [AWS Skill Builder](https://skillbuilder.aws/), [AWS Cloud Practitioner path](https://aws.amazon.com/training/learn-about/cloud-practitioner/)

### Session 5.3.3 — Azure and Google Cloud equivalents
> Outcomes: Translate architectures between AWS, Azure and Google Cloud.
- Service mapping across providers {#1}
- Azure fundamentals (AZ-900 topics) {#2}
- Google Cloud fundamentals {#3}
- Practice: redraw your AWS architecture for Azure and GCP {#4}
Sources: [Azure Fundamentals](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/), [Google Cloud training](https://cloud.google.com/learn/training), [Google Skills](https://www.skills.google/)

### Session 5.3.4 — Serverless
> Outcomes: Build event-driven serverless functions and know their limits.
- Functions as a service and event triggers {#1}
- Cold starts, limits and pricing {#2}
- Serverless databases and queues {#3}
- Practice: an image-thumbnail function triggered by uploads {#4}
Sources: [AWS Lambda docs](https://docs.aws.amazon.com/lambda/), [microservices.io](https://microservices.io/)

### Session 5.3.5 — PaaS deployment with logging and monitoring
> Outcomes: Deploy a full-stack app to a free PaaS with logs, health checks and alerts.
- PaaS options: Render, Fly.io, Vercel, Neon {#1}
- Environment configuration and secrets {#2}
- Logs, health checks and alerting on PaaS {#3}
- Practice: deploy the to-do app to a free PaaS with monitoring {#4}
Sources: [Render docs](https://render.com/docs), [Fly.io docs](https://fly.io/docs/), [Vercel docs](https://vercel.com/docs), [Neon docs](https://neon.com/docs/introduction)

### Session 5.3.6 — Cloud cost management
> Outcomes: Estimate, monitor and reduce cloud costs.
- Cost drivers: compute, storage, egress {#1}
- Budgets, alerts and tagging {#2}
- Right-sizing and reserved capacity {#3}
- Practice: estimate the monthly cost of your architecture {#4}
Sources: [FinOps Foundation](https://www.finops.org/introduction/what-is-finops/), [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/)

## Module 5.4 — Infrastructure as code

### Session 5.4.1 — Terraform fundamentals
> Outcomes: Provision infrastructure declaratively with Terraform.
- Infrastructure as code principles {#1}
- Providers, resources and variables {#2}
- Plan, apply and state {#3}
- Practice: provision a container and a database with Terraform {#4}
Sources: [Terraform tutorials](https://developer.hashicorp.com/terraform/tutorials), [OpenTofu docs](https://opentofu.org/docs/)

### Session 5.4.2 — Terraform at scale
> Outcomes: Organise Terraform code with modules, remote state and environments.
- Modules and composition {#1}
- Remote state and locking {#2}
- Workspaces and environment separation {#3}
- Policy and drift detection {#4}
- Practice: refactor your Terraform into reusable modules {#5}
Sources: [Terraform docs](https://developer.hashicorp.com/terraform/docs)

### Session 5.4.3 — Configuration management with Ansible
> Outcomes: Configure servers repeatably with Ansible playbooks.
- Inventories and playbooks {#1}
- Idempotent tasks and roles {#2}
- Ansible vs Terraform {#3}
- Practice: configure a VM with Nginx using Ansible {#4}
Sources: [Ansible docs](https://docs.ansible.com/)

## Module 5.5 — Kubernetes

### Session 5.5.1 — Kubernetes architecture and core objects
> Outcomes: Explain the Kubernetes control plane and core objects.
- Why orchestration {#1}
- Control plane and nodes {#2}
- Pods, ReplicaSets and Deployments {#3}
- Running a local cluster with kind or minikube {#4}
- Practice: deploy your API to kind {#5}
Sources: [Kubernetes Basics tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/), [Kubernetes docs](https://kubernetes.io/docs/home/)

### Session 5.5.2 — Deploying applications on Kubernetes
> Outcomes: Expose and configure applications with Services, Ingress, ConfigMaps and Secrets.
- Services and service discovery {#1}
- Ingress and TLS {#2}
- ConfigMaps and Secrets {#3}
- Persistent volumes and StatefulSets {#4}
- Practice: full stack (API + Postgres) on kind {#5}
Sources: [Kubernetes docs](https://kubernetes.io/docs/home/)

### Session 5.5.3 — Packaging with Helm
> Outcomes: Package and version Kubernetes applications with Helm charts.
- Charts, values and templates {#1}
- Releases, upgrades and rollbacks {#2}
- Practice: write a Helm chart for your API {#3}
Sources: [Helm docs](https://helm.sh/docs/)

### Session 5.5.4 — Operating Kubernetes workloads
> Outcomes: Make workloads resilient with probes, resource limits and autoscaling.
- Liveness, readiness and startup probes {#1}
- Requests, limits and quality of service {#2}
- Horizontal Pod Autoscaler {#3}
- Rolling updates and disruption budgets {#4}
- Practice: autoscale your API under load {#5}
Sources: [Kubernetes docs](https://kubernetes.io/docs/home/), [Google SRE Workbook](https://sre.google/workbook/table-of-contents/)

## Module 5.6 — Observability and operations

### Session 5.6.1 — Structured logging
> Outcomes: Produce structured, searchable logs with correlation IDs.
- Log levels and what to log {#1}
- Structured JSON logs {#2}
- Correlation and request IDs {#3}
- Log aggregation (Loki) {#4}
- Practice: structured logging in the FastAPI app {#5}
Sources: [Python logging HOWTO](https://docs.python.org/3/howto/logging.html), [Grafana Loki docs](https://grafana.com/docs/loki/latest/)

### Session 5.6.2 — Metrics with Prometheus and Grafana
> Outcomes: Instrument services with metrics and build dashboards and alerts.
- Metric types: counters, gauges, histograms {#1}
- Prometheus scraping and PromQL {#2}
- Grafana dashboards {#3}
- Alerting on symptoms (RED, golden signals) {#4}
- Practice: dashboard for API latency and errors {#5}
Sources: [Prometheus overview](https://prometheus.io/docs/introduction/overview/), [Grafana docs](https://grafana.com/docs/grafana/latest/)

### Session 5.6.3 — Distributed tracing with OpenTelemetry
> Outcomes: Trace requests across services to find latency and errors.
- Traces, spans and context propagation {#1}
- OpenTelemetry SDK and auto-instrumentation {#2}
- Collectors and backends (Jaeger, Tempo) {#3}
- Practice: trace a request from frontend to database {#4}
Sources: [OpenTelemetry docs](https://opentelemetry.io/docs/), [OpenTelemetry Python](https://opentelemetry.io/docs/languages/python/)

### Session 5.6.4 — Error tracking with Sentry
> Outcomes: Capture, triage and fix production errors with Sentry.
- Error tracking vs logging {#1}
- Sentry SDK for FastAPI and Next.js {#2}
- Releases, source maps and performance monitoring {#3}
- Alert rules and triage workflow {#4}
- Practice: integrate Sentry into YouCanDoIt {#5}
Sources: [Sentry docs](https://docs.sentry.io/), [Sentry FastAPI integration](https://docs.sentry.io/platforms/python/integrations/fastapi/)

### Session 5.6.5 — On-call and incident response
> Outcomes: Respond to incidents calmly and run blameless postmortems.
- On-call practices and alert fatigue {#1}
- Incident roles and communication {#2}
- Runbooks {#3}
- Blameless postmortems {#4}
- Practice: write a postmortem for a simulated outage {#5}
Sources: [Google SRE Book](https://sre.google/sre-book/table-of-contents/), [PagerDuty Incident Response](https://response.pagerduty.com/)

# Track 6 — Security and Compliance

## Module 6.1 — Security foundations

### Session 6.1.1 — Security mindset and threat modelling
> Outcomes: Identify assets, threats and mitigations for a system before writing code.
- CIA triad and attack surface {#1}
- Threat modelling with STRIDE {#2}
- Security by design and defence in depth {#3}
- Practice: threat model YouCanDoIt {#4}
Sources: [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html), [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Session 6.1.2 — Cryptography for developers
> Outcomes: Use hashing, encryption and signatures correctly without inventing your own crypto.
- Hashing vs encryption vs encoding {#1}
- Symmetric and asymmetric encryption {#2}
- Digital signatures and certificates {#3}
- Password hashing (Argon2, bcrypt) {#4}
- Practice: sign and verify a payload; hash passwords correctly {#5}
Sources: [Practical Cryptography for Developers](https://cryptobook.nakov.com/), [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## Module 6.2 — Web application security

### Session 6.2.1 — The OWASP Top 10
> Outcomes: Recognise and prevent the most critical web application security risks.
- Broken access control {#1}
- Cryptographic failures {#2}
- Injection {#3}
- Insecure design and misconfiguration {#4}
- Vulnerable components and logging failures {#5}
- Practice: audit a sample app against the Top 10 {#6}
Sources: [OWASP Top 10](https://top10.owasp.org/), [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Session 6.2.2 — Preventing SQL injection
> Outcomes: Prevent SQL injection with parameterised queries and safe ORM use.
- How SQL injection works {#1}
- Parameterised queries and prepared statements {#2}
- ORM pitfalls: raw SQL and string formatting {#3}
- Least-privilege database users {#4}
- Practice: exploit and then fix a vulnerable endpoint locally {#5}
Sources: [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), [SQLAlchemy docs](https://docs.sqlalchemy.org/en/20/)

### Session 6.2.3 — XSS, CSRF and browser security
> Outcomes: Prevent cross-site scripting and request forgery with escaping, CSP and cookies.
- Stored, reflected and DOM XSS {#1}
- Output encoding and React's protections (and dangerouslySetInnerHTML) {#2}
- Content Security Policy {#3}
- CSRF and SameSite cookies {#4}
- Security headers {#5}
- Practice: add CSP and security headers to a Next.js app {#6}
Sources: [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [MDN — CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

### Session 6.2.4 — API security
> Outcomes: Secure APIs against the OWASP API Top 10.
- Object-level and function-level authorisation {#1}
- Rate limiting and resource exhaustion {#2}
- Mass assignment and input validation {#3}
- Practice: security review of your FastAPI project {#4}
Sources: [OWASP API Security Top 10](https://owasp.org/API-Security/), [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

## Module 6.3 — Identity and access

### Session 6.3.1 — Authentication
> Outcomes: Implement secure login with sessions or tokens.
- Password-based login done right {#1}
- Sessions vs JWTs {#2}
- Token storage and expiry, refresh tokens {#3}
- Practice: add login to the to-do API {#4}
Sources: [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [JWT introduction](https://jwt.io/introduction), [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

### Session 6.3.2 — Two-factor authentication and passkeys
> Outcomes: Add TOTP-based 2FA and understand passkeys/WebAuthn.
- Why MFA {#1}
- TOTP (RFC 6238) and recovery codes {#2}
- Passkeys and WebAuthn {#3}
- Practice: add TOTP 2FA to your login {#4}
Sources: [OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html), [RFC 6238 TOTP](https://www.rfc-editor.org/rfc/rfc6238), [WebAuthn Guide](https://webauthn.guide/)

### Session 6.3.3 — OAuth 2.0 and OpenID Connect
> Outcomes: Integrate social login and delegated access with OAuth 2.0 and OIDC.
- OAuth roles and flows (authorization code + PKCE) {#1}
- OpenID Connect and ID tokens {#2}
- Scopes and consent {#3}
- Practice: "Sign in with GitHub" {#4}
Sources: [OAuth 2.0](https://oauth.net/2/), [OpenID Connect](https://openid.net/developers/how-connect-works/)

### Session 6.3.4 — Authorisation models
> Outcomes: Design role- and attribute-based access control.
- RBAC, ABAC and ReBAC {#1}
- Enforcing authorisation in APIs {#2}
- Multi-tenancy isolation {#3}
- Practice: roles for admin, mentor and learner {#4}
Sources: [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## Module 6.4 — Secure delivery

### Session 6.4.1 — Secrets management
> Outcomes: Keep secrets out of code and rotate them safely.
- Environment variables and their limits {#1}
- Secret managers (Vault, cloud KMS) {#2}
- Secret scanning and rotation {#3}
- Practice: remove a leaked secret from git history and rotate it {#4}
Sources: [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning)

### Session 6.4.2 — Software supply chain security
> Outcomes: Reduce dependency risk with scanning, pinning, SBOMs and provenance.
- Dependency vulnerabilities and Dependabot {#1}
- Pinning, lock files and reproducible builds {#2}
- SBOMs and SLSA provenance {#3}
- Image scanning (Trivy) {#4}
- Practice: add dependency and image scanning to CI {#5}
Sources: [SLSA](https://slsa.dev/), [Trivy docs](https://trivy.dev/docs/latest/), [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot)

### Session 6.4.3 — Hardening cloud and containers
> Outcomes: Apply least privilege and hardening to containers, Kubernetes and cloud accounts.
- Least-privilege IAM {#1}
- Container hardening: non-root, read-only filesystems {#2}
- Network policies and segmentation {#3}
- Security logging and monitoring {#4}
- Practice: harden your Compose and Kubernetes manifests {#5}
Sources: [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html), [Kubernetes security docs](https://kubernetes.io/docs/concepts/security/)

## Module 6.5 — Privacy and regulation

### Session 6.5.1 — GDPR for developers
> Outcomes: Build features that comply with GDPR: lawful basis, consent, data rights and retention.
- Personal data and lawful bases {#1}
- Privacy by design and data minimisation {#2}
- Data subject rights: access, deletion, portability {#3}
- Retention, DPAs and breach notification {#4}
- Practice: implement data export and account deletion {#5}
Sources: [GDPR — Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj), [OWASP User Privacy Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html)

### Session 6.5.2 — The EU AI Act and responsible AI
> Outcomes: Classify an AI system's risk level and apply responsible-AI practices.
- Risk categories under the AI Act {#1}
- Transparency obligations for chatbots and generated content {#2}
- Bias, fairness and explainability {#3}
- AI risk management frameworks {#4}
- Practice: write a short AI impact assessment for YouCanDoIt's tutor {#5}
Sources: [EU AI Act — Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj), [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)

# Track 7 — Mathematics for AI

## Module 7.1 — Linear algebra

### Session 7.1.1 — Vectors and vector spaces
> Outcomes: Manipulate vectors and explain dot products and similarity geometrically.
- Vectors as arrows and as lists of numbers {#1}
- Addition, scaling and linear combinations {#2}
- Dot product, norms and cosine similarity {#3}
- Practice: compute cosine similarity between word vectors with NumPy {#4}
Sources: [3Blue1Brown — Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra), [Khan Academy — Linear Algebra](https://www.khanacademy.org/math/linear-algebra)

### Session 7.1.2 — Matrices and linear transformations
> Outcomes: Interpret matrices as transformations and multiply them confidently.
- Matrices as transformations {#1}
- Matrix multiplication and composition {#2}
- Determinant, inverse and rank {#3}
- Practice: implement matrix multiplication and compare with NumPy {#4}
Sources: [3Blue1Brown — Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra), [Khan Academy — Linear Algebra](https://www.khanacademy.org/math/linear-algebra)

### Session 7.1.3 — Eigenvectors and decompositions
> Outcomes: Explain eigenvectors, SVD and PCA and why they matter in ML.
- Eigenvalues and eigenvectors {#1}
- Singular value decomposition {#2}
- Principal component analysis {#3}
- Practice: reduce a dataset to 2D with PCA and plot it {#4}
Sources: [3Blue1Brown — Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra), [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course)

## Module 7.2 — Calculus

### Session 7.2.1 — Derivatives and gradients
> Outcomes: Compute derivatives and partial derivatives and interpret gradients.
- Limits and the derivative as rate of change {#1}
- Rules of differentiation {#2}
- Partial derivatives and the gradient {#3}
- Practice: numerically approximate gradients in Python {#4}
Sources: [3Blue1Brown — Essence of Calculus](https://www.3blue1brown.com/topics/calculus), [Khan Academy — Calculus 1](https://www.khanacademy.org/math/calculus-1)

### Session 7.2.2 — Chain rule and optimisation
> Outcomes: Apply the chain rule and gradient descent — the engine of neural network training.
- The chain rule and computational graphs {#1}
- Gradient descent and learning rate {#2}
- Stochastic and mini-batch gradient descent {#3}
- Practice: fit a line with hand-written gradient descent {#4}
Sources: [3Blue1Brown — Essence of Calculus](https://www.3blue1brown.com/topics/calculus), [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html)

## Module 7.3 — Probability and statistics

### Session 7.3.1 — Probability fundamentals
> Outcomes: Reason about uncertainty with probability rules, conditional probability and Bayes' theorem.
- Events, sample spaces and probability rules {#1}
- Conditional probability and independence {#2}
- Bayes' theorem {#3}
- Random variables and expectation {#4}
- Practice: simulate a medical-test Bayes problem in Python {#5}
Sources: [Khan Academy — Statistics and Probability](https://www.khanacademy.org/math/statistics-probability), [CS50 AI](https://cs50.harvard.edu/ai/)

### Session 7.3.2 — Distributions
> Outcomes: Recognise common distributions and where they appear in data and models.
- Discrete: Bernoulli, binomial, Poisson {#1}
- Continuous: uniform, normal, exponential {#2}
- Central limit theorem {#3}
- Practice: sample and plot distributions with NumPy {#4}
Sources: [OpenStax Introductory Statistics](https://openstax.org/details/books/introductory-statistics-2e), [StatQuest](https://statquest.org/)

### Session 7.3.3 — Descriptive and inferential statistics
> Outcomes: Summarise data and draw conclusions with confidence intervals and hypothesis tests.
- Mean, median, variance and correlation {#1}
- Sampling and confidence intervals {#2}
- Hypothesis testing and p-values {#3}
- A/B testing in product work {#4}
- Practice: analyse an A/B test result {#5}
Sources: [OpenStax Introductory Statistics](https://openstax.org/details/books/introductory-statistics-2e), [StatQuest](https://statquest.org/)

## Module 7.4 — Data tools

### Session 7.4.1 — NumPy
> Outcomes: Work with arrays, broadcasting and vectorised operations.
- ndarrays, shapes and dtypes {#1}
- Indexing and slicing {#2}
- Broadcasting and vectorisation {#3}
- Practice: rewrite loops as vectorised NumPy {#4}
Sources: [NumPy — absolute beginners](https://numpy.org/doc/stable/user/absolute_beginners.html)

### Session 7.4.2 — pandas and data visualisation
> Outcomes: Load, clean, explore and visualise tabular data.
- DataFrames, selection and filtering {#1}
- Cleaning missing and messy data {#2}
- Grouping and aggregation {#3}
- Plotting with matplotlib {#4}
- Practice: exploratory data analysis of a public dataset {#5}
Sources: [pandas — Getting started](https://pandas.pydata.org/docs/getting_started/index.html), [Matplotlib tutorials](https://matplotlib.org/stable/tutorials/index.html)

# Track 8 — Machine Learning and Deep Learning

## Module 8.1 — Classical AI

### Session 8.1.1 — Search, knowledge and reasoning
> Outcomes: Explain classical AI techniques: search, logic and probabilistic reasoning.
- Uninformed and informed search (BFS, A*) {#1}
- Adversarial search (minimax) {#2}
- Knowledge representation and logic {#3}
- Probabilistic reasoning {#4}
- Practice: complete one CS50 AI project {#5}
Sources: [CS50 AI](https://cs50.harvard.edu/ai/), [AIMA](https://aima.cs.berkeley.edu/)

## Module 8.2 — Machine learning fundamentals

### Session 8.2.1 — What machine learning is
> Outcomes: Frame problems as supervised, unsupervised or reinforcement learning.
- Learning from data vs writing rules {#1}
- Supervised, unsupervised, reinforcement learning {#2}
- Features, labels, training and inference {#3}
- The ML project lifecycle {#4}
- Practice: frame three real problems as ML tasks {#5}
Sources: [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course), [StatQuest](https://statquest.org/)

### Session 8.2.2 — Regression
> Outcomes: Train and evaluate linear and polynomial regression models.
- Linear regression and loss functions {#1}
- Training with gradient descent {#2}
- Regularisation (L1, L2) {#3}
- Metrics: MAE, MSE, R² {#4}
- Practice: predict house prices {#5}
Sources: [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course), [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)

### Session 8.2.3 — Classification
> Outcomes: Train classifiers and pick metrics that match the business problem.
- Logistic regression {#1}
- Decision trees, random forests and gradient boosting {#2}
- Precision, recall, F1, ROC-AUC {#3}
- Class imbalance {#4}
- Practice: spam classifier {#5}
Sources: [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course), [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html), [StatQuest](https://statquest.org/)

### Session 8.2.4 — Model evaluation and generalisation
> Outcomes: Detect overfitting and evaluate models honestly.
- Train, validation and test splits {#1}
- Cross-validation {#2}
- Bias–variance trade-off {#3}
- Data leakage {#4}
- Practice: fix a leaky evaluation {#5}
Sources: [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course), [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)

### Session 8.2.5 — Unsupervised learning
> Outcomes: Cluster data and reduce dimensionality to find structure.
- k-means and hierarchical clustering {#1}
- Dimensionality reduction (PCA, t-SNE, UMAP) {#2}
- Anomaly detection {#3}
- Practice: cluster articles by topic using embeddings {#4}
Sources: [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html), [StatQuest](https://statquest.org/)

### Session 8.2.6 — Feature engineering and ML pipelines
> Outcomes: Build reproducible scikit-learn pipelines with preprocessing and tuning.
- Encoding, scaling and missing values {#1}
- Pipelines and ColumnTransformer {#2}
- Hyperparameter search {#3}
- Saving and loading models {#4}
- Practice: end-to-end pipeline for a tabular dataset {#5}
Sources: [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)

## Module 8.3 — Neural networks

### Session 8.3.1 — From perceptron to multilayer networks
> Outcomes: Explain neurons, activation functions and why depth helps.
- The perceptron and linear separability {#1}
- Activation functions {#2}
- Multilayer perceptrons as function approximators {#3}
- Practice: classify handwritten digits with an MLP {#4}
Sources: [3Blue1Brown — Neural Networks](https://www.3blue1brown.com/topics/neural-networks), [StatQuest](https://statquest.org/)

### Session 8.3.2 — Backpropagation from scratch
> Outcomes: Implement backpropagation and a tiny autograd engine.
- Computational graphs {#1}
- Backpropagation via the chain rule {#2}
- Building micrograd {#3}
- Practice: train a small network with your own autograd {#4}
Sources: [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html), [3Blue1Brown — Neural Networks](https://www.3blue1brown.com/topics/neural-networks)

## Module 8.4 — Deep learning with PyTorch

### Session 8.4.1 — Tensors and autograd
> Outcomes: Use PyTorch tensors, autograd and GPUs/MPS.
- Tensors and operations {#1}
- Autograd {#2}
- Devices: CPU, CUDA, Apple MPS {#3}
- Practice: reimplement your micrograd network in PyTorch {#4}
Sources: [PyTorch tutorials](https://docs.pytorch.org/tutorials/)

### Session 8.4.2 — Training neural networks
> Outcomes: Write training loops, track loss and tune training.
- Datasets and DataLoaders {#1}
- nn.Module, optimisers and loss functions {#2}
- Training/validation loops and loss curves {#3}
- Overfitting remedies: dropout, weight decay, early stopping {#4}
- Practice: train a network and track loss with TensorBoard {#5}
Sources: [PyTorch tutorials](https://docs.pytorch.org/tutorials/), [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html)

### Session 8.4.3 — Convolutional networks and computer vision
> Outcomes: Build image classifiers with CNNs and transfer learning.
- Convolutions and pooling {#1}
- Classic architectures (ResNet) {#2}
- Transfer learning {#3}
- Practice: fine-tune a pretrained CNN on your own images {#4}
Sources: [PyTorch tutorials](https://docs.pytorch.org/tutorials/), [Dive into Deep Learning](https://d2l.ai/)

### Session 8.4.4 — Sequence models
> Outcomes: Explain how RNNs process sequences and why transformers replaced them.
- Embeddings for tokens {#1}
- RNNs, LSTMs and vanishing gradients {#2}
- From sequence-to-sequence to attention {#3}
- Practice: character-level language model (makemore) {#4}
Sources: [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html), [Dive into Deep Learning](https://d2l.ai/)

## Module 8.5 — Transformers and LLMs

### Session 8.5.1 — Attention and the transformer architecture
> Outcomes: Explain self-attention, multi-head attention and the transformer block.
- Queries, keys and values {#1}
- Self-attention and multi-head attention {#2}
- Positional encoding {#3}
- The transformer block: residuals and layer norm {#4}
- Practice: draw the transformer from memory and explain each part {#5}
Sources: [Attention Is All You Need](https://arxiv.org/abs/1706.03762), [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/), [3Blue1Brown — Neural Networks](https://www.3blue1brown.com/topics/neural-networks)

### Session 8.5.2 — Build a tiny GPT
> Outcomes: Implement and train a small GPT-style language model.
- Decoder-only architecture {#1}
- Causal masking {#2}
- Training on a text corpus {#3}
- Sampling: temperature, top-k, top-p {#4}
- Practice: train a tiny GPT on your favourite author {#5}
Sources: [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html)

### Session 8.5.3 — Tokenisation
> Outcomes: Implement byte-pair encoding and explain how tokenisation affects LLM behaviour.
- Characters, words and subwords {#1}
- Byte-pair encoding {#2}
- Tokenisers in practice (tiktoken, Hugging Face) {#3}
- Tokenisation quirks: numbers, code, languages {#4}
- Practice: build a BPE tokenizer with minbpe {#5}
Sources: [Karpathy — minbpe](https://github.com/karpathy/minbpe), [Hugging Face LLM Course](https://huggingface.co/learn/llm-course)

### Session 8.5.4 — How LLMs are trained and aligned
> Outcomes: Describe pretraining, scaling, instruction tuning and alignment.
- Pretraining and scaling laws {#1}
- Instruction tuning and RLHF/RLAIF {#2}
- Constitutional AI and safety {#3}
- Context windows and reasoning models {#4}
- Practice: explain the life of an LLM in a one-page diagram {#5}
Sources: [Hugging Face LLM Course](https://huggingface.co/learn/llm-course), [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html), [Anthropic research](https://www.anthropic.com/research)

## Module 8.6 — Open models and fine-tuning

### Session 8.6.1 — Hugging Face Transformers and the Hub
> Outcomes: Load, run and share pretrained models with the Transformers library.
- The Hub: models, datasets, Spaces {#1}
- Pipelines and AutoModel {#2}
- Model cards and licences {#3}
- Practice: build a small app with an open-source model {#4}
Sources: [Hugging Face Transformers docs](https://huggingface.co/docs/transformers/index), [Hugging Face Learn](https://huggingface.co/learn)

### Session 8.6.2 — Running open models locally
> Outcomes: Run open LLMs locally with Ollama and understand quantisation trade-offs.
- Model sizes, memory and hardware {#1}
- Quantisation (GGUF, 4-bit) {#2}
- Ollama and its REST API {#3}
- Practice: compare three local models on the same prompts {#4}
Sources: [Ollama docs](https://docs.ollama.com/), [Ollama API](https://docs.ollama.com/api/introduction)

### Session 8.6.3 — Fine-tuning small models
> Outcomes: Fine-tune a small model efficiently with LoRA and evaluate the result.
- When to fine-tune vs prompt vs RAG {#1}
- Full fine-tuning vs PEFT (LoRA, QLoRA) {#2}
- Supervised fine-tuning with TRL {#3}
- Practice: fine-tune a small model on a custom dataset {#4}
Sources: [Hugging Face PEFT](https://huggingface.co/docs/peft/index), [Hugging Face smol-course](https://github.com/huggingface/smol-course), [Hugging Face TRL](https://huggingface.co/docs/trl/index)

# Track 9 — AI Engineering

## Module 9.1 — Working with LLM APIs

### Session 9.1.1 — How LLM APIs work
> Outcomes: Explain tokens, context windows, sampling and pricing for LLM APIs.
- Messages, roles and system prompts {#1}
- Tokens, context windows and costs {#2}
- Sampling parameters and determinism {#3}
- Model families and choosing a model {#4}
- Practice: compare cost and latency of three models on the same task {#5}
Sources: [Claude Developer Platform docs](https://platform.claude.com/docs/en/home), [OpenAI API docs](https://developers.openai.com/api/docs)

### Session 9.1.2 — The Claude API
> Outcomes: Build features with the Claude API using the official SDKs.
- Messages API and the Python/TypeScript SDKs {#1}
- System prompts, multi-turn conversations {#2}
- Thinking, effort and model selection {#3}
- Prompt caching and the Batch API {#4}
- Practice: an article summariser with Claude {#5}
Sources: [Claude Developer Platform docs](https://platform.claude.com/docs/en/home), [Anthropic courses](https://github.com/anthropics/courses)

### Session 9.1.3 — The OpenAI API
> Outcomes: Use the OpenAI API and compare its design with other providers.
- Responses API and chat {#1}
- Embeddings endpoints {#2}
- Assistants, files and tools {#3}
- Practice: port your summariser to OpenAI and compare {#4}
Sources: [OpenAI API docs](https://developers.openai.com/api/docs), [OpenAI Cookbook](https://developers.openai.com/cookbook)

### Session 9.1.4 — Structured outputs and tool calling
> Outcomes: Get reliable JSON and call functions from LLMs.
- JSON mode and structured outputs {#1}
- Tool (function) calling: definitions, calls and results {#2}
- Validating model output with Pydantic {#3}
- Practice: extract structured data from invoices {#4}
Sources: [Claude tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview), [OpenAI API docs](https://developers.openai.com/api/docs)

### Session 9.1.5 — LLMs in production
> Outcomes: Handle streaming, errors, rate limits, cost and latency in real applications.
- Streaming responses to the UI {#1}
- Retries, timeouts and rate limits {#2}
- Caching and cost control {#3}
- Provider abstraction and fallbacks {#4}
- Practice: streaming chat endpoint with retries and a cost dashboard {#5}
Sources: [Claude Developer Platform docs](https://platform.claude.com/docs/en/home), [OpenAI Cookbook](https://developers.openai.com/cookbook)

## Module 9.2 — Prompt engineering

### Session 9.2.1 — Prompt engineering fundamentals
> Outcomes: Write clear, specific prompts that produce reliable results.
- Clarity, context and constraints {#1}
- Roles and system prompts {#2}
- Examples (few-shot) {#3}
- Output formatting with XML tags {#4}
- Practice: the Anthropic interactive tutorial {#5}
Sources: [Anthropic prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview), [Anthropic interactive tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial), [Prompt Engineering Guide](https://www.promptingguide.ai/)

### Session 9.2.2 — Advanced prompting techniques
> Outcomes: Use chain-of-thought, prompt chaining and self-critique for complex tasks.
- Step-by-step reasoning and thinking models {#1}
- Prompt chaining and decomposition {#2}
- Self-consistency and self-critique {#3}
- Long-context prompting {#4}
- Practice: a multi-step research prompt chain {#5}
Sources: [Prompt Engineering Guide](https://www.promptingguide.ai/), [Anthropic prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

### Session 9.2.3 — Testing and iterating prompts
> Outcomes: Treat prompts as code: version, test and measure them.
- Prompt versioning {#1}
- Test sets and regression checks {#2}
- A/B testing prompts {#3}
- Practice: build a small prompt test suite {#4}
Sources: [Anthropic courses](https://github.com/anthropics/courses), [OpenAI Cookbook](https://developers.openai.com/cookbook)

## Module 9.3 — Retrieval-augmented generation

### Session 9.3.1 — Embeddings and semantic search
> Outcomes: Explain embeddings and build semantic search over documents.
- What embeddings are and how they are trained {#1}
- Similarity measures {#2}
- Embedding models (local and hosted) {#3}
- Practice: semantic search over your notes {#4}
Sources: [Hugging Face LLM Course](https://huggingface.co/learn/llm-course), [Ollama docs](https://docs.ollama.com/)

### Session 9.3.2 — Vector databases
> Outcomes: Store and query embeddings at scale with pgvector and Qdrant.
- Exact vs approximate nearest neighbour search {#1}
- Index types: HNSW, IVF {#2}
- pgvector in PostgreSQL {#3}
- Dedicated vector databases: Qdrant {#4}
- Metadata filtering {#5}
- Practice: the same search on pgvector and Qdrant, compared {#6}
Sources: [pgvector](https://github.com/pgvector/pgvector), [Qdrant docs](https://qdrant.tech/documentation/)

### Session 9.3.3 — Building a RAG pipeline
> Outcomes: Build a RAG system with ingestion, chunking, retrieval and cited answers.
- RAG architecture {#1}
- Ingestion and text extraction {#2}
- Chunking strategies {#3}
- Retrieval and prompt assembly {#4}
- Citations and grounding {#5}
- Practice: chatbot for your own documents {#6}
Sources: [LlamaIndex docs](https://developers.llamaindex.ai/python/framework/), [Hugging Face Learn](https://huggingface.co/learn), [pgvector](https://github.com/pgvector/pgvector)

### Session 9.3.4 — Advanced RAG
> Outcomes: Improve retrieval quality with hybrid search, reranking and query transformation.
- Hybrid search (BM25 + vectors) {#1}
- Reranking with cross-encoders {#2}
- Query rewriting and HyDE {#3}
- Contextual retrieval and parent-document strategies {#4}
- Practice: measure the quality gain of reranking {#5}
Sources: [LlamaIndex docs](https://developers.llamaindex.ai/python/framework/), [Qdrant docs](https://qdrant.tech/documentation/)

### Session 9.3.5 — Evaluating RAG
> Outcomes: Measure retrieval and answer quality with datasets and metrics.
- Retrieval metrics: recall@k, MRR {#1}
- Answer metrics: faithfulness, relevance {#2}
- Building an evaluation dataset {#3}
- Ragas {#4}
- Practice: evaluate your document chatbot {#5}
Sources: [Ragas docs](https://docs.ragas.io/), [Hugging Face Evaluate](https://huggingface.co/docs/evaluate/index)

## Module 9.4 — Vision and smart context

### Session 9.4.1 — OCR and document processing
> Outcomes: Extract text and structure from scanned documents and PDFs.
- OCR with Tesseract {#1}
- Layout-aware extraction from PDFs {#2}
- Cleaning and structuring extracted text {#3}
- Practice: OCR pipeline feeding your RAG index {#4}
Sources: [Tesseract docs](https://tesseract-ocr.github.io/tessdoc/), [OpenCV tutorials](https://docs.opencv.org/4.x/d9/df8/tutorial_root.html)

### Session 9.4.2 — Multimodal LLMs
> Outcomes: Use vision-capable LLMs to understand images, charts and documents.
- How vision models see images {#1}
- Image and PDF inputs in LLM APIs {#2}
- Use cases and limits {#3}
- Practice: extract data from screenshots and charts {#4}
Sources: [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision), [OpenAI API docs](https://developers.openai.com/api/docs)

### Session 9.4.3 — Memory for AI applications
> Outcomes: Give AI applications short- and long-term memory.
- Conversation history and summarisation {#1}
- Long-term memory stores {#2}
- Retrieval-based memory and user profiles {#3}
- Privacy considerations for memory {#4}
- Practice: add memory to your chatbot {#5}
Sources: [Claude Developer Platform docs](https://platform.claude.com/docs/en/home), [LlamaIndex docs](https://developers.llamaindex.ai/python/framework/)

## Module 9.5 — Agents

### Session 9.5.1 — How agents work
> Outcomes: Explain the agent loop and when an agent is the right tool.
- Workflows vs agents {#1}
- The agent loop: think, act, observe {#2}
- Common agent patterns (routing, orchestrator–workers, evaluator–optimiser) {#3}
- When not to build an agent {#4}
- Practice: diagram three agent patterns with examples {#5}
Sources: [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), [Hugging Face Agents Course](https://huggingface.co/learn/agents-course)

### Session 9.5.2 — Build an agent from scratch
> Outcomes: Implement a tool-using agent loop without frameworks.
- Tool definitions and schemas {#1}
- The manual tool-use loop {#2}
- Error handling and stopping conditions {#3}
- Practice: a research agent with web search and a calculator {#4}
Sources: [Claude tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview), [Hugging Face smol-course](https://github.com/huggingface/smol-course)

### Session 9.5.3 — The Model Context Protocol (MCP)
> Outcomes: Build and connect MCP servers to expose tools and data to AI applications.
- MCP architecture: hosts, clients, servers {#1}
- Tools, resources and prompts {#2}
- Transports and authentication {#3}
- Practice: an MCP server exposing your YouCanDoIt progress {#4}
Sources: [MCP specification](https://modelcontextprotocol.io/specification/latest), [Model Context Protocol](https://modelcontextprotocol.io/)

### Session 9.5.4 — Multi-agent systems
> Outcomes: Design multi-agent architectures with clear roles and coordination.
- Orchestrator and sub-agents {#1}
- Communication and shared state {#2}
- Frameworks overview (LangGraph, OpenAI Agents SDK, Claude Agent SDK) {#3}
- Cost and failure modes {#4}
- Practice: a planner–executor–reviewer system {#5}
Sources: [Hugging Face Agents Course](https://huggingface.co/learn/agents-course), [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), [GitHub — Agentic engineering system](https://github.com/resources/insights/agentic-engineering-system)

### Session 9.5.5 — Agent infrastructure you can trust
> Outcomes: Run agents safely with sandboxing, guardrails, tracing and human oversight — knowing exactly what they do.
- Sandboxing and permissions {#1}
- Guardrails and human-in-the-loop approval {#2}
- Tracing and observability of agent runs {#3}
- Git and infrastructure for agent-scale development {#4}
- Practice: add tracing and approval gates to your agent {#5}
Sources: [GitHub Blog — Git infrastructure for agent-scale development](https://github.blog/engineering/architecture-optimization/building-git-infrastructure-for-agent-scale-development/), [Claude Code docs](https://code.claude.com/docs/en/overview), [OpenTelemetry docs](https://opentelemetry.io/docs/)

### Session 9.5.6 — Claude Code and agentic coding
> Outcomes: Use Claude Code CLI effectively and extend it with hooks, skills, subagents and MCP.
- Claude Code workflows: plan, edit, test {#1}
- CLAUDE.md, memory and project context {#2}
- Hooks, skills, subagents and slash commands {#3}
- MCP servers in Claude Code {#4}
- Headless mode and CI automation {#5}
- Practice: automate a repetitive task in your repo with Claude Code {#6}
Sources: [Claude Code docs](https://code.claude.com/docs/en/overview), [Model Context Protocol](https://modelcontextprotocol.io/)

### Session 9.5.7 — Specialised agents and smart suggestions
> Outcomes: Build focused agents that suggest, draft and automate inside real products.
- Designing a specialised agent: scope, tools, evaluation {#1}
- Smart suggestions and auto-drafting (emails, replies) {#2}
- Triggering agents from events and schedules {#3}
- Practice: an agent that drafts your weekly study email {#4}
Sources: [Claude Developer Platform docs](https://platform.claude.com/docs/en/home), [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

## Module 9.6 — Evaluation and LLMOps

### Session 9.6.1 — Evaluating LLM applications
> Outcomes: Build evals that tell you whether a change made your AI feature better.
- Why evals: vibes don't scale {#1}
- Golden datasets and graders (code, human, LLM-as-judge) {#2}
- Offline vs online evaluation {#3}
- Practice: an eval suite for your tutor feature {#4}
Sources: [Hugging Face Evaluate](https://huggingface.co/docs/evaluate/index), [Anthropic courses](https://github.com/anthropics/courses), [OpenAI Cookbook](https://developers.openai.com/cookbook)

### Session 9.6.2 — Observability and cost for LLM apps
> Outcomes: Trace prompts, responses, latency and cost in production.
- What to log (and what not to) {#1}
- Tracing LLM calls with OpenTelemetry {#2}
- Cost and token dashboards {#3}
- Practice: add LLM tracing to YouCanDoIt {#4}
Sources: [OpenTelemetry docs](https://opentelemetry.io/docs/), [Claude Developer Platform docs](https://platform.claude.com/docs/en/home)

### Session 9.6.3 — Deploying AI applications
> Outcomes: Serve AI apps with FastAPI, Gradio and model servers.
- Serving patterns: API, batch, streaming {#1}
- Gradio demos and Hugging Face Spaces {#2}
- Model servers (vLLM) and GPUs {#3}
- Scaling and caching strategies {#4}
- Practice: deploy your RAG app with a demo UI {#5}
Sources: [FastAPI docs](https://fastapi.tiangolo.com/), [Gradio guides](https://www.gradio.app/guides), [vLLM docs](https://docs.vllm.ai/en/latest/)

### Session 9.6.4 — MLOps fundamentals
> Outcomes: Track experiments, version models and monitor them in production.
- The ML lifecycle in production {#1}
- Experiment tracking and model registry (MLflow) {#2}
- Data and model drift monitoring {#3}
- Practice: track your fine-tuning runs with MLflow {#4}
Sources: [MLflow docs](https://mlflow.org/docs/latest/), [ml-ops.org](https://ml-ops.org/)

### Session 9.6.5 — Security for AI applications
> Outcomes: Defend AI apps against prompt injection, data leakage and excessive agency.
- OWASP Top 10 for LLM applications {#1}
- Prompt injection (direct and indirect) {#2}
- Data leakage and PII handling {#3}
- Excessive agency and tool permissions {#4}
- Practice: red-team your own chatbot {#5}
Sources: [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/), [Claude Developer Platform docs](https://platform.claude.com/docs/en/home)

# Track 10 — Senior Engineer Skills

## Module 10.1 — Thinking like a senior

### Session 10.1.1 — Systems thinking
> Outcomes: See software, teams and organisations as systems with feedback loops and second-order effects.
- Stocks, flows and feedback loops {#1}
- Second-order effects and unintended consequences {#2}
- Conway's law and socio-technical systems {#3}
- Practice: map the feedback loops of an incident {#4}
Sources: [Google SRE Book](https://sre.google/sre-book/table-of-contents/), [Martin Fowler — Conway's Law](https://martinfowler.com/bliki/ConwaysLaw.html), [lethain.com](https://lethain.com/)

### Session 10.1.2 — Architecture trade-offs and decision making
> Outcomes: Make and communicate technical decisions with explicit trade-offs.
- Reversible vs irreversible decisions {#1}
- Trade-off analysis and decision matrices {#2}
- Build vs buy {#3}
- Practice: an ADR for a real trade-off you faced {#4}
Sources: [Architecture Decision Records](https://adr.github.io/), [Martin Fowler — Software Architecture Guide](https://martinfowler.com/architecture/), [StaffEng](https://staffeng.com/guides/)

### Session 10.1.3 — Managing technical debt
> Outcomes: Identify, prioritise and pay down technical debt strategically.
- Kinds of technical debt {#1}
- Measuring and communicating debt {#2}
- Incremental modernisation (strangler fig) {#3}
- Practice: a technical debt register for a project {#4}
Sources: [Martin Fowler — Technical Debt](https://martinfowler.com/bliki/TechnicalDebt.html), [Martin Fowler — Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html)

## Module 10.2 — Ownership

### Session 10.2.1 — End-to-end ownership and product mindset
> Outcomes: Own features from problem to production metrics, thinking like a product engineer.
- Understanding users and business goals {#1}
- Defining success metrics {#2}
- Shipping, measuring and iterating {#3}
- Practice: define metrics for a YouCanDoIt feature and review them after release {#4}
Sources: [The Pragmatic Engineer](https://blog.pragmaticengineer.com/), [StaffEng](https://staffeng.com/guides/)

### Session 10.2.2 — Working with ambiguity
> Outcomes: Turn vague problems into clear plans and make progress without full information.
- Framing problems and asking the right questions {#1}
- Spikes and prototypes {#2}
- Writing a one-page proposal {#3}
- Practice: write a proposal for an ambiguous feature request {#4}
Sources: [StaffEng](https://staffeng.com/guides/), [lethain.com](https://lethain.com/)

## Module 10.3 — Working with people

### Session 10.3.1 — Mentoring and teaching
> Outcomes: Help other engineers grow through mentoring, pairing and knowledge sharing.
- Mentoring vs coaching vs sponsoring {#1}
- Pair programming {#2}
- Giving feedback {#3}
- Practice: mentor a junior or write a tutorial {#4}
Sources: [StaffEng](https://staffeng.com/guides/), [Google Engineering Practices](https://google.github.io/eng-practices/)

### Session 10.3.2 — Cross-team collaboration and influence
> Outcomes: Drive alignment across teams without formal authority.
- Stakeholder mapping {#1}
- Building trust and influence {#2}
- Running effective meetings and async communication {#3}
- Practice: lead a cross-team decision in writing {#4}
Sources: [StaffEng](https://staffeng.com/guides/), [lethain.com](https://lethain.com/)

### Session 10.3.3 — Communicating as a senior engineer
> Outcomes: Write design docs, RFCs and postmortems and present technical ideas clearly.
- Writing for decision makers {#1}
- Design docs and RFC process {#2}
- Presenting to technical and non-technical audiences {#3}
- Practice: present your YouCanDoIt architecture in 10 minutes {#4}
Sources: [Google Tech Writing](https://developers.google.com/tech-writing), [Write the Docs](https://www.writethedocs.org/guide/)

## Module 10.4 — Career

### Session 10.4.1 — Technical interviews
> Outcomes: Prepare for coding, system design and behavioural interviews.
- Coding interviews: patterns and communication {#1}
- System design interviews {#2}
- Behavioural interviews and the STAR method {#3}
- Practice: three mock interviews {#4}
Sources: [Tech Interview Handbook](https://www.techinterviewhandbook.org/), [System Design Primer](https://github.com/donnemartin/system-design-primer), [NeetCode Roadmap](https://neetcode.io/roadmap)

### Session 10.4.2 — Portfolio and professional presence
> Outcomes: Present your work so recruiters and engineers see your level.
- Portfolio projects that show senior skills {#1}
- READMEs, demos and write-ups {#2}
- Writing and speaking publicly {#3}
- Practice: publish a write-up about YouCanDoIt {#4}
Sources: [Open Source Guides](https://opensource.guide/), [The Pragmatic Engineer](https://blog.pragmaticengineer.com/)

### Session 10.4.3 — Growing to senior and beyond
> Outcomes: Plan your growth along the engineering ladder towards senior and staff.
- Career ladders and expectations {#1}
- Staff archetypes: tech lead, architect, solver, right hand {#2}
- Building a brag document {#3}
- Practice: write your one-year growth plan {#4}
Sources: [StaffEng](https://staffeng.com/guides/), [lethain.com](https://lethain.com/)

# Track 11 — Capstone Projects

## Module 11.1 — Portfolio builds

### Session 11.1.1 — Python data analysis project
> Outcomes: Ship a complete data analysis on a public dataset with clean, tested Python.
- Choose a dataset and questions {#1}
- Clean and explore with pandas {#2}
- Visualise and write conclusions {#3}
- Package, test and publish the repository {#4}
Sources: [pandas — Getting started](https://pandas.pydata.org/docs/getting_started/index.html), [AI Engineer Roadmap (Resources)](https://roadmap.sh/ai-engineer)

### Session 11.1.2 — Data structures and algorithms library
> Outcomes: Publish a tested library of the data structures and algorithms from Track 1.
- Implement core structures with type hints {#1}
- Property-based and unit tests {#2}
- Benchmarks and complexity notes {#3}
- Documentation site {#4}
Sources: [Open Data Structures](https://opendatastructures.org/), [pytest docs](https://docs.pytest.org/en/stable/)

### Session 11.1.3 — Production-grade REST API
> Outcomes: Build a FastAPI + PostgreSQL service with auth, migrations and tests.
- Domain model and API design {#1}
- Persistence with SQLAlchemy and Alembic {#2}
- Authentication with 2FA {#3}
- Test suite and OpenAPI docs {#4}
Sources: [FastAPI docs](https://fastapi.tiangolo.com/), [SQLAlchemy 2.0 docs](https://docs.sqlalchemy.org/en/20/)

### Session 11.1.4 — Ship it: containers, CI/CD, IaC and Kubernetes
> Outcomes: Deliver the API with Docker, GitHub Actions, Terraform and Kubernetes.
- Multi-stage Docker image {#1}
- CI pipeline with tests and scanning {#2}
- Infrastructure with Terraform {#3}
- Deployment to Kubernetes with Helm {#4}
Sources: [Docker — Get started](https://docs.docker.com/get-started/), [GitHub Actions docs](https://docs.github.com/en/actions), [Kubernetes docs](https://kubernetes.io/docs/home/)

### Session 11.1.5 — Observe and harden
> Outcomes: Add observability and security hardening to your API.
- Logs, metrics, traces and Sentry {#1}
- SLOs and alerts {#2}
- OWASP review and fixes {#3}
- GDPR data export and deletion {#4}
Sources: [OpenTelemetry docs](https://opentelemetry.io/docs/), [OWASP Top 10](https://top10.owasp.org/)

### Session 11.1.6 — Machine learning model
> Outcomes: Train, evaluate and serve a regression or classification model.
- Problem framing and data {#1}
- Pipeline and evaluation {#2}
- Serve the model behind an API {#3}
Sources: [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html), [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course)

### Session 11.1.7 — Neural network and tiny GPT
> Outcomes: Train a neural network and a small language model and track the loss.
- Micrograd network {#1}
- PyTorch training with loss tracking {#2}
- Tiny GPT trained on your corpus {#3}
Sources: [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html), [PyTorch tutorials](https://docs.pytorch.org/tutorials/)

### Session 11.1.8 — Fine-tune a small model
> Outcomes: Fine-tune and evaluate a small open model for a narrow task.
- Dataset preparation {#1}
- LoRA fine-tuning {#2}
- Before/after evaluation {#3}
- Publish on the Hugging Face Hub {#4}
Sources: [Hugging Face smol-course](https://github.com/huggingface/smol-course), [Hugging Face PEFT](https://huggingface.co/docs/peft/index)

### Session 11.1.9 — RAG chatbot for your documents
> Outcomes: Build and evaluate a RAG chatbot over your own documents.
- Ingestion with OCR {#1}
- Retrieval with reranking {#2}
- Cited answers and memory {#3}
- Evaluation with Ragas {#4}
Sources: [LlamaIndex docs](https://developers.llamaindex.ai/python/framework/), [Ragas docs](https://docs.ragas.io/)

### Session 11.1.10 — Tool-using agent with MCP
> Outcomes: Build an agent that uses tools through MCP with tracing and guardrails.
- MCP server for your data {#1}
- Agent loop with tools {#2}
- Guardrails and approval {#3}
- Tracing and evals {#4}
Sources: [Model Context Protocol](https://modelcontextprotocol.io/), [Hugging Face Agents Course](https://huggingface.co/learn/agents-course)

### Session 11.1.11 — Evaluate and deploy your AI app
> Outcomes: Put an AI app into production with evals, monitoring and a public demo.
- Eval suite in CI {#1}
- Deployment with monitoring and cost tracking {#2}
- Public demo and write-up {#3}
Sources: [Hugging Face Evaluate](https://huggingface.co/docs/evaluate/index), [Gradio guides](https://www.gradio.app/guides)

### Session 11.1.12 — Flagship: YouCanDoIt
> Outcomes: Grow this platform into a senior-level portfolio piece.
- Full lessons with diagrams and quizzes {#1}
- Spaced-repetition reviews {#2}
- Optional: port RAG from pgvector to Qdrant and compare speed, filtering and setup {#3}
- Auth, multi-user and public deployment {#4}
- Architecture write-up and demo video {#5}
Sources: [Next.js docs](https://nextjs.org/docs), [FastAPI docs](https://fastapi.tiangolo.com/), [Qdrant docs](https://qdrant.tech/documentation/)

### Session 11.1.13 — Open-source contribution
> Outcomes: Land a meaningful contribution to an open-source project you use.
- Choose a project and issue {#1}
- Discuss, implement and test {#2}
- Respond to review and get it merged {#3}
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
- Languages: [Python](https://docs.python.org/3/) · [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html) · [Java](https://docs.oracle.com/en/java/javase/)
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
