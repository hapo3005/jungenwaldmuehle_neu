# Designsystem Jungenwaldmühle

## Richtung

Die Website fühlt sich wie ein sorgfältig geführtes Landgasthaus an: dunkles Mühlengrün, warmes Papier, ehrliche Holz- und Naturtöne, großzügige Fotografie und eine ruhige redaktionelle Typografie. Sie zeigt nicht „Rustikalität“ als Dekoration, sondern reale Küche, Gastgeber und Landschaft.

## Komposition

- Der erste Bildschirm gehört einem echten Ortsbild, einer klaren Aussage und der telefonischen Reservierung.
- Inhalte folgen dem Besuchsweg: Begehren, kulinarischer Beweis, Gastgeber, praktische Planung, sekundäres Pferdeangebot.
- Asymmetrische Bild-Text-Kompositionen statt wiederholter Kartenraster.
- Großzügige, aber nicht filmisch überdehnte Abstände; mobile Entscheidungen bleiben kompakt.
- Eine feine horizontale Linie und klare Flächenwechsel strukturieren, nicht Schattenboxen.

## Farbe

- `--paper: #f2eee4` – warmer Grund
- `--paper-deep: #e5ddce` – ruhige Absetzung
- `--ink: #172019` – Text
- `--forest: #17372b` – tragende Markenfläche
- `--moss: #526b55` – sekundäre Information
- `--ochre: #b77a36` – sparsame Wärme und Fokus
- Weiß auf Dunkelgrün und Dunkelgrün auf Papier müssen WCAG-konform bleiben.

## Typografie

- Display: charaktervolle, lokal eingebundene oder robuste Serifenschrift; bis dahin Georgia als ehrlicher Fallback.
- Text und Navigation: nüchterner System-Sans-Stack.
- Überschriften bleiben breit, höchstens drei Zeilen und verwenden keine künstlichen Zeilenumbrüche auf Mobilgeräten.
- Kleine Kennzeichnungen erscheinen in Satzform, nicht als überall wiederholte Großbuchstaben-Eyebrows.

## Bilder

- Ausschließlich reale Bilder der Jungenwaldmühle, ihrer Speisen, Räume, Terrasse und Pferde.
- Großzügige, redaktionelle Ausschnitte; keine Collagen aus vielen gleichwertigen Kacheln.
- Keine KI-Bilder, Stockfotos, künstlichen Lichtlecks oder generischen Textur-Overlays.
- Bildausschnitte auf Mobilgeräten bewusst per `object-position` führen.

## Logo

- Das Signet abstrahiert ein Mühlrad über zwei Wasserlinien. Es leitet sich ausschließlich aus dem Namen und der belegten historischen Wassermühle ab.
- Keine erfundene Jahreszahl, kein Wappen und keine zusätzlichen Herkunfts- oder Traditionsbehauptungen.
- Primäranwendung ist das runde Signet in Mühlengrün und warmem Papier; der Ockerton markiert nur die Radnabe.
- In der Navigation bildet das Signet mit dem gesetzten Namen und der Angebotszeile die verbindliche Wort-Bild-Marke.
- Das Signet darf nicht gestreckt, gedreht, eingefärbt, mit Effekten versehen oder kleiner als 40 CSS-Pixel dargestellt werden.

## Interaktion

- Reservierung ist als Telefonnummer beschriftet, nicht als unehrlich automatisierter Buchungsvorgang.
- Primäre CTAs sind ruhige, rechteckige Flächen mit klarer Pfeilführung;
  sekundäre CTAs erscheinen als redaktionelle Linienlinks statt als isolierte
  Kreise oder generische Pillen.
- Rufnummern stehen immer ungebrochen und zurückhaltend; Buttons benennen die
  konkrete Handlung statt nur eine nackte Telefonnummer zu zeigen.
- Buttons reagieren beim Drücken dezent mit `scale(.97)`.
- Hover nur auf Geräten mit präzisem Zeiger.
- Mobile Navigation ist ein klarer, bildschirmfüllender Entscheidungsraum mit sofort sichtbarer Telefonnummer.
- Abläufe werden über Überschriften und feine Trennlinien gegliedert; dekorative Schrittziffern werden nicht verwendet.
- Bewegung unterstützt Orientierung und bleibt unter 260 ms; keine Scrollshow und keine dekorative Dauermotion.

## Verbote

- Keine generischen Drei-Karten-Reihen als primäre Seitengrammatik.
- Keine Pillen, Glaseffekte, Farbverläufe auf Text, Icon-Kacheln oder „Premium“-Floskeln.
- Keine unbestätigten Preise, Verfügbarkeiten oder Gästestimmen als Tatsachen.
- Keine konkurrierenden primären Handlungsaufforderungen im ersten Bildschirm.
