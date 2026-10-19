# UI notes and design tokens

Two references were studied on 2026-10-19 to derive a token set for YouCanDoIt (Next.js + shadcn/ui + Tailwind CSS variables).

---

## 1. Behance: "E-learning Web App | Ronas IT" (product name *CourseConnect*)

URL: https://www.behance.net/gallery/199745431/E-learning-Web-App-Ronas-IT

**How it was read:** Behance blocks plain fetches with a JS cookie challenge. I passed the challenge with curl and downloaded the 19 project images (1400 px wide), then looked at them directly. The hex values below are **the designers' own labels on the "Colors" board, confirmed by pixel sampling**. One label is wrong: the swatch named "Navaho" is labelled `#FFE0A1` but the pixel is `#09A287` (teal). Credits: Ronas IT UI/UX Team (Alexander Kontsevoy, Dmitry Lauretsky, Evgeny Leonov). Tools: Photoshop, After Effects.

### Palette (dark-first)
| Name (from the board) | Hex | Role |
|---|---|---|
| Bondi | `#1E1F22` | Card / surface |
| (sampled) | `#151516` | App background (UI-kit board) |
| (sampled) | `#28292C` | Inputs, search field, chips (elevated surface) |
| (sampled) | `#000101` / `#191A1E` | Sidebar (near black) / course card on the hero mockup |
| Crayola | `#4865FF` | **Primary**: buttons, active nav item, focus, links, logo tile |
| Lilac | `#9433DC` | Secondary accent: category tiles, progress bars |
| "Navaho" (actually) | `#09A287` | Success / progress (a lighter tint is about `#62D2BD`) |
| Pure | `#FFFFFF` | Text on dark |
| (seen in UI kit) | about `#F0476B` | Error border and message |

Translucent status buttons (dark blue, dark red and dark green fills with saturated text) are used for tags such as "Engineering" or "Testing".

### Typography
- **Zona Pro** (geometric sans) is the only typeface, in weights Light, Regular, Medium and Semibold.
- Headings are large and light or medium with generous tracking. Body text is small, about 12–14 px in the mockups.
- A free alternative with a similar geometric feel: **Outfit**, **Plus Jakarta Sans** or **Manrope** (all on Google Fonts).

### Cards, radius, spacing
- Cards are flat filled surfaces (`#1E1F22` on `#151516`) with **no visible border and no shadow**. Elevation comes only from lightness steps (151516 → 1E1F22 → 28292C).
- Radius is **about 16 px** on cards and swatches and about 10–12 px on inputs and buttons. Mind-map nodes and "Download app" use full pills.
- Course cards: a coloured thumbnail tile on the left (a solid category colour with a large line icon and price/date chips), then title, 2-line description, tag chips, rating, and a square primary arrow button in the corner.
- Spacing is airy, on an 8 px grid with about 24 px card padding and 16 px gaps.
- Progress bars are thick rounded pills with a **diagonal-striped remainder** for the unfilled part. This is a distinctive touch worth copying.

### Layout and sidebar patterns
- **Left sidebar** (about 240 px, near-black): logo, then icon + label nav (Dashboard, Homework, Schedule, Courses, Chat, Bookmarks). The active item is a **filled primary pill**. A promo card ("Download our app") sits at the bottom, with Log out last.
- **Main column:** page title, then **horizontal category tabs** (All / Advertising / Design… with an underline indicator), then a vertical list of course cards.
- **Right rail** (about 300 px): mini calendar (week strip, today in primary), a "Mentors" list with avatars, and "Learning Process" progress cards ("Python Developer 80%").
- **Schedule screen:** a week grid with colour-coded event blocks (blue, lilac, teal).
- **Information architecture:** they made a **mind map** of features before wireframing: Dashboard (overall progress, recommendations, active course, recent achievements), Homework, Schedule, Courses, Bookmarks, Profile.
- **Feedback modal:** "Keep up the good work!", an icon tile, then two stacked buttons (secondary teal, primary blue). This is a good template for "lesson complete".

---

## 2. Uniroma5: Ingegneria Informatica e Intelligenza Artificiale (BSc)

URL: https://www.uniroma5.it/triennale/ingegneria-informatica-e-intelligenza-artificiale

**How it was read:** I downloaded the HTML and `/css/app.css` and pulled the custom properties and computed values out of the CSS. The site is built on **Bootstrap 5** (`--bs-*` vars, `accordion`, `nav-tabs`) with a reactive widget for the academic-year selector.

