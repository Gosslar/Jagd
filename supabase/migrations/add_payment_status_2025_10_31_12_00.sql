-- Füge Zahlungsstatus-Spalte zur einfachen Bestelltabelle hinzu

-- 1. Füge Zahlungsstatus-Spalten hinzu
ALTER TABLE public.simple_bestellungen_2025_10_31_12_00 
ADD COLUMN IF NOT EXISTS zahlungsstatus VARCHAR(50) DEFAULT 'offen' 
CHECK (zahlungsstatus IN ('offen', 'bezahlt', 'erstattet'));

ALTER TABLE public.simple_bestellungen_2025_10_31_12_00 
ADD COLUMN IF NOT EXISTS zahlungsart VARCHAR(50) DEFAULT 'bar';

ALTER TABLE public.simple_bestellungen_2025_10_31_12_00 
ADD COLUMN IF NOT EXISTS zahlungsstatus_geaendert_am TIMESTAMP WITH TIME ZONE;

-- 2. Setze Standardwerte für bestehende Bestellungen
UPDATE public.simple_bestellungen_2025_10_31_12_00 
SET zahlungsstatus = 'offen', zahlungsart = 'bar'
WHERE zahlungsstatus IS NULL;

-- 3. Zeige aktualisierte Tabellenstruktur
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'simple_bestellungen_2025_10_31_12_00' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Zeige alle Bestellungen mit neuen Spalten
SELECT 
    id,
    name,
    email,
    gesamtpreis,
    status,
    zahlungsstatus,
    zahlungsart,
    erstellt_am
FROM public.simple_bestellungen_2025_10_31_12_00
ORDER BY erstellt_am DESC;

COMMENT ON COLUMN public.simple_bestellungen_2025_10_31_12_00.zahlungsstatus IS 'Zahlungsstatus: offen, bezahlt, erstattet';
COMMENT ON COLUMN public.simple_bestellungen_2025_10_31_12_00.zahlungsart IS 'Zahlungsart: bar, karte, überweisung, etc.';
COMMENT ON COLUMN public.simple_bestellungen_2025_10_31_12_00.zahlungsstatus_geaendert_am IS 'Zeitpunkt der letzten Zahlungsstatus-Änderung';