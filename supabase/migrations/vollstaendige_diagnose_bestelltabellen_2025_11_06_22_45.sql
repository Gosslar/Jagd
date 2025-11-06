-- Vollständige Diagnose - prüfe alle Tabellen und neue Bestellungen
-- Erstellt: 2025-11-06 22:45 UTC

-- 1. Prüfe welche Bestelltabellen existieren
SELECT 
    'VERFUEGBARE_BESTELLTABELLEN' as info,
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name LIKE '%bestellung%' 
AND table_schema = 'public'
ORDER BY table_name;

-- 2. Zeige alle Bestellungen aus der ALTEN Tabelle (falls Shop noch dort speichert)
SELECT 
    'ALTE_TABELLE_2025_10_31' as quelle,
    COUNT(*) as anzahl_bestellungen,
    MAX(created_at) as neueste_bestellung,
    MIN(created_at) as aelteste_bestellung
FROM public.simple_bestellungen_2025_10_31_12_00;

-- 3. Zeige alle Bestellungen aus der NEUEN Tabelle (wo Bestellverwaltung liest)
SELECT 
    'NEUE_TABELLE_2025_11_06' as quelle,
    COUNT(*) as anzahl_bestellungen,
    MAX(created_at) as neueste_bestellung,
    MIN(created_at) as aelteste_bestellung
FROM public.simple_bestellungen_2025_11_06_21_00;

-- 4. Zeige die letzten 5 Bestellungen aus BEIDEN Tabellen
SELECT 
    'LETZTE_5_ALTE_TABELLE' as quelle,
    id,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at
FROM public.simple_bestellungen_2025_10_31_12_00 
ORDER BY created_at DESC
LIMIT 5;

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

-- 5. Prüfe ob neue Bestellungen in den letzten 10 Minuten erstellt wurden
SELECT 
    'BESTELLUNGEN_LETZTE_10_MIN_ALTE_TABELLE' as quelle,
    COUNT(*) as anzahl,
    STRING_AGG(name, ', ') as kunden
FROM public.simple_bestellungen_2025_10_31_12_00 
WHERE created_at > NOW() - INTERVAL '10 minutes';

SELECT 
    'BESTELLUNGEN_LETZTE_10_MIN_NEUE_TABELLE' as quelle,
    COUNT(*) as anzahl,
    STRING_AGG(name, ', ') as kunden
FROM public.simple_bestellungen_2025_11_06_21_00 
WHERE created_at > NOW() - INTERVAL '10 minutes';