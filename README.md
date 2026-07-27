# Jungenwaldmühle – Website-Konzept

## GitHub Pages
1. Inhalt dieses Ordners in ein GitHub-Repository hochladen.
2. Settings → Pages.
3. Deploy from a branch, Branch `main`, Ordner `/ (root)`.

## Barrierefreiheit
Semantische Struktur, Skip-Link, sichtbare Fokuszustände, responsive Navigation, Alternativtexte, Formular-Labels und `prefers-reduced-motion`.

## Vor Veröffentlichung
Kontaktdaten, saisonale Öffnungszeiten und Gastgeberangaben sind in `docs/CONTENT.md` mit Quellen dokumentiert. Konkrete Speisen und Preise werden erst nach aktueller Freigabe des Betriebs veröffentlicht. Bildrechte und betriebsindividuelle Pflichtangaben bleiben vor der endgültigen kommerziellen Übernahme durch den Betrieb zu bestätigen.

## Lokale Prüfung

`npm run check` baut und synchronisiert alle Seiten, prüft SEO, Semantik,
Navigation, interne Ressourcen, Sitemap, strukturierte Daten und Dateibudgets
und führt zusätzlich den projektlokalen Impeccable-Detektor aus. Dafür ist nach
der Installation der Projektabhängigkeiten kein externer Paketabruf nötig.
