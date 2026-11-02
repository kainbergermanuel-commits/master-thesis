# Master-Thesis · KlassenHub

Öffentliche Arbeitsdokumentation für die Master-Thesis „Digitale Schulkommunikation
als Entwicklungsfeld schulischer Leadership" (Hochschullehrgang Schulmanagement &
Leadership, PH NÖ) – eine qualitative Untersuchung zur Erprobung der selbst
entwickelten Schulklassen-App **KlassenHub**. KlassenHub selbst ist Untersuchungs­
gegenstand der Studie; die empirische Erprobung beginnt mit dem ersten
Schulsemester ab September 2026.

Gedacht vor allem als vorzeigbare, versionierte Grundlage für die
Betreuungsgespräche – die Git-Historie ist zugleich Fortschritts-Nachweis.

Bewusst kuratiert: Rohnotizen, Quellenbewertungen und private Vorbereitungen
liegen separat im lokalen Arbeitsordner und werden nicht 1:1 hierher
übernommen – hier stehen nur präsentable, abgeschlossene Inhalte.

## Stand (02.11.2026)

| | |
|---|---|
| **Phase** | Feldphase: Erhebung 1 vorbereitet, Durchführung im November 2026 |
| **Seiten** | 33 (Startseite, 27 Dokumente, 5 Instrumentenseiten unter `docs/`) |
| **Mappe** | 58 Entwurfsdokumente als Markdown unter `mappe/` |
| **Literaturbestand** | 52 aktive Quellen, einzeln bewertet, in zehn Kategorien; Lückenanalyse für den Theorieteil abgeschlossen |
| **Forschungsfrage** | dreimal präzisiert, am 17.08.2026 mit der Betreuung abgestimmt |
| **Exposé** | am 17.08.2026 besprochen, inhaltlich ohne Einwände; liegt privat als `.docx` |
| **Empirie** | App seit Schulbeginn im Einsatz; Erhebung 1 dokumentiert unter `docs/2026-11-erhebung-1.html` |

**Fachgespräche:** erstes am 03.08.2026 (Explikation), Exposé-Besprechung am 17.08.2026.

**Zum Namen:** Die App heißt seit September 2026 **ClassHaven**, vorher **KlassenHub**. Ältere
Dokumente verwenden den alten Namen; die Startseite erklärt das.

### Wo was steht

**Aktuell: die Dokumentation der ersten Erhebungswelle liegt unter
`docs/2026-11-erhebung-1.html`** und ist auf der Startseite ganz oben verlinkt. Sie wird
bei jedem Schritt fortgeschrieben (Änderungsprotokoll am Seitenende).

Die Dokumente sind auf der Startseite in drei Ebenen geordnet, und diese Ordnung
ist die eigentliche Navigationshilfe:

- **Ebene 1 – Die Arbeit.** Forschungsfrage, Design, Literatur, Ethik, Begriffe,
  Rahmenbedingungen. Das, worauf die Betreuungsgespräche zielen. Acht Dokumente.
- **Ebene 2 – Der Gegenstand.** Der App-Systemüberblick als Grundlage des Kapitels
  „Beschreibung der App". Code-basiert, mit sauberer Trennung von Belegtem und
  Interpretiertem.
- **Ebene 3 – Entwicklungsdokumentation.** Zehn Dokumente zum Entstehungsprozess der
  App, gebündelt auf einer Sammelseite. Sie belegen den Prozess, tragen aber nicht die
  Forschungsargumentation.

Neue Dokumente werden der passenden Ebene zugeordnet, nicht einfach angehängt.

### Navigation

Alle Seiten binden `assets/nav.js` ein. Es ergänzt Brotkrumen in der Topbar, einen
Navigator mit Suche (Taste `/` oder Strg/⌘+K), „Weiterlesen" mit vorherigem und nächstem
Dokument derselben Ebene und einen „Nach oben"-Knopf. Auf der Startseite führt die
Pillenleiste über alle vier Ebenen.

**Darstellung:** Standard ist hell. Über den Knopf in der Kopfzeile (oder im Navigator)
lässt sich auf Dunkel oder Automatisch (folgt dem Gerät) umschalten; die Wahl wird im
Browser gespeichert. Jede Seite trägt dafür ein kleines Skript im `<head>`, das die Wahl
vor dem ersten Zeichnen setzt. Neue Seiten brauchen dieses Skript ebenfalls.

**Neue Dokumente müssen zusätzlich in `SITE` am Anfang von `assets/nav.js` eingetragen
werden**, an der Stelle, an der sie auf der Startseite stehen. Sonst fehlen sie im
Navigator und in der Weiterlesen-Kette.

### Was hier bewusst nicht liegt

Der eigentliche Arbeitsordner (`klassenhub thesis`, nicht öffentlich) enthält die
PDFs des Literaturbestands, die Guideline-Dokumente der PH NÖ, das Exposé und die
Gesprächsvorbereitungen. Maßgeblich für Literaturangaben ist trotzdem das Dokument
in **diesem** Repo (`docs/2026-07-literaturverzeichnis.html`): Ältere Kopien im
Arbeitsordner sind divergent und werden nicht gepflegt.

### Zahlen, die zusammenpassen müssen

Ändert sich der Literaturbestand, sind **vier** Orte nachzuziehen, sonst
widersprechen sie einander:

1. `docs/2026-07-literaturverzeichnis.html` – Quellenkarten und Kopfzahl
2. `docs/2026-07-literaturkarte.html` – Tabellenzeilen, Filterleiste, Kopfzahl
3. `index.html` – Stand-Block und die beiden Dokumentkarten
4. `papers and references/README.md` im Arbeitsordner – Ordnertabelle

Der Stand-Block auf der Startseite veraltet erfahrungsgemäß zuerst.


## Struktur

```
index.html          Übersichtsseite (Timeline, Dokumenten-Übersicht)
assets/theme.css     geteiltes Design-System (Tokens, Basis-Komponenten)
docs/*.html          einzelne Dokumente (Konzepte, Entwürfe, Notizen)
mappe/**/*.md        Praxisunterlagen zum Schulstart (Markdown, nicht gerendert)
```

Jede Datei unter `docs/` ist ein eigenständiges, selbst-enthaltenes HTML-
Dokument, das nur `assets/theme.css` einbindet und darüber hinaus einen
eigenen `<style>`-Block für seine spezifischen Komponenten mitbringt
(z. B. Quest-Karten, Arc-Karten). Das Fundament (Farben, Typografie, Cards,
Chips, Tabellen, Timeline …) kommt aus `assets/theme.css` und ist über alle
Seiten hinweg konsistent.

## Eine neue Seite hinzufügen

1. Neue Datei unter `docs/YYYY-MM-kurzer-titel.html` anlegen.
2. `<link rel="stylesheet" href="../assets/theme.css">` einbinden.
3. Im `<div class="topbar">` einen Zurück-Link auf `../index.html` setzen
   (siehe `docs/2026-07-gamification-konzept.html` als Vorlage).
4. Seiten-spezifische Komponenten in einem eigenen `<style>`-Block direkt
   in der Datei ergänzen – nicht in `theme.css`, damit die geteilte Basis
   schlank bleibt.
5. In `index.html` unter „Dokumente" eine neue `.doc-card` ergänzen – in der
   passenden Ebene (siehe „Wo was steht").
6. Vor dem Commit prüfen: Tag-Balance, keine verschachtelten `<a>` (die Doc-Karten
   sind selbst Links, ein Link darin zerlegt die Karte), und alle verwendeten
   CSS-Klassen in `theme.css` oder im lokalen `<style>`-Block definiert.

## Design-System

Farb-Tokens, Typografie-Paarung (Bricolage Grotesque / Hanken Grotesque) und
die Komponenten-Bausteine (Topbar, Hero, Chips, Karten, Tabellen, Timeline,
Phasen-Roadmap …) sind bewusst identisch zur KlassenHub-App gehalten – die
Thesis dokumentiert ein Produkt, dessen visuelle Sprache sie mitträgt. Beide
Farbschemata (hell/dunkel) werden über CSS-Variablen bedient, sowohl über
`prefers-color-scheme` als auch über ein manuelles `data-theme`-Attribut.

## GitHub Pages einrichten

1. Repo auf GitHub erstellen (öffentlich – private Pages brauchen einen
   bezahlten Plan) und diesen lokalen Ordner als Remote verbinden.
2. Push auf `main`.
3. Auf GitHub: **Settings → Pages → Source: Deploy from a branch → Branch:
   `main` / `/ (root)`** → Speichern.
4. Nach kurzer Zeit ist die Seite unter
   `https://<username>.github.io/master-thesis/` erreichbar.

## Lokale Vorschau

Kein Build-Schritt nötig – reines HTML/CSS. Einfach lokal servieren, damit
relative Pfade (`assets/…`, `docs/…`) korrekt auflösen:

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```
