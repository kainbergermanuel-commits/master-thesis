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
5. In `index.html` unter „Dokumente" eine neue `.doc-card` ergänzen.

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
