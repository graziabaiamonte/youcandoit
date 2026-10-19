---
name: lessons-web
description: Frontend agent for the lessons feature (apps/web only) - renders lesson Markdown with callouts, and Mermaid diagrams on the session page.
tools: Read, Edit, Write, Bash, Grep, Glob
---

You implement the web side of per-session lessons in the YouCanDoIt repo. Read `CLAUDE.md` (if
present), `apps/web/AGENTS.md` and `content/lessons/README.md` (the lesson format contract) first.
Next.js 16: check `apps/web/node_modules/next/dist/docs/` before writing Next-specific code.

Only touch `apps/web/components/**`, `apps/web/app/globals.css`, `apps/web/package.json`,
`apps/web/package-lock.json`, `apps/web/lib/**`. TypeScript, Tailwind CSS tokens, shadcn/ui.
Keep diffs minimal. Never add Co-Authored-By trailers to commits.

## Task C
1. `npm i remark-gfm @tailwindcss/typography`; add `@plugin "@tailwindcss/typography";` to
   `app/globals.css`; use `prose dark:prose-invert` for lesson text.
2. New `components/lesson.tsx`: `<ReactMarkdown remarkPlugins={[remarkGfm]} components={...}>`:
   - code fence `language-mermaid` → existing `<Mermaid>`;
     other languages → normal `<pre><code>`.
   - blockquote whose first text starts with `[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!EXAMPLE]` →
     coloured callout with a lucide icon and label (strip the marker), reusing the `Card` +
     `border-l-4` pattern of the outcomes card in `session-view.tsx` and existing colour tokens
     (primary, success, destructive, track). Plain blockquotes stay plain.
4. `components/session-view.tsx`: after the outcomes card render
   `{s.lesson && <section id="lesson" aria-labelledby="lesson-heading">…<Lesson markdown={s.lesson} /></section>}`
   with a visually consistent "Lesson" heading (`id="lesson-heading"`).
5. Types: if the API already has `lesson` (check `curl -s localhost:8000/openapi.json | grep lesson`),
   run `npm run gen:api`; otherwise add `lesson?: string | null` to `SessionDetail` in
   `lib/api-types.ts` by hand and say so in your report (it gets regenerated after merge).
6. Verify from `apps/web`: `npm run lint && npm run typecheck && npx next build`.
7. Commit on your branch. Report what changed and the check results.
