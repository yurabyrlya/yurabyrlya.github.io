# CV Site: Style Guide for LLMs and Contributors

Read this whole file **before** changing anything in this folder. It's the single source of truth for structure, content rules and visual style. Keep changes consistent with it, and update this guide in the same change if you deliberately change a rule.

---

## 1. What this is

An interactive, single-page CV for **Iuri Birlea, Senior Software Engineer**.

| Feature | Where |
|---|---|
| Recruiter quick summary (LinkedIn, highlights, stack, 3 actions) | Sidebar card, `renderSummary()` |
| Search and skill filter | Sidebar panel, `renderSkills()` and `matches()` |
| Work history grouped by **company · product**, newest first | `renderList()` |
| STAR story for every milestone (expandable) | `starHTML()` |
| Copy summary · **Copy for LLM** (full CV as Markdown) · **Print / PDF** | `App.copySummary`, `App.copyMarkdown`, `window.print()` |
| Text-only print CV | `#print-cv`, `renderPrint()`, print CSS in `theme.css` |
| Dark mode, mobile-first responsive layout | `App.toggleDark`, Tailwind breakpoints |

**Stack:** plain HTML, the Tailwind **Play CDN** (no build step) and vanilla JavaScript. Opening `index.html` in a browser is the whole "run" step. Don't add frameworks, bundlers, npm packages or extra CDNs.

---

## 2. Folder structure

```
iuri-birlea-cv/
├── index.html          # Page shell: <head>, header, layout containers, script tags. No CV content.
├── assets/
│   ├── css/theme.css   # Design tokens (CSS variables), small global rules, PRINT styles.
│   └── js/
│       ├── data.js     # ALL CV content (window.CV). The only file to edit for content changes.
│       └── app.js      # Rendering and behaviour. Reads window.CV; never hard-codes CV facts.
├── STYLE-GUIDE.md      # This file.
├── AGENTS.md           # Short pointer for AI tools; points here.
└── README.md           # CV summary shown on the GitHub repo page. Generated from data.js; keep it in step when content changes.
```

**Rules:**
- **Content** changes go in `data.js` only.
- **Behaviour or layout** changes go in `app.js` and `index.html`.
- **Colours, fonts, radius and print** changes go in `theme.css`.
- Don't create new files unless a new *kind* of thing is needed. If you do, add it to this tree.
- Script order matters: `data.js` must load before `app.js`.

---

## 3. Data model (`assets/js/data.js`)

`window.CV` has exactly these keys: `person`, `metrics`, `eras`, `skills`, `milestones`, `growth`.

### 3.1 `person`
| Field | Type | Rule |
|---|---|---|
| `name`, `title`, `location` | string | Plain text |
| `company` | string | Career line: **"Utilita (Web Development, 2022–23) → Procode (2023–), building Utilita products"** |
| `since` | string | e.g. `"since 2023"` (shown as "Senior Software Engineer (since 2023)") |
| `linkedin` | URL | The **only** external link allowed on the page |
| `tagline` | string | One sentence, about 15 words or fewer |
| `highlights` | `{icon, strong, text}[]` | **Exactly 4.** `strong` is the number or headline; `text` finishes the sentence |
| `shortSummary` | string | One line, used by "Copy summary" (LinkedIn is added automatically) |
| `stack` | string[] | Core technologies, the most important first, at most about 16 |

### 3.2 `metrics`
`{ value, label, note }[]`, the headline numbers used in print and Markdown. `note` shows the working or the source (e.g. `"Pay by Bank · 214,567 payments/month × £2"`).

