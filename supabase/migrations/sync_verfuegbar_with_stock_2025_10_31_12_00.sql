-- Aktualisiere verfuegbar Status basierend auf Lagerbestand

-- 1. Zeige aktuelle Produkte mit Lagerbestand und Verfügbarkeit
SELECT 
    name,
    lagerbestand,
    verfuegbar,
    CASE 
        WHEN lagerbestand <= 0 AND verfuegbar = true THEN 'PROBLEM: Verfügbar aber kein Lagerbestand'
        WHEN lagerbestand > 0 AND verfuegbar = false THEN 'PROBLEM: Lagerbestand aber nicht verfügbar'
        ELSE 'OK'
    END as status
FROM public.shop_produkte_2025_10_27_14_00
ORDER BY name;

-- 2. Aktualisiere verfuegbar Status basierend auf Lagerbestand
UPDATE public.shop_produkte_2025_10_27_14_00 
SET verfuegbar = CASE 
    WHEN lagerbestand > 0 THEN true 
    ELSE false 
END;

-- 3. Zeige Ergebnis nach Update
SELECT 
    name,
    lagerbestand,
    verfuegbar,
    'KORRIGIERT' as status
FROM public.shop_produkte_2025_10_27_14_00
ORDER BY verfuegbar DESC, lagerbestand DESC, name;

-- 4. Erstelle Trigger für automatische verfuegbar Updates
CREATE OR REPLACE FUNCTION public.update_verfuegbar_based_on_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Setze verfuegbar basierend auf Lagerbestand
    IF NEW.lagerbestand <= 0 THEN
        NEW.verfuegbar = false;
    ELSIF NEW.lagerbestand > 0 AND OLD.verfuegbar = false THEN
        -- Nur automatisch auf true setzen wenn es vorher false war wegen Lagerbestand
        NEW.verfuegbar = true;
    END IF;
    
    -- Setze aktualisiert_am
    NEW.aktualisiert_am = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Erstelle/Ersetze Trigger
DROP TRIGGER IF EXISTS update_verfuegbar_on_stock_change ON public.shop_produkte_2025_10_27_14_00;

CREATE TRIGGER update_verfuegbar_on_stock_change
    BEFORE UPDATE ON public.shop_produkte_2025_10_27_14_00
    FOR EACH ROW
    WHEN (OLD.lagerbestand IS DISTINCT FROM NEW.lagerbestand)
    EXECUTE FUNCTION public.update_verfuegbar_based_on_stock();

-- 6. Teste den Trigger
DO $$
DECLARE
    test_product_name TEXT;
    original_stock INTEGER;
    original_available BOOLEAN;
BEGIN
    -- Finde ein Produkt zum Testen
    SELECT name, lagerbestand, verfuegbar 
    INTO test_product_name, original_stock, original_available
    FROM public.shop_produkte_2025_10_27_14_00 
    WHERE lagerbestand > 0
    LIMIT 1;
    
    IF test_product_name IS NOT NULL THEN
        RAISE NOTICE 'Teste Trigger mit Produkt: % (Lagerbestand: %, Verfügbar: %)', 
                     test_product_name, original_stock, original_available;
        
        -- Teste Lagerbestand auf 0 setzen
        UPDATE public.shop_produkte_2025_10_27_14_00 
        SET lagerbestand = 0
        WHERE name = test_product_name;
        
        -- Prüfe Ergebnis
        SELECT verfuegbar INTO original_available
        FROM public.shop_produkte_2025_10_27_14_00 
        WHERE name = test_product_name;
        
        RAISE NOTICE 'Nach Lagerbestand = 0: Verfügbar = %', original_available;
        
        -- Stelle ursprünglichen Zustand wieder her
        UPDATE public.shop_produkte_2025_10_27_14_00 
        SET lagerbestand = original_stock
        WHERE name = test_product_name;
        
        RAISE NOTICE 'Trigger-Test abgeschlossen - ursprünglicher Zustand wiederhergestellt';
    ELSE
        RAISE NOTICE 'Kein Produkt zum Testen gefunden';
    END IF;
END $$;

-- 7. Zeige finale Statistik
SELECT 
    COUNT(*) as gesamt_produkte,
    COUNT(*) FILTER (WHERE verfuegbar = true) as verfuegbare_produkte,
    COUNT(*) FILTER (WHERE lagerbestand > 0) as produkte_mit_lagerbestand,
    COUNT(*) FILTER (WHERE verfuegbar = true AND lagerbestand > 0) as korrekt_verfuegbar,
    COUNT(*) FILTER (WHERE verfuegbar = false AND lagerbestand <= 0) as korrekt_nicht_verfuegbar
FROM public.shop_produkte_2025_10_27_14_00;

COMMENT ON TRIGGER update_verfuegbar_on_stock_change ON public.shop_produkte_2025_10_27_14_00 IS 'Automatische Aktualisierung der Verfügbarkeit basierend auf Lagerbestand';