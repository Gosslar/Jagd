# Jagd Weetzen Website - Deployment Dateien

## 📦 Für Alfahosting Upload benötigte Dateien

### 🎯 Hauptdateien (aus dist/ Ordner):

#### 1. index.html
```html
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jagd Weetzen - Nachhaltige Jagd in Niedersachsen</title>
    <meta name="description" content="Jagd Weetzen bietet nachhaltige Jagd auf 340 Hektar Wald- und Feldlandschaft in Niedersachsen. Erfahren Sie mehr über Wildarten, Jagdzeiten und Wildfleischverkauf." />
    <meta name="author" content="Jagd Weetzen" />

    <meta property="og:title" content="Jagd Weetzen - Nachhaltige Jagd in Niedersachsen" />
    <meta property="og:description" content="Jagd Weetzen bietet nachhaltige Jagd auf 340 Hektar Wald- und Feldlandschaft in Niedersachsen. Erfahren Sie mehr über Wildarten, Jagdzeiten und Wildfleischverkauf." />
    <meta property="og:type" content="website" />
    <script type="module" crossorigin src="/assets/index-C-88Vvzw.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-BySY5LX-.css">
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```

#### 2. .htaccess (WICHTIG für React Router)
```apache
# React Router Support für Single Page Application
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Handle React Router
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Control für bessere Performance
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

### 📁 Ordnerstruktur für Alfahosting:

```
/public_html/
├── index.html
├── .htaccess
├── favicon.ico
├── robots.txt
├── placeholder.svg
├── assets/
│   ├── index-BySY5LX-.css (71 KB)
│   ├── index-C-88Vvzw.js (1 MB)
│   └── index-C-88Vvzw.js.map (2.3 MB)
└── images/ (76 Bilder)
    ├── dachs_praedator_1.jpeg
    ├── fuchs_praedator_1.jpeg
    ├── waschbaer_praedator_1.jpeg
    ├── reh_wildart_1.jpeg
    ├── schwarzwild_wildart_1.jpeg
    ├── weetzen.jpg
    └── [weitere 70 Bilder...]
```

### 🚨 WICHTIGE DATEIEN:

Die folgenden großen Dateien müssen von Skywork heruntergeladen werden:

1. **assets/index-C-88Vvzw.js** (1 MB) - Haupt-JavaScript
2. **assets/index-BySY5LX-.css** (71 KB) - Alle Styles  
3. **images/** Ordner (76 Bilder) - Alle Wildtier/Prädatoren-Bilder

### 📤 Upload-Anleitung:

1. **GitHub Repository klonen:** https://github.com/Gosslar/Jagd
2. **Build erstellen:** `npm install && npm run build`
3. **dist/ Ordner Inhalt** zu Alfahosting /public_html/ hochladen
4. **.htaccess Datei** hinzufügen
5. **Supabase Domain** konfigurieren

### 🔗 Nach Upload:
- Website: https://jagd-weetzen.de
- Supabase Settings: Domain hinzufügen für Auth

---
Erstellt: 2024-10-27
Projekt: Jagd Weetzen Website