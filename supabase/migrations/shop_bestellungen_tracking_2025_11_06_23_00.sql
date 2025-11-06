-- Prüfe ob Shop-Bestellungen tatsächlich in der richtigen Tabelle ankommen
-- Erstellt: 2025-11-06 23:00 UTC

-- Zeige alle Bestellungen der letzten 30 Minuten in der NEUEN Tabelle
SELECT 
    'NEUE_TABELLE_LETZTE_30_MIN' as quelle,
    id,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at,
    EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minuten_alt
FROM public.simple_bestellungen_2025_11_06_21_00 
WHERE created_at > NOW() - INTERVAL '30 minutes'
ORDER BY created_at DESC;

-- Zeige alle Bestellungen der letzten 30 Minuten in der ALTEN Tabelle
SELECT 
    'ALTE_TABELLE_LETZTE_30_MIN' as quelle,
    id,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at,
    EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minuten_alt
FROM public.simple_bestellungen_2025_10_31_12_00 
WHERE created_at > NOW() - INTERVAL '30 minutes'
ORDER BY created_at DESC;

-- Zähle Bestellungen in beiden Tabellen
SELECT 
    'ANZAHL_NEUE_TABELLE' as info,
    COUNT(*) as total_bestellungen,
    MAX(created_at) as neueste_bestellung
FROM public.simple_bestellungen_2025_11_06_21_00;

SELECT 
    'ANZAHL_ALTE_TABELLE' as info,
    COUNT(*) as total_bestellungen,
    MAX(created_at) as neueste_bestellung
FROM public.simple_bestellungen_2025_10_31_12_00;

-- Erstelle eine weitere Test-Bestellung mit aktuellem Zeitstempel
INSERT INTO public.simple_bestellungen_2025_11_06_21_00 (
    name, email, telefon, adresse, nachricht, gesamtpreis, status, created_at, updated_at
) VALUES (
    'SHOP TEST ' || TO_CHAR(NOW(), 'HH24:MI:SS'),
    'shoptest@example.com',
    '+49 123 456789',
    'Shop Teststraße 456',
    'Test ob Shop-Bestellungen ankommen',
    33.75,
    'neu',
    NOW(),
    NOW()
) RETURNING id, name, created_at;

-- Zeige die neuesten 5 Bestellungen aus der Tabelle die die Bestellverwaltung liest
SELECT 
    'TOP_5_BESTELLVERWALTUNG_TABELLE' as info,
    id,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at
FROM public.simple_bestellungen_2025_11_06_21_00 
ORDER BY created_at DESC
LIMIT 5;