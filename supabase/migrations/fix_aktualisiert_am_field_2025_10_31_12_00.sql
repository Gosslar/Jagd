-- Behebe aktualisiert_am Feld Problem - füge fehlende Spalte hinzu

-- 1. Prüfe aktuelle Spalten der Produkt-Tabelle
SELECT 
    column_name, 
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'shop_produkte_2025_10_27_14_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Füge aktualisiert_am Spalte hinzu falls sie fehlt
ALTER TABLE public.shop_produkte_2025_10_27_14_00 
ADD COLUMN IF NOT EXISTS aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Prüfe alle Trigger auf der Tabelle
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'shop_produkte_2025_10_27_14_00'
AND event_object_schema = 'public';

-- 4. Erstelle sicheren Update-Trigger falls nötig
CREATE OR REPLACE FUNCTION public.update_aktualisiert_am_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Prüfe ob aktualisiert_am Spalte existiert
    IF TG_TABLE_NAME = 'shop_produkte_2025_10_27_14_00' THEN
        NEW.aktualisiert_am = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Erstelle Trigger nur falls er nicht existiert
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_shop_produkte_aktualisiert_am'
        AND event_object_table = 'shop_produkte_2025_10_27_14_00'
    ) THEN
        CREATE TRIGGER update_shop_produkte_aktualisiert_am
            BEFORE UPDATE ON public.shop_produkte_2025_10_27_14_00
            FOR EACH ROW
            EXECUTE FUNCTION public.update_aktualisiert_am_column();
        RAISE NOTICE 'Trigger erstellt: update_shop_produkte_aktualisiert_am';
    ELSE
        RAISE NOTICE 'Trigger existiert bereits: update_shop_produkte_aktualisiert_am';
    END IF;
END $$;

-- 6. Teste UPDATE Operation
DO $$
DECLARE
    test_product_name TEXT := 'Test Rehkeule';
    current_stock INTEGER;
    updated_count INTEGER;
BEGIN
    -- Zeige Produkt vor Update
    SELECT lagerbestand INTO current_stock
    FROM public.shop_produkte_2025_10_27_14_00 
    WHERE name = test_product_name;
    
    IF current_stock IS NOT NULL THEN
        RAISE NOTICE 'Test-Produkt gefunden: % - Lagerbestand: %', test_product_name, current_stock;
        
        -- Teste UPDATE
        UPDATE public.shop_produkte_2025_10_27_14_00 
        SET lagerbestand = lagerbestand - 1
        WHERE name = test_product_name
        AND lagerbestand > 0;
        
        GET DIAGNOSTICS updated_count = ROW_COUNT;
        RAISE NOTICE 'UPDATE Test: % Zeilen aktualisiert', updated_count;
        
        -- Zeige Produkt nach Update
        SELECT lagerbestand INTO current_stock
        FROM public.shop_produkte_2025_10_27_14_00 
        WHERE name = test_product_name;
        
        RAISE NOTICE 'Neuer Lagerbestand: %', current_stock;
        
        -- Rückgängig machen
        UPDATE public.shop_produkte_2025_10_27_14_00 
        SET lagerbestand = lagerbestand + 1
        WHERE name = test_product_name;
        
        RAISE NOTICE 'Test-Update rückgängig gemacht';
    ELSE
        RAISE NOTICE 'Test-Produkt nicht gefunden: %', test_product_name;
        
        -- Zeige verfügbare Produkte
        FOR current_stock IN 
            SELECT 1 FROM public.shop_produkte_2025_10_27_14_00 LIMIT 3
        LOOP
            SELECT name INTO test_product_name FROM public.shop_produkte_2025_10_27_14_00 LIMIT 1;
            RAISE NOTICE 'Verfügbares Produkt: %', test_product_name;
            EXIT;
        END LOOP;
    END IF;
END $$;

-- 7. Zeige finale Tabellenstruktur
SELECT 
    column_name, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'shop_produkte_2025_10_27_14_00'
AND table_schema = 'public'
AND column_name IN ('name', 'lagerbestand', 'verfuegbar', 'aktualisiert_am')
ORDER BY ordinal_position;

COMMENT ON COLUMN public.shop_produkte_2025_10_27_14_00.aktualisiert_am IS 'Zeitstempel der letzten Aktualisierung - behebt Trigger-Probleme';