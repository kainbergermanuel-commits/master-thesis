/* ==========================================================================
   Mitscrollendes Inhaltsverzeichnis

   Baut sich selbst aus dem vorhandenen Markup: jede <section id="…"> mit einer
   Überschrift wird ein Eintrag. Kein zusätzliches Markup je Seite nötig — neue
   Abschnitte tauchen automatisch auf.

   Verhalten: standardmäßig nur eine Reihe kurzer Striche am rechten Rand,
   der aktive Abschnitt ist hervorgehoben. Bei Mouseover oder Tastaturfokus
   klappt die Leiste zu den Titeln auf. Unter 1080px Breite (kein Seitenrand
   mehr vorhanden) und im Druck bleibt sie aus.
   ========================================================================== */
(function () {
  var MIN_SECTIONS = 3;      // kürzere Seiten brauchen keine Sprungmarken

  // Bewusst KEINE Breitenprüfung hier: das Ausblenden auf schmalen Fenstern
  // übernimmt die Media-Query in theme.css. Würde das Skript die Breite beim
  // Laden abfragen, entstünde das Verzeichnis bei einem anfangs schmalen Fenster
  // nie — auch dann nicht, wenn man es später breit zieht.

  var items = [];
  document.querySelectorAll('section[id]').forEach(function (sec) {
    var h = sec.querySelector('.sec-head h2, h2');
    if (h) items.push({ el: sec, text: h.textContent });
  });
  if (items.length < MIN_SECTIONS) return;

  // Lange Überschriften kürzen: Untertitel nach Gedankenstrich weglassen,
  // danach hart auf 34 Zeichen begrenzen.
  function label(raw) {
    var t = raw.replace(/\s+/g, ' ').trim().split(/\s+[—–]\s+/)[0];
    return t.length > 34 ? t.slice(0, 33).trimEnd() + '…' : t;
  }

  var nav = document.createElement('nav');
  nav.className = 'toc';
  nav.setAttribute('aria-label', 'Abschnitte dieser Seite');

  var head = document.createElement('p');
  head.className = 'toc-h';
  head.textContent = 'Auf dieser Seite';
  nav.appendChild(head);

  var ol = document.createElement('ol');
  items.forEach(function (it) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + it.el.id;
    a.textContent = label(it.text);
    a.title = it.text.replace(/\s+/g, ' ').trim();
    li.appendChild(a);
    ol.appendChild(li);
    it.li = li;
  });
  nav.appendChild(ol);
  document.body.appendChild(nav);

  // Aktiven Abschnitt markieren. Das schmale Sichtband (oben unter der Topbar,
  // unten bei 60 % Höhe) sorgt dafür, dass jeweils nur ein Abschnitt zählt.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      items.forEach(function (it) {
        it.li.classList.toggle('on', it.el === e.target);
      });
    });
  }, { rootMargin: '-72px 0px -60% 0px', threshold: 0 });

  items.forEach(function (it) { io.observe(it.el); });
})();
