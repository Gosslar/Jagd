-- Zuerst die Struktur der alten Tabelle prüfen
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'wildfleisch_lager_2025_10_24_14_00' 
AND table_schema = 'public';

-- Dann alle vorhandenen Artikel anzeigen
SELECT * FROM public.wildfleisch_lager_2025_10_24_14_00 LIMIT 10;