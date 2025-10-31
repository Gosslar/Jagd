#!/bin/bash
echo "=== EINFACHER BUILD ==="

# Schritt 1: Aufräumen
echo "Lösche alte Builds..."
rm -rf dist/ upload-package/

# Schritt 2: Build
echo "Führe npm run build aus..."
npm run build

# Schritt 3: Warten
echo "Warte 2 Sekunden..."
sleep 2

# Schritt 4: Prüfen
echo "Prüfe dist Verzeichnis..."
if [ -d "dist" ]; then
    echo "✅ dist Verzeichnis existiert"
    ls -la dist/
else
    echo "❌ dist Verzeichnis existiert NICHT"
    exit 1
fi

# Schritt 5: Upload-Paket erstellen
echo "Erstelle Upload-Paket..."
mkdir -p upload-package

# Schritt 6: Dateien einzeln kopieren
echo "Kopiere Dateien einzeln..."
if [ -f "dist/index.html" ]; then
    cp dist/index.html upload-package/
    echo "✅ index.html kopiert"
else
    echo "❌ index.html nicht gefunden"
fi

if [ -d "dist/assets" ]; then
    cp -r dist/assets upload-package/
    echo "✅ assets Verzeichnis kopiert"
else
    echo "❌ assets Verzeichnis nicht gefunden"
fi

if [ -d "dist/images" ]; then
    cp -r dist/images upload-package/
    echo "✅ images Verzeichnis kopiert"
else
    echo "❌ images Verzeichnis nicht gefunden"
fi

# Kopiere weitere Dateien
for file in dist/*.html dist/*.ico dist/*.txt dist/*.svg; do
    if [ -f "$file" ]; then
        cp "$file" upload-package/
        echo "✅ $(basename $file) kopiert"
    fi
done

# Schritt 7: Finale Prüfung
echo "=== FINALE PRÜFUNG ==="
echo "Upload-Paket Inhalt:"
ls -la upload-package/

echo "Statistiken:"
echo "- Dateien in upload-package: $(find upload-package/ -type f 2>/dev/null | wc -l)"
echo "- Größe: $(du -sh upload-package/ 2>/dev/null | cut -f1)"

if [ -f "upload-package/index.html" ] && [ -d "upload-package/assets" ] && [ -d "upload-package/images" ]; then
    echo "✅ BUILD ERFOLGREICH!"
    echo "✅ Bereit für Alfahosting Upload!"
else
    echo "❌ BUILD UNVOLLSTÄNDIG!"
    exit 1
fi
