-- Prüfe ob neue Bestellungen aus dem Shop in der Datenbank ankommen
-- Erstellt: 2025-11-06 22:30 UTC

-- Zeige alle Bestellungen der letzten 2 Stunden
SELECT 
    'NEUE_BESTELLUNGEN_LETZTE_2_STUNDEN' as typ,
    id,
    name as kunde,
    email,
    telefon,
    adresse,
    nachricht,
    gesamtpreis,
    status,
    created_at,
    updated_at,
    EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minuten_alt
FROM public.simple_bestellungen_2025_11_06_21_00 
WHERE created_at > NOW() - INTERVAL '2 hours'
ORDER BY created_at DESC;

-- Prüfe ob Bestellpositionen für neue Bestellungen existieren
SELECT 
    'BESTELLPOSITIONEN_NEUE_BESTELLUNGEN' as typ,
    b.name as kunde,
    b.email,
    b.gesamtpreis,
    b.created_at as bestellung_zeit,
    COUNT(p.id) as anzahl_artikel,
    STRING_AGG(p.produkt_name, ' | ') as artikel_liste
FROM public.simple_bestellungen_2025_11_06_21_00 b
LEFT JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
WHERE b.created_at > NOW() - INTERVAL '2 hours'
GROUP BY b.id, b.name, b.email, b.gesamtpreis, b.created_at
ORDER BY b.created_at DESC;

-- Zeige die neueste Bestellung mit allen Details
SELECT 
    'NEUESTE_BESTELLUNG_DETAILS' as typ,
    id,
    name as kunde,
    email,
    telefon,
    adresse,
    nachricht,
    gesamtpreis,
    status,
    created_at,
    'NEUESTE_BESTELLUNG' as info
FROM public.simple_bestellungen_2025_11_06_21_00 
ORDER BY created_at DESC
LIMIT 1;

-- Zeige Artikel der neuesten Bestellung
SELECT 
    'ARTIKEL_NEUESTE_BESTELLUNG' as typ,
    p.produkt_name as artikel,
    p.menge,
    p.einzelpreis,
    p.gesamtpreis,
    p.created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b
JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
WHERE b.id = (
    SELECT id FROM public.simple_bestellungen_2025_11_06_21_00 
    ORDER BY created_at DESC LIMIT 1
)
ORDER BY p.created_at;