/* ==========================================================================
   Seitenübergreifende Navigation

   Ein Skript für alle Seiten. Es ergänzt, ohne das Markup der Seiten anzufassen:

   1. Brotkrumen in der Topbar: „Übersicht › Ebene 1 · Die Arbeit".
   2. Navigator (Taste „/" oder Strg/Cmd+K): alle Dokumente nach Ebenen, mit
      Suchfeld, Tastatursteuerung und den Abschnitten der aktuellen Seite.
      Auf schmalen Bildschirmen ersetzt er das Inhaltsverzeichnis am Rand.
   3. „Weiterlesen" am Seitenende: vorheriges und nächstes Dokument derselben Ebene.
   4. „Nach oben"-Knopf nach längerem Scrollen.
   5. Umschalter für die Darstellung: Hell (Standard), Dunkel, Automatisch.
      Gespeichert in localStorage "mt-theme"; ein kleines Skript im <head> jeder
      Seite setzt die Wahl vor dem ersten Zeichnen.
   6. Begriffs-Erklärungen: Das erste Vorkommen eines Glossarbegriffs auf einer
      Seite wird gepunktet unterstrichen; Darüberfahren oder Antippen zeigt die
      Definition mit Belegstatus. Quelle ist allein die Seite
      Begriffsdefinitionen, sie wird beim Laden gelesen. Neue Begriffe dort
      anlegen (h3 mit id) und unten in GLOSSAR ein Suchmuster eintragen.

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
        ['2026-11-theorielandkarte.html', 'Theorie-Landkarte'],
        ['2026-11-theoretische-anker.html', 'Theoretische Anker'],
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
        ['2026-11-versionsprotokoll.html', 'Versionsprotokoll der App'],
        ['2026-08-schulstart-timeline.html', 'Ausgabe-Timeline Schulstart'],
        ['2026-08-schulstart-mappe.html', 'Dokumentenmappe Schulstart'] ] },
      { name: 'Instrumente Erhebung 1', items: [
        ['2026-11-e1-leitfaden-lehrpersonen.html', 'Leitfaden Lehrpersonen'],
        ['2026-11-e1-kurzfragebogen-lehrpersonen.html', 'Kurzfragebogen Lehrpersonen'],
        ['2026-11-e1-leitfaden-gruppeninterview.html', 'Leitfaden Gruppeninterview'],
        ['2026-11-e1-kartenaufgabe.html', 'Kartenaufgabe'],
        ['2026-11-e1-fragebogen-eltern.html', 'Fragebogen Erziehungsberechtigte'] ] } ] }
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
    /* Darstellung */
    '.nv-theme{display:inline-grid;place-items:center;width:32px;height:32px;flex:none;order:98;border-radius:50%;cursor:pointer;',
    'color:var(--nv-muted);background:var(--nv-card2);border:1px solid var(--nv-line);transition:color .15s,border-color .15s}',
    '.nv-theme:hover{color:var(--nv-teal);border-color:color-mix(in srgb,var(--nv-teal) 45%,var(--nv-line))}',
    '.nv-theme:focus-visible,.nv-seg button:focus-visible{outline:2px solid var(--nv-teal);outline-offset:2px}',
    '.nv-theme svg,.nv-seg svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}',
    '.topbar .legend ~ .nv-theme{margin-left:0}',
    '.nv-mode{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;border-top:1px solid var(--nv-line)}',
    '.nv-mode .ml{font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--nv-muted)}',
    '.nv-seg{display:inline-flex;gap:3px;padding:3px;border-radius:999px;background:var(--nv-card2);border:1px solid var(--nv-line)}',
    '.nv-seg button{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:12px;font-weight:700;color:var(--nv-muted);background:transparent;border:0;border-radius:999px;padding:5px 11px;cursor:pointer}',
    '.nv-seg button[aria-pressed="true"]{background:var(--nv-card);color:var(--nv-teal);box-shadow:0 1px 4px rgba(0,0,0,.12)}',
    '@media (max-width:420px){.nv-seg button .sl{display:none}}',
    '@media print{.nv-open,.nv-top,.nv-next,.nv-dlg,.nv-theme{display:none!important}}',
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

  // ---- 5 Darstellung ---------------------------------------------------------
  var MODES = {
    light: { label: 'Hell', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' },
    dark:  { label: 'Dunkel', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' },
    auto:  { label: 'Automatisch', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/></svg>' }
  };
  var ORDER = ['light', 'dark', 'auto'];
  function getMode() {
    try { var t = localStorage.getItem('mt-theme'); if (MODES[t]) return t; } catch (e) {}
    return 'light';
  }
  var themeBtn = el('button', 'nv-theme');
  themeBtn.type = 'button';
  var segBtns = [];
  function applyMode(m) {
    document.documentElement.setAttribute('data-theme', m);
    try { localStorage.setItem('mt-theme', m); } catch (e) {}
    var nxt = MODES[ORDER[(ORDER.indexOf(m) + 1) % ORDER.length]].label;
    themeBtn.innerHTML = MODES[m].icon;
    themeBtn.setAttribute('aria-label', 'Darstellung: ' + MODES[m].label + '. Wechseln zu ' + nxt);
    themeBtn.title = 'Darstellung: ' + MODES[m].label + ' (Klick: ' + nxt + ')';
    segBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === m)); });
  }
  themeBtn.addEventListener('click', function () {
    var m = getMode();
    applyMode(ORDER[(ORDER.indexOf(m) + 1) % ORDER.length]);
  });
  if (bar) bar.insertBefore(themeBtn, btn);
  else { themeBtn.classList.add('nv-float'); themeBtn.style.left = '64px'; document.body.appendChild(themeBtn); }

  var dlg = el('dialog', 'nv-dlg');
  dlg.setAttribute('aria-label', 'Navigation');
  dlg.innerHTML =
    '<div class="nv-search">' + ICON_SEARCH +
    '<input type="search" placeholder="Dokument oder Abschnitt suchen …" aria-label="Suchen" autocomplete="off">' +
    '<button type="button" class="nv-x">Esc</button></div>' +
    '<div class="nv-list" role="listbox"></div>' +
    '<div class="nv-mode"><span class="ml">Darstellung</span><div class="nv-seg" role="group" aria-label="Darstellung"></div></div>' +
    '<div class="nv-foot"><span><kbd>↑</kbd><kbd>↓</kbd>auswählen</span><span><kbd>Enter</kbd>öffnen</span><span><kbd>Esc</kbd>schließen</span></div>';
  document.body.appendChild(dlg);
  var input = dlg.querySelector('input');
  var seg = dlg.querySelector('.nv-seg');
  ORDER.forEach(function (m) {
    var b = el('button');
    b.type = 'button';
    b.dataset.mode = m;
    b.innerHTML = MODES[m].icon + '<span class="sl">' + MODES[m].label + '</span>';
    b.addEventListener('click', function () { applyMode(m); });
    seg.appendChild(b);
    segBtns.push(b);
  });
  applyMode(getMode());
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

  // ---- 6 Begriffs-Erklärungen -------------------------------------------------
  // Suchmuster je Glossar-Anker. Nur das erste Vorkommen pro Seite wird markiert.
  var GLOSSAR = [
    ['aneignung', /\bAneignung\b/],
    ['involvement-engagement', /\bInvolvement\b/],
    ['digitales-kapital', /\bdigitale[sn]? Kapitals?\b/i],
    ['sdt', /\bSelbstbestimmungstheorie\b/],
    ['game-fiction', /\b[Gg]ame[ -]fiction\b/],
    ['gamification', /\bGamification\b/],
    ['verbindlichkeit', /\bVerbindlichkeit\b/],
    ['schulintern', /\bschulintern entwickelte[mnrs]?\b/i],
    ['datafizierung', /\bDatafizierung\b/],
    ['saettigung', /\bSättigung\b/],
    ['inhaltsanalyse', /\b[Qq]ualitative[nr]? Inhaltsanalyse\b/],
    ['neuheitseffekt', /\b[Nn]euheitseffekt\b|\b[Nn]ovelty-Effekt\b/],
    ['ses', /\bsozioökonomische[nmrs]? Status\b/i]
  ];
  var GLOSS_FILE = '2026-07-begriffsdefinitionen.html';
  var ICON_BOOK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>';
  if (file !== GLOSS_FILE && window.fetch && window.DOMParser) {
    var gst = document.createElement('style'); gst.id = 'gl-css'; gst.textContent = ([
      '.gl-t{text-decoration:underline dotted color-mix(in srgb,var(--nv-teal) 70%,transparent);text-decoration-thickness:1.5px;text-underline-offset:3px;cursor:help;border-radius:3px;transition:background .15s}',
      '.gl-t:hover,.gl-t:focus-visible,.gl-t.on{background:color-mix(in srgb,var(--nv-teal) 12%,transparent);outline:none}',
      '.gl-tip{position:fixed;z-index:60;width:min(340px,calc(100vw - 24px));padding:14px 16px 12px;border-radius:16px;',
      'border:1px solid color-mix(in srgb,var(--nv-teal) 28%,var(--nv-line));color:var(--nv-ink);font-family:var(--body,system-ui,sans-serif);',
      'background:linear-gradient(150deg,color-mix(in srgb,var(--nv-teal) 10%,var(--nv-card)) 0%,var(--nv-card) 55%,color-mix(in srgb,var(--amber,#B8721E) 6%,var(--nv-card)) 100%);',
      'box-shadow:0 22px 50px -24px rgba(0,0,0,.5),0 2px 8px -4px rgba(0,0,0,.15);opacity:0;transform:translateY(4px);pointer-events:none;transition:opacity .16s,transform .16s}',
      '.gl-tip.on{opacity:1;transform:none;pointer-events:auto}',
      '.gl-tip .gh{display:flex;align-items:center;gap:9px;margin-bottom:7px}',
      '.gl-tip .gi{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;flex:none;background:color-mix(in srgb,var(--nv-teal) 15%,transparent)}',
      '.gl-tip .gi svg{width:14px;height:14px;stroke:var(--nv-teal);stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}',
      '.gl-tip .gn{font-family:var(--nv-display);font-weight:700;font-size:14.5px;line-height:1.25;flex:1;min-width:0}',
      '.gl-tip .gs{font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:2px 8px;border-radius:999px;white-space:nowrap}',
      '.gl-tip .gs.ok{color:var(--good,#2E9C6E);background:color-mix(in srgb,var(--good,#2E9C6E) 15%,transparent)}',
      '.gl-tip .gs.sek{color:var(--amber,#B8721E);background:color-mix(in srgb,var(--amber,#B8721E) 15%,transparent)}',
      '.gl-tip .gs.own{color:var(--violet,#5965B8);background:color-mix(in srgb,var(--violet,#5965B8) 15%,transparent)}',
      '.gl-tip .gs.open{color:var(--nv-muted);border:1px dashed var(--nv-line)}',
      '.gl-tip .gd{font-size:13px;line-height:1.55;color:var(--ink-soft,var(--nv-ink));display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden}',
      '.gl-tip .gf{display:flex;justify-content:flex-end;margin-top:10px;padding-top:9px;border-top:1px solid var(--nv-line)}',
      '.gl-tip .gf a{font-size:12px;font-weight:700;color:var(--nv-teal);text-decoration:none}',
      '.gl-tip .gf a:hover{text-decoration:underline}',
      '@media (prefers-reduced-motion:reduce){.gl-tip{transition:none}}'
    ].join('')); document.head.appendChild(gst);
    fetch(docHref(GLOSS_FILE)).then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) {
      if (!html) return;
      var g = new DOMParser().parseFromString(html, 'text/html'), data = {};
      Array.prototype.forEach.call(g.querySelectorAll('.term h3[id]'), function (h) {
        var term = h.closest('.term'), st = term.querySelector('.st'), def = term.querySelector('.def');
        data[h.id] = { name: h.textContent.trim(), st: st ? st.className.replace('st', '').trim() : '', stl: st ? st.textContent.trim() : '', def: def ? def.textContent.replace(/\s+/g, ' ').trim() : '' };
      });
      markTerms(data);
    }).catch(function () {});
  }
  function markTerms(data) {
    var root = Array.prototype.filter.call(document.querySelectorAll('.wrap'), function (n) { return !n.closest('.topbar'); });
    if (!root.length) return;
    var SKIP = 'a,h1,h2,h3,h4,code,pre,button,svg,script,style,.ref,.chip,.topbar,.foot,.nv-next,.gl-t,.meta,.ksrc,.lede-skip,[data-no-gloss]';
    var done = {};
    root.forEach(function (r) {
      var walker = document.createTreeWalker(r, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
        if (!n.nodeValue || n.nodeValue.length < 4) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        return p && !p.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      } });
      var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (n) {
        GLOSSAR.forEach(function (gp) {
          var id = gp[0]; if (done[id] || !data[id] || !n.parentNode) return;
          // Nicht in Wortzusammensetzungen wie „Gamification-Prinzipien" markieren
          var re = new RegExp(gp[1].source + '(?![-\u2011\u00AD])', gp[1].flags);
          var m = re.exec(n.nodeValue); if (!m) return;
          var after = n.splitText(m.index); after.splitText(m[0].length);
          var span = el('span', 'gl-t', m[0]);
          span.tabIndex = 0; span.setAttribute('role', 'button'); span.setAttribute('aria-describedby', 'gl-tip');
          span.dataset.gl = id;
          after.parentNode.replaceChild(span, after);
          done[id] = true;
          n = span.nextSibling && span.nextSibling.nodeType === 3 ? span.nextSibling : n;
        });
      });
    });
    if (Object.keys(done).length) wireTips(data);
  }
  function wireTips(data) {
    var tip = el('div', 'gl-tip'); tip.id = 'gl-tip'; tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
    var cur = null, hideT = null;
    function show(t) {
      clearTimeout(hideT);
      var d = data[t.dataset.gl]; if (!d) return;
      if (cur && cur !== t) cur.classList.remove('on');
      cur = t; t.classList.add('on');
      tip.innerHTML = '<div class="gh"><span class="gi">' + ICON_BOOK + '</span><span class="gn"></span>' + (d.stl ? '<span class="gs ' + d.st + '"></span>' : '') + '</div><div class="gd"></div><div class="gf"><a>Im Glossar nachlesen →</a></div>';
      tip.querySelector('.gn').textContent = d.name;
      if (d.stl) tip.querySelector('.gs').textContent = d.stl;
      tip.querySelector('.gd').textContent = d.def;
      tip.querySelector('a').href = docHref(GLOSS_FILE) + '#' + t.dataset.gl;
      var r = t.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, vw = innerWidth, vh = innerHeight;
      var x = Math.max(12, Math.min(r.left + r.width / 2 - w / 2, vw - w - 12));
      var y = r.bottom + 10; if (y + h > vh - 12 && r.top - h - 10 > 12) y = r.top - h - 10;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
      tip.classList.add('on');
    }
    function hide(delay) {
      clearTimeout(hideT);
      hideT = setTimeout(function () { tip.classList.remove('on'); if (cur) cur.classList.remove('on'); cur = null; }, delay || 0);
    }
    Array.prototype.forEach.call(document.querySelectorAll('.gl-t'), function (t) {
      t.addEventListener('mouseenter', function () { show(t); });
      t.addEventListener('mouseleave', function () { hide(180); });
      t.addEventListener('focus', function () { show(t); });
      t.addEventListener('blur', function () { hide(180); });
      t.addEventListener('click', function (e) { e.stopPropagation(); if (cur === t && tip.classList.contains('on')) hide(); else show(t); });
      t.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
    });
    tip.addEventListener('mouseenter', function () { clearTimeout(hideT); });
    tip.addEventListener('mouseleave', function () { hide(180); });
    document.addEventListener('click', function (e) { if (!tip.contains(e.target)) hide(); });
    window.addEventListener('scroll', function () { if (tip.classList.contains('on')) hide(); }, { passive: true });
  }
})();
