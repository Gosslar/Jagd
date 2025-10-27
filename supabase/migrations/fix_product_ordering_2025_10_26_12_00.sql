-- Korrigierte Funktion zum Verschieben von Produkten innerhalb ihrer Kategorie
CREATE OR REPLACE FUNCTION move_product_position_in_category(
    produkt_id UUID,
    direction TEXT -- 'up' oder 'down'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_product RECORD;
    target_product RECORD;
    temp_position INTEGER;
BEGIN
    -- Hole aktuelles Produkt
    SELECT * INTO current_product
    FROM public.wildfleisch_lager_2025_10_24_14_00
    WHERE id = produkt_id;
    
    IF current_product IS NULL THEN
        RAISE EXCEPTION 'Produkt nicht gefunden';
    END IF;
    
    -- Finde Ziel-Produkt zum Tauschen
    IF direction = 'up' THEN
        -- Finde das Produkt direkt darüber in derselben Kategorie
        SELECT * INTO target_product
        FROM public.wildfleisch_lager_2025_10_24_14_00
        WHERE kategorie = current_product.kategorie
        AND reihenfolge < current_product.reihenfolge
        ORDER BY reihenfolge DESC
        LIMIT 1;
    ELSIF direction = 'down' THEN
        -- Finde das Produkt direkt darunter in derselben Kategorie
        SELECT * INTO target_product
        FROM public.wildfleisch_lager_2025_10_24_14_00
        WHERE kategorie = current_product.kategorie
        AND reihenfolge > current_product.reihenfolge
        ORDER BY reihenfolge ASC
        LIMIT 1;
    END IF;
    
    -- Wenn kein Ziel-Produkt gefunden, nichts tun
    IF target_product IS NULL THEN
        RETURN;
    END IF;
    
    -- Tausche die Positionen
    temp_position := current_product.reihenfolge;
    
    UPDATE public.wildfleisch_lager_2025_10_24_14_00
    SET reihenfolge = target_product.reihenfolge
    WHERE id = current_product.id;
    
    UPDATE public.wildfleisch_lager_2025_10_24_14_00
    SET reihenfolge = temp_position
    WHERE id = target_product.id;
    
END;
$$;

-- Vereinfachte Funktion für globale Neuordnung nach Kategorien
CREATE OR REPLACE FUNCTION reorder_products_by_category()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Setze Reihenfolge neu basierend auf Kategorie-Gruppen
    WITH category_ordered AS (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                ORDER BY 
                    CASE kategorie 
                        WHEN 'Rehwild' THEN 1
                        WHEN 'Schwarzwild' THEN 2
                        WHEN 'Federwild' THEN 3
                        WHEN 'Wildmettwurst' THEN 4
                        ELSE 5
                    END,
                    reihenfolge ASC,
                    produkt_name ASC
            ) as new_order
        FROM public.wildfleisch_lager_2025_10_24_14_00
    )
    UPDATE public.wildfleisch_lager_2025_10_24_14_00
    SET reihenfolge = category_ordered.new_order
    FROM category_ordered
    WHERE wildfleisch_lager_2025_10_24_14_00.id = category_ordered.id;
END;
$$;

-- Kommentare
COMMENT ON FUNCTION move_product_position_in_category IS 'Verschiebt ein Produkt innerhalb seiner Kategorie nach oben oder unten';
COMMENT ON FUNCTION reorder_products_by_category IS 'Ordnet alle Produkte nach Kategorien und interner Reihenfolge neu';

-- Erfolgsmeldung
SELECT 'Produkt-Reihenfolge-Funktionen korrigiert!' as status;