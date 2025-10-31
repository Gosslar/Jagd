-- Prüfe korrekte Tabellenstruktur und erstelle passende View

-- 1. Zeige alle Spalten der Tabelle
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'shop_produkte_2025_10_27_14_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Zeige Beispieldaten
SELECT * FROM public.shop_produkte_2025_10_27_14_00 LIMIT 3;

-- 3. Erstelle View mit korrekten Spaltennamen
CREATE OR REPLACE VIEW public.verfuegbare_produkte AS
SELECT *
FROM public.shop_produkte_2025_10_27_14_00
WHERE lagerbestand > 0
ORDER BY name;

-- 4. Teste die View
SELECT 
    name,
    lagerbestand,
    verfuegbar,
    preis,
    einheit
FROM public.verfuegbare_produkte
ORDER BY name
LIMIT 10;

-- 5. Zeige Statistik
SELECT 
    'Alle Produkte' as typ,
    COUNT(*) as anzahl
FROM public.shop_produkte_2025_10_27_14_00
UNION ALL
SELECT 
    'Verfügbare Produkte (Lagerbestand > 0)' as typ,
    COUNT(*) as anzahl
FROM public.verfuegbare_produkte
UNION ALL
SELECT 
    'Produkte mit Lagerbestand = 0' as typ,
    COUNT(*) as anzahl
FROM public.shop_produkte_2025_10_27_14_00
WHERE lagerbestand <= 0;

-- 6. Zeige problematische Produkte
SELECT 
    name,
    lagerbestand,
    verfuegbar
FROM public.shop_produkte_2025_10_27_14_00
WHERE lagerbestand <= 0
ORDER BY name;

COMMENT ON VIEW public.verfuegbare_produkte IS 'View für Produkte mit Lagerbestand > 0';