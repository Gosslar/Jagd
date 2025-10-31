-- Prüfe verfuegbar Spalten-Definition und erstelle Workaround

-- 1. Prüfe Spalten-Definition
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable,
    generation_expression,
    is_generated
FROM information_schema.columns 
WHERE table_name = 'shop_produkte_2025_10_27_14_00'
AND table_schema = 'public'
AND column_name = 'verfuegbar';

-- 2. Zeige alle Produkte mit Lagerbestand-Status
SELECT 
    name,
    lagerbestand,
    verfuegbar,
    CASE 
        WHEN lagerbestand <= 0 THEN 'Nicht verfügbar (kein Lagerbestand)'
        WHEN lagerbestand > 0 THEN 'Verfügbar'
        ELSE 'Unbekannt'
    END as tatsaechlicher_status
FROM public.shop_produkte_2025_10_27_14_00
ORDER BY lagerbestand DESC, name;

-- 3. Erstelle View für verfügbare Produkte (nur mit Lagerbestand > 0)
CREATE OR REPLACE VIEW public.verfuegbare_produkte AS
SELECT 
    id,
    name,
    kategorie,
    preis,
    einheit,
    lagerbestand,
    verfuegbar,
    aktualisiert_am,
    erstellt_am
FROM public.shop_produkte_2025_10_27_14_00
WHERE lagerbestand > 0
ORDER BY name;

-- 4. Teste die View
SELECT 
    name,
    lagerbestand,
    verfuegbar
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

-- 6. Zeige problematische Produkte (Lagerbestand 0 aber verfuegbar = true)
SELECT 
    name,
    lagerbestand,
    verfuegbar,
    'PROBLEM: Sollte nicht im Shop angezeigt werden' as hinweis
FROM public.shop_produkte_2025_10_27_14_00
WHERE lagerbestand <= 0 AND verfuegbar = true
ORDER BY name;

COMMENT ON VIEW public.verfuegbare_produkte IS 'View für Produkte mit Lagerbestand > 0 - umgeht verfuegbar Spalten-Probleme';