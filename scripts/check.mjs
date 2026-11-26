#!/usr/bin/env node
// Validates content/cv-data.js against docs/STYLE-GUIDE.md sections 3 and 4.
// Usage: node scripts/check.mjs   (exit code 1 on any problem)
import { loadCV } from './lib.mjs';

const C = loadCV();
const problems = [];
const fail = msg => problems.push(msg);

const KEYS = ['person', 'metrics', 'eras', 'skills', 'milestones', 'growth'];
const COLORS = ['emerald', 'indigo', 'violet', 'sky', 'pink'];
const TYPES = ['build', 'launch', 'security', 'payments', 'devops', 'modernise', 'decision', 'idea', 'ownership', 'people'];
const SECTIONS = ['experience', 'project'];

for (const k of KEYS) if (!(k in C)) fail(`missing top-level key: ${k}`);
for (const k of Object.keys(C)) if (!KEYS.includes(k)) fail(`unexpected top-level key: ${k}`);

const P = C.person || {};
for (const f of ['name', 'title', 'location', 'company', 'since', 'linkedin', 'tagline', 'shortSummary']) if (!P[f]) fail(`person.${f} is missing`);
if (!/^https:\/\/www\.linkedin\.com\/in\/[\w-]+\/?$/.test(P.linkedin || '')) fail('person.linkedin must be a LinkedIn profile URL');
if (!Array.isArray(P.highlights) || P.highlights.length !== 4) fail('person.highlights must have exactly 4 items');
if (!Array.isArray(P.stack) || !P.stack.length) fail('person.stack must be a non-empty list');

const eraIds = new Set();
for (const e of C.eras || []) {
  if (eraIds.has(e.id)) fail(`duplicate era id: ${e.id}`);
  eraIds.add(e.id);
  if (!COLORS.includes(e.color)) fail(`era ${e.id}: color "${e.color}" is not one of ${COLORS.join(', ')}`);
  if (!SECTIONS.includes(e.section)) fail(`era ${e.id}: section must be experience or project`);
  for (const f of ['company', 'role', 'period']) if (!e[f]) fail(`era ${e.id}: ${f} is missing`);
  if (/^(My Utilita|MyUtilita)/i.test(e.company)) fail(`era ${e.id}: "${e.company}" is a product, not a company`);
}

const skills = new Set(C.skills || []);
const used = new Set();
const ids = new Set();
for (const m of C.milestones || []) {
  const at = `milestone ${m.id}`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.id || '')) fail(`${at}: id must be kebab-case`);
  if (ids.has(m.id)) fail(`${at}: duplicate id`);
  ids.add(m.id);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(m.date || '')) fail(`${at}: date must be YYYY-MM`);
  if (!eraIds.has(m.era)) fail(`${at}: unknown era "${m.era}"`);
  if (!['I', 'We'].includes(m.who)) fail(`${at}: who must be "I" or "We"`);
  if (!TYPES.includes(m.type)) fail(`${at}: type must be one of ${TYPES.join(', ')}`);
  if (!m.title || !m.oneLiner) fail(`${at}: title and oneLiner are required`);
  if (!Array.isArray(m.tags) || m.tags.length < 2 || m.tags.length > 5) fail(`${at}: needs 2–5 tags`);
  for (const t of m.tags || []) { used.add(t); if (!skills.has(t)) fail(`${at}: tag "${t}" is not in skills`); }
  const s = m.star || {};
  if (!s.s || !s.t) fail(`${at}: star.s and star.t are required`);
  if (!Array.isArray(s.a) || s.a.length < 1 || s.a.length > 5) fail(`${at}: star.a needs 1–5 bullets`);
  if (!Array.isArray(s.r) || s.r.length < 1 || s.r.length > 3) fail(`${at}: star.r needs 1–3 bullets`);
  if (m.metric !== null && (!m.metric || !m.metric.value || !m.metric.label)) fail(`${at}: metric must be null or {value, label}`);
}
for (const s of skills) if (!used.has(s)) fail(`skill "${s}" is not used by any milestone`);
for (const e of eraIds) if (!(C.milestones || []).some(m => m.era === e)) fail(`era ${e} has no milestones`);

// Privacy: only the LinkedIn link, no ticket IDs, no emails.
const text = JSON.stringify(C);
for (const url of text.match(/https?:\/\/[^"\s)]+/g) || []) if (url !== P.linkedin) fail(`external link not allowed: ${url}`);
for (const id of new Set(text.match(/\b[A-Z][A-Z0-9]{1,9}-\d{1,6}\b/g) || [])) fail(`looks like a ticket ID: ${id}`);
for (const em of text.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || []) fail(`email address not allowed: ${em}`);

if (problems.length) {
  console.error(`✖ ${problems.length} problem(s) in content/cv-data.js:\n` + problems.map(p => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log(`✔ content/cv-data.js OK: ${C.milestones.length} milestones, ${C.eras.length} eras, ${C.skills.length} skills`);
