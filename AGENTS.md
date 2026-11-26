# Agent instructions

This repo **is** the live site at https://yurabyrlya.github.io/. It's a static, single-page CV: plain HTML, the Tailwind Play CDN and vanilla JS, with no build step. GitHub Pages publishes `main` from the repo root.

**Read [docs/STYLE-GUIDE.md](./docs/STYLE-GUIDE.md) before changing anything.**

## Where things go

| Change | File |
|---|---|
| CV content (jobs, milestones, STAR stories, skills, numbers) | `content/cv-data.js` **only** |
| Layout and behaviour (search, filters, print, Copy for LLM) | `assets/js/app.js`, `index.html` |
| Colours, fonts, print styles | `assets/css/theme.css` |
| Rules | `docs/STYLE-GUIDE.md` (and `scripts/check.mjs` if the rule can be checked automatically) |
| `README.md` | **Generated.** Never edit it by hand |

## Commands (Node 18+, no install)

```bash
node scripts/check.mjs           # validate content rules
node scripts/readme.mjs          # regenerate README.md from the content
node scripts/readme.mjs --check  # CI: fail if README.md is stale
```

## Must-follow rules

- Plain English with numbers first. Never overclaim ("I" vs "We"), and never invent facts or numbers.
- No other people's names, no ticket IDs, no emails. LinkedIn is the only link.
- Utilita and Procode are the **companies**. My Utilita and MyUtilita v4 are Utilita **products** built at Procode. "Auth" is a Procode team. Cosmetrics AI is a separate project.
- Design mobile first: touch targets of at least 44px, no horizontal scroll at 375px, a `dark:` pair for every colour.
- Print and Copy for LLM are generated from the content. Keep them working.

## Done when

`check.mjs` passes, README is regenerated, the page has no console errors at 1280px and 375px, print preview shows the text CV, and the full checklist in STYLE-GUIDE section 8 is complete.
