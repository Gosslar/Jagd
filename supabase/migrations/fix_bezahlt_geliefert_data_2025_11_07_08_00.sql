-- Prüfe und korrigiere Bezahlt/Geliefert Spalten
-- Aktuelle Zeit: 2025-11-07 08:00 UTC

-- Prüfe aktuelle Tabellenstruktur
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'simple_bestellungen_2025_11_06_21_00' 
AND column_name IN ('bezahlt', 'geliefert', 'lieferdatum')
ORDER BY ordinal_position;

-- Prüfe aktuelle Daten
SELECT id, bestellnummer, kunde_name, status, bezahlt, geliefert, lieferdatum, created_at
FROM public.simple_bestellungen_2025_11_06_21_00 
ORDER BY created_at DESC 
LIMIT 5;

-- Setze alle bestehenden Bestellungen auf FALSE falls NULL
UPDATE public.simple_bestellungen_2025_11_06_21_00 
SET bezahlt = COALESCE(bezahlt, FALSE),
    geliefert = COALESCE(geliefert, FALSE)
WHERE bezahlt IS NULL OR geliefert IS NULL;

-- Teste Update einer Bestellung
UPDATE public.simple_bestellungen_2025_11_06_21_00 
SET bezahlt = TRUE, geliefert = TRUE, lieferdatum = NOW()
WHERE id = (
    SELECT id FROM public.simple_bestellungen_2025_11_06_21_00 
    ORDER BY created_at DESC 
    LIMIT 1
);

-- Prüfe Ergebnis
SELECT id, bestellnummer, kunde_name, status, bezahlt, geliefert, lieferdatum
FROM public.simple_bestellungen_2025_11_06_21_00 
ORDER BY created_at DESC 
LIMIT 3;

-- Zeige finale Tabellenstruktur
\d public.simple_bestellungen_2025_11_06_21_00;