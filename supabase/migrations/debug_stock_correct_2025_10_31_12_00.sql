-- Debug Lagerbestand - korrekte Spaltenprüfung

-- 1. Zeige Struktur der Produkt-Tabelle
SELECT 
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'shop_produkte_2025_10_27_14_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Zeige alle Produkte mit Lagerbestand (mit korrekten Spaltennamen)
SELECT * FROM public.shop_produkte_2025_10_27_14_00 LIMIT 5;

-- 3. Zeige Bestellpositionen die reduziert werden sollen
SELECT 
    b.name as kunde_name,
    p.produkt_name,
    p.menge,
    p.einzelpreis,
    b.status
FROM public.simple_bestellungen_2025_10_31_12_00 b
JOIN public.simple_bestellpositionen_2025_10_31_12_00 p ON b.id = p.bestellung_id
ORDER BY b.erstellt_am DESC
LIMIT 10;

-- 4. Prüfe Produktnamen-Übereinstimmung
SELECT 
    'Bestellposition' as typ,
    produkt_name as name,
    COUNT(*) as anzahl
FROM public.simple_bestellpositionen_2025_10_31_12_00
GROUP BY produkt_name
UNION ALL
SELECT 
    'Produkt' as typ,
    name,
    1 as anzahl
FROM public.shop_produkte_2025_10_27_14_00
WHERE name IS NOT NULL
ORDER BY name, typ;

-- 5. Teste manuelle Lagerbestand-Reduzierung
DO $$
DECLARE
    test_product_name TEXT := 'Test Rehkeule';
    test_menge INTEGER := 1;
    updated_count INTEGER;
BEGIN
    RAISE NOTICE 'Teste manuelle Reduzierung für: % (Menge: %)', test_product_name, test_menge;
    
    -- Zeige Produkt vor Reduzierung
    FOR updated_count IN 
        SELECT lagerbestand
        FROM public.shop_produkte_2025_10_27_14_00 
        WHERE name = test_product_name
    LOOP
        RAISE NOTICE 'Lagerbestand vor Reduzierung: %', updated_count;
    END LOOP;
    
    -- Versuche Reduzierung
    UPDATE public.shop_produkte_2025_10_27_14_00 
    SET lagerbestand = lagerbestand - test_menge
    WHERE name = test_product_name 
    AND lagerbestand >= test_menge;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Anzahl aktualisierte Zeilen: %', updated_count;
    
    -- Zeige Produkt nach Reduzierung
    FOR updated_count IN 
        SELECT lagerbestand
        FROM public.shop_produkte_2025_10_27_14_00 
        WHERE name = test_product_name
    LOOP
        RAISE NOTICE 'Lagerbestand nach Reduzierung: %', updated_count;
    END LOOP;
    
    -- Rückgängig machen für weitere Tests
    UPDATE public.shop_produkte_2025_10_27_14_00 
    SET lagerbestand = lagerbestand + test_menge
    WHERE name = test_product_name;
    
    RAISE NOTICE 'Test-Reduzierung rückgängig gemacht';
END $$;