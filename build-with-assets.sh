#!/bin/bash

echo "🦌 Jagdrevier Weetzen - Build mit Assets"
echo "======================================"

echo "📦 Starte Vite Build..."
npm run build

echo "📁 Kopiere Assets in dist/..."
mkdir -p dist/assets/images
mkdir -p dist/images

echo "🖼️ Kopiere wichtigste Assets..."
cp public/assets/images/* dist/assets/images/ 2>/dev/null || echo "Keine Assets in public/assets/images/"

echo "🖼️ Kopiere alle Public Images..."
cp public/images/* dist/images/ 2>/dev/null || echo "Keine Bilder in public/images/"

echo "✅ Build abgeschlossen!"
echo ""
echo "📊 Assets-Statistik:"
echo "Assets in dist/assets/images/: $(ls dist/assets/images/ 2>/dev/null | wc -l)"
echo "Bilder in dist/images/: $(ls dist/images/ 2>/dev/null | wc -l)"
echo ""
echo "🚀 Website bereit für Deployment!"