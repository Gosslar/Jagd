-- Tabelle für Lagerbestand-Verwaltung
CREATE TABLE IF NOT EXISTS public.wildfleisch_lager_2025_10_24_14_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    produkt_name TEXT NOT NULL UNIQUE,
    kategorie TEXT NOT NULL,
    preis DECIMAL(10,2) NOT NULL,
    einheit TEXT NOT NULL,
    lagerbestand INTEGER NOT NULL DEFAULT 0,
    mindestbestand INTEGER DEFAULT 0,
    verfügbar BOOLEAN GENERATED ALWAYS AS (lagerbestand > 0) STORED,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_wildfleisch_lager_kategorie 
ON public.wildfleisch_lager_2025_10_24_14_00(kategorie);

CREATE INDEX IF NOT EXISTS idx_wildfleisch_lager_verfügbar 
ON public.wildfleisch_lager_2025_10_24_14_00(verfügbar);

-- RLS Policy
ALTER TABLE public.wildfleisch_lager_2025_10_24_14_00 ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann Lagerbestände lesen (für Website)
CREATE POLICY "Lagerbestände öffentlich lesbar" 
ON public.wildfleisch_lager_2025_10_24_14_00 
FOR SELECT 
USING (true);

-- Policy: Nur authentifizierte Benutzer können Bestände verwalten
CREATE POLICY "Lagerbestände verwalten" 
ON public.wildfleisch_lager_2025_10_24_14_00 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Trigger für automatische Aktualisierung des Zeitstempels
CREATE OR REPLACE FUNCTION update_wildfleisch_lager_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.aktualisiert_am = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wildfleisch_lager_timestamp_trigger
    BEFORE UPDATE ON public.wildfleisch_lager_2025_10_24_14_00
    FOR EACH ROW
    EXECUTE FUNCTION update_wildfleisch_lager_timestamp();

-- Initiale Daten einfügen
INSERT INTO public.wildfleisch_lager_2025_10_24_14_00 (produkt_name, kategorie, preis, einheit, lagerbestand, mindestbestand) VALUES
-- Rehwild
('Rehhack', 'Rehwild', 7.00, '500g', 10, 2),
('Rehrücken', 'Rehwild', 32.00, 'kg', 5, 1),
('Rehfilet', 'Rehwild', 40.00, 'kg', 3, 1),
('Rehgulasch', 'Rehwild', 16.00, 'kg', 8, 2),

-- Schwarzwild
('Grobe Bratwurst (5er Pack)', 'Schwarzwild', 9.00, 'Pack', 15, 3),

-- Federwild
('Gänsebrust gefroren', 'Federwild', 29.90, 'kg', 6, 1),

-- Wildmettwurst
('Wildmettwurst Knoblauch', 'Wildmettwurst', 14.00, 'Stück (ca. 300g)', 12, 2),
('Wildmettwurst Mediterran', 'Wildmettwurst', 14.00, 'Stück (ca. 300g)', 8, 2),
('Wildmettwurst Ganzer Pfeffer', 'Wildmettwurst', 14.00, 'Stück (ca. 300g)', 10, 2),
('Wildmettwurst Walnuss', 'Wildmettwurst', 16.00, 'Stück (ca. 300g)', 5, 1);

-- Kommentare
COMMENT ON TABLE public.wildfleisch_lager_2025_10_24_14_00 IS 'Lagerbestand-Verwaltung für Wildfleisch-Produkte';
COMMENT ON COLUMN public.wildfleisch_lager_2025_10_24_14_00.verfügbar IS 'Automatisch berechnet: true wenn lagerbestand > 0';
COMMENT ON COLUMN public.wildfleisch_lager_2025_10_24_14_00.mindestbestand IS 'Warnung bei Unterschreitung dieses Bestands';