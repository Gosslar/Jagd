-- Korrigierte Migration der alten Bestellungen
-- Erstellt: 2025-11-06 21:00 UTC

-- Prüfe Struktur der alten Tabelle
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'simple_bestellungen_2025_10_31_12_00' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Prüfe alte Bestellungen (mit korrekten Spaltennamen)
SELECT 'Alte Bestellungen in simple_bestellungen_2025_10_31_12_00' as info, count(*) as anzahl
FROM public.simple_bestellungen_2025_10_31_12_00;

-- Zeige alle alten Bestellungen (mit verfügbaren Spalten)
SELECT id, name, email, gesamtpreis
FROM public.simple_bestellungen_2025_10_31_12_00
ORDER BY id;

-- Migriere alte Bestellungen in neue Tabelle
INSERT INTO public.simple_bestellungen_2025_11_06_21_00 (
    name, email, telefon, adresse, nachricht, gesamtpreis, status, created_at, updated_at
)
SELECT 
    name,
    email,
    COALESCE(telefon, '') as telefon,
    COALESCE(adresse, '') as adresse,
    COALESCE(nachricht, '') as nachricht,
    gesamtpreis,
    'neu' as status,
    NOW() as created_at,
    NOW() as updated_at
FROM public.simple_bestellungen_2025_10_31_12_00
WHERE NOT EXISTS (
    SELECT 1 FROM public.simple_bestellungen_2025_11_06_21_00 n
    WHERE n.name = simple_bestellungen_2025_10_31_12_00.name 
    AND n.email = simple_bestellungen_2025_10_31_12_00.email
    AND n.gesamtpreis = simple_bestellungen_2025_10_31_12_00.gesamtpreis
);

-- Zeige Ergebnis der Migration
SELECT 'Nach Migration - Neue Tabelle' as info, count(*) as anzahl
FROM public.simple_bestellungen_2025_11_06_21_00;

-- Zeige alle Bestellungen in neuer Tabelle
SELECT name, email, status, gesamtpreis, created_at
FROM public.simple_bestellungen_2025_11_06_21_00
ORDER BY created_at DESC;