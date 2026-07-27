# Qualitätsprüfung

## Vor jedem Commit

- [x] `npm run build` läuft ohne Fehler.
- [x] Keine ungeprüften Inhalte wurden als sicher dargestellt.
- [x] Alle internen Links und Sprungmarken funktionieren.
- [x] Telefonlinks verwenden `tel:+4965347493854`.
- [x] Aktuelle Seite ist in der Navigation erkennbar.
- [x] Navigation lässt sich per Tastatur öffnen, schließen und verlassen.
- [x] Fokus ist auf allen interaktiven Elementen sichtbar.
- [x] Bedeutungsvolle Bilder haben passende Alternativtexte.
- [x] Keine horizontale Überbreite bei 320, 390, 768 und 1440 px.
- [x] Primäre Handlung ist im ersten mobilen Bildschirm verständlich.
- [x] Öffnungszeiten, Telefonnummer und Route sind mobil schnell erreichbar.
- [x] Speisekarte ist mobil ohne PDF, Zoom oder horizontales Seitenscrollen lesbar.
- [x] Speisekarten-Kategorien schließen mobil ohne übergroße Leerflächen in einem gleichmäßigen Abstand aneinander an.
- [x] Kategorien, Reservierung, Öffnungszeiten und Anfahrt sind direkt verlinkt.
- [x] `prefers-reduced-motion` wird respektiert.
- [x] Konsole enthält keine Fehler.

## Vor Veröffentlichung fachlich bestätigen

- [x] Saisonöffnungszeiten aus VisitMosel und Ortsplan Brauneberg 2026
- [x] Veröffentlichte Speisekarte und Preise vom bestehenden Betriebsauftritt mit sichtbarem Stand Juli 2026 übernommen
- [x] Namen und berufliche Angaben der Gastgeber aus VisitMosel
- [ ] Bildrechte
- [x] Impressum und Datenschutz für den aktuellen statischen GitHub-Pages-Stand ergänzt
- [x] Kontakt-/Reservierungsprozess: Telefon und E-Mail, kein vorgetäuschtes Formular

## Mobile-Optimierung im Branch

- [x] Breakpoints für 980, 680 und 360 px definiert
- [x] 320–360 px mit eigener Typografie- und Abstandsabsicherung
- [x] Mobile Navigation bei kleiner Bildschirmhöhe scrollbar
- [x] Fokus wird beim Öffnen gesetzt, innerhalb des Menüs gehalten und beim Schließen zurückgegeben
- [x] Escape schließt das Menü
- [x] Menü schließt beim Wechsel auf Desktop
- [x] Safe-Area-Abstände für moderne Smartphones berücksichtigt
- [x] Primäre Buttons mindestens 44 px hoch
- [x] Speisekarten-Sprunglinks mindestens 44 px hoch
- [x] Telefonreservierung im ersten mobilen Bildschirm erreichbar
- [x] Hervorgehobene Telefonhandlungen sind visuell als Anruf erkennbar und
      bleiben für Screenreader eindeutig beschriftet
- [x] Mehrspaltige Inhalte werden einspaltig
- [x] Pferde-Informationsreihen verlieren mobil ihre seitlichen Trennlinien
- [x] Reitschulbereiche einschließlich Termine sind über fünf direkte Sprunglinks erreichbar
- [x] Der nächste Ferientermin ist auf Start- und Reitschulseite auffindbar
- [x] Termin, Uhrzeit, Alter, Beitrag, enthaltene Verpflegung und Mitbringliste stimmen mit dem Betriebsauftritt überein
- [x] Der Terminbereich verspricht keine Verfügbarkeit und führt zur telefonischen Anfrage
- [x] Das verlinkte KI-Flyermotiv wurde nicht als vermeintlich authentisches Foto eingesetzt; die plakatartige Wirkung entsteht mit einem realen Bestandsmotiv
- [x] Terminmotiv, Daten, Leistungen und telefonische Anfrage bleiben mobil in einer eindeutigen Leserichtung
- [x] Das Pferde-Bildpaar der Startseite behält mobil seine natürlichen Ausschnitte und exakt dieselbe Inhaltsbreite
- [x] Verkaufspferde sind mobil als tastaturbedienbare Details gegliedert
- [x] Verfügbarkeit und Stand der Verkaufspferde werden transparent benannt
- [x] Jedem Verkaufspferd ist sein offizielles Originalfoto eindeutig zugeordnet
- [x] Verkaufspferde-Fotos bleiben mobil kompakt und ohne Layoutsprung erfassbar
- [x] Jedes Verkaufspferd zeigt beim Öffnen sein vollständiges Originalfoto in einer großen Detailansicht
- [x] Pferde-Großansichten bleiben mobil unbeschnitten und nutzen die verfügbare Inhaltsbreite
- [x] Magnus wird mit drei belegten Originalaufnahmen statt als reiner Datenblock vorgestellt
- [x] Drei veröffentlichte Nachzuchtbilder sind eindeutig vom Verkaufspferde-Katalog getrennt
- [x] Magnus-Bereich führt direkt zu Verkaufspferden und Pferdeanfrage
- [x] Kartenansicht und große Bilder erhalten mobile Höhen
- [x] Horizontale Seitenüberläufe werden verhindert
- [x] Bewegungsreduktion wird respektiert
- [x] Scroll-up-Button ist touchfreundlich, tastaturbedienbar und bewegungsreduziert
- [x] Geräteemulation mit echten CSS-Viewports bei 320, 390, 768 und 1440 px
- [x] Alle Kernseiten bei 390 px ohne horizontalen Überlauf geprüft
- [x] Mobile Navigation bei 320, 390 und 768 px geöffnet, geschlossen und per Escape bedient
- [x] Kritische Bildressourcen mit HTTP-Status 200 geprüft
- [x] Hero-Bild lädt mobil die 640-px-Variante und auf großen Ansichten die passende größere Quelle
- [ ] Abschließender Sichttest auf realem iPhone und Android-Gerät

