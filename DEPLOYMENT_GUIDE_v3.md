# Jagdrevier Weetzen - Deployment Guide v3.0

## 📦 Aktuelle Version: v3.0 (27.10.2025)

### ✅ Neueste Updates:
- **Erweiterten Wildfleisch-Webshop** mit Kategorien und Drag & Drop
- **Professionell formatierter Stapelteiche-Text** mit korrekten historischen Fakten
- **Vollständige Assets** mit aktualisierten CSS/JS-Dateien
- **Bestellsystem** mit automatischen Bestellnummern
- **Admin-Verwaltung** für Shop, Bestellungen und Kategorien

## 📁 Deployment-Dateien

### 🎯 Für Alfahosting Upload:
**Datei:** `jagdrevier-website-COMPLETE-v3.tar.gz` (49 MB)

**Vollständiger Inhalt:**
```
dist/
├── index.html                    # Haupt-HTML-Datei
├── assets/                       # ✅ VOLLSTÄNDIG ENTHALTEN
│   ├── index-CThaM6Wz.css       # Styles (72 KB)
│   ├── index-Bm2KEAvK.js        # JavaScript (1 MB)
│   └── index-Bm2KEAvK.js.map    # Source Map (2.4 MB)
├── images/                       # 76 Bilder
│   ├── dachs_praedator_1.jpeg
│   ├── fuchs_praedator_1.jpeg
│   ├── reh_wildart_1.jpeg
│   └── [weitere 73 Bilder...]
├── favicon.ico
├── robots.txt
└── placeholder.svg
.htaccess                         # React Router Support
```

### 📤 Upload-Anleitung für Alfahosting:

1. **Archiv von GitHub herunterladen:**
   - Repository: https://github.com/Gosslar/Jagd
   - Datei: `jagdrevier-website-COMPLETE-v3.tar.gz`

2. **Entpacken:**
   ```bash
   tar -xzf jagdrevier-website-COMPLETE-v3.tar.gz
   ```

3. **Upload zu Alfahosting:**
   - **ALLE Dateien** aus `dist/` Ordner nach `/public_html/` hochladen
   - **`.htaccess`** Datei in `/public_html/` hochladen
   - **Ordnerstruktur beibehalten** (besonders `assets/` und `images/`)

4. **Supabase Konfiguration:**
   - Site URL: `https://jagd-weetzen.de`
   - Redirect URLs: `https://jagd-weetzen.de/**`

### 🔧 Verifikation nach Upload:

**Diese URLs müssen funktionieren:**
- ✅ `https://jagd-weetzen.de/` (Hauptseite)
- ✅ `https://jagd-weetzen.de/assets/index-CThaM6Wz.css` (Styles)
- ✅ `https://jagd-weetzen.de/assets/index-Bm2KEAvK.js` (JavaScript)
- ✅ `https://jagd-weetzen.de/images/reh_wildart_1.jpeg` (Bilder)

### 🌐 Features der Version 3.0:

#### 🛒 Wildfleisch-Webshop:
- **5 Kategorien:** Rehwild, Schwarzwild, Wildgeflügel, Wildwurst, Wildmettwurst
- **Warenkorb-System** mit Bestellabwicklung
- **Automatische Bestellnummern:** WF-YYYYMMDD-XXX
- **Abholung** mit Terminvereinbarung

#### 🔐 Admin-Funktionen:
- **Shop-Verwaltung:** Kategorien und Produkte mit Drag & Drop
- **Bestellverwaltung:** Status-Workflow (Neu → Bestätigt → Bereit → Abgeholt)
- **Blog-Verwaltung:** "Neues aus dem Revier"
- **Kontakt- und Benutzerverwaltung**

#### 📝 Stapelteiche-Sektion:
- **Korrekte Geschichte:** Zuckerfabrik (nicht Kali-Bergbau)
- **275 Vogelarten** in farbkodierten Kategorien
- **20+ Wasserbüffel** als Landschaftspfleger seit 2011
- **Professionelle Formatierung** mit visuellen Elementen

#### 📱 Technische Features:
- **React + Vite + TypeScript**
- **Tailwind CSS + shadcn/ui**
- **Supabase Backend** (Datenbank + Auth + Edge Functions)
- **Responsive Design** für alle Geräte
- **SEO-optimiert** mit korrekten Meta-Tags

### 🚀 Post-Deployment Checkliste:

- [ ] **Hauptseite lädt** ohne Fehler
- [ ] **Navigation funktioniert** (alle Menüpunkte springen korrekt)
- [ ] **Wildfleisch-Shop** ist erreichbar und funktional
- [ ] **Alle Bilder werden angezeigt** (76 Stück)
- [ ] **CSS-Styling** wird korrekt geladen
- [ ] **JavaScript-Funktionen** arbeiten einwandfrei
- [ ] **Anmeldung/Registrierung** funktioniert
- [ ] **Admin-Bereiche** sind nach Anmeldung verfügbar
- [ ] **Mobile Ansicht** funktioniert korrekt

### ⚠️ Wichtige Hinweise:

1. **Assets-Ordner kritisch:** Ohne `assets/` Ordner funktioniert die Website nicht!
2. **Ordnerstruktur beibehalten:** Alle Unterordner müssen korrekt hochgeladen werden
3. **.htaccess erforderlich:** Für React Router Navigation
4. **Supabase-URLs:** Müssen in der Supabase-Konsole konfiguriert werden

---

**Letzte Aktualisierung:** 27. Oktober 2025, 17:56 UTC  
**Version:** 3.0 - Vollständige Version mit allen Assets und professionellem Stapelteiche-Text  
**Archiv-Größe:** 49 MB  
**GitHub:** https://github.com/Gosslar/Jagd