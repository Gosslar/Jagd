-- Direkte Abfrage der Artikel in Bestellung B-ffb52721
-- Erstellt: 2025-11-06 22:30 UTC

-- Finde die UUID für Bestellcode B-ffb52721
WITH bestellung_mit_code AS (
    SELECT 
        id,
        CONCAT('B-', SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)) as bestellcode,
        name as kunde_name,
        email,
        gesamtpreis,
        status,
        created_at
    FROM public.simple_bestellungen_2025_11_06_21_00
    WHERE CONCAT('B-', SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)) = 'B-ffb52721'
)
SELECT 
    'BESTELLUNG_B_FFB52721_DETAILS' as info,
    bestellcode,
    kunde_name,
    email,
    gesamtpreis,
    status,
    created_at::date as bestelldatum
FROM bestellung_mit_code;

-- Zeige ALLE Artikel für Bestellung B-ffb52721
WITH bestellung_mit_code AS (
    SELECT 
        id,
        CONCAT('B-', SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)) as bestellcode
    FROM public.simple_bestellungen_2025_11_06_21_00
    WHERE CONCAT('B-', SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)) = 'B-ffb52721'
)
SELECT 
    'ARTIKEL_IN_BESTELLUNG_B_FFB52721' as info,
    p.produkt_name as artikel_name,
    p.menge,
    p.einzelpreis,
    p.gesamtpreis,
    (p.menge * p.einzelpreis) as berechneter_preis
FROM bestellung_mit_code bc
JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON bc.id = p.bestellung_id
ORDER BY p.created_at;

-- Falls nicht gefunden, zeige alle Bestellcodes zur Referenz
SELECT 
    'ALLE_VERFUEGBAREN_BESTELLCODES' as info,
    CONCAT('B-', SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)) as bestellcode,
    name as kunde,
    gesamtpreis,
    status,
    created_at::date as datum
FROM public.simple_bestellungen_2025_11_06_21_00 
ORDER BY created_at DESC
LIMIT 10;