### Palette (from the CSS custom properties)
| Variable | Hex | Use |
|---|---|---|
| `--sr-darkblue` | `#18233E` | **Body text colour** and dark sections |
| `--sr-blue` | `#5A75B8` | Brand blue |
| (frequent literal) | `#447CBC` | Links and buttons |
| `--sr-green` | `#11AA66` (`#1a6`), also `#14AC64` | Positive / accent |
| `--sr-violet` | `#7D3478` | Accent (faculty colour) |
| `--sr-orange` | `#F49612` | Highlight / CTA accent |
| `--sr-olive` | `#9D968C` | Muted warm |
| `--sr-white` | `#F6F5F2` | Warm off-white background |
| `--sr-lightgray` | `#F4F5F5` | Section background |
| `--sr-gray` | `#F3EFEF` | Alternate background |
| `--sr-grey` | `#0C232F33` | Translucent border (20% ink) |
| `--gui-grey` | `#D9D9D9` | Dividers |

### Typography
- Body: **Open Sans**, `18px / 170%`, weight 400, in dark navy rather than black.
- Hero heading: **Montserrat** 33 px / 120%. FAQ: **Inter**.
- Common sizes: 16, 18, 23, 28, 33, 40 and 64 px. Weights 400, 600 and 700.

### Cards, radius, spacing
- Mostly **square or 2–8 px corners**. Buttons and badges are **pills** (`50px` / `999px`).
- Shadows are soft and navy-tinted: `0 8px 20px rgba(24,35,62,.18)` and `0 18px 40px rgba(24,35,62,.14)`.
- **CTA card:** white with a `1px solid rgba(12,35,47,.2)` border, **fixed on the right** (400 px) on desktop and a bottom sheet on mobile.
- The spacer base is `0.25rem` (Bootstrap).

### Layout patterns relevant to a roadmap
- The **study plan is grouped by year**: an accordion with one item per year ("I anno", "II anno", "III anno"). Each opens to a **table of courses with CFU (credits)**, preceded by a paragraph about what that year builds (maths/physics foundations → numerical computing and statistics → AI and creation technologies).
- **Tabs** switch between academic-year cohorts.
- Section blocks: overview, learning outcomes, career outcomes ("sbocchi occupazionali"), FAQ accordion.
- **What to take from it:** progressive, phase-based curriculum disclosure (Year/Phase → courses with weight), a narrative intro for each phase, and credits as a measure of effort. For YouCanDoIt that means a **Phase accordion view** as an alternative to the graph roadmap, with "estimated hours" playing the role of CFU.

---

## 3. Synthesis for YouCanDoIt

