# 🚀 ALFAHOSTING UPLOAD - FINALE ANLEITUNG

## ✅ PROJEKT KOMPLETT NEU ERSTELLT UND VERIFIZIERT

### 📁 Was Sie zu Alfahosting hochladen:

**Den kompletten Inhalt des `dist/` Ordners (NICHT den Ordner selbst!)**

## 📋 SCHRITT-FÜR-SCHRITT UPLOAD:

### 1. 📥 Dateien von GitHub herunterladen:
```bash
git clone https://github.com/Gosslar/Jagd.git
cd Jagd
npm install
npm run build
```

### 2. 📂 Upload-Dateien (aus dist/ Ordner):

#### ✅ HTML-Dateien (direkt ins Root):
- **index.html** ← HAUPTSEITE (MUSS ins Root!)
- **diagnose.html** ← Diagnose-Tool
- **fallback.html** ← Fallback-Version
- **static.html** ← Statische Version
- **test-root.html** ← Test-Seite

#### ✅ Weitere Root-Dateien:
- **favicon.ico** ← Website-Icon
- **robots.txt** ← SEO-Datei
- **placeholder.svg** ← Platzhalter

#### ✅ Assets-Ordner (komplett hochladen):
```
assets/
├── index-*.js          ← React-App (mehrere JS-Dateien)
├── index-*.css         ← Styles
├── html2canvas-*.js    ← PDF-Generation
├── purify-*.js         ← Sicherheit
└── *.map              ← Source-Maps
```

#### ✅ Images-Ordner (komplett hochladen):
```
images/
├── weetzen.jpg                    ← Hauptbild
├── alpenlaendische_dachsbracke_*  ← Jagdhunde
├── brandlbracke_*                 ← Jagdhunde
├── deutsche_bracke_*              ← Jagdhunde
├── reh_*                          ← Rehwild
├── wildschwein_*                  ← Schwarzwild
├── ente_*                         ← Federwild
├── gans_*                         ← Federwild
├── hase_*                         ← Haarwild
├── fuchs_praedator_*              ← Prädatoren
├── dachs_praedator_*              ← Prädatoren
├── marder_praedator_*             ← Prädatoren
├── waschbaer_praedator_*          ← Prädatoren
├── nutria_praedator_*             ← Prädatoren
├── jagd_wildlife_*                ← Jagd-Szenen
├── jagd_einrichtungen_*           ← Einrichtungen
├── rehkitzrettung_*               ← Rehkitzrettung
├── wildfleisch_*                  ← Wildfleisch-Produkte
├── wildarten_*                    ← Allgemeine Wildarten
└── praedatoren_*                  ← Allgemeine Prädatoren
```

## 🌐 UPLOAD-PROZESS:

### ✅ Option A: FTP-Upload (Empfohlen)
1. **FTP-Client öffnen** (FileZilla, WinSCP)
2. **Alfahosting FTP-Daten eingeben**
3. **Navigieren zu htdocs/ oder public_html/**
4. **Alle Dateien aus dist/ hochladen:**
   - Alle HTML-Dateien → Root-Verzeichnis
   - assets/ Ordner → Root-Verzeichnis
   - images/ Ordner → Root-Verzeichnis
   - Alle anderen Dateien → Root-Verzeichnis

### ✅ Option B: File Manager
1. **Alfahosting Control Panel** einloggen
2. **File Manager** öffnen
3. **Zu htdocs/ navigieren**
4. **Upload starten** (kann bei ~112MB dauern)

## 📊 UPLOAD-VERIFIKATION:

### ✅ Nach Upload prüfen:
```
htdocs/
├── index.html          ← MUSS vorhanden sein!
├── diagnose.html       ← Diagnose-Tool
├── fallback.html       ← Fallback
├── static.html         ← Statisch
├── test-root.html      ← Test
├── favicon.ico         ← Icon
├── robots.txt          ← SEO
├── placeholder.svg     ← Platzhalter
├── assets/             ← JavaScript & CSS Ordner
│   ├── index-*.js      ← React-App Dateien
│   ├── index-*.css     ← Style-Dateien
│   └── ...            ← Weitere Assets
└── images/             ← Bilder-Ordner
    ├── weetzen.jpg     ← Hauptbild
    ├── *.jpeg          ← Alle Jagdbilder
    └── ...            ← 80+ weitere Bilder
```

### ✅ Upload-Statistik:
- **Gesamtgröße:** ~112MB
- **HTML-Dateien:** 5 Dateien
- **JavaScript-Dateien:** 6+ Dateien
- **CSS-Dateien:** 1 Hauptdatei
- **Bilder:** 83+ Bilder
- **Gesamt:** 180+ Dateien

## 🎯 NACH DEM UPLOAD:

### ✅ Website testen:
1. **Hauptseite aufrufen:** `https://ihre-domain.de`
2. **Sollte anzeigen:** Jagdrevier Weetzen Hauptseite
3. **Bilder prüfen:** Alle Bilder sollten laden
4. **Navigation testen:** Alle Bereiche erreichbar

### ✅ Fallback-Seiten:
- **`/diagnose.html`** → Problemdiagnose
- **`/fallback.html`** → Falls React nicht lädt
- **`/static.html`** → Reine HTML-Version

### ✅ Erwartete Funktionalität:
- **🦌 Jagdrevier-Hauptseite** mit allen Bereichen
- **🥩 Wildfleisch-Shop** mit Kategorien und Bildern
- **🐕 Jagdhunde-Bereiche** mit allen Rassen
- **🦆 Wildarten-Galerie** mit allen Bildern
- **🛡️ Prädatorenmanagement** vollständig
- **📱 Responsive Design** auf allen Geräten

## ⚠️ WICHTIGE HINWEISE:

### ✅ Ordnerstruktur beibehalten:
- **index.html MUSS ins Root-Verzeichnis!**
- **assets/ Ordner komplett hochladen**
- **images/ Ordner komplett hochladen**
- **Keine Unterordner für HTML-Dateien**

### ✅ Dateiberechtigungen:
- **Dateien:** 644 (rw-r--r--)
- **Ordner:** 755 (rwxr-xr-x)

### ✅ Bei Problemen:
1. **Weiße Seite:** → `/fallback.html` aufrufen
2. **Bilder fehlen:** → Ordnerstruktur prüfen
3. **JavaScript-Fehler:** → `/diagnose.html` verwenden

---

## 🎉 ZUSAMMENFASSUNG:

**Laden Sie den kompletten Inhalt des `dist/` Ordners (~112MB, 180+ Dateien) in das Root-Verzeichnis Ihres Alfahosting Webspaces hoch. Die Website wird dann unter Ihrer Domain vollständig funktional sein!**

**GitHub-Repository:** https://github.com/Gosslar/Jagd.git