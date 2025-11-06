-- Bestellungen-Tabellen für Tab-System
-- Erstellt: 2025-11-06 21:00 UTC

-- Haupttabelle für Bestellungen
CREATE TABLE IF NOT EXISTS public.simple_bestellungen_2025_11_06_21_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    telefon TEXT,
    adresse TEXT,
    nachricht TEXT,
    gesamtpreis DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'neu' CHECK (status IN ('neu', 'bestätigt', 'storniert')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelle für Bestellpositionen
CREATE TABLE IF NOT EXISTS public.simple_bestellpositionen_2025_11_06_21_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bestellung_id UUID NOT NULL REFERENCES public.simple_bestellungen_2025_11_06_21_00(id) ON DELETE CASCADE,
    produkt_name TEXT NOT NULL,
    menge INTEGER NOT NULL DEFAULT 1,
    einzelpreis DECIMAL(10,2) NOT NULL DEFAULT 0,
    gesamtpreis DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies für Bestellungen
ALTER TABLE public.simple_bestellungen_2025_11_06_21_00 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bestellungen für alle sichtbar" ON public.simple_bestellungen_2025_11_06_21_00
    FOR SELECT USING (true);

CREATE POLICY "Bestellungen erstellen erlaubt" ON public.simple_bestellungen_2025_11_06_21_00
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Bestellungen aktualisieren erlaubt" ON public.simple_bestellungen_2025_11_06_21_00
    FOR UPDATE USING (true);

-- RLS Policies für Bestellpositionen
ALTER TABLE public.simple_bestellpositionen_2025_11_06_21_00 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bestellpositionen für alle sichtbar" ON public.simple_bestellpositionen_2025_11_06_21_00
    FOR SELECT USING (true);

CREATE POLICY "Bestellpositionen erstellen erlaubt" ON public.simple_bestellpositionen_2025_11_06_21_00
    FOR INSERT WITH CHECK (true);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_bestellungen_status ON public.simple_bestellungen_2025_11_06_21_00(status);
CREATE INDEX IF NOT EXISTS idx_bestellungen_created_at ON public.simple_bestellungen_2025_11_06_21_00(created_at);
CREATE INDEX IF NOT EXISTS idx_bestellpositionen_bestellung_id ON public.simple_bestellpositionen_2025_11_06_21_00(bestellung_id);

-- Test-Daten einfügen
INSERT INTO public.simple_bestellungen_2025_11_06_21_00 (name, email, telefon, adresse, nachricht, gesamtpreis, status) VALUES
('Max Mustermann', 'max@example.com', '+49 123 456789', 'Musterstraße 1, 12345 Musterstadt', 'Bitte schnell liefern', 45.50, 'neu'),
('Anna Schmidt', 'anna@example.com', '+49 987 654321', 'Beispielweg 2, 54321 Beispielstadt', 'Danke für die gute Qualität', 32.00, 'bestätigt'),
('Tom Weber', 'tom@example.com', '+49 555 123456', 'Teststraße 3, 98765 Teststadt', 'Erste Bestellung', 28.75, 'storniert');

-- Test-Positionen einfügen
INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis)
SELECT 
    b.id,
    CASE 
        WHEN b.name = 'Max Mustermann' THEN 'Rehkeule (1kg)'
        WHEN b.name = 'Anna Schmidt' THEN 'Wildschweinbratwurst (500g)'
        WHEN b.name = 'Tom Weber' THEN 'Hirschgulasch (750g)'
    END,
    CASE 
        WHEN b.name = 'Max Mustermann' THEN 1
        WHEN b.name = 'Anna Schmidt' THEN 2
        WHEN b.name = 'Tom Weber' THEN 1
    END,
    CASE 
        WHEN b.name = 'Max Mustermann' THEN 45.50
        WHEN b.name = 'Anna Schmidt' THEN 16.00
        WHEN b.name = 'Tom Weber' THEN 28.75
    END,
    b.gesamtpreis
FROM public.simple_bestellungen_2025_11_06_21_00 b;