#!/bin/bash
echo "=== STABILER BUILD-PROZESS ==="
echo "Schritt 1: Lösche alte Builds"
rm -rf dist/ upload-package/

echo "Schritt 2: Führe Build aus"
npm run build

echo "Schritt 3: Prüfe Build-Ergebnis"
if [ ! -d "dist/" ]; then
    echo "❌ FEHLER: dist/ Verzeichnis nicht erstellt!"
    exit 1
fi

if [ ! -d "dist/assets/" ]; then
    echo "❌ FEHLER: dist/assets/ Verzeichnis nicht erstellt!"
    exit 1
fi

echo "Schritt 4: Erstelle Upload-Paket"
mkdir -p upload-package
cp -r dist/* upload-package/

echo "Schritt 5: Bestätige Upload-Paket"
if [ ! -f "upload-package/index.html" ]; then
    echo "❌ FEHLER: index.html fehlt im Upload-Paket!"
    exit 1
fi

if [ ! -d "upload-package/assets/" ]; then
    echo "❌ FEHLER: assets/ Verzeichnis fehlt im Upload-Paket!"
    exit 1
fi

if [ ! -d "upload-package/images/" ]; then
    echo "❌ FEHLER: images/ Verzeichnis fehlt im Upload-Paket!"
    exit 1
fi

echo "✅ BUILD ERFOLGREICH!"
echo "✅ dist/ Verzeichnis: VORHANDEN"
echo "✅ dist/assets/ Verzeichnis: VORHANDEN"
echo "✅ upload-package/ Verzeichnis: VORHANDEN"
echo "✅ Alle kritischen Dateien: VORHANDEN"

echo "📊 STATISTIK:"
echo "- dist/ Dateien: $(find dist/ -type f | wc -l)"
echo "- upload-package/ Dateien: $(find upload-package/ -type f | wc -l)"
echo "- upload-package/ Größe: $(du -sh upload-package/ | cut -f1)"

echo "🎯 BEREIT FÜR ALFAHOSTING!"
