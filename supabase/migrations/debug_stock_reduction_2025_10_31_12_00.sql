-- Debug Lagerbestand-Reduzierung - prüfe Produkte und teste Funktion

-- 1. Zeige alle Produkte mit Lagerbestand
SELECT 
    id,
    name,
    titel,
    lagerbestand,
    verfuegbar
FROM public.shop_produkte_2025_10_27_14_00
ORDER BY name;

-- 2. Zeige Bestellpositionen die reduziert werden sollen
SELECT 
    b.name as kunde_name,
    p.produkt_name,
    p.menge,
    p.einzelpreis,
    b.status
FROM public.simple_bestellungen_2025_10_31_12_00 b
JOIN public.simple_bestellpositionen_2025_10_31_12_00 p ON b.id = p.bestellung_id
WHERE b.status = 'bestaetigt'
ORDER BY b.erstellt_am DESC;

-- 3. Teste die Lagerbestand-Reduzierung Funktion mit einer echten Bestellung
DO $$
DECLARE
    test_order_id UUID;
    result_text TEXT;
BEGIN
    -- Finde eine bestätigte Bestellung
    SELECT id INTO test_order_id 
    FROM public.simple_bestellungen_2025_10_31_12_00 
    WHERE status = 'bestaetigt'
    ORDER BY erstellt_am DESC
    LIMIT 1;
    
    IF test_order_id IS NOT NULL THEN
        RAISE NOTICE 'Teste Lagerbestand-Reduzierung für Bestellung: %', test_order_id;
        
        -- Zeige Bestellpositionen
        FOR result_text IN 
            SELECT 'Position: ' || produkt_name || ' (' || menge || 'x) - Einzelpreis: ' || einzelpreis || '€' as info
            FROM public.simple_bestellpositionen_2025_10_31_12_00 
            WHERE bestellung_id = test_order_id
        LOOP
            RAISE NOTICE '%', result_text;
        END LOOP;
        
        -- Zeige passende Produkte vor Reduzierung
        FOR result_text IN 
            SELECT 'Produkt gefunden: ' || COALESCE(name, titel, 'UNBEKANNT') || ' - Lagerbestand: ' || lagerbestand as info
            FROM public.shop_produkte_2025_10_27_14_00 
            WHERE name IN (SELECT produkt_name FROM public.simple_bestellpositionen_2025_10_31_12_00 WHERE bestellung_id = test_order_id)
               OR titel IN (SELECT produkt_name FROM public.simple_bestellpositionen_2025_10_31_12_00 WHERE bestellung_id = test_order_id)
        LOOP
            RAISE NOTICE '%', result_text;
        END LOOP;
        
        -- Führe Test-Reduzierung durch
        SELECT public.reduce_stock_for_order(test_order_id) INTO result_text;
        RAISE NOTICE 'Reduzierung-Ergebnis: %', result_text;
        
    ELSE
        RAISE NOTICE 'Keine bestätigte Bestellung zum Testen gefunden';
        
        -- Zeige alle Bestellungen
        FOR result_text IN 
            SELECT 'Bestellung: ' || name || ' - Status: ' || status as info
            FROM public.simple_bestellungen_2025_10_31_12_00 
            ORDER BY erstellt_am DESC
            LIMIT 5
        LOOP
            RAISE NOTICE '%', result_text;
        END LOOP;
    END IF;
END $$;

-- 4. Prüfe ob Produktnamen zwischen Bestellpositionen und Produkten übereinstimmen
SELECT 
    'Bestellposition' as typ,
    produkt_name as name,
    COUNT(*) as anzahl
FROM public.simple_bestellpositionen_2025_10_31_12_00
GROUP BY produkt_name
UNION ALL
SELECT 
    'Produkt (name)' as typ,
    name,
    1 as anzahl
FROM public.shop_produkte_2025_10_27_14_00
WHERE name IS NOT NULL
UNION ALL
SELECT 
    'Produkt (titel)' as typ,
    titel,
    1 as anzahl
FROM public.shop_produkte_2025_10_27_14_00
WHERE titel IS NOT NULL
ORDER BY name, typ;