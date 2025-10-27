# Jagd Weetzen Website - Upload Anleitung

## 📦 Website-Dateien für Alfahosting

### 📁 Benötigte Dateien:
Alle Dateien aus dem `dist/` Ordner + .htaccess Datei

### 📋 Upload-Checkliste:

#### ✅ Hauptdateien:
- [ ] index.html (Haupt-HTML-Datei)
- [ ] favicon.ico (Website-Icon)
- [ ] robots.txt (Suchmaschinen-Anweisungen)
- [ ] placeholder.svg (Platzhalter-Grafik)

#### ✅ Assets-Ordner:
- [ ] assets/index-BySY5LX-.css (Alle Styles)
- [ ] assets/index-o2bYEDZB.js (JavaScript-Code)
- [ ] assets/index-o2bYEDZB.js.map (Source Map)

#### ✅ Images-Ordner (74 Bilder):
- [ ] Alle Wildtier-Bilder (reh_wildart_*.jpeg, schwarzwild_wildart_*.jpeg, etc.)
- [ ] Alle Prädatoren-Bilder (fuchs_praedator_*.jpeg, waschbaer_praedator_*.jpeg, etc.)
- [ ] Alle Jagd-Bilder (jagd_wildlife_*.jpeg, jagd_einrichtungen_*.jpeg, etc.)
- [ ] Spezielle Bilder (weetzen.jpg, wildfleisch_*.*, etc.)

#### ✅ .htaccess Datei (neu erstellen):
```apache
# React Router Support
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### 🎯 Upload zu Alfahosting:

#### Via FTP:
1. FTP-Client öffnen (FileZilla empfohlen)
2. Alfahosting FTP-Daten eingeben
3. Zu /public_html/ navigieren
4. Alle Dateien hochladen

#### Via Dateimanager:
1. Alfahosting Control Panel → Dateimanager
2. Zu /public_html/ navigieren
3. "Upload" → Alle Dateien auswählen
4. Upload starten

### 🔗 Nach dem Upload:
1. Supabase Dashboard → Authentication → Settings
2. Site URL: https://ihre-domain.de
3. Redirect URLs: https://ihre-domain.de, https://ihre-domain.de/auth/callback

### 📞 Support:
Bei Problemen: support@alfahosting.de oder 02381 4071-0

---
Erstellt: $(date)
Projekt: Jagd Weetzen Website