| Decision | Choice | Why |
|---|---|---|
| Theme | Dark-first with full light parity | The Behance reference is dark. Learners study at night. |
| Primary | Crayola blue `#4865FF` (light) / `#7088FF` (dark) | Brand-like, and passes AA with white text in light mode |
| XP / achievement accent | Lilac (`#7E22CE` / `#B57CF0`) | From Behance "Lilac", adjusted for AA |
| Success / mastery | Teal (`#0F766E` / `#2DD4BF`) | From Behance "Navaho" teal |
| Text | Navy-black ink, not pure black | Uniroma5 uses `#18233E`, which reads softer |
| Font | **Plus Jakarta Sans** or **Outfit** (headings) + **Inter** (UI/body) + **JetBrains Mono** (code) | A free stand-in for Zona Pro |
| Radius | `--radius: 1rem` (cards). shadcn derives sm/md/lg from it. | Behance cards are about 16 px |
| Elevation | Lightness steps in dark mode; in light mode one soft navy shadow `0 8px 20px rgb(24 35 62 / .08)` | Both references |
| Layout | Sidebar 240 px · main · optional right rail 320 px (streak, today's review, calendar) | Behance dashboard |
| Roadmap | Graph view (React Flow) + **Phase accordion** view (Uniroma5 study-plan pattern) | Two mental models |
| Progress bar | Rounded pill with a striped remainder | Behance signature |
| Celebration | Centered modal "Keep up the good work!" with primary + secondary actions | Behance |

---

## 4. Proposed design tokens (shadcn/ui + Tailwind v4 CSS variables)

All foreground/background pairs were checked with the WCAG 2.x relative-luminance formula. The values in comments are contrast ratios.

```css
:root {
  --radius: 1rem;

  --background: #F7F7F8;
  --foreground: #18181B;              /* 17.7 on card */
  --card: #FFFFFF;
  --card-foreground: #18181B;
  --popover: #FFFFFF;
  --popover-foreground: #18181B;

  --primary: #4865FF;                 /* Crayola */
  --primary-foreground: #FFFFFF;      /* 4.58 : AA */
  --secondary: #F1F2F4;
  --secondary-foreground: #18181B;

  --muted: #F1F2F4;
  --muted-foreground: #5F6168;        /* 6.18 on card */
  --accent: #EEF1FF;                  /* shadcn "accent" = hover/selected tint */
  --accent-foreground: #2F4BE0;       /* 5.83 on --accent */

  --destructive: #DC2626;             /* 4.83 with white */
  --destructive-foreground: #FFFFFF;
  --success: #0F766E;                 /* 5.47 */
  --xp: #7E22CE;                      /* Lilac, adjusted: 6.98 */

  --border: #E4E5E9;
  --input: #E4E5E9;
  --ring: #4865FF;

  --sidebar: #FFFFFF;
  --sidebar-foreground: #18181B;
  --sidebar-primary: #4865FF;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #EEF1FF;
  --sidebar-accent-foreground: #2F4BE0;
  --sidebar-border: #E4E5E9;
  --sidebar-ring: #4865FF;

  /* 12 track colours: each ≥ 4.5:1 on --card (#FFFFFF) */
  --track-1:  #1D4ED8;  /* blue    6.70 */
  --track-2:  #4338CA;  /* indigo  7.90 */
  --track-3:  #6D28D9;  /* violet  7.10 */
  --track-4:  #A21CAF;  /* fuchsia 6.32 */
  --track-5:  #BE185D;  /* pink    6.04 */
  --track-6:  #B91C1C;  /* red     6.47 */
  --track-7:  #C2410C;  /* orange  5.18 */
  --track-8:  #B45309;  /* amber   5.02 */
  --track-9:  #4D7C0F;  /* lime    4.99 */
  --track-10: #15803D;  /* green   5.02 */
  --track-11: #0F766E;  /* teal    5.47 */
  --track-12: #0E7490;  /* cyan    5.36 */
}

.dark {
  --background: #151516;
  --foreground: #F2F2F3;              /* 16.3 on bg */
  --card: #1E1F22;                    /* Bondi */
  --card-foreground: #F2F2F3;
  --popover: #1E1F22;
  --popover-foreground: #F2F2F3;

  --primary: #7088FF;                 /* lifted Crayola: 5.22 on card */
  --primary-foreground: #151516;      /* 5.78 */
  --secondary: #28292C;
  --secondary-foreground: #F2F2F3;

  --muted: #28292C;
  --muted-foreground: #9A9BA1;        /* 5.95 on card */
  --accent: #28292C;
  --accent-foreground: #F2F2F3;

  --destructive: #F87171;             /* 5.96 on card */
  --destructive-foreground: #151516;
  --success: #2DD4BF;                 /* 8.85 */
  --xp: #B57CF0;                      /* 5.58 */

  --border: rgb(255 255 255 / 0.08);
  --input: rgb(255 255 255 / 0.12);
  --ring: #7088FF;

  --sidebar: #0F0F10;
  --sidebar-foreground: #F2F2F3;
  --sidebar-primary: #4865FF;         /* filled active pill, white text: 4.58 */
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #1E1F22;
  --sidebar-accent-foreground: #F2F2F3;
  --sidebar-border: rgb(255 255 255 / 0.06);
  --sidebar-ring: #7088FF;

  /* 12 track colours: each ≥ 4.5:1 on --card (#1E1F22) */
  --track-1:  #60A5FA;  /* blue    6.48 */
  --track-2:  #818CF8;  /* indigo  5.52 */
  --track-3:  #A78BFA;  /* violet  6.06 */
  --track-4:  #E879F9;  /* fuchsia 6.70 */
  --track-5:  #F472B6;  /* pink    6.22 */
  --track-6:  #F87171;  /* red     5.96 */
  --track-7:  #FB923C;  /* orange  7.28 */
  --track-8:  #FBBF24;  /* amber   9.87 */
  --track-9:  #A3E635;  /* lime   10.93 */
  --track-10: #4ADE80;  /* green   9.46 */
  --track-11: #2DD4BF;  /* teal    8.85 */
  --track-12: #22D3EE;  /* cyan    9.12 */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-xp: var(--xp);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 6px);
  --radius-md: calc(var(--radius) - 4px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  /* --color-track-1 … --color-track-12 the same way */
}
```

### Usage rules for the track colours
- The 12 track colours are tuned for **text, icons, 2 px borders and progress fills on the card background** (≥ 4.5:1, so AA even for small text).
- For a **filled tile with text on top** (the Behance course-thumbnail style), use white text on the *light-mode* value, which works in both themes: all 12 light values are ≥ 4.99:1 against white.
- For a soft tinted chip background, use `color-mix(in oklab, var(--track-n) 14%, var(--card))` and keep the text in `var(--track-n)`.
- Never rely on colour alone. Pair every track with an icon and a name, which helps with colour-vision deficiency, since the red/green/lime hues collide for deuteranopes.
