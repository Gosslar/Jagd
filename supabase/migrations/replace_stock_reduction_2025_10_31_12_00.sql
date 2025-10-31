-- Ersetze Lagerbestand-Reduzierung Funktion

-- 1. Lösche alte Funktion
DROP FUNCTION IF EXISTS public.reduce_stock_for_order(UUID);

-- 2. Erstelle neue einfache Lagerbestand-Reduzierung Funktion
CREATE OR REPLACE FUNCTION public.reduce_stock_for_order(order_id_param UUID)
RETURNS TEXT AS $$
DECLARE
    position_record RECORD;
    result_text TEXT := '';
    updated_count INTEGER := 0;
    total_reductions INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starte Lagerbestand-Reduzierung für Bestellung: %', order_id_param;
    
    -- Durchlaufe alle Bestellpositionen
    FOR position_record IN 
        SELECT produkt_name, menge 
        FROM public.simple_bestellpositionen_2025_10_31_12_00 
        WHERE bestellung_id = order_id_param
    LOOP
        RAISE NOTICE 'Verarbeite Position: % (Menge: %)', position_record.produkt_name, position_record.menge;
        
        -- Versuche Lagerbestand zu reduzieren in shop_produkte_2025_10_27_14_00
        BEGIN
            UPDATE public.shop_produkte_2025_10_27_14_00 
            SET lagerbestand = lagerbestand - position_record.menge
            WHERE produkt_name = position_record.produkt_name 
            AND lagerbestand >= position_record.menge;
            
            GET DIAGNOSTICS updated_count = ROW_COUNT;
            
            IF updated_count > 0 THEN
                result_text := result_text || 'Lagerbestand reduziert für ' || position_record.produkt_name || ' um ' || position_record.menge || '; ';
                total_reductions := total_reductions + 1;
                RAISE NOTICE 'Erfolgreich reduziert: %', position_record.produkt_name;
            ELSE
                result_text := result_text || 'WARNUNG: Produkt ' || position_record.produkt_name || ' nicht gefunden oder nicht genug Lagerbestand; ';
                RAISE NOTICE 'Nicht reduziert: %', position_record.produkt_name;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            result_text := result_text || 'FEHLER bei ' || position_record.produkt_name || ': ' || SQLERRM || '; ';
            RAISE NOTICE 'Fehler bei %: %', position_record.produkt_name, SQLERRM;
        END;
    END LOOP;
    
    IF result_text = '' THEN
        result_text := 'Keine Bestellpositionen gefunden für Bestellung ' || order_id_param;
    ELSE
        result_text := 'Gesamt ' || total_reductions || ' Produkte reduziert. ' || result_text;
    END IF;
    
    RAISE NOTICE 'Lagerbestand-Reduzierung abgeschlossen: %', result_text;
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Teste die Funktion mit einer echten Bestellung
DO $$
DECLARE
    test_order_id UUID;
    result_text TEXT;
BEGIN
    -- Finde eine Bestellung zum Testen
    SELECT id INTO test_order_id 
    FROM public.simple_bestellungen_2025_10_31_12_00 
    ORDER BY erstellt_am DESC
    LIMIT 1;
    
    IF test_order_id IS NOT NULL THEN
        RAISE NOTICE 'Teste Lagerbestand-Reduzierung für Bestellung: %', test_order_id;
        
        -- Zeige Bestellpositionen vor der Reduzierung
        FOR result_text IN 
            SELECT 'Position: ' || produkt_name || ' (' || menge || 'x)' as info
            FROM public.simple_bestellpositionen_2025_10_31_12_00 
            WHERE bestellung_id = test_order_id
        LOOP
            RAISE NOTICE '%', result_text;
        END LOOP;
        
        -- Führe Test-Reduzierung durch (nur zur Demonstration)
        -- SELECT public.reduce_stock_for_order(test_order_id);
        RAISE NOTICE 'Test-Funktion bereit. Verwende: SELECT public.reduce_stock_for_order(''%'');', test_order_id;
    ELSE
        RAISE NOTICE 'Keine Bestellungen zum Testen gefunden';
    END IF;
END $$;

-- 4. Zeige aktuelle Lagerbestände
SELECT 
    produkt_name,
    lagerbestand,
    verfuegbar
FROM public.shop_produkte_2025_10_27_14_00
WHERE lagerbestand > 0
ORDER BY produkt_name
LIMIT 10;

COMMENT ON FUNCTION public.reduce_stock_for_order IS 'Reduziert Lagerbestand für alle Positionen einer Bestellung - Version 2025-10-31';