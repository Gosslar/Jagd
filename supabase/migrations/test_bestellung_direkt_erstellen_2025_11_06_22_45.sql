-- Erstelle Test-Bestellung direkt in der Datenbank
-- Erstellt: 2025-11-06 22:45 UTC

-- Erstelle eine Test-Bestellung mit aktueller Zeit
INSERT INTO public.simple_bestellungen_2025_11_06_21_00 (
    name, email, telefon, adresse, nachricht, gesamtpreis, status, created_at, updated_at
) VALUES (
    'Test Kunde JETZT',
    'test@example.com',
    '+49 123 456789',
    'Teststraße 123, 12345 Teststadt',
    'Test-Bestellung zur Diagnose',
    45.50,
    'neu',
    NOW(),
    NOW()
) RETURNING id, name, email, gesamtpreis, status, created_at;

-- Füge Test-Artikel für die neue Bestellung hinzu
WITH neue_bestellung AS (
    SELECT id FROM public.simple_bestellungen_2025_11_06_21_00 
    WHERE name = 'Test Kunde JETZT' 
    ORDER BY created_at DESC LIMIT 1
)
INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (
    bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis, created_at
)
SELECT 
    nb.id,
    'Hirschgulasch (500g) - TEST',
    2,
    22.75,
    45.50,
    NOW()
FROM neue_bestellung nb
RETURNING bestellung_id, produkt_name, menge, einzelpreis;

-- Zeige die neue Test-Bestellung
SELECT 
    'TEST_BESTELLUNG_ERSTELLT' as info,
    b.id,
    b.name as kunde,
    b.email,
    b.gesamtpreis,
    b.status,
    b.created_at,
    COUNT(p.id) as anzahl_artikel
FROM public.simple_bestellungen_2025_11_06_21_00 b
LEFT JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
WHERE b.name = 'Test Kunde JETZT'
GROUP BY b.id, b.name, b.email, b.gesamtpreis, b.status, b.created_at
ORDER BY b.created_at DESC;