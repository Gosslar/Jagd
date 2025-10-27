-- Tabelle für Wildfleisch-Bestellungen
CREATE TABLE IF NOT EXISTS public.wildfleisch_bestellungen_2025_10_24_08_03 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kunde_name TEXT NOT NULL,
    kunde_email TEXT NOT NULL,
    kunde_telefon TEXT,
    kunde_adresse TEXT,
    bestellung_json JSONB NOT NULL,
    gesamtpreis DECIMAL(10,2) NOT NULL,
    nachricht TEXT,
    status TEXT DEFAULT 'neu' CHECK (status IN ('neu', 'bearbeitet', 'versendet', 'abgeschlossen')),
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    bearbeitet_am TIMESTAMP WITH TIME ZONE,
    notizen TEXT
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_wildfleisch_bestellungen_status 
ON public.wildfleisch_bestellungen_2025_10_24_08_03(status);

CREATE INDEX IF NOT EXISTS idx_wildfleisch_bestellungen_erstellt 
ON public.wildfleisch_bestellungen_2025_10_24_08_03(erstellt_am DESC);

-- RLS Policy für Administratoren
ALTER TABLE public.wildfleisch_bestellungen_2025_10_24_08_03 ENABLE ROW LEVEL SECURITY;

-- Policy: Nur authentifizierte Benutzer können Bestellungen einsehen
CREATE POLICY "Bestellungen für authentifizierte Benutzer" 
ON public.wildfleisch_bestellungen_2025_10_24_08_03 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Policy: Jeder kann Bestellungen erstellen (für das Kontaktformular)
CREATE POLICY "Bestellungen erstellen" 
ON public.wildfleisch_bestellungen_2025_10_24_08_03 
FOR INSERT 
WITH CHECK (true);

-- Policy: Nur authentifizierte Benutzer können Bestellungen aktualisieren
CREATE POLICY "Bestellungen aktualisieren" 
ON public.wildfleisch_bestellungen_2025_10_24_08_03 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Kommentare für bessere Dokumentation
COMMENT ON TABLE public.wildfleisch_bestellungen_2025_10_24_08_03 IS 'Speichert alle Wildfleisch-Bestellungen für manuelle Bearbeitung und E-Mail-Versand über Alfahosting';
COMMENT ON COLUMN public.wildfleisch_bestellungen_2025_10_24_08_03.bestellung_json IS 'JSON-Array mit bestellten Artikeln (Produkt, Menge, Preis)';
COMMENT ON COLUMN public.wildfleisch_bestellungen_2025_10_24_08_03.status IS 'Bearbeitungsstatus: neu, bearbeitet, versendet, abgeschlossen';