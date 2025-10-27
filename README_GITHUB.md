# Jagd Weetzen Website

Eine moderne, responsive Website für das Jagdrevier Jagd Weetzen in Niedersachsen.

## 🎯 Features

- **Revierinformationen**: 340 Hektar Wald- und Feldlandschaft
- **Wildarten**: Rehwild, Schwarzwild, Damwild, Gänse und Federwild
- **Rehkitzrettung**: Moderne Drohnentechnik zum Schutz von Rehkitzen
- **Prädatorenmanagement**: Professionelles Management zum Schutz des Niederwildes
- **Wildfleischverkauf**: Online-Bestellsystem mit E-Mail-Integration
- **News-System**: Verwaltung von Neuigkeiten und Ankündigungen
- **Bildergalerie**: Kategorisierte Bilder aus dem Revier
- **Kontaktformular**: Direkter Kontakt zu den Revierpächtern

## 🛠 Technologie

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui Komponenten
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **E-Mail**: Resend API Integration
- **Hosting**: Deployment-ready für alle gängigen Anbieter

## 🚀 Schnellstart

### Lokale Entwicklung
```bash
npm install
npm run dev
```

### Produktions-Build
```bash
npm run build
```

### Deployment
Der `dist/` Ordner enthält alle statischen Dateien für das Deployment.

## 📁 Projektstruktur

```
├── dist/                 # Produktions-Build
├── public/              # Statische Assets
│   └── images/          # Alle Bilder (inkl. weetzen.jpg)
├── src/
│   ├── components/      # React Komponenten
│   ├── integrations/    # Supabase Integration
│   └── pages/          # Seiten-Komponenten
├── supabase/
│   ├── migrations/      # Datenbank-Schema
│   └── edge_function/   # Server-Funktionen
└── docs/               # Dokumentation
```

## 🔧 Konfiguration

### Umgebungsvariablen
```env
VITE_SUPABASE_URL=https://ihr-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=ihr-anon-key
```

### Supabase Setup
1. Projekt bei Supabase erstellen
2. SQL-Migrationen ausführen
3. Edge Functions deployen
4. Resend API-Key in Secrets hinzufügen

## 📞 Kontakt

**Revierpächter:**
- Christoph Burchard - Holtenserstrasse 4, 30952 Linderte
- Ole Gosslar - Am Denkmal 16, 30952 Linderte

**E-Mail:** info@jagd-weetzen.de

## 📄 Lizenz

Erstellt für Jagd Weetzen - Alle Rechte vorbehalten.

---

**Live-Demo:** https://3nzy4iw8m8.skywork.website