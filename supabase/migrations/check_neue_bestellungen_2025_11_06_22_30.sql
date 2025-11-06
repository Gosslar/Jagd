-- Prüfe ob neue Bestellungen in der Datenbank ankommen
-- Erstellt: 2025-11-06 22:30 UTC

-- Zeige alle Bestellungen mit Zeitstempel
SELECT 
    'ALLE_BESTELLUNGEN_CHRONOLOGISCH' as typ,
    id,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at,
    updated_at,
    EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minuten_alt
FROM public.simple_bestellungen_2025_11_06_21_00 
ORDER BY created_at DESC;

-- Zeige Bestellungen der letzten Stunde
SELECT 
    'NEUE_BESTELLUNGEN_LETZTE_STUNDE' as typ,
    id,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at
FROM public.simple_bestellungen_2025_11_06_21_00 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Prüfe ob Bestellpositionen für neue Bestellungen existieren
SELECT 
    'BESTELLPOSITIONEN_CHECK' as typ,
    b.name as kunde,
    b.created_at as bestellung_zeit,
    COUNT(p.id) as anzahl_artikel,
    STRING_AGG(p.produkt_name, ', ') as artikel_liste
FROM public.simple_bestellungen_2025_11_06_21_00 b
LEFT JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
WHERE b.created_at > NOW() - INTERVAL '2 hours'
GROUP BY b.id, b.name, b.created_at
ORDER BY b.created_at DESC;