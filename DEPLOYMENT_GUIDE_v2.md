# Jagdrevier Weetzen - Deployment Guide

## 📦 Aktuelle Version: v2.0 (27.10.2025)

### ✅ Neueste Updates:
- **Erweiterten Wildfleisch-Webshop** mit Kategorien und Drag & Drop
- **Artikel-Migration** aus alter Lagerverwaltung
- **Professionell formatierter Stapelteiche-Text** mit korrekten historischen Fakten
- **Bestellsystem** mit automatischen Bestellnummern
- **Admin-Verwaltung** für Shop, Bestellungen und Kategorien

## 📁 Deployment-Dateien

### 🎯 Für Alfahosting Upload:
**Datei:** `jagdrevier-website-FINAL-v2.tar.gz` (49 MB)

**Inhalt:**
- ✅ Kompletter `dist/` Ordner mit allen Website-Dateien
- ✅ `assets/` Ordner mit CSS und JavaScript (72 KB + 1 MB)
- ✅ `images/` Ordner mit 76 Bildern
- ✅ `.htaccess` Datei für React Router Support
- ✅ Alle HTML, CSS, JS und Asset-Dateien

### 📤 Upload-Anleitung für Alfahosting:

1. **Archiv herunterladen:**
   ```bash
   # Von GitHub oder direkt von Skywork
   wget jagdrevier-website-FINAL-v2.tar.gz
   ```

2. **Entpacken:**
   ```bash
   tar -xzf jagdrevier-website-FINAL-v2.tar.gz
   ```

3. **Upload zu Alfahosting:**
   - Alle Dateien aus `dist/` Ordner nach `/public_html/` hochladen
   - `.htaccess` Datei in `/public_html/` hochladen
   - Sicherstellen, dass Ordnerstruktur erhalten bleibt

4. **Supabase Konfiguration:**
   - Site URL: `https://jagd-weetzen.de`
   - Redirect URLs: `https://jagd-weetzen.de/**`

### 🔧 Technische Details:

**Framework:** React + Vite + TypeScript
**Styling:** Tailwind CSS + shadcn/ui
**Backend:** Supabase (Datenbank + Authentication + Edge Functions)
**Deployment:** Statische Website (SPA)

### 📋 Vollständige Dateiliste:
```
dist/
├── index.html                 # Haupt-HTML-Datei
├── assets/
│   ├── index-D9TMNGGw.css    # Styles (72 KB)
│   ├── index-Dr_bxOnq.js     # JavaScript (1 MB)
│   └── index-Dr_bxOnq.js.map # Source Map (2.4 MB)
├── images/                    # 76 Bilder (Wildtiere, Prädatoren)
├── favicon.ico
├── robots.txt
└── placeholder.svg
.htaccess                      # React Router Support
```

### 🌐 Features der aktuellen Version:

#### 🛒 Wildfleisch-Webshop:
- Kategorien: Rehwild, Schwarzwild, Wildgeflügel, Wildwurst, Wildmettwurst
- Warenkorb-Funktionalität mit Bestellsystem
- Automatische Bestellnummern (WF-YYYYMMDD-XXX)
- Abholung mit Terminvereinbarung

#### 🔐 Admin-Bereiche:
- Shop-Verwaltung mit Drag & Drop Sortierung
- Bestellverwaltung mit Status-Workflow
- Blog-Verwaltung für "Neues aus dem Revier"
- Kontakt- und Benutzerverwaltung

#### 📱 Responsive Design:
- Mobile-optimiert für alle Geräte
- Professionelle Typografie und Layout
- Farbkodierte Informationsboxen

### 🚀 Nach dem Upload testen:
- [ ] Hauptseite lädt korrekt
- [ ] Navigation funktioniert (alle Menüpunkte)
- [ ] Wildfleisch-Shop ist erreichbar
- [ ] Bilder werden angezeigt
- [ ] Anmeldung/Registrierung funktioniert
- [ ] Admin-Bereiche sind nach Anmeldung verfügbar

---

**Letzte Aktualisierung:** 27. Oktober 2025, 17:51 UTC
**Version:** 2.0 - Erweiterte Webshop-Version mit professionellem Stapelteiche-Text