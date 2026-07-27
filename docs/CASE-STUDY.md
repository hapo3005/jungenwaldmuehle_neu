# Fallstudie Jungenwaldmühle

## Kurzfassung für Jans Unternehmenspräsentation

Die Jungenwaldmühle verbindet Restaurant, Hofcafé, Ponyhof, Reitschule und
Islandpferdezucht an einem ruhigen Ort bei Brauneberg. Die neue Website ordnet
diese Vielfalt wirtschaftlich klar: Gastronomie und telefonische Reservierung
führen, während Pferdehaltung und Reitschule das unverwechselbare Profil des
Betriebs sichtbar machen.

Das Ergebnis ist eine eigenständige, mobile Website mit authentischen Bildern,
direktem Kontaktweg und einem dokumentierten Qualitätsprozess. Es werden keine
Umsatz-, Reservierungs- oder Reichweitensteigerungen behauptet, solange dafür
keine belastbaren Betriebsdaten vorliegen.

## Belegter Ausgangsstand

Am 27. Juli 2026 wurde der erreichbare SimDif-Auftritt unter
`https://jungenwaldmuehle.simdif.com/` im mobilen Browser geprüft.

Beobachtbare Merkmale:

- Seitentitel nur „Jungenwaldmühle“
- zwei H1-Überschriften auf der Startseite
- Einstieg über eine allgemeine Begrüßung
- Ponyhof, Restaurant und Hofcafé gemeinsam in einer langen Überschrift
- keine telefonische Tischreservierung als primäre Handlung im ersten
  mobilen Bildschirm
- sichtbarer SimDif-Werbehinweis im Seiteninhalt
- sechs Skript- und sechs Stylesheet-Ressourcen im geprüften Dokument

Diese Punkte beschreiben ausschließlich den am genannten Datum sichtbaren
Stand. Sie sind keine Bewertung des Betriebs oder seiner gastronomischen
Qualität.

## Geschäftsproblem

Der Betrieb hat mehrere attraktive Angebotsbereiche, aber Besucher kommen mit
unterschiedlichen Absichten:

1. essen, Kuchen genießen oder einen Tisch reservieren,
2. Öffnungszeiten und Anfahrt prüfen,
3. Reitunterricht oder Ponyhof kennenlernen,
4. Informationen über die Islandpferdezucht suchen.

Ohne klare Priorisierung konkurrieren diese Anliegen miteinander. Für den
wirtschaftlichen Nutzen muss die häufigste und direkt umsatznahe Handlung –
die Tischreservierung – sofort erreichbar sein, ohne die Pferdebereiche zu
verstecken.

## Strategische Entscheidung

- Gastronomie führt die Startseite und Hauptnavigation.
- Telefonische Reservierung ist der primäre Handlungsweg.
- Öffnungszeiten, Telefonnummer und Route sind mobil schnell erreichbar.
- Reitschule und Islandpferde erhalten eigenständige, glaubwürdige Seiten.
- Die Bildsprache verwendet nur vorhandene Fotografien des Betriebs.
- Inhalte bleiben konkret, regional und frei von erfundenen Auszeichnungen,
  Speisen, Preisen oder Erfolgszahlen.

## Gestalterische Lösung

- eigenständige Wort-/Bildmarke mit Mühlrad- und Landschaftsbezug
- dunkles Waldgrün, warmes Papierweiß und ein zurückhaltender Ockerton
- charaktervolle Serifentypografie für Überschriften
- großzügige, bildgeführte Einstiege statt austauschbarer Kartenraster
- unterschiedliche Seitenrhythmen für Gastronomie, Reitschule und Zucht
- kompakte mobile Navigation mit deutlich erreichbarer Reservierung
- markengerechter Scroll-up-Button mit Fortschrittsanzeige

## Technische Lösung

- Eleventy, Nunjucks, Vanilla CSS und Vanilla JavaScript
- sieben gebaute Seiten einschließlich eigener 404-Seite
- keine externen Skripte, Tracker, eingebetteten Karten oder externen Schriften
- responsive Auslegung bis hinunter zu 280 px
- sichtbare Fokuszustände, Sprunglink, Fokusführung und
  `prefers-reduced-motion`
- eindeutige Titel, Beschreibungen, Canonical-URLs und strukturierte Daten
- Bildgrößen, JavaScript und CSS innerhalb festgelegter Budgets
- automatische Prüfung vor Pull Requests und jedem Pages-Deployment

## Nachweisbare Qualität

- 35 Kombinationen aus sieben Seiten und fünf Standardbreiten geprüft
- weitere 42 Kombinationen mit 280 px, kompakten Altgeräten,
  Handy-Querformat, Tablet-Querformat und 2560 px geprüft
- keine horizontale Überbreite in diesen Prüfungen
- alle aktiven Kernbilder geladen
- Browserkonsole ohne Fehler oder Warnungen
- Navigation, Fokusfalle, Escape, Breakpoint-Wechsel und Scroll-up-Verhalten
  automatisch simuliert
- `npm run check` und `npm audit --omit=dev` laufen in GitHub Actions
- Impeccable-Detektor ohne Befund

## Noch nicht behaupten

- mehr Reservierungen, Umsatz oder Besucher
- bessere Suchmaschinenpositionen
- eine bestimmte Ladezeit oder Lighthouse-Punktzahl ohne aktuellen Messbericht
- geschäftliche Ergebnisse ohne Zugriff auf vergleichbare Vorher-/Nachher-Daten

## Empfohlene Präsentationsstruktur

1. ein mobiler Vorher-Screenshot mit der allgemeinen Begrüßung,
2. der neue mobile Hero mit Reservierungsbutton,
3. Desktopansicht der neuen Startseite,
4. je eine Ansicht von Restaurant und Reitschule,
5. die strategische Erklärung „Gastronomie führt, Pferde differenzieren“,
6. die nachweisbaren technischen Qualitätsmerkmale,
7. Link zur veröffentlichten Website.

Vor der öffentlichen Nutzung von Vorher-/Nachher-Screenshots sind die
entsprechenden Bild- und Darstellungsrechte zu bestätigen.
