-- Prüfe Shop-Tabellen und behebe Datenlade-Probleme

-- 1. Prüfe ob Kategorien-Tabelle existiert
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name LIKE '%kategorie%'
ORDER BY table_name;

-- 2. Prüfe ob Produkt-Tabelle existiert
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name LIKE '%produkt%'
ORDER BY table_name;

-- 3. Zeige Struktur der Kategorien-Tabelle
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'shop_kategorien_2025_10_27_14_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Zeige Struktur der Produkt-Tabelle
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'shop_produkte_2025_10_27_14_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Zeige alle Kategorien
SELECT * FROM public.shop_kategorien_2025_10_27_14_00 ORDER BY name;

-- 6. Zeige alle Produkte mit Lagerbestand
SELECT 
    id,
    name,
    kategorie_id,
    preis,
    einheit,
    lagerbestand,
    verfuegbar
FROM public.shop_produkte_2025_10_27_14_00
WHERE lagerbestand > 0
ORDER BY name
LIMIT 10;

-- 7. Teste JOIN zwischen Produkten und Kategorien
SELECT 
    p.name as produkt_name,
    p.lagerbestand,
    p.verfuegbar,
    k.name as kategorie_name
FROM public.shop_produkte_2025_10_27_14_00 p
LEFT JOIN public.shop_kategorien_2025_10_27_14_00 k ON p.kategorie_id = k.id
WHERE p.lagerbestand > 0
LIMIT 5;

-- 8. Prüfe RLS Policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND (tablename LIKE '%kategorie%' OR tablename LIKE '%produkt%')
ORDER BY tablename, policyname;