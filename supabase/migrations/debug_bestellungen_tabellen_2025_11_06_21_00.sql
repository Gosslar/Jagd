-- Debug und Test der Bestellungen-Tabellen
-- Erstellt: 2025-11-06 21:00 UTC

-- Prüfe ob Tabellen existieren
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%bestellung%'
ORDER BY table_name;

-- Prüfe Daten in den Tabellen
SELECT 'simple_bestellungen_2025_11_06_21_00' as table_name, count(*) as row_count
FROM public.simple_bestellungen_2025_11_06_21_00
UNION ALL
SELECT 'simple_bestellpositionen_2025_11_06_21_00' as table_name, count(*) as row_count  
FROM public.simple_bestellpositionen_2025_11_06_21_00;

-- Zeige alle Bestellungen
SELECT id, name, email, status, gesamtpreis, created_at
FROM public.simple_bestellungen_2025_11_06_21_00
ORDER BY created_at DESC;