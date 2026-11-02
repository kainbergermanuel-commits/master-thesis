/* ==========================================================================
   Seitenübergreifende Navigation

   Ein Skript für alle Seiten. Es ergänzt, ohne das Markup der Seiten anzufassen:

   1. Brotkrumen in der Topbar: „Übersicht › Ebene 1 · Die Arbeit".
   2. Navigator (Taste „/" oder Strg/Cmd+K): alle Dokumente nach Ebenen, mit
      Suchfeld, Tastatursteuerung und den Abschnitten der aktuellen Seite.
      Auf schmalen Bildschirmen ersetzt er das Inhaltsverzeichnis am Rand.
   3. „Weiterlesen" am Seitenende: vorheriges und nächstes Dokument derselben Ebene.
   4. „Nach oben"-Knopf nach längerem Scrollen.

   Neue Dokumente werden nur in SITE eingetragen, in der Reihenfolge der
   Startseite. Die Gruppen spiegeln die Ebenen und Untergruppen der Startseite.
   ========================================================================== */
(function () {
  'use strict';

  var SITE = [
    { ebene: 1, name: 'Die Arbeit', anchor: 'ebene-1', groups: [
      { name: 'Forschungsdesign', items: [
        ['2026-07-forschungsdesign.html', 'Forschungsdesign & Untersuchungsdesign'],
        ['2026-07-begriffsdefinitionen.html', 'Begriffsdefinitionen'] ] },
      { name: 'Theorie & Literatur', items: [
        ['2026-07-literaturkarte.html', 'Literaturkarte'],
        ['2026-07-literaturverzeichnis.html', 'Literaturverzeichnis'],
        ['2026-08-suchstrategie.html', 'Suchstrategie & Literaturauswahl'],
        ['2026-07-risiken-gamifizierung.html', 'Risiken & Grenzen der Gamifizierung'] ] },
      { name: 'Feldzugang & Ethik', items: [
        ['2026-07-forschungsethik.html', 'Forschungsethik & Einwilligung'],
        ['2026-08-datenschutz.html', 'Datenschutz & Feldzugang'],
        ['2026-08-feldeinfuehrung.html', 'Feldeinführung & Erhebungsstart'] ] },
      { name: 'Rahmen & Betreuung', items: [
        ['2026-07-rahmenbedingungen.html', 'Rahmenbedingungen & Fahrplan'],
        ['gespraechsvorbereitung.html', 'Vorbereitung erstes Fachgespräch'] ] } ] },
    { ebene: 2, name: 'Der Gegenstand', anchor: 'ebene-2', groups: [
      { name: null, items: [
        ['2026-07-app-systemueberblick.html', 'App-Systemüberblick'] ] } ] },
    { ebene: 3, name: 'Entwicklungsdokumentation', anchor: 'ebene-3', hub: 'entwicklungsdokumentation.html', groups: [
      { name: null, items: [
        ['entwicklungsdokumentation.html', 'Übersicht Entwicklungsdokumentation'] ] },
      { name: 'Umsetzungsberichte', items: [
        ['2026-07-anwesenheit-konzept.html', 'Anwesenheit · Konzept'],
        ['2026-07-juli-update.html', 'Juli-Update: Anwesenheit & Abenteuer'],
        ['2026-07-organisation-vertieft.html', 'Organisation vertieft'],
        ['2026-07-gamification-umsetzung.html', 'Gamification-Umsetzung'] ] },
      { name: 'Konzept & Design-Rationale', items: [
        ['2026-07-gamification-prinzipien.html', 'Gamification-Prinzipien'],
        ['2026-07-soziale-normen.html', 'Soziale Normen richtig einsetzen'],
        ['2026-07-gamification-konzept.html', 'Gamification-Konzept'],
        ['2026-07-gamification-balance.html', 'Balance, Alltag & Vertrauen'],
        ['2026-07-story-welten.html', 'Story-Welten'] ] },
      { name: 'Technische Planung', items: [
        ['2026-07-gamification-technischer-plan.html', 'Vom Prinzip zum Code'] ] } ] },
    { ebene: 4, name: 'Die Umsetzung', anchor: 'ebene-4', groups: [
      { name: null, items: [
        ['2026-11-erhebung-1.html', 'Erhebung 1 · Dokumentation'],
        ['2026-08-schulstart-timeline.html', 'Ausgabe-Timeline Schulstart'],
        ['2026-08-schulstart-mappe.html', 'Dokumentenmappe Schulstart'] ] } ] }
  ];

  // ---- Pfade ---------------------------------------------------------------
  var me = document.currentScript && document.currentScript.getAttribute('src') || '';
  var ROOT = me.replace(/assets\/nav\.js.*$/, '');          // '' auf der Startseite, '../' in docs/
  var file = location.pathname.split('/').pop() || 'index.html';
  var isIndex = !/\/docs\//.test(location.pathname) && (file === '' || file === 'index.html');
  var docHref = function (f) { return ROOT + 'docs/' + f; };

  // Flache Liste mit Ebenen-Bezug
  var flat = [];
  SITE.forEach(function (lv) {
    lv.groups.forEach(function (g) {
      g.items.forEach(function (it) { flat.push({ file: it[0], title: it[1], lv: lv, group: g.name }); });
    });
  });
  var current = isIndex ? null : flat.filter(function (x) { return x.file === file; })[0] || null;

  // ---- Styles ----------------------------------------------------------------
  var css = [
    ':root{--nv-teal:var(--teal,#0F8A82);--nv-ink:var(--ink,#16292E);--nv-muted:var(--muted,#5C6B6A);',
    '--nv-line:var(--line,#E2D9C7);--nv-card:var(--card,#FBF9F3);--nv-card2:var(--card-2,var(--card2,#F6F1E6));',
    '--nv-paper:var(--paper,#F1ECE1);--nv-mono:var(--mono,ui-monospace,Menlo,monospace);--nv-display:var(--display,system-ui,sans-serif)}',
    /* Brotkrumen */
    '.nv-crumb{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;min-width:0}',
    '.nv-crumb .sep{color:var(--nv-line);font-weight:400}',
    '.nv-crumb a{color:var(--nv-muted);text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .15s}',
    '.nv-crumb a:hover{color:var(--nv-teal)}',
    '.nv-crumb .lvb{font-family:var(--nv-mono);font-size:11px;color:var(--nv-teal);background:color-mix(in srgb,var(--nv-teal) 12%,transparent);padding:1px 7px;border-radius:999px;margin-right:5px}',
    '@media (max-width:720px){.nv-crumb .lvn{display:none}}',
    '@media (max-width:900px){.nv-crumb .backlink .bt{display:none}}',
    /* Knopf in der Topbar */
    '.nv-open{display:inline-flex;align-items:center;gap:8px;margin-left:auto;order:99;font:inherit;font-size:12.5px;font-weight:700;',
    'color:var(--nv-ink);background:var(--nv-card2);border:1px solid var(--nv-line);border-radius:999px;padding:6px 8px 6px 12px;cursor:pointer;',
    'transition:border-color .15s,color .15s,background .15s}',
    '.nv-open:hover{border-color:color-mix(in srgb,var(--nv-teal) 45%,var(--nv-line));color:var(--nv-teal)}',
    '.nv-open:focus-visible,.nv-dlg a:focus-visible,.nv-top:focus-visible{outline:2px solid var(--nv-teal);outline-offset:2px}',
    '.nv-open kbd{font-family:var(--nv-mono);font-size:10.5px;font-weight:700;color:var(--nv-muted);border:1px solid var(--nv-line);border-radius:6px;padding:1px 6px;background:var(--nv-card)}',
    '.nv-open svg{width:15px;height:15px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}',
    '.topbar .legend + .nv-open,.topbar .legend ~ .nv-open{margin-left:0}',
    '@media (max-width:1000px){.nv-open .tx{display:none}.nv-open{padding:6px 8px 6px 9px}}',
    '@media (max-width:720px){.nv-open kbd{display:none}.nv-open{padding:7px}}',
    '@media (hover:none){.nv-open kbd{display:none}}',
    '.nv-float{position:fixed;left:16px;bottom:16px;z-index:40;box-shadow:0 10px 28px -14px rgba(0,0,0,.55)}',
    /* Dialog */
    '.nv-dlg{border:1px solid var(--nv-line);border-radius:18px;padding:0;width:min(640px,calc(100vw - 32px));max-height:min(78vh,720px);',
    'background:var(--nv-card);color:var(--nv-ink);box-shadow:0 30px 80px -30px rgba(0,0,0,.6);margin:10vh auto auto}',
    '.nv-dlg::backdrop{background:color-mix(in srgb,#000 38%,transparent);backdrop-filter:blur(3px)}',
    '.nv-dlg[open]{display:flex;flex-direction:column}',
    '.nv-search{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--nv-line)}',
    '.nv-search svg{width:17px;height:17px;stroke:var(--nv-muted);stroke-width:2;fill:none;stroke-linecap:round;flex:none}',
    '.nv-search input{flex:1;border:0;outline:0;background:transparent;font:inherit;font-size:15px;color:var(--nv-ink);min-width:0}',
    '.nv-search input::placeholder{color:var(--nv-muted)}',
    '.nv-x{border:1px solid var(--nv-line);background:var(--nv-card2);color:var(--nv-muted);border-radius:8px;font:inherit;font-size:11px;font-weight:700;padding:3px 8px;cursor:pointer}',
    '.nv-list{overflow:auto;padding:8px 8px 10px;overscroll-behavior:contain}',
    '.nv-h{display:flex;align-items:center;gap:8px;font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--nv-muted);padding:12px 10px 6px}',
    '.nv-h .lvb{font-family:var(--nv-mono);letter-spacing:0;text-transform:none;color:var(--nv-teal);background:color-mix(in srgb,var(--nv-teal) 12%,transparent);padding:1px 7px;border-radius:999px}',
    '.nv-g{font-size:11.5px;font-weight:700;color:var(--nv-muted);padding:6px 10px 2px 14px;opacity:.85}',
    '.nv-dlg a.nv-i{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;color:var(--nv-ink);text-decoration:none;font-size:14px;line-height:1.35}',
    '.nv-dlg a.nv-i .t{flex:1;min-width:0}',
    '.nv-dlg a.nv-i .here{font-size:10.5px;font-weight:800;color:var(--nv-teal);text-transform:uppercase;letter-spacing:.06em}',
    '.nv-dlg a.nv-i.sec{font-size:13.5px;color:var(--nv-muted)}',
    '.nv-dlg a.nv-i.sec::before{content:"";width:10px;height:2px;border-radius:2px;background:var(--nv-line);flex:none}',
    '.nv-dlg a.nv-i.cur{background:color-mix(in srgb,var(--nv-teal) 9%,transparent)}',
    '.nv-dlg a.nv-i.act{background:color-mix(in srgb,var(--nv-teal) 16%,transparent);color:var(--nv-ink)}',
    '.nv-dlg a.nv-i.act.sec{color:var(--nv-ink)}',
    '.nv-empty{padding:22px 12px;color:var(--nv-muted);font-size:13.5px;text-align:center}',
    '.nv-foot{display:flex;gap:14px;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--nv-line);font-size:11.5px;color:var(--nv-muted)}',
    '.nv-foot kbd{font-family:var(--nv-mono);font-size:10.5px;border:1px solid var(--nv-line);border-radius:5px;padding:0 5px;margin-right:4px;background:var(--nv-card2)}',
    '@media (hover:none){.nv-foot{display:none}}',
    /* Weiterlesen */
    '.nv-next{margin:44px 0 6px}',
    '.nv-next .nh{font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--nv-muted);margin-bottom:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
    '.nv-next .nh a{color:var(--nv-teal);text-decoration:none;letter-spacing:.04em}',
    '.nv-next .nh a:hover{text-decoration:underline}',
    '.nv-pn{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '@media (max-width:640px){.nv-pn{grid-template-columns:1fr}}',
    '.nv-pn a{display:block;padding:14px 16px;border-radius:14px;background:var(--nv-card);border:1px solid var(--nv-line);text-decoration:none;color:var(--nv-ink);transition:border-color .15s,transform .15s}',
    '.nv-pn a:hover{border-color:color-mix(in srgb,var(--nv-teal) 45%,var(--nv-line));transform:translateY(-1px)}',
    '.nv-pn a.nx{text-align:right}',
    '.nv-pn .d{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--nv-teal)}',
    '.nv-pn .tt{font-family:var(--nv-display);font-size:15px;font-weight:700;margin-top:4px;line-height:1.3}',
    '.nv-pn .ph{visibility:hidden}',
    /* Nach oben */
    '.nv-top{position:fixed;right:18px;bottom:18px;z-index:40;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;cursor:pointer;',
    'background:color-mix(in srgb,var(--nv-card) 92%,transparent);border:1px solid var(--nv-line);color:var(--nv-muted);backdrop-filter:blur(8px);',
    'box-shadow:0 10px 26px -14px rgba(0,0,0,.55);opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .2s,transform .2s,color .15s}',
    '.nv-top.on{opacity:1;transform:none;pointer-events:auto}',
    '.nv-top:hover{color:var(--nv-teal)}',
    '.nv-top svg{width:17px;height:17px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}',
    '@media print{.nv-open,.nv-top,.nv-next,.nv-dlg{display:none!important}}',
    '@media (prefers-reduced-motion:reduce){.nv-top,.nv-pn a,.nv-open{transition:none}}'
  ].join('');
  var st = document.createElement('style');
  st.id = 'nv-css';
  st.textContent = css;
  document.head.appendChild(st);

  // ---- Helfer ----------------------------------------------------------------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  var ICON_NAV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>';
  var ICON_SEARCH = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  var ICON_UP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  // ---- 1 Brotkrumen ----------------------------------------------------------
  var back = document.querySelector('.topbar .backlink');
  if (back && current) {
    var crumb = el('nav', 'nv-crumb');
    crumb.setAttribute('aria-label', 'Brotkrumen');
    back.parentNode.insertBefore(crumb, back);
    crumb.appendChild(back);
    // Text des Rücklinks einfassen, damit er auf mittleren Breiten zum Pfeil schrumpfen kann
    Array.prototype.slice.call(back.childNodes).forEach(function (n) {
      if (n.nodeType === 3 && n.textContent.trim()) {
        var sp = el('span', 'bt', n.textContent.trim());
        back.replaceChild(sp, n);
      }
    });
    back.setAttribute('aria-label', 'Zur Übersicht');
    var sep = el('span', 'sep', '›'); sep.setAttribute('aria-hidden', 'true');
    crumb.appendChild(sep);
    var lvA = document.createElement('a');
    var inHub = current.lv.hub && current.file !== current.lv.hub;
    lvA.href = inHub ? docHref(current.lv.hub) : ROOT + 'index.html#' + current.lv.anchor;
    lvA.innerHTML = '<span class="lvb">Ebene ' + current.lv.ebene + '</span><span class="lvn"></span>';
    lvA.querySelector('.lvn').textContent = current.lv.name;
    lvA.title = inHub ? 'Zur Übersicht der Entwicklungsdokumentation' : 'Zu Ebene ' + current.lv.ebene + ' auf der Startseite';
    crumb.appendChild(lvA);
  }

  // ---- 2 Navigator -----------------------------------------------------------
  var btn = el('button', 'nv-open');
  btn.type = 'button';
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.innerHTML = ICON_NAV + '<span class="tx">Navigation</span><kbd>' + (isMac ? '⌘K' : 'Strg K') + '</kbd>';
  btn.title = 'Alle Dokumente und Abschnitte (Taste / oder ' + (isMac ? '⌘K' : 'Strg+K') + ')';
  var bar = document.querySelector('.topbar-in, .topbar .wrap');
  if (bar) bar.appendChild(btn); else { btn.classList.add('nv-float'); document.body.appendChild(btn); }

  var dlg = el('dialog', 'nv-dlg');
  dlg.setAttribute('aria-label', 'Navigation');
  dlg.innerHTML =
    '<div class="nv-search">' + ICON_SEARCH +
    '<input type="search" placeholder="Dokument oder Abschnitt suchen …" aria-label="Suchen" autocomplete="off">' +
    '<button type="button" class="nv-x">Esc</button></div>' +
    '<div class="nv-list" role="listbox"></div>' +
    '<div class="nv-foot"><span><kbd>↑</kbd><kbd>↓</kbd>auswählen</span><span><kbd>Enter</kbd>öffnen</span><span><kbd>Esc</kbd>schließen</span></div>';
  document.body.appendChild(dlg);
  var input = dlg.querySelector('input');
  var list = dlg.querySelector('.nv-list');

  // Abschnitte der aktuellen Seite (gleiche Logik wie toc.js)
  var sections = [];
  document.querySelectorAll('section[id]').forEach(function (sec) {
    var h = sec.querySelector('.sec-head h2, h2');
    if (h) sections.push({ id: sec.id, text: h.textContent.replace(/\s+/g, ' ').trim() });
  });

  var links = [];
  var act = -1;
  function addHead(html) { var h = el('div', 'nv-h'); h.innerHTML = html; list.appendChild(h); }
  function addLink(href, text, opts) {
    var a = el('a', 'nv-i' + (opts.sec ? ' sec' : '') + (opts.cur ? ' cur' : ''));
    a.href = href;
    a.setAttribute('role', 'option');
    a.appendChild(el('span', 't', text));
    if (opts.cur) a.appendChild(el('span', 'here', 'hier'));
    a.addEventListener('click', function () { close(); });
    a.addEventListener('mousemove', function () { setAct(links.indexOf(a)); });
    list.appendChild(a);
    links.push(a);
  }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function render(q) {
    list.innerHTML = ''; links = []; act = -1;
    var nq = norm(q || '');
    var hit = function (s) { return !nq || norm(s).indexOf(nq) !== -1; };

    if (!isIndex) {
      var shownStart = false;
      if (hit('Übersicht Startseite')) {
        addHead('Start');
        addLink(ROOT + 'index.html', 'Übersicht · Startseite', {});
        shownStart = true;
      }
      var secs = sections.filter(function (s) { return hit(s.text); });
      if (secs.length >= 2 || (nq && secs.length)) {
        addHead('Auf dieser Seite');
        secs.forEach(function (s) { addLink('#' + s.id, s.text, { sec: true }); });
      }
    } else {
      var isecs = sections.filter(function (s) { return hit(s.text); });
      if (isecs.length) {
        addHead('Auf der Startseite');
        isecs.forEach(function (s) { addLink('#' + s.id, s.text, { sec: true }); });
      }
    }

    SITE.forEach(function (lv) {
      var lvHit = hit('Ebene ' + lv.ebene + ' ' + lv.name);
      var rows = [];
      lv.groups.forEach(function (g) {
        var gHit = g.name && hit(g.name);
        var its = g.items.filter(function (it) { return lvHit || gHit || hit(it[1]); });
        if (its.length) rows.push({ g: g, its: its });
      });
      if (!rows.length) return;
      addHead('<span class="lvb">Ebene ' + lv.ebene + '</span>' + lv.name.replace(/&/g, '&amp;'));
      rows.forEach(function (r) {
        if (r.g.name && lv.groups.length > 1) list.appendChild(el('div', 'nv-g', r.g.name));
        r.its.forEach(function (it) {
          addLink(docHref(it[0]), it[1], { cur: current && current.file === it[0] });
        });
      });
    });

    if (!links.length) list.appendChild(el('div', 'nv-empty', 'Nichts gefunden.'));
    else setAct(nq ? 0 : -1);
  }
  function setAct(i) {
    if (act >= 0 && links[act]) links[act].classList.remove('act');
    act = i;
    if (act >= 0 && links[act]) {
      links[act].classList.add('act');
      links[act].scrollIntoView({ block: 'nearest' });
    }
  }
  function open() {
    if (dlg.open) return;
    input.value = '';
    render('');
    dlg.showModal();
    // aktuelle Seite ins Blickfeld
    var cur = list.querySelector('.cur');
    if (cur) cur.scrollIntoView({ block: 'center' });
    input.focus();
  }
  function close() { if (dlg.open) dlg.close(); }

  btn.addEventListener('click', open);
  dlg.querySelector('.nv-x').addEventListener('click', close);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
  input.addEventListener('input', function () { render(input.value.trim()); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setAct(Math.min(links.length - 1, act + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAct(Math.max(0, act - 1)); }
    else if (e.key === 'Enter' && act >= 0 && links[act]) { e.preventDefault(); links[act].click(); }
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    var typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); dlg.open ? close() : open(); }
    else if (e.key === '/' && !typing && !dlg.open) { e.preventDefault(); open(); }
  });

  // ---- 3 Weiterlesen ---------------------------------------------------------
  if (current) {
    var same = flat.filter(function (x) { return x.lv === current.lv; });
    var i = same.indexOf(current);
    var prev = same[i - 1], next = same[i + 1];
    if (prev || next) {
      var box = el('nav', 'nv-next');
      box.setAttribute('aria-label', 'Weiterlesen');
      var nh = el('div', 'nh');
      nh.appendChild(document.createTextNode('Weiterlesen in Ebene ' + current.lv.ebene + ' · '));
      var lvLink = el('a', null, current.lv.name);
      lvLink.href = current.lv.hub ? docHref(current.lv.hub) : ROOT + 'index.html#' + current.lv.anchor;
      nh.appendChild(lvLink);
      box.appendChild(nh);
      var grid = el('div', 'nv-pn');
      function card(x, cls, dir) {
        if (!x) { var ph = el('div', 'ph'); grid.appendChild(ph); return; }
        var a = el('a', cls);
        a.href = docHref(x.file);
        a.appendChild(el('div', 'd', dir));
        a.appendChild(el('div', 'tt', x.title));
        grid.appendChild(a);
      }
      card(prev, 'pv', '← Vorheriges');
      card(next, 'nx', 'Nächstes →');
      box.appendChild(grid);
      // Nur Inhaltscontainer zählen, nie die Topbar (manche Seiten nutzen .wrap auch dort)
      var inContent = function (n) { return n && !n.closest('.topbar'); };
      var foot = Array.prototype.filter.call(document.querySelectorAll('.foot'), inContent).pop();
      if (foot && foot.parentNode) foot.parentNode.insertBefore(box, foot);
      else {
        var host = Array.prototype.filter.call(document.querySelectorAll('.wrap'), inContent).pop() || document.body;
        box.style.maxWidth = '900px'; box.style.marginLeft = 'auto'; box.style.marginRight = 'auto'; box.style.padding = '0 22px 30px';
        host.appendChild(box);
      }
    }
  }

  // ---- 4 Nach oben -----------------------------------------------------------
  var up = el('button', 'nv-top');
  up.type = 'button';
  up.setAttribute('aria-label', 'Nach oben');
  up.title = 'Nach oben';
  up.innerHTML = ICON_UP;
  document.body.appendChild(up);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      up.classList.toggle('on', window.scrollY > 900);
      ticking = false;
    });
  }, { passive: true });
})();
