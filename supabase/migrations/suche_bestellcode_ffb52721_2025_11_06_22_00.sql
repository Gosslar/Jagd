-- Suche nach Bestellung mit Code ffb52721 über UUID-Suche
-- Erstellt: 2025-11-06 22:00 UTC

-- Zeige alle Bestellungen mit ihren UUIDs und generierten Codes
SELECT 
    'ALLE_BESTELLUNGEN_MIT_CODES' as typ,
    id as uuid_id,
    CONCAT('B-', SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)) as bestellcode,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at
FROM public.simple_bestellungen_2025_11_06_21_00 
ORDER BY created_at DESC;

-- Suche nach Bestellung wo der generierte Code ffb52721 enthält
WITH bestellung_codes AS (
    SELECT 
        id,
        CONCAT('B-', SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)) as bestellcode,
        name,
        email,
        gesamtpreis,
        status,
        created_at
    FROM public.simple_bestellungen_2025_11_06_21_00
)
SELECT 
    'BESTELLUNG_GEFUNDEN' as typ,
    id as uuid_id,
    bestellcode,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at
FROM bestellung_codes
WHERE bestellcode LIKE '%ffb52721%' OR bestellcode = 'B-ffb52721';

-- Suche nach Artikeln für die gefundene Bestellung
WITH bestellung_codes AS (
    SELECT 
        id,
        CONCAT('B-', SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)) as bestellcode
    FROM public.simple_bestellungen_2025_11_06_21_00
)
SELECT 
    'ARTIKEL_FUER_BESTELLUNG_FFB52721' as typ,
    bc.bestellcode,
    p.produkt_name as artikel,
    p.menge,
    p.einzelpreis,
    p.gesamtpreis,
    'ARTIKEL_DETAILS' as info
FROM bestellung_codes bc
JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON bc.id = p.bestellung_id
WHERE bc.bestellcode LIKE '%ffb52721%' OR bc.bestellcode = 'B-ffb52721';