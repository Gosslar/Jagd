-- Prüfe Shop-Tabellen Struktur und repariere Bestellfunktion

-- 1. Zeige Struktur der Bestelltabelle
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'shop_bestellungen_2025_10_27_14_00' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Zeige Struktur der Bestellpositionen-Tabelle
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'shop_bestellpositionen_2025_10_27_14_00' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Zeige Struktur der Produkte-Tabelle
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'shop_produkte_2025_10_27_14_00' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Deaktiviere RLS für alle Shop-Tabellen
ALTER TABLE IF EXISTS public.shop_kategorien_2025_10_27_14_00 DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.shop_produkte_2025_10_27_14_00 DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.shop_bestellungen_2025_10_27_14_00 DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.shop_bestellpositionen_2025_10_27_14_00 DISABLE ROW LEVEL SECURITY;

-- 5. Zeige verfügbare Produkte
SELECT 
    id,
    produkt_name,
    kategorie,
    preis,
    einheit,
    lagerbestand,
    verfuegbar
FROM public.shop_produkte_2025_10_27_14_00
WHERE verfuegbar = true
ORDER BY kategorie, produkt_name
LIMIT 10;