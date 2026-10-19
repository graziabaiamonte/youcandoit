# Design system — three themes

Based on the references in `ui_design.md` and the screenshots in this folder. All values are CSS tokens in
`apps/web/app/globals.css`, one `[data-theme="…"]` block per theme (set on `<html>` by next-themes,
saved under the `ycdi-theme` key). The theme menu (palette icon, top right of the header) switches
between them. Components never use raw hex.

| Theme | Source | Mode | Background | Card | Text | Primary |
|---|---|---|---|---|---|---|
| **Plum** (default) | gamified-app screenshots, SCALEN | dark | `#160f1f` | `#221a2e` | `#f5f0fa` | lavender `#b8a4ff` |
| **Midnight** | Ronas IT "Course Connect" | dark | `#0e0f13` | `#17191f` | `#f2f4f8` | electric blue `#6b93ff` |
| **Campus** | uniroma5.it | light | warm `#f6f5f2` | `#ffffff` | navy `#18233e` | navy `#18233e` |

- Plum and Midnight share `color-scheme: dark`, the pastel `--track-1…12` and `--surface-tint: 22%`.
  Tailwind's `dark:` variant matches both. Campus uses saturated 700/800 tracks and a 16% tint.
- Other tokens in each block: `muted`/`secondary`, `muted-foreground`, `accent`, `border`/`input`, `glow`
  (radial backdrop), `xp`, `streak`, `success`, `destructive`, and `sidebar-*`.
- Libraries that only know light/dark (Mermaid, React Flow) get it from `isDarkTheme()` in
  `components/theme-toggle.tsx`.

Contrast rules (WCAG 2.2 AA): text ≥ 4.5:1, large text and UI parts ≥ 3:1. Every pair is checked in all
three themes: foreground and muted text on background, card and muted; primary; xp, streak, success and
destructive on card; `text-track` on card and on `.surface-track` (≥ 5.2:1); badge text on `bg-track`
(≥ 6.7:1). The lowest ratio is muted text on muted at 5.3:1 (Campus).

To add a theme: add an `id` to `THEMES` in `components/theme-toggle.tsx`, add a `[data-theme="id"]`
block with every token, add it to the `dark` custom variant if it is dark, and re-run the contrast check.

## Track surfaces

Set `style={{ "--track": trackColor(id) }}` on an element, then:
- `.surface-track` is the pastel card: a 135° gradient of the track over `card` (`--surface-tint`: 16%
  light, 22% dark). Text on it stays `foreground`.
- `text-track`, `bg-track`, `border-track` are for accents. `<ProgressRing percent />` draws a circle in
  the track colour.

## Type

| Role | Font | Size |
|---|---|---|
| Display (h1, h2, h3, hero card titles) | Unbounded, `font-heading` | h1 `text-3xl`, section h2 `text-lg`, hero `text-2xl` |
| Body / UI | Inter, `font-sans` | `text-sm`–`text-base`, `leading-relaxed` for reading |
| Ids, counters, XP | JetBrains Mono, `font-mono` + `tabular-nums` | `text-xs`–`text-2xl` |

Lesson prose (`.prose`) keeps Inter for its headings, because a wide display face tires the eye in long text.

## Shape and spacing

- `--radius: 1rem`. Cards `rounded-xl`; hero and track cards `rounded-2xl`/`rounded-3xl`; chips, badges,
  primary CTAs and the sidebar nav use `rounded-full`.
- Tailwind 4px spacing scale. Card padding `p-4` (dense) or `p-6` (headers); section gap `space-y-6`/`space-y-8`.
- Content column `max-w-5xl`; 16px gutter on mobile (`px-4`), 32px from `md`.

## Interaction

- Focus: shadcn's `ring-ring/50` ring is always visible; never remove the outline.
- Hit targets ≥ 32px (24px minimum per WCAG 2.5.8).
- Motion: short (150–250ms) and only for state changes. `prefers-reduced-motion` turns off all animation
  (global rule in globals.css).
- Status is never shown by colour alone: icons plus labels (`aria-label="Completed"` and so on).
- Card types (lesson callouts, session outcomes) differ by background tint (`bg-<colour>/12`) and an icon in a
  round chip (`bg-<colour>/24`), never by a coloured side border.

## Do / don't

- Do use tokens (`bg-card`, `text-muted-foreground`, `text-track`). Don't use raw hex or palette classes
  (`text-purple-500`) in TSX.
- Do reuse `components/ui/*` (shadcn) and `ProgressRing`. Don't make one-off variants.
- Do add a new colour to all three theme blocks and re-run the contrast check.
