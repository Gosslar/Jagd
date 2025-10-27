-- Füge Reihenfolge-Feld zur Wildfleisch-Lager Tabelle hinzu
ALTER TABLE public.wildfleisch_lager_2025_10_24_14_00 
ADD COLUMN reihenfolge INTEGER DEFAULT 0;

-- Setze initiale Reihenfolge basierend auf Kategorie und Produktname
UPDATE public.wildfleisch_lager_2025_10_24_14_00 
SET reihenfolge = (
    SELECT ROW_NUMBER() OVER (ORDER BY kategorie ASC, produkt_name ASC)
    FROM public.wildfleisch_lager_2025_10_24_14_00 AS inner_table 
    WHERE inner_table.id = wildfleisch_lager_2025_10_24_14_00.id
);

-- Erstelle Index für bessere Performance bei Sortierung
CREATE INDEX idx_wildfleisch_reihenfolge ON public.wildfleisch_lager_2025_10_24_14_00(reihenfolge ASC);

-- Funktion zum Verschieben von Produkten in der Reihenfolge
CREATE OR REPLACE FUNCTION move_product_position(
    produkt_id UUID,
    new_position INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_position INTEGER;
    max_position INTEGER;
BEGIN
    -- Hole aktuelle Position
    SELECT reihenfolge INTO current_position
    FROM public.wildfleisch_lager_2025_10_24_14_00
    WHERE id = produkt_id;
    
    IF current_position IS NULL THEN
        RAISE EXCEPTION 'Produkt nicht gefunden';
    END IF;
    
    -- Hole maximale Position
    SELECT COALESCE(MAX(reihenfolge), 0) INTO max_position
    FROM public.wildfleisch_lager_2025_10_24_14_00;
    
    -- Begrenze neue Position
    new_position := GREATEST(1, LEAST(new_position, max_position));
    
    -- Wenn Position sich nicht ändert, nichts tun
    IF current_position = new_position THEN
        RETURN;
    END IF;
    
    -- Verschiebe andere Produkte
    IF new_position < current_position THEN
        -- Nach oben verschieben - andere Produkte nach unten
        UPDATE public.wildfleisch_lager_2025_10_24_14_00
        SET reihenfolge = reihenfolge + 1
        WHERE reihenfolge >= new_position 
        AND reihenfolge < current_position
        AND id != produkt_id;
    ELSE
        -- Nach unten verschieben - andere Produkte nach oben
        UPDATE public.wildfleisch_lager_2025_10_24_14_00
        SET reihenfolge = reihenfolge - 1
        WHERE reihenfolge > current_position 
        AND reihenfolge <= new_position
        AND id != produkt_id;
    END IF;
    
    -- Setze neue Position für das Produkt
    UPDATE public.wildfleisch_lager_2025_10_24_14_00
    SET reihenfolge = new_position
    WHERE id = produkt_id;
    
    -- Normalisiere Reihenfolge (schließe Lücken)
    WITH numbered_products AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY reihenfolge ASC, kategorie ASC, produkt_name ASC) as new_order
        FROM public.wildfleisch_lager_2025_10_24_14_00
    )
    UPDATE public.wildfleisch_lager_2025_10_24_14_00
    SET reihenfolge = numbered_products.new_order
    FROM numbered_products
    WHERE wildfleisch_lager_2025_10_24_14_00.id = numbered_products.id;
END;
$$;

-- Funktion zum automatischen Setzen der Reihenfolge bei neuen Produkten
CREATE OR REPLACE FUNCTION set_new_product_position()
RETURNS TRIGGER AS $$
BEGIN
    -- Setze Reihenfolge für neue Produkte an letzte Position
    IF NEW.reihenfolge IS NULL OR NEW.reihenfolge = 0 THEN
        SELECT COALESCE(MAX(reihenfolge), 0) + 1 INTO NEW.reihenfolge
        FROM public.wildfleisch_lager_2025_10_24_14_00
        WHERE id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für neue Produkte
CREATE TRIGGER set_product_position_trigger
    BEFORE INSERT ON public.wildfleisch_lager_2025_10_24_14_00
    FOR EACH ROW
    EXECUTE FUNCTION set_new_product_position();

-- Update existing trigger to handle reihenfolge updates
DROP TRIGGER IF EXISTS update_wildfleisch_lager_timestamp_trigger ON public.wildfleisch_lager_2025_10_24_14_00;

CREATE OR REPLACE FUNCTION update_wildfleisch_lager_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.aktualisiert_am = NOW();
    
    -- Berechne Verfügbarkeit basierend auf Lagerbestand
    NEW.verfügbar = (NEW.lagerbestand > 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wildfleisch_lager_timestamp_trigger
    BEFORE UPDATE ON public.wildfleisch_lager_2025_10_24_14_00
    FOR EACH ROW
    EXECUTE FUNCTION update_wildfleisch_lager_timestamp();

-- Kommentare
COMMENT ON COLUMN public.wildfleisch_lager_2025_10_24_14_00.reihenfolge IS 'Anzeigereihenfolge der Produkte (1 = oben)';
COMMENT ON FUNCTION move_product_position IS 'Verschiebt ein Produkt an eine neue Position in der Reihenfolge';
COMMENT ON FUNCTION set_new_product_position IS 'Setzt automatisch die Reihenfolge für neue Produkte';

-- Erfolgsmeldung
SELECT 'Reihenfolge-System für Wildfleisch-Produkte erfolgreich hinzugefügt!' as status;