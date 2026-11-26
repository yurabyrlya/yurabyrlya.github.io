# Agent instructions

This folder is a static, single-page CV (plain HTML, the Tailwind Play CDN and vanilla JS; no build step).

**Before making any change, read [STYLE-GUIDE.md](./STYLE-GUIDE.md) and follow it.** In short:

- CV content lives **only** in `assets/js/data.js` (schema: STYLE-GUIDE section 3).
- Rendering lives in `assets/js/app.js`; design tokens and print styles live in `assets/css/theme.css`.
- Use plain English, put numbers first, and don't overclaim. Don't include other people's names, ticket IDs, or links other than LinkedIn.
- Utilita and Procode are the companies. My Utilita and MyUtilita v4 are Utilita **products** built at Procode. Cosmetrics AI is a separate project.
- Design mobile first, with touch targets of at least 44px and no horizontal scroll at 375px.
- Keep the print CV and the "Copy for LLM" Markdown in step with any data change.
- Finish by working through the "Definition of done" checklist (STYLE-GUIDE section 8).
