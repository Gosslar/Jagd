-- Prüfe alle Bestellungen in allen Tabellen und teste Bestellerstellung

-- 1. Zeige alle Tabellen die "bestellung" enthalten
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as spalten_anzahl
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name LIKE '%bestellung%'
ORDER BY table_name;

-- 2. Prüfe neue einfache Bestelltabelle
SELECT COUNT(*) as anzahl_bestellungen FROM public.simple_bestellungen_2025_10_31_12_00;

-- 3. Zeige alle Bestellungen aus neuer Tabelle
SELECT 
    id,
    name,
    email,
    telefon,
    adresse,
    gesamtpreis,
    status,
    erstellt_am
FROM public.simple_bestellungen_2025_10_31_12_00
ORDER BY erstellt_am DESC
LIMIT 10;

-- 4. Prüfe Bestellpositionen
SELECT COUNT(*) as anzahl_positionen FROM public.simple_bestellpositionen_2025_10_31_12_00;

-- 5. Zeige Bestellpositionen
SELECT 
    bestellung_id,
    produkt_name,
    menge,
    einzelpreis,
    gesamtpreis
FROM public.simple_bestellpositionen_2025_10_31_12_00
ORDER BY erstellt_am DESC
LIMIT 10;

-- 6. Erstelle Test-Bestellung um sicherzustellen dass es funktioniert
INSERT INTO public.simple_bestellungen_2025_10_31_12_00 (
    name, 
    email, 
    telefon, 
    adresse, 
    nachricht, 
    gesamtpreis, 
    status
) VALUES (
    'Test Admin Bestellung',
    'admin@test.de',
    '0123456789',
    'Admin Teststraße 1, 12345 Teststadt',
    'Test-Bestellung zur Überprüfung der Bestellverwaltung',
    99.99,
    'neu'
) RETURNING id, name, email, gesamtpreis, status, erstellt_am;

-- 7. Erstelle Test-Bestellpositionen für die Test-Bestellung
WITH test_bestellung AS (
    SELECT id FROM public.simple_bestellungen_2025_10_31_12_00 
    WHERE name = 'Test Admin Bestellung' 
    ORDER BY erstellt_am DESC 
    LIMIT 1
)
INSERT INTO public.simple_bestellpositionen_2025_10_31_12_00 (
    bestellung_id,
    produkt_name,
    menge,
    einzelpreis,
    gesamtpreis
) 
SELECT 
    test_bestellung.id,
    'Test Rehkeule',
    2,
    25.00,
    50.00
FROM test_bestellung
UNION ALL
SELECT 
    test_bestellung.id,
    'Test Wildschweinbratwurst',
    3,
    16.66,
    49.99
FROM test_bestellung;

-- 8. Zeige finale Übersicht
SELECT 
    'Bestellungen' as tabelle,
    COUNT(*) as anzahl
FROM public.simple_bestellungen_2025_10_31_12_00
UNION ALL
SELECT 
    'Bestellpositionen' as tabelle,
    COUNT(*) as anzahl
FROM public.simple_bestellpositionen_2025_10_31_12_00;

-- 9. Zeige Test-Bestellung mit Positionen
SELECT 
    b.id,
    b.name,
    b.email,
    b.gesamtpreis,
    b.status,
    COUNT(p.id) as anzahl_positionen,
    STRING_AGG(p.produkt_name || ' (' || p.menge || 'x)', ', ') as produkte
FROM public.simple_bestellungen_2025_10_31_12_00 b
LEFT JOIN public.simple_bestellpositionen_2025_10_31_12_00 p ON b.id = p.bestellung_id
WHERE b.name = 'Test Admin Bestellung'
GROUP BY b.id, b.name, b.email, b.gesamtpreis, b.status;