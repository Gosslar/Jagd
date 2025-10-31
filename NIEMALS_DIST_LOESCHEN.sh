#!/bin/bash
echo "=== PERMANENTER BUILD - DIST WIRD NIEMALS GELÖSCHT ==="

# NIEMALS dist/ löschen!
if [ -d "dist" ]; then
    echo "✅ dist existiert bereits - wird NICHT gelöscht"
else
    echo "⚠️ dist existiert nicht - wird erstellt"
fi

# Build ohne Löschen
echo "Führe Build aus..."
npm run build

# Sofort prüfen
if [ -d "dist" ]; then
    echo "✅ dist erfolgreich erstellt"
    ls -la dist/
    
    # Sofort Upload-Paket erstellen
    echo "Erstelle sofort Upload-Paket..."
    rm -rf upload-package/
    mkdir -p upload-package
    cp -r dist/* upload-package/
    
    echo "✅ Upload-Paket erstellt"
    echo "Dateien: $(find upload-package/ -type f | wc -l)"
    echo "Größe: $(du -sh upload-package/ | cut -f1)"
    
    # Backup erstellen
    BACKUP_NAME="backup-dist-$(date +%Y%m%d-%H%M%S)"
    cp -r dist "$BACKUP_NAME"
    echo "✅ Backup erstellt: $BACKUP_NAME"
    
else
    echo "❌ FEHLER: dist wurde nicht erstellt!"
    exit 1
fi

echo "✅ FERTIG - DIST BLEIBT BESTEHEN!"
