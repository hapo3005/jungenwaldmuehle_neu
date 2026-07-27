# Gemeinsame Arbeitsregeln

Alle Coding-Agenten lesen vor Änderungen `PRODUCT.md`, `DESIGN.md`, `docs/CONTENT.md`, `docs/VOICE.md` und `docs/QA.md`.

- Eleventy, Nunjucks und Vanilla CSS/JavaScript bleiben bestehen.
- Änderungen erfolgen primär in `src/`, `assets/` und den Projektgedächtnis-Dateien.
- Root-HTML wird erst nach erfolgreichem Build aus dem generierten Stand synchronisiert.
- Keine Platzhalter, erfundenen Inhalte, Bewertungen, Auszeichnungen oder Preise.
- Persönliche Texte folgen der Gastgeberstimme aus `docs/VOICE.md`; Preise, Termine, Pferdedaten, rechtliche Angaben und Sicherheitshinweise bleiben sachlich.
- Reale Bilder zuerst; keine Stock- oder KI-Bilder.
- Gastronomie und telefonische Reservierung sind der primäre wirtschaftliche Pfad.
- Ponyhof/Reitschule und Islandpferde sind eigenständige Sekundärpfade.
- Kein ungefragter Framework-, Hosting- oder Formularanbieter-Wechsel.
- Desktop und Mobil müssen nach jeder wesentlichen UI-Änderung geprüft werden.
- Tastatur, Fokus, reduzierte Bewegung, Kontrast und semantische Struktur sind Pflicht.
- Keine Änderung gilt als fertig, bevor `npm run check` einschließlich lokalem Impeccable-Detektor erfolgreich war und `docs/QA.md` abgearbeitet wurde.

