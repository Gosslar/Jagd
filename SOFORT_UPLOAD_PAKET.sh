#!/bin/bash
echo "🚨 NOTFALL: SOFORTIGES UPLOAD-PAKET ERSTELLEN"

# Prüfe ob dist existiert
if [ ! -d "dist" ]; then
    echo "❌ FEHLER: dist existiert nicht - führe Build aus"
    npm run build
fi

# Warte kurz
sleep 1

# Prüfe nochmal
if [ ! -d "dist" ]; then
    echo "❌ KRITISCHER FEHLER: dist kann nicht erstellt werden!"
    exit 1
fi

echo "✅ dist existiert - erstelle sofort Upload-Paket"

# Lösche altes Upload-Paket
rm -rf upload-package/

# Erstelle neues Upload-Paket
mkdir -p upload-package
cp -r dist/* upload-package/

# Prüfe Ergebnis
if [ -f "upload-package/index.html" ] && [ -d "upload-package/assets" ] && [ -d "upload-package/images" ]; then
    echo "✅ UPLOAD-PAKET ERFOLGREICH ERSTELLT!"
    echo "📊 Statistik:"
    echo "- Dateien: $(find upload-package/ -type f | wc -l)"
    echo "- Größe: $(du -sh upload-package/ | cut -f1)"
    echo "- JavaScript: $(find upload-package/assets/ -name '*.js' | wc -l) Dateien"
    echo "- CSS: $(find upload-package/assets/ -name '*.css' | wc -l) Dateien"
    echo "- Bilder: $(find upload-package/images/ -type f | wc -l) Dateien"
    echo ""
    echo "🚀 BEREIT FÜR ALFAHOSTING!"
else
    echo "❌ UPLOAD-PAKET UNVOLLSTÄNDIG!"
    exit 1
fi
