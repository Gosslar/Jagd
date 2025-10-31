-- Erstelle einfache Lagerbestand-Reduzierung für Bestellbestätigung

-- 1. Prüfe welche Produkt-Tabellen existieren
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%produkt%'
ORDER BY table_name;

-- 2. Zeige Struktur der Produkt-Tabelle
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name LIKE '%produkt%' 
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 3. Erstelle einfache Lagerbestand-Reduzierung Funktion
CREATE OR REPLACE FUNCTION public.reduce_stock_for_order(order_id_param UUID)
RETURNS TEXT AS $$
DECLARE
    position_record RECORD;
    product_record RECORD;
    result_text TEXT := '';
    updated_count INTEGER := 0;
BEGIN
    -- Durchlaufe alle Bestellpositionen
    FOR position_record IN 
        SELECT produkt_name, menge 
        FROM public.simple_bestellpositionen_2025_10_31_12_00 
        WHERE bestellung_id = order_id_param
    LOOP
        -- Versuche Lagerbestand zu reduzieren in verschiedenen möglichen Tabellen
        
        -- Versuch 1: shop_produkte_2025_10_27_14_00
        UPDATE public.shop_produkte_2025_10_27_14_00 
        SET lagerbestand = lagerbestand - position_record.menge
        WHERE produkt_name = position_record.produkt_name 
        AND lagerbestand >= position_record.menge;
        
        GET DIAGNOSTICS updated_count = ROW_COUNT;
        
        IF updated_count > 0 THEN
            result_text := result_text || 'Lagerbestand reduziert für ' || position_record.produkt_name || ' um ' || position_record.menge || '; ';
        ELSE
            -- Versuch 2: Andere mögliche Tabellennamen
            BEGIN
                UPDATE public.wildfleisch_produkte_2025_10_24_08_03 
                SET lagerbestand = lagerbestand - position_record.menge
                WHERE name = position_record.produkt_name 
                AND lagerbestand >= position_record.menge;
                
                GET DIAGNOSTICS updated_count = ROW_COUNT;
                
                IF updated_count > 0 THEN
                    result_text := result_text || 'Lagerbestand reduziert (alt) für ' || position_record.produkt_name || ' um ' || position_record.menge || '; ';
                ELSE
                    result_text := result_text || 'WARNUNG: Produkt ' || position_record.produkt_name || ' nicht gefunden oder nicht genug Lagerbestand; ';
                END IF;
            EXCEPTION WHEN OTHERS THEN
                result_text := result_text || 'FEHLER bei ' || position_record.produkt_name || ': ' || SQLERRM || '; ';
            END;
        END IF;
    END LOOP;
    
    IF result_text = '' THEN
        result_text := 'Keine Bestellpositionen gefunden für Bestellung ' || order_id_param;
    END IF;
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Teste die Funktion mit der Test-Bestellung
DO $$
DECLARE
    test_order_id UUID;
    result_text TEXT;
BEGIN
    -- Finde Test-Bestellung
    SELECT id INTO test_order_id 
    FROM public.simple_bestellungen_2025_10_31_12_00 
    WHERE name = 'Test Admin Bestellung' 
    LIMIT 1;
    
    IF test_order_id IS NOT NULL THEN
        -- Teste Lagerbestand-Reduzierung (aber mache sie nicht wirklich)
        RAISE NOTICE 'Test-Bestellung gefunden: %', test_order_id;
        
        -- Zeige Bestellpositionen
        FOR result_text IN 
            SELECT produkt_name || ' (' || menge || 'x)' as info
            FROM public.simple_bestellpositionen_2025_10_31_12_00 
            WHERE bestellung_id = test_order_id
        LOOP
            RAISE NOTICE 'Position: %', result_text;
        END LOOP;
    ELSE
        RAISE NOTICE 'Keine Test-Bestellung gefunden';
    END IF;
END $$;

-- 5. Zeige verfügbare Produkte mit Lagerbestand
SELECT 
    'shop_produkte_2025_10_27_14_00' as tabelle,
    COUNT(*) as anzahl_produkte
FROM public.shop_produkte_2025_10_27_14_00
WHERE lagerbestand > 0
UNION ALL
SELECT 
    'wildfleisch_produkte_2025_10_24_08_03' as tabelle,
    COUNT(*) as anzahl_produkte
FROM public.wildfleisch_produkte_2025_10_24_08_03
WHERE lagerbestand > 0;

COMMENT ON FUNCTION public.reduce_stock_for_order IS 'Reduziert Lagerbestand für alle Positionen einer Bestellung';