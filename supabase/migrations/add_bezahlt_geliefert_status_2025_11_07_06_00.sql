-- Bezahlt und Geliefert Status zur Bestelltabelle hinzufügen
-- Aktuelle Zeit: 2025-11-07 06:00 UTC

-- Prüfe aktuelle Spalten
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'simple_bestellungen_2025_11_06_21_00' 
ORDER BY ordinal_position;

-- Füge Bezahlt-Status hinzu falls nicht vorhanden
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'simple_bestellungen_2025_11_06_21_00' 
        AND column_name = 'bezahlt'
    ) THEN
        ALTER TABLE public.simple_bestellungen_2025_11_06_21_00 
        ADD COLUMN bezahlt BOOLEAN DEFAULT FALSE;
        
        COMMENT ON COLUMN public.simple_bestellungen_2025_11_06_21_00.bezahlt 
        IS 'Status ob die Bestellung bezahlt wurde';
    END IF;
END $$;

-- Füge Geliefert-Status hinzu falls nicht vorhanden
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'simple_bestellungen_2025_11_06_21_00' 
        AND column_name = 'geliefert'
    ) THEN
        ALTER TABLE public.simple_bestellungen_2025_11_06_21_00 
        ADD COLUMN geliefert BOOLEAN DEFAULT FALSE;
        
        COMMENT ON COLUMN public.simple_bestellungen_2025_11_06_21_00.geliefert 
        IS 'Status ob die Bestellung geliefert wurde';
    END IF;
END $$;

-- Füge Lieferdatum hinzu falls nicht vorhanden
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'simple_bestellungen_2025_11_06_21_00' 
        AND column_name = 'lieferdatum'
    ) THEN
        ALTER TABLE public.simple_bestellungen_2025_11_06_21_00 
        ADD COLUMN lieferdatum TIMESTAMP WITH TIME ZONE;
        
        COMMENT ON COLUMN public.simple_bestellungen_2025_11_06_21_00.lieferdatum 
        IS 'Datum wann die Bestellung geliefert wurde';
    END IF;
END $$;

-- Zeige finale Tabellenstruktur
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'simple_bestellungen_2025_11_06_21_00' 
ORDER BY ordinal_position;

-- Setze bestehende Bestellungen auf Standard-Werte
UPDATE public.simple_bestellungen_2025_11_06_21_00 
SET bezahlt = FALSE, geliefert = FALSE 
WHERE bezahlt IS NULL OR geliefert IS NULL;