# Iuri Birlea: Interactive CV

A single-page, interactive CV with a recruiter summary, search, a skill filter, STAR stories, dark mode, a text-only print version, and a **Copy for LLM** button that copies the whole CV as Markdown.

## View it

Open `index.html` in a browser. There's nothing to install or build. The page needs an internet connection for the Tailwind CDN and Google Fonts.

## Update the content

Edit **`assets/js/data.js`** only. The rules for each field and the writing style are in [STYLE-GUIDE.md](./STYLE-GUIDE.md).

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Page shell and layout containers |
| `assets/js/data.js` | All CV content |
| `assets/js/app.js` | Rendering, search and filter, print CV, Markdown export |
| `assets/css/theme.css` | Design tokens and print styles |
| `STYLE-GUIDE.md` | Rules for people and LLMs making changes |
| `AGENTS.md` | Pointer for AI coding tools |
| `DEPLOY.md` | Step-by-step deploy to https://yurabyrlya.github.io/ |

## Print / PDF

Use **⎙ Print / PDF** in the recruiter card, or Cmd+P. You get a compact, text-only A4 CV.
