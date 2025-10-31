# 🚀 Alfahosting Upload-Anleitung - Jagdrevier Weetzen

## 📁 Was Sie hochladen müssen:

### ✅ NUR den Inhalt des `dist/` Ordners!

**WICHTIG:** Laden Sie **NICHT** den `dist/` Ordner selbst hoch, sondern nur dessen **Inhalt**!

## 📋 Schritt-für-Schritt Anleitung:

### 1. 📥 Dateien von GitHub herunterladen:
```bash
git clone https://github.com/Gosslar/Jagd.git
cd Jagd
npm install
npm run build
```

### 2. 📂 Upload-Dateien vorbereiten:
**Laden Sie diese Dateien/Ordner zu Alfahosting hoch:**

```
📁 Ihr Alfahosting Webspace (htdocs/ oder public_html/)
├── 📄 index.html              ← Hauptseite (1.1KB)
├── 📄 diagnose.html           ← Diagnose-Tool (8.2KB)
├── 📄 fallback.html           ← Fallback-Version (11KB)
├── 📄 static.html             ← Statische Version (9.2KB)
├── 📄 test-root.html          ← Test-Seite (7.3KB)
├── 📄 favicon.ico             ← Website-Icon
├── 📄 robots.txt              ← SEO-Datei
├── 📄 placeholder.svg         ← Platzhalter
├── 📁 assets/                 ← JavaScript & CSS (63MB)
│   ├── index-BlhUzoKH.js      ← React-App
│   ├── index-CQZbmO-F.css     ← Styles
│   └── ... (weitere JS/CSS)
└── 📁 images/                 ← Alle Bilder (50MB)
    ├── weetzen.jpg            ← Hauptbild
    ├── brandlbracke_1.jpeg    ← Jagdhunde
    ├── reh_wildart_1.jpeg     ← Wildarten
    └── ... (83 weitere Bilder)
```

### 3. 🌐 Alfahosting Upload-Prozess:

#### Option A: FTP-Upload
1. **FTP-Client öffnen** (FileZilla, WinSCP, etc.)
2. **Verbindung zu Alfahosting** herstellen
3. **Navigieren zu** `/htdocs/` oder `/public_html/`
4. **Alle Dateien aus `dist/` hochladen:**
   - `index.html` → Root-Verzeichnis
   - `assets/` Ordner → Root-Verzeichnis
   - `images/` Ordner → Root-Verzeichnis
   - Alle anderen HTML-Dateien → Root-Verzeichnis

#### Option B: Alfahosting File Manager
1. **Alfahosting Control Panel** öffnen
2. **File Manager** starten
3. **Zu Webspace navigieren** (`htdocs/` oder `public_html/`)
4. **Dateien hochladen:**
   - Alle Dateien aus `dist/` auswählen
   - Upload starten (kann bei 112MB etwas dauern)

## 📊 Upload-Details:

### ✅ Dateien-Übersicht:
- **Gesamtgröße:** 112MB
- **Dateien gesamt:** 189 Dateien
- **Bilder:** 83 Bilder (50MB)
- **JavaScript/CSS:** Assets-Ordner (63MB)
- **HTML-Seiten:** 5 Seiten

### ✅ Wichtige Dateien:
- **`index.html`** ← HAUPTSEITE (muss im Root sein!)
- **`assets/`** ← JavaScript & CSS (erforderlich!)
- **`images/`** ← Alle Bilder (erforderlich!)
- **`favicon.ico`** ← Website-Icon
- **`robots.txt`** ← SEO-Optimierung

## 🔧 Nach dem Upload:

### ✅ Website testen:
1. **Ihre Domain aufrufen:** `https://ihre-domain.de`
2. **Hauptseite prüfen:** Sollte Jagdrevier-Website anzeigen
3. **Bilder prüfen:** Alle Bilder sollten laden
4. **Navigation testen:** Alle Bereiche erreichbar

### ✅ Fallback-Seiten:
- **`/diagnose.html`** - Für Problemdiagnose
- **`/fallback.html`** - Falls React nicht lädt
- **`/static.html`** - Statische Version

## ⚠️ Wichtige Hinweise:

### ✅ Ordnerstruktur beibehalten:
```
htdocs/
├── index.html          ← Im Root!
├── assets/             ← Ordner mit Unterordnern!
│   ├── *.js
│   ├── *.css
│   └── images/         ← Bilder auch hier!
└── images/             ← Hauptbilder-Ordner!
    └── *.jpeg/jpg/png
```

### ✅ Berechtigungen:
- **Dateien:** 644 (rw-r--r--)
- **Ordner:** 755 (rwxr-xr-x)
- **index.html:** 644 (wichtig für Hauptseite!)

### ✅ Upload-Reihenfolge:
1. **Erst HTML-Dateien** (schnell)
2. **Dann assets/ Ordner** (JavaScript/CSS)
3. **Zuletzt images/ Ordner** (dauert am längsten)

## 🎯 Erwartetes Ergebnis:

### ✅ Nach erfolgreichem Upload:
- **Website lädt:** Jagdrevier Weetzen Hauptseite
- **Alle Bilder sichtbar:** 83 Bilder laden korrekt
- **Navigation funktioniert:** Alle Bereiche erreichbar
- **Shop funktional:** Wildfleisch-Shop mit Kategorien
- **Responsive:** Funktioniert auf allen Geräten

### ✅ URL-Struktur:
- **Hauptseite:** `https://ihre-domain.de/`
- **Diagnose:** `https://ihre-domain.de/diagnose.html`
- **Fallback:** `https://ihre-domain.de/fallback.html`
- **Bilder:** `https://ihre-domain.de/images/weetzen.jpg`

---

## 🆘 Bei Problemen:

### ✅ Häufige Probleme:
1. **Weiße Seite:** → `/fallback.html` aufrufen
2. **Bilder laden nicht:** → Ordnerstruktur prüfen
3. **JavaScript-Fehler:** → `/diagnose.html` verwenden

### ✅ Support:
- **Fallback-Versionen:** Immer verfügbar
- **Diagnose-Tools:** Integriert
- **Statische Version:** Funktioniert ohne JavaScript

---

**Zusammenfassung: Laden Sie den kompletten Inhalt des `dist/` Ordners (112MB, 189 Dateien) in Ihr Alfahosting Webspace-Root-Verzeichnis hoch. Die Website wird dann unter Ihrer Domain verfügbar sein!**