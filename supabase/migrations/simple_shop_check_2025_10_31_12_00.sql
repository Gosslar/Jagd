-- Einfache Prüfung der Shop-Tabellen

-- 1. Prüfe welche Shop-Tabellen existieren
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%shop%'
ORDER BY table_name;

-- 2. Prüfe welche Bestellungs-Tabellen existieren
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%bestellung%' OR table_name LIKE '%order%')
ORDER BY table_name;

-- 3. Zeige alle Tabellen mit 2025_10_27 im Namen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%2025_10_27%'
ORDER BY table_name;

-- 4. Deaktiviere RLS für alle möglichen Shop-Tabellen
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND (table_name LIKE '%shop%' OR table_name LIKE '%bestellung%')
    LOOP
        EXECUTE 'ALTER TABLE IF EXISTS public.' || table_record.table_name || ' DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE 'RLS deaktiviert für: %', table_record.table_name;
    END LOOP;
END $$;