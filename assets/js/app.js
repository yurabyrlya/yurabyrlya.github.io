/* Rendering and behaviour. Content lives in content/cv-data.js; do not hard-code CV facts here.
   See docs/STYLE-GUIDE.md section 6 before changing this file. */
(() => {
  const C = window.CV;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = d => new Date(d + '-01').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  const newest = (a, b) => b.date.localeCompare(a.date);
  const eraName = e => e.company + (e.product ? ' · ' + e.product : '');
  const linkedinShort = () => C.person.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  // Era colours: full class names so Tailwind can see them.
  const ERA = {
    emerald: { dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
    indigo:  { dot: 'bg-indigo-500',  text: 'text-indigo-700 dark:text-indigo-400' },
    violet:  { dot: 'bg-violet-500',  text: 'text-violet-700 dark:text-violet-400' },
    sky:     { dot: 'bg-sky-500',     text: 'text-sky-700 dark:text-sky-400' },
    pink:    { dot: 'bg-pink-500',    text: 'text-pink-700 dark:text-pink-400' }
  };
  const eraStyle = e => ERA[e.color] || { dot: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400' };

  const state = { q: '', skills: new Set() };
  const hay = m => (m.title + ' ' + m.oneLiner + ' ' + m.tags.join(' ') + ' ' + m.star.s + ' ' + m.star.t + ' ' + m.star.a.join(' ') + ' ' + m.star.r.join(' ')).toLowerCase();
  const matches = m => (!state.skills.size || m.tags.some(t => state.skills.has(t))) && (!state.q || hay(m).includes(state.q));
  const hl = s => state.q ? esc(s).replace(new RegExp('(' + state.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>') : esc(s);

  /* ---------- Small UI helpers ---------- */
  const chips = tags => tags.map(t => `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${state.skills.has(t) ? 'bg-accent text-white ring-accent' : 'bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'}">${esc(t)}</span>`).join(' ');
  const starHTML = m => {
    const row = (k, label, body) => `<div class="grid grid-cols-[2rem_1fr] gap-3">
      <div class="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 font-mono text-sm font-bold text-accent" aria-hidden="true">${k}</div>
      <div><div class="text-xs font-semibold uppercase tracking-wide text-slate-400">${label}</div><div class="mt-0.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">${body}</div></div></div>`;
    const list = a => `<ul class="mt-1 space-y-1">${a.map(x => `<li class="flex gap-2"><span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"></span><span>${hl(x)}</span></li>`).join('')}</ul>`;
    return `<div class="space-y-4">${row('S', 'Situation', hl(m.star.s))}${row('T', 'Task', hl(m.star.t))}${row('A', 'Action', list(m.star.a))}${row('R', 'Result', list(m.star.r))}</div>`;
  };
  const toast = msg => {
    let el = $('toast');
    if (!el) { el = Object.assign(document.createElement('div'), { id: 'toast', role: 'status', className: 'fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-center text-sm text-white shadow-lg transition-opacity duration-300 opacity-0' }); document.body.appendChild(el); }
    el.textContent = msg; el.style.opacity = '1'; clearTimeout(el._t); el._t = setTimeout(() => el.style.opacity = '0', 2000);
  };
  const copy = (text, msg) => {
    const done = () => toast(msg);
    const fallback = () => { const ta = Object.assign(document.createElement('textarea'), { value: text }); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); done(); };
    navigator.clipboard?.writeText ? navigator.clipboard.writeText(text).then(done, fallback) : fallback();
  };

  /* ---------- Header + recruiter card ---------- */
  function renderHeader() {
    const P = C.person;
    $('hdr-name').textContent = P.name;
    $('hdr-title').textContent = P.title;
    $('hdr-linkedin').href = P.linkedin;
  }
  function renderSummary() {
    const P = C.person, btn = 'flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition';
    $('summary').innerHTML = `
      <p id="summary-h" class="text-xs font-semibold uppercase tracking-widest text-accent">Recruiter quick summary</p>
      <h1 class="mt-2 text-2xl font-extrabold tracking-tight">${esc(P.name)}</h1>
      <p class="text-sm text-slate-700 dark:text-slate-300">${esc(P.title)} (${esc(P.since)}) · ${esc(P.location)}</p>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${esc(P.company)}</p>
      <a href="${esc(P.linkedin)}" target="_blank" rel="noopener" class="mt-2 inline-flex min-h-[2.75rem] items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        <span class="grid h-4 w-4 place-items-center rounded-sm bg-accent text-[10px] font-bold text-white">in</span>${esc(linkedinShort())}</a>
      <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">${esc(P.tagline)}</p>
      <ul class="mt-3 space-y-1.5 text-sm">${P.highlights.map(h => `<li class="flex gap-2"><span aria-hidden="true">${h.icon}</span><span><b>${esc(h.strong)}</b> ${esc(h.text)}</span></li>`).join('')}</ul>
      <p class="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Core stack</p>
      <div class="mt-1.5 flex flex-wrap gap-1">${P.stack.map(s => `<span class="rounded-full bg-white/70 px-2.5 py-0.5 text-xs text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:ring-slate-700">${esc(s)}</span>`).join('')}</div>
      <div class="mt-5 grid gap-2">
        <button onclick="App.copySummary()" class="${btn} bg-accent text-white hover:opacity-90">Copy summary</button>
        <button onclick="App.copyMarkdown()" title="Copies the full CV with every STAR story as Markdown, ready to paste into ChatGPT, Copilot or Claude" class="${btn} border border-accent/50 bg-white/70 text-accent hover:bg-accent hover:text-white dark:bg-slate-900/60">✦ Copy for LLM</button>
        <button onclick="window.print()" class="${btn} border border-slate-300 bg-white/70 text-slate-700 hover:border-accent hover:text-accent dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-200">⎙ Print / PDF</button>
      </div>`;
  }

  /* ---------- Skills filter ---------- */
  function renderSkills() {
    const max = Math.max(...C.skills.map(s => C.milestones.filter(m => m.tags.includes(s)).length));
    $('skills').innerHTML = C.skills.map(s => {
      const n = C.milestones.filter(m => m.tags.includes(s)).length, on = state.skills.has(s);
      return `<button type="button" aria-pressed="${on}" onclick="App.toggleSkill('${esc(s)}')"
        class="flex h-9 flex-none items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm ring-1 ring-inset transition lg:h-9 lg:w-full lg:justify-between lg:rounded-lg lg:px-2 lg:ring-0 ${on ? 'bg-accent text-white ring-accent' : 'ring-slate-200 hover:bg-slate-50 dark:ring-slate-700 dark:hover:bg-slate-900'}">
        <span>${esc(s)}</span><span class="flex items-center gap-2"><span class="hidden h-1.5 rounded-full lg:block ${on ? 'bg-white/70' : 'bg-accent/40'}" style="width:${Math.round(n / max * 56)}px"></span><span class="font-mono text-xs ${on ? '' : 'text-slate-400'}">${n}</span></span></button>`;
    }).join('');
    $('clear').classList.toggle('hidden', !state.skills.size && !state.q);
  }

  /* ---------- Work list (grouped by company · product) ---------- */
  const card = m => {
    const autoOpen = state.q && !(m.title + ' ' + m.oneLiner).toLowerCase().includes(state.q);
    return `<li id="m-${esc(m.id)}" class="fade-in rounded-[var(--radius)] border border-slate-200 p-4 transition hover:border-accent/60 dark:border-slate-800 sm:p-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div class="min-w-0"><p class="font-mono text-xs text-slate-400">${fmtDate(m.date)}</p>
          <h3 class="mt-1 font-semibold leading-snug"><span aria-hidden="true">${m.icon}</span> ${hl(m.title)}</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">${hl(m.oneLiner)}</p></div>
        ${m.metric ? `<div class="flex flex-none items-baseline gap-2 sm:block sm:text-right"><div class="font-mono text-lg font-bold text-accent">${esc(m.metric.value)}</div><div class="text-xs text-slate-400 sm:max-w-[9rem]">${esc(m.metric.label)}</div></div>` : ''}
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">${chips(m.tags)}</div>
      <details class="mt-2" ${autoOpen ? 'open' : ''}><summary class="inline-flex min-h-[2.75rem] cursor-pointer items-center gap-1.5 text-sm font-semibold text-accent"><span class="chev inline-block transition-transform">▸</span> STAR story</summary><div class="pb-1 pt-2">${starHTML(m)}</div></details>
    </li>`;
  };
  function renderList() {
    const shown = C.milestones.filter(matches);
    const groups = ['experience', 'project'].map(section => {
      const html = C.eras.filter(e => e.section === section).map(e => {
        const ms = shown.filter(m => m.era === e.id).sort(newest); if (!ms.length) return '';
        const st = eraStyle(e);
        return `<section aria-label="${esc(eraName(e))}">
          <div class="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-slate-200 pb-2 dark:border-slate-800">
            <h2 class="flex items-center gap-2 text-base font-bold"><span class="h-2.5 w-2.5 rounded-full ${st.dot}"></span><span>${esc(e.company)}</span>${e.product ? `<span class="font-medium ${st.text}">· ${esc(e.product)}</span>` : ''}</h2>
            <p class="font-mono text-xs text-slate-500">${esc(e.period)} · ${esc(e.role)}</p></div>
          <ol class="space-y-3">${ms.map(card).join('')}</ol></section>`;
      }).join('');
      if (!html) return '';
      return section === 'project' ? `<div><p class="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Separate project</p>${html}</div>` : html;
    }).join('');
    $('list').innerHTML = groups || `<p class="py-16 text-center text-slate-400">Nothing matches. Try another word or skill.</p>`;
    const total = C.milestones.length, filters = [...state.skills].join(', ');
    $('status').innerHTML = shown.length === total && !filters && !state.q ? `<b>${total}</b> highlights, newest first. Tap <b>STAR story</b> for details.` : `Showing <b>${shown.length}</b> of ${total}${filters ? ' · ' + esc(filters) : ''}${state.q ? ` · “${esc(state.q)}”` : ''}`;
  }
  function renderLessons() {
    $('lessons').innerHTML = `<h2 class="mb-3 border-b border-slate-200 pb-2 text-base font-bold dark:border-slate-800">Lessons learned</h2>
      <ul class="grid gap-3 sm:grid-cols-3">${C.growth.map(g => `<li class="rounded-[var(--radius)] bg-slate-50 p-4 text-sm dark:bg-slate-900"><b class="block">${esc(g.title)}</b><span class="text-slate-600 dark:text-slate-400">${esc(g.lesson)}</span></li>`).join('')}</ul>`;
  }

  /* ---------- Print: text-only CV ---------- */
  function renderPrint() {
    const P = C.person;
    const entry = m => `<li><b>${esc(m.title)}</b> (${fmtDate(m.date)}): ${esc(m.oneLiner)}<br><span class="res">Result: ${m.star.r.map(esc).join('; ')}.</span> <span class="tech">[${m.tags.map(esc).join(', ')}]</span></li>`;
    const block = e => { const ms = C.milestones.filter(m => m.era === e.id).sort(newest); return ms.length ? `<h3>${esc(eraName(e))}<span>${esc(e.period)}</span></h3><p class="role">${esc(e.role)}</p><ul>${ms.map(entry).join('')}</ul>` : ''; };
    const sec = s => C.eras.filter(e => e.section === s).map(block).join('');
    $('print-cv').innerHTML = `<h1>${esc(P.name)}</h1>
      <p class="sub"><b>${esc(P.title)}</b> (${esc(P.since)}) · ${esc(P.location)}</p>
      <p class="sub">${esc(P.company)}</p>
      <p class="sub">LinkedIn: ${esc(linkedinShort())}</p>
      <h2>Profile</h2><p>${esc(P.tagline)}</p>
      <h2>Key results</h2><ul>${C.metrics.map(m => `<li><b>${esc(m.value)}</b> ${esc(m.label)} (${esc(m.note)})</li>`).join('')}</ul>
      <h2>Skills</h2><p>${P.stack.map(esc).join(' · ')}</p>
      <h2>Experience</h2>${sec('experience')}
      <h2>Separate project</h2>${sec('project')}
      <h2>Lessons learned</h2><ul>${C.growth.map(g => `<li><b>${esc(g.title)}:</b> ${esc(g.lesson)}</li>`).join('')}</ul>`;
  }

  /* ---------- Copy for LLM: Markdown ---------- */
  function markdown() {
    const P = C.person, L = [];
    const star = m => [`#### ${m.title} (${fmtDate(m.date)})`, '', m.oneLiner, '',
      `- **Situation:** ${m.star.s}`, `- **Task:** ${m.star.t}`, '- **Action:**', ...m.star.a.map(a => `  - ${a}`),
      '- **Result:**', ...m.star.r.map(r => `  - ${r}`), `- **Tech:** ${m.tags.join(', ')}`, ''];
    const block = e => { const ms = C.milestones.filter(m => m.era === e.id).sort(newest); return ms.length ? [`### ${eraName(e)} (${e.period})`, '', `*${e.role}*`, '', ...ms.flatMap(star)] : []; };
    L.push(`# ${P.name}: CV`, '', `**${P.title}** (${P.since}) · ${P.location}`, '',
      `- **Companies:** ${P.company}. My Utilita and MyUtilita v4 are Utilita products built at Procode.`,
      `- **LinkedIn:** ${P.linkedin}`, '', '## Profile', '', P.tagline, '', '## Key results', '',
      ...C.metrics.map(m => `- **${m.value}** ${m.label} (${m.note})`), '', '## Skills', '', P.stack.join(', '), '',
      '## Experience (newest first, STAR format)', '', ...C.eras.filter(e => e.section === 'experience').flatMap(block),
      '## Separate project', '', ...C.eras.filter(e => e.section === 'project').flatMap(block),
      '## Lessons learned', '', ...C.growth.map(g => `- **${g.title}:** ${g.lesson}`), '');
    return L.join('\n');
  }

  /* ---------- Public actions ---------- */
  const rerender = () => { renderSkills(); renderList(); };
  window.App = {
    toggleSkill(s) { state.skills.has(s) ? state.skills.delete(s) : state.skills.add(s); rerender(); },
    clearFilters() { state.skills.clear(); state.q = ''; $('q').value = ''; rerender(); },
    toggleDark() { const d = document.documentElement.classList.toggle('dark'); localStorage.setItem('cv-dark', d ? '1' : '0'); },
    copySummary() { copy(C.person.shortSummary + ' · ' + C.person.linkedin, 'Summary copied'); },
    copyMarkdown() { copy(markdown(), 'CV copied as Markdown, ready to paste into an LLM'); },
    markdown
  };

  let t;
  $('q').addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.toLowerCase().trim(); rerender(); }, 120); });
  renderHeader(); renderSummary(); renderSkills(); renderList(); renderLessons(); renderPrint();
})();
