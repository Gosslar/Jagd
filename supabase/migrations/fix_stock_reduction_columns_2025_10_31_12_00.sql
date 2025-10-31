-- Prüfe Produkt-Tabellen Struktur und korrigiere Lagerbestand-Funktion

-- 1. Zeige alle Tabellen mit "produkt" im Namen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%produkt%'
ORDER BY table_name;

-- 2. Zeige Struktur der shop_produkte Tabelle
SELECT 
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'shop_produkte_2025_10_27_14_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Zeige ein paar Beispiel-Produkte
SELECT * FROM public.shop_produkte_2025_10_27_14_00 LIMIT 3;

-- 4. Lösche und erstelle korrigierte Funktion
DROP FUNCTION IF EXISTS public.reduce_stock_for_order(UUID);

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
        
        -- Versuche Lagerbestand zu reduzieren (verwende korrekte Spaltennamen)
        BEGIN
            -- Versuche mit verschiedenen möglichen Spaltennamen
            UPDATE public.shop_produkte_2025_10_27_14_00 
            SET lagerbestand = lagerbestand - position_record.menge
            WHERE name = position_record.produkt_name 
            AND lagerbestand >= position_record.menge;
            
            GET DIAGNOSTICS updated_count = ROW_COUNT;
            
            IF updated_count = 0 THEN
                -- Versuche anderen Spaltennamen
                UPDATE public.shop_produkte_2025_10_27_14_00 
                SET lagerbestand = lagerbestand - position_record.menge
                WHERE titel = position_record.produkt_name 
                AND lagerbestand >= position_record.menge;
                
                GET DIAGNOSTICS updated_count = ROW_COUNT;
            END IF;
            
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

COMMENT ON FUNCTION public.reduce_stock_for_order IS 'Reduziert Lagerbestand für Bestellpositionen - korrigierte Spaltennamen';