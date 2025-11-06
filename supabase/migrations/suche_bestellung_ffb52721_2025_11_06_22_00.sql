-- Suche nach Bestellung B-ffb52721 und deren Artikeln
-- Erstellt: 2025-11-06 22:00 UTC

-- Suche Bestellung mit ID B-ffb52721
SELECT 
    'BESTELLUNG_GEFUNDEN' as typ,
    id,
    name as kunde,
    email,
    telefon,
    adresse,
    nachricht,
    gesamtpreis,
    status,
    created_at,
    updated_at
FROM public.simple_bestellungen_2025_11_06_21_00 
WHERE id = 'B-ffb52721' OR id LIKE '%ffb52721%';

-- Falls nicht gefunden, suche in allen Bestellungen nach ähnlichen IDs
SELECT 
    'AEHNLICHE_BESTELLUNGEN' as typ,
    id,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at
FROM public.simple_bestellungen_2025_11_06_21_00 
WHERE id LIKE '%ffb52721%' OR id LIKE '%ffb5%' OR id LIKE '%2721%'
ORDER BY created_at DESC;

-- Suche nach Artikeln für diese Bestellung
SELECT 
    'ARTIKEL_FUER_BESTELLUNG' as typ,
    p.bestellung_id,
    p.produkt_name as artikel,
    p.menge,
    p.einzelpreis,
    p.gesamtpreis,
    p.created_at
FROM public.simple_bestellpositionen_2025_11_06_21_00 p
WHERE p.bestellung_id = 'B-ffb52721' OR p.bestellung_id LIKE '%ffb52721%';

-- Zeige alle Bestellungen mit ihren IDs zur Referenz
SELECT 
    'ALLE_BESTELLUNGEN_REFERENZ' as typ,
    id as bestellung_id,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at
FROM public.simple_bestellungen_2025_11_06_21_00 
ORDER BY created_at DESC
LIMIT 10;