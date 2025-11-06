-- Korrigierte Prüfung ohne created_at für alte Tabelle
-- Erstellt: 2025-11-06 23:00 UTC

-- Zeige Struktur der ALTEN Tabelle
SELECT 
    'STRUKTUR_ALTE_TABELLE' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'simple_bestellungen_2025_10_31_12_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Zeige Struktur der NEUEN Tabelle
SELECT 
    'STRUKTUR_NEUE_TABELLE' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'simple_bestellungen_2025_11_06_21_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Zähle Bestellungen in beiden Tabellen
SELECT 
    'ANZAHL_NEUE_TABELLE' as info,
    COUNT(*) as total_bestellungen
FROM public.simple_bestellungen_2025_11_06_21_00;

SELECT 
    'ANZAHL_ALTE_TABELLE' as info,
    COUNT(*) as total_bestellungen
FROM public.simple_bestellungen_2025_10_31_12_00;

-- Zeige die letzten 5 Bestellungen aus der NEUEN Tabelle
SELECT 
    'LETZTE_5_NEUE_TABELLE' as quelle,
    id,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at
FROM public.simple_bestellungen_2025_11_06_21_00 
ORDER BY created_at DESC
LIMIT 5;

-- Zeige die letzten 5 Bestellungen aus der ALTEN Tabelle (ohne created_at)
SELECT 
    'LETZTE_5_ALTE_TABELLE' as quelle,
    id,
    name as kunde,
    email,
    gesamtpreis,
    status
FROM public.simple_bestellungen_2025_10_31_12_00 
ORDER BY id DESC
LIMIT 5;

-- Erstelle eine weitere Test-Bestellung
INSERT INTO public.simple_bestellungen_2025_11_06_21_00 (
    name, email, telefon, adresse, nachricht, gesamtpreis, status, created_at, updated_at
) VALUES (
    'SHOP TEST JETZT ' || EXTRACT(EPOCH FROM NOW())::text,
    'shoptest@example.com',
    '+49 123 456789',
    'Shop Teststraße 456',
    'Test ob Shop-Bestellungen ankommen',
    33.75,
    'neu',
    NOW(),
    NOW()
) RETURNING id, name, created_at;