### 3.3 `eras`: one per **company · product** group
```js
{ id: "mu4", company: "Procode", product: "MyUtilita v4 (Utilita product)",
  role: "Senior Software Engineer", period: "2025 – 2026", color: "indigo", section: "experience" }
```
- `section`: `"experience"` (main career) or `"project"` (separate projects, such as Cosmetrics AI, listed after experience).
- **Array order is display order**, so keep the newest first within each section.
- `color` must be a key of `ERA` in `app.js`: `emerald`, `indigo`, `violet`, `sky` or `pink`. To use a new colour, add it to `ERA` with **full class names** (Tailwind can't see class names built from pieces).
- **Company vs product naming (important):**
  - **Companies:** Utilita (2022-07 → 2023-11, Web Development team), then **Procode** (2023-11 →).
  - **Products:** *My Utilita* (MU3) and *MyUtilita v4* (MU4 / EA4) are **Utilita products built at Procode**. Never present them as companies. Write `"My Utilita (Utilita product)"`.
  - **Auth** is a team or workstream at Procode (authorization: APIM, OPA). Label it just **"Auth"**.
  - **Cosmetrics AI** is a separate project (`section: "project"`), with the role **Product Developer**.

### 3.4 `skills`
The filter list, as strings. Every tag used in `milestones[].tags` **must** be in `skills`, and every skill should be used by at least one milestone. Keep the casing exactly the same (`"CI/CD"`, `"OPA"`, `"Go"`).

### 3.5 `milestones`: one card each
```js
{ id: "authz-lab", date: "2026-11", era: "pc", who: "I", type: "build", icon: "🧪",
  title: "Central authorization R&D in Go + OPA",
  oneLiner: "Found the design's breaking point, then rebuilt it: 30M users at ~1.5 ms.",
  metric: { value: "30M", label: "users at ~1.5 ms/check" },   // or null
  tags: ["Go", "OPA", "Security", "Azure"],
  star: { s: "…", t: "…", a: ["…", "…"], r: ["…", "…"] } }
```
| Field | Rule |
|---|---|
| `id` | Unique, kebab-case, stable (it's used as the `#m-<id>` anchor) |
| `date` | `YYYY-MM` (the delivery or go-live month) |
| `era` | An existing `eras[].id` |
| `who` | `"I"` (my work) or `"We"` (team work I was part of) |
| `type` | One of `build`, `launch`, `security`, `decision`, `people`, `ops` (metadata only) |
| `icon` | **One** emoji |
| `title` | About 6 words or fewer, starts with a verb or noun, no full stop |
| `oneLiner` | One sentence, about 18 words or fewer |
| `metric` | The single strongest number, or `null`. `value` is short (`"£5.1M"`, `"23/23"`, `"0"`) |
| `tags` | 2–5 entries from `skills` |
| `star.s` / `star.t` | One sentence each |
| `star.a` | 3–5 bullets: what **I** did, starting with a verb |
| `star.r` | 1–3 bullets: outcomes, with numbers where possible |

### 3.6 `growth`
`{ id, title, lesson }[]`: honest mistakes and the lesson applied (3 is ideal).

---

## 4. Writing rules (content)

1. **Plain English** that both technical and non-technical readers can follow. Explain jargon on first use, or avoid it.
2. **Results first, with numbers.** Mark estimates with `≈` or `~`, and say how a number was worked out in `metrics[].note`.
3. **"I" vs "We":** be truthful about ownership. Don't overclaim. For example, on Cosmetrics the AI models already existed, and the work was integrating them.
4. **Privacy:**
   - No other people's names (use roles, like "the Product Owner").
   - No ticket IDs (Jira etc.) and no internal URLs.
   - LinkedIn is the only link.
   - No secrets, emails or phone numbers unless the owner adds them.
5. **British English** spelling and dates (`Nov 2026`, `£`).
6. **Consistent numbers.** The same fact must have the same number everywhere (`highlights`, `metrics`, STAR text). Key facts:
   - Pay by Bank: ≈ £5.1M a year (214,567 payments a month × £2), at 100% of customers by 11 Apr 2025.
   - 2FA: 100% of customers (1M accounts), with only 60 support contacts.
   - Authorization R&D: 30M users at ~1.5 ms per check, ~16k checks/s per copy.
   - Cosmetrics: 23/23 requirements met (v1.0), 8/8 acceptance tests passed (v2.0).
7. Keep punctuation simple: use `:` or `;`, not long dash chains. Existing `→` arrows for progressions are fine.

**Source of truth:**
- `docs/history/WORK-HISTORY.md` and `docs/history/STAR-STORIES.md` (in the original research repo).
- If they disagree with this site, ask the owner. Don't guess.

---

## 5. Visual style (professional theme)

| Token | Value | Use |
|---|---|---|
| `--accent` | indigo-600 (`79 70 229`), dark: indigo-400 | Links, primary button, active chips, metric numbers |
| `--accent-soft` | indigo-50, dark: indigo-950 | Recruiter card background |
| `--radius` | `14px` | Cards and panels: `rounded-[var(--radius)]` |
| Fonts | Inter (UI), JetBrains Mono (dates, metrics, periods) | `font-sans` / `font-mono` |

**Use Tailwind classes:**
- Accent: `text-accent`, `bg-accent`, `bg-accentsoft`, `border-accent/30`, `ring-accent/40`.
- Neutrals: only the `slate` palette.
- **Dark mode:** every colour class needs a `dark:` pair (`bg-white dark:bg-slate-950`, `text-slate-600 dark:text-slate-400`, `border-slate-200 dark:border-slate-800`).
- Don't add a second accent colour. Era colours are **only** for the small dot and product label in group headings.

**Type scale:**

| Element | Classes |
|---|---|
| Name | `text-2xl font-extrabold` |
| Group headings | `text-base font-bold` |
| Card titles | `font-semibold` |
| Body | `text-sm` |
| Meta | `text-xs` / `font-mono text-xs text-slate-400` |
| Section labels | `text-xs font-semibold uppercase tracking-widest` |

**Spacing:**
- Cards: `p-4 sm:p-5`.
- Space between cards: `space-y-3`.
- Space between groups: `space-y-10`.
- Page padding: `px-4 sm:px-6`.

**Components (reuse; don't reinvent):**
- Card, the STAR block, skill chips, primary / outline / neutral buttons and the toast are all defined in `app.js`.
- Copy their class lists when adding similar UI.

### 5.1 Mobile-first rules
- Write the mobile classes first, then add `sm:` (640px) and `lg:` (1024px). The two-column layout starts at `lg`.
- **Touch targets of at least 44px** (`h-11`, `min-h-[2.75rem]`) for buttons, links, `summary` and the header icons.
- **No horizontal page scroll at 375px.** Grid columns use `minmax(0,1fr)`, and grid children that contain scrolling rows need `min-w-0`.
- On mobile, skills are a horizontally scrolling row of chips (`overflow-x-auto no-scrollbar`). On `lg` and up they're a vertical list with frequency bars.
- Inputs use `text-base` on mobile (so iOS doesn't zoom) and `sm:text-sm` on larger screens.
- Don't put anything behind hover only. Everything must work by tap.
- Respect `env(safe-area-inset-*)` for fixed elements (see the toast).

### 5.2 Accessibility
- Semantic structure: one `h1` (the name, in the recruiter card), `h2` for groups, `h3` for cards.
- `aria-pressed` on toggle chips, `aria-live` on the results status, a skip link, and `aria-label` on icon-only buttons.
- Colour contrast at least WCAG AA in both themes. Honour `prefers-reduced-motion` (already in `theme.css`).

### 5.3 Print
- Printing shows **only** `#print-cv`: plain black text on A4, in Arial at 9.5pt, with no colours, chips, cards or emoji.
- Sections, in this order: **Profile, Key results, Skills, Experience, Separate project, Lessons learned**.
- Experience is grouped by company · product with its period, then one line per milestone, then a `Result:` line and its `[tags]`.
- Print is generated from `data.js`, so new content appears automatically. Never hand-write print HTML.

### 5.4 Copy for LLM (Markdown)
- `App.markdown()` must stay **lossless**: every milestone with its full STAR story and tags, plus person, metrics, skills, eras and growth.
- Heading levels:

  | Heading | Content |
  |---|---|
  | `#` | Name |
  | `##` | Sections |
  | `###` | Company · product (period) |
  | `####` | Milestone |

- If you add a field to the data model that a reader would need, add it to `markdown()` and `renderPrint()` too.

---

## 6. Code rules (`app.js`)

- One IIFE; the only global it exposes is `window.App`. Keep it framework-free.
- **Always escape** data with `esc()` before inserting it into HTML (`hl()` escapes as well as highlighting).
- Render functions are pure "data → innerHTML": `renderHeader`, `renderSummary`, `renderSkills`, `renderList`, `renderLessons` and `renderPrint`. State lives only in `state` (`q`, `skills`).
- Tailwind class names must appear **in full** in the source (no `'bg-' + color`).
- Keep comments short, and only where they explain *why*.

---

## 7. Recipes

**Add a milestone**
1. Add an object to `milestones` in `data.js`, following 3.5. Order in the array doesn't matter; it's sorted by date.
2. Use an existing `era`. Make sure every tag is in `skills`, and add new skills if needed.
3. If it's a headline result, consider updating `person.highlights` (keep exactly 4) and `metrics`.

**Add a new job or product group:** add an `eras` entry in the right position (newest first) with an existing `color`, then add its milestones.

**Add a separate project:** add an era with `section: "project"`. It appears under "Separate project" on screen, in print and in Markdown.

**Change the accent colour:** edit `--accent` / `--accent-soft` (and the `.dark` values) in `theme.css`, plus `<meta name="theme-color">` in `index.html`.

---

## 8. Definition of done (check before finishing)

1. Open `index.html` and check the browser console has **no errors**.
2. At **375px wide**: no horizontal page scroll, every button tappable, cards readable.
3. At **1280px wide**: sidebar on the left, list on the right, sidebar stays in view.
4. Search for a word from a STAR action, and confirm the card appears with its STAR story open. A skill chip filters the list, and "Clear" resets it.
5. Dark mode toggles and remembers your choice after a reload.
6. **Print preview** shows only the text CV, in the section order from 5.3, with the new content included.
7. **Copy for LLM** output contains the new content, with valid Markdown headings.
8. Content passes the writing rules in section 4 (privacy, plain English, consistent numbers, company vs product naming).
9. If you changed a rule, update this guide.

## 9. Don'ts

- Don't add a build step, a framework, analytics, trackers or extra CDNs.
- Don't hard-code CV facts in `app.js` or `index.html`.
- Don't add links other than LinkedIn, or other people's names or ticket IDs.
- Don't present My Utilita or MyUtilita v4 as companies.
- Don't break print or Markdown output when changing the screen layout.