## Referenzqualität

- [x] Keine generischen KI-Floskeln oder austauschbare Stockmotive
- [x] Gastronomie führt klar, Pferde differenzieren
- [x] Startseite erzählt einen schlüssigen Besuchsweg
- [x] Desktop und Mobil wurden visuell geprüft
- [x] Vorher-/Nachher-Erkenntnisse sind in `docs/CASE-STUDY.md` faktenbasiert dokumentiert

## Technische Endabnahme

- [x] Sieben Seiten einschließlich eigener 404-Seite werden gebaut und synchronisiert
- [x] Automatische Prüfung auf eindeutige Titel, Beschreibungen und Canonical-URLs
- [x] Noindex-Regeln und Sitemap-Inhalt stimmen überein
- [x] Überschriftenfolge, Fokusziel, Sprunglink und aktuelle Navigation geprüft
- [x] Keine internen Designkommentare oder Platzhalter im ausgelieferten HTML
- [x] JSON-LD ist syntaktisch gültig und nur auf indexierbaren Seiten vorhanden
- [x] Keine externen Skripte, Tracker, eingebetteten Karten oder externen Schriften
- [x] CSS, JavaScript und jedes Bild bleiben innerhalb definierter Größenbudgets
- [x] 35 Live-Kombinationen aus sieben Seiten und fünf Breiten ohne Überlauf, defekte Bilder oder zu kleine nicht-inline Bedienelemente
- [x] Mobile Navigation öffnet und schließt korrekt, hält den Fokus und reagiert auf Escape
- [x] Scroll-up-Button funktioniert per Touch/Klick; Tastaturpfad verwendet keine Bewegung
- [x] Scroll-up-Button startet bereits im HTML außerhalb der Tab-Reihenfolge
- [x] Laufzeitsimulation prüft Menü, Fokusfalle, Escape, Breakpoint-Wechsel, Scrollfortschritt und Bewegungsreduktion
- [x] Pull Requests und Deployments führen den vollständigen Qualitätscheck automatisiert aus
- [x] Reale nicht vorhandene URL liefert die markengerechte 404-Seite mit Noindex
- [x] Verschachtelte unbekannte URLs laden die 404-Seite mit korrekten Styles, Logo und Rücklinks
- [x] Nach jedem Deployment werden alle Live-Seiten, die verschachtelte 404-Seite und lokale Ressourcen automatisch geprüft
- [x] Browserkonsole im finalen Live-Stand ohne Fehler
- [x] Verwendete Kernfarbpaare erfüllen mindestens WCAG AA; gemessene Kontraste 5,33:1 bis 16,15:1
- [x] Alle Fotografien bis zum ursprünglichen Upload im Repository zurückverfolgt; keine Stock- oder KI-Fotografien ergänzt
- [ ] Bildrechte durch den Betrieb schriftlich bestätigt
- [ ] Betriebsinhaber und Rechtsform sowie – soweit vorhanden – Vertretungsberechtigte, Register-, Umsatzsteuer- oder Wirtschafts-Identifikationsnummer durch den Betrieb oder Rechtsberater bestätigt
- [ ] Abschließender Sicht- und Bedienungstest auf realem iPhone und Android-Gerät

Die beiden betriebsseitigen Bestätigungen werden mit `docs/FREIGABE.md`
strukturiert eingeholt. Die unterschriebene Fassung gehört nicht in das
öffentliche Repository.
