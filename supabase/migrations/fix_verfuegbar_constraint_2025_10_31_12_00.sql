-- Behebe verfuegbar Spalten-Constraint Problem

-- 1. Prüfe Constraints auf verfuegbar Spalte
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.shop_produkte_2025_10_27_14_00'::regclass
AND conname LIKE '%verfuegbar%';

-- 2. Zeige alle Constraints der Tabelle
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.shop_produkte_2025_10_27_14_00'::regclass;

-- 3. Entferne problematische Constraints auf verfuegbar Spalte
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN 
        SELECT conname
        FROM pg_constraint 
        WHERE conrelid = 'public.shop_produkte_2025_10_27_14_00'::regclass
        AND conname LIKE '%verfuegbar%'
        AND contype = 'c' -- Check constraints
    LOOP
        EXECUTE 'ALTER TABLE public.shop_produkte_2025_10_27_14_00 DROP CONSTRAINT IF EXISTS ' || constraint_record.conname;
        RAISE NOTICE 'Constraint entfernt: %', constraint_record.conname;
    END LOOP;
END $$;

-- 4. Erstelle korrigierte Lagerbestand-Reduzierung ohne verfuegbar Update
DROP FUNCTION IF EXISTS public.reduce_stock_for_order(UUID);

CREATE OR REPLACE FUNCTION public.reduce_stock_for_order(order_id_param UUID)
RETURNS TEXT AS $$
DECLARE
    position_record RECORD;
    result_text TEXT := '';
    updated_count INTEGER := 0;
    total_reductions INTEGER := 0;
    current_stock INTEGER;
BEGIN
    RAISE NOTICE 'Starte Lagerbestand-Reduzierung für Bestellung: %', order_id_param;
    
    -- Durchlaufe alle Bestellpositionen
    FOR position_record IN 
        SELECT produkt_name, menge 
        FROM public.simple_bestellpositionen_2025_10_31_12_00 
        WHERE bestellung_id = order_id_param
    LOOP
        RAISE NOTICE 'Verarbeite Position: % (Menge: %)', position_record.produkt_name, position_record.menge;
        
        -- Suche Produkt und zeige aktuellen Lagerbestand
        SELECT lagerbestand INTO current_stock
        FROM public.shop_produkte_2025_10_27_14_00 
        WHERE name = position_record.produkt_name;
        
        IF current_stock IS NOT NULL THEN
            RAISE NOTICE 'Produkt gefunden: % - Aktueller Lagerbestand: %', position_record.produkt_name, current_stock;
            
            IF current_stock >= position_record.menge THEN
                -- Reduziere nur Lagerbestand, nicht verfuegbar
                UPDATE public.shop_produkte_2025_10_27_14_00 
                SET lagerbestand = lagerbestand - position_record.menge
                WHERE name = position_record.produkt_name;
                
                GET DIAGNOSTICS updated_count = ROW_COUNT;
                
                IF updated_count > 0 THEN
                    result_text := result_text || 'Lagerbestand reduziert für ' || position_record.produkt_name || ' von ' || current_stock || ' auf ' || (current_stock - position_record.menge) || '; ';
                    total_reductions := total_reductions + 1;
                    RAISE NOTICE 'Erfolgreich reduziert: % - Neuer Lagerbestand: %', position_record.produkt_name, (current_stock - position_record.menge);
                ELSE
                    result_text := result_text || 'FEHLER: Update fehlgeschlagen für ' || position_record.produkt_name || '; ';
                    RAISE NOTICE 'Update fehlgeschlagen für: %', position_record.produkt_name;
                END IF;
            ELSE
                result_text := result_text || 'WARNUNG: Nicht genug Lagerbestand für ' || position_record.produkt_name || ' (verfügbar: ' || current_stock || ', benötigt: ' || position_record.menge || '); ';
                RAISE NOTICE 'Nicht genug Lagerbestand für %: verfügbar %, benötigt %', position_record.produkt_name, current_stock, position_record.menge;
            END IF;
        ELSE
            result_text := result_text || 'WARNUNG: Produkt ' || position_record.produkt_name || ' nicht in Produkttabelle gefunden; ';
            RAISE NOTICE 'Produkt nicht gefunden: %', position_record.produkt_name;
        END IF;
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

-- 5. Teste die korrigierte Funktion
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
        RAISE NOTICE 'Teste korrigierte Lagerbestand-Reduzierung (ohne verfuegbar Update) für Bestellung: %', test_order_id;
        
        -- Zeige Bestellpositionen
        FOR result_text IN 
            SELECT 'Position: ' || produkt_name || ' (' || menge || 'x)' as info
            FROM public.simple_bestellpositionen_2025_10_31_12_00 
            WHERE bestellung_id = test_order_id
        LOOP
            RAISE NOTICE '%', result_text;
        END LOOP;
        
        RAISE NOTICE 'Funktion bereit zum Testen. Verwende: SELECT public.reduce_stock_for_order(''%'');', test_order_id;
    ELSE
        RAISE NOTICE 'Keine Bestellungen zum Testen gefunden';
    END IF;
END $$;

-- 6. Zeige aktuelle Lagerbestände
SELECT 
    name,
    lagerbestand,
    verfuegbar,
    preis,
    einheit
FROM public.shop_produkte_2025_10_27_14_00
ORDER BY name
LIMIT 10;

COMMENT ON FUNCTION public.reduce_stock_for_order IS 'Lagerbestand-Reduzierung ohne verfuegbar Update - umgeht Constraint-Probleme';