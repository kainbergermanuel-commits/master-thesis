# Master-Thesis · KlassenHub

Öffentliche Arbeitsdokumentation für die Master-Thesis „Digitale Schulkommunikation
als Entwicklungsfeld schulischer Leadership" (Hochschullehrgang Schulmanagement &
Leadership, PH NÖ) — eine qualitative Untersuchung zur Erprobung der selbst
entwickelten Schulklassen-App **KlassenHub**. KlassenHub selbst ist Untersuchungs­
gegenstand der Studie; die empirische Erprobung beginnt mit dem ersten
Schulsemester ab September 2026.

Gedacht vor allem als vorzeigbare, versionierte Grundlage für die
Betreuungsgespräche — die Git-Historie ist zugleich Fortschritts-Nachweis.

Bewusst kuratiert: Rohnotizen, Quellenbewertungen und private Vorbereitungen
liegen separat im lokalen Arbeitsordner und werden nicht 1:1 hierher
übernommen — hier stehen nur präsentable, abgeschlossene Inhalte.

## Stand (03.08.2026)

| | |
|---|---|
| **Seiten** | 21 (Startseite + 20 Dokumente unter `docs/`) |
| **Literaturbestand** | 50 aktive Quellen, einzeln bewertet, in zehn Kategorien; 3 begründet ausgesondert |
| **Erklärte Lücken** | 3 von 4 geschlossen; offen bleibt allein der österreichische Kontext (Ordner 07), bewusst bis zur Klärung mit der Betreuung |
| **Forschungsfrage** | dreimal präzisiert (25.07., 31.07., 03.08.2026), zuletzt um den Leadership-Bezug erweitert |
| **Exposé** | erster vollständiger Entwurf, liegt privat als `.docx` in der PH-Vorlage |
| **Empirie** | noch nicht begonnen; Erhebung ab September 2026 |

**Erstes Fachgespräch** (Explikation, 10 % der Note) fand am 03.08.2026 statt.

### Wo was steht

Die Dokumente sind auf der Startseite in drei Ebenen geordnet, und diese Ordnung
ist die eigentliche Navigationshilfe:

- **Ebene 1 — Die Arbeit.** Forschungsfrage, Design, Literatur, Ethik, Begriffe,
  Rahmenbedingungen. Das, worauf die Betreuungsgespräche zielen. Acht Dokumente.
- **Ebene 2 — Der Gegenstand.** Der App-Systemüberblick als Grundlage des Kapitels
  „Beschreibung der App". Code-basiert, mit sauberer Trennung von Belegtem und
  Interpretiertem.
- **Ebene 3 — Entwicklungsdokumentation.** Zehn Dokumente zum Entstehungsprozess der
  App, gebündelt auf einer Sammelseite. Sie belegen den Prozess, tragen aber nicht die
  Forschungsargumentation.

Neue Dokumente werden der passenden Ebene zugeordnet, nicht einfach angehängt.

### Was hier bewusst nicht liegt

Der eigentliche Arbeitsordner (`klassenhub thesis`, nicht öffentlich) enthält die
PDFs des Literaturbestands, die Guideline-Dokumente der PH NÖ, das Exposé und die
Gesprächsvorbereitungen. Maßgeblich für Literaturangaben ist trotzdem das Dokument
in **diesem** Repo (`docs/2026-07-literaturverzeichnis.html`): Ältere Kopien im
Arbeitsordner sind divergent und werden nicht gepflegt.

### Zahlen, die zusammenpassen müssen

Ändert sich der Literaturbestand, sind **vier** Orte nachzuziehen, sonst
widersprechen sie einander:

1. `docs/2026-07-literaturverzeichnis.html` — Quellenkarten und Kopfzahl
2. `docs/2026-07-literaturkarte.html` — Tabellenzeilen, Filterleiste, Kopfzahl
3. `index.html` — Stand-Block und die beiden Dokumentkarten
4. `papers and references/README.md` im Arbeitsordner — Ordnertabelle

Der Stand-Block auf der Startseite veraltet erfahrungsgemäß zuerst.


## Struktur

```
index.html          Übersichtsseite (Timeline, Dokumenten-Übersicht)
assets/theme.css     geteiltes Design-System (Tokens, Basis-Komponenten)
docs/*.html          einzelne Dokumente (Konzepte, Entwürfe, Notizen)
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
   in der Datei ergänzen — nicht in `theme.css`, damit die geteilte Basis
   schlank bleibt.
5. In `index.html` unter „Dokumente" eine neue `.doc-card` ergänzen — in der
   passenden Ebene (siehe „Wo was steht").
6. Vor dem Commit prüfen: Tag-Balance, keine verschachtelten `<a>` (die Doc-Karten
   sind selbst Links, ein Link darin zerlegt die Karte), und alle verwendeten
   CSS-Klassen in `theme.css` oder im lokalen `<style>`-Block definiert.

## Design-System

Farb-Tokens, Typografie-Paarung (Bricolage Grotesque / Hanken Grotesque) und
die Komponenten-Bausteine (Topbar, Hero, Chips, Karten, Tabellen, Timeline,
Phasen-Roadmap …) sind bewusst identisch zur KlassenHub-App gehalten — die
Thesis dokumentiert ein Produkt, dessen visuelle Sprache sie mitträgt. Beide
Farbschemata (hell/dunkel) werden über CSS-Variablen bedient, sowohl über
`prefers-color-scheme` als auch über ein manuelles `data-theme`-Attribut.

## GitHub Pages einrichten

1. Repo auf GitHub erstellen (öffentlich — private Pages brauchen einen
   bezahlten Plan) und diesen lokalen Ordner als Remote verbinden.
2. Push auf `main`.
3. Auf GitHub: **Settings → Pages → Source: Deploy from a branch → Branch:
   `main` / `/ (root)`** → Speichern.
4. Nach kurzer Zeit ist die Seite unter
   `https://<username>.github.io/master-thesis/` erreichbar.

## Lokale Vorschau

Kein Build-Schritt nötig — reines HTML/CSS. Einfach lokal servieren, damit
relative Pfade (`assets/…`, `docs/…`) korrekt auflösen:

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```
