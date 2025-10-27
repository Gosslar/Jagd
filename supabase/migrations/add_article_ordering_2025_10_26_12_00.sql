-- Füge Reihenfolge-Feld zur Blog-Artikel Tabelle hinzu
ALTER TABLE public.blog_artikel_2025_10_25_20_00 
ADD COLUMN reihenfolge INTEGER DEFAULT 0;

-- Setze initiale Reihenfolge basierend auf Veröffentlichungsdatum
UPDATE public.blog_artikel_2025_10_25_20_00 
SET reihenfolge = (
    SELECT ROW_NUMBER() OVER (ORDER BY veröffentlicht_am DESC NULLS LAST, erstellt_am DESC)
    FROM public.blog_artikel_2025_10_25_20_00 AS inner_table 
    WHERE inner_table.id = blog_artikel_2025_10_25_20_00.id
);

-- Erstelle Index für bessere Performance bei Sortierung
CREATE INDEX idx_blog_artikel_reihenfolge ON public.blog_artikel_2025_10_25_20_00(reihenfolge ASC);

-- Funktion zum Verschieben von Artikeln in der Reihenfolge
CREATE OR REPLACE FUNCTION move_article_position(
    artikel_id UUID,
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
    FROM public.blog_artikel_2025_10_25_20_00
    WHERE id = artikel_id;
    
    IF current_position IS NULL THEN
        RAISE EXCEPTION 'Artikel nicht gefunden';
    END IF;
    
    -- Hole maximale Position
    SELECT COALESCE(MAX(reihenfolge), 0) INTO max_position
    FROM public.blog_artikel_2025_10_25_20_00;
    
    -- Begrenze neue Position
    new_position := GREATEST(1, LEAST(new_position, max_position));
    
    -- Wenn Position sich nicht ändert, nichts tun
    IF current_position = new_position THEN
        RETURN;
    END IF;
    
    -- Verschiebe andere Artikel
    IF new_position < current_position THEN
        -- Nach oben verschieben - andere Artikel nach unten
        UPDATE public.blog_artikel_2025_10_25_20_00
        SET reihenfolge = reihenfolge + 1
        WHERE reihenfolge >= new_position 
        AND reihenfolge < current_position
        AND id != artikel_id;
    ELSE
        -- Nach unten verschieben - andere Artikel nach oben
        UPDATE public.blog_artikel_2025_10_25_20_00
        SET reihenfolge = reihenfolge - 1
        WHERE reihenfolge > current_position 
        AND reihenfolge <= new_position
        AND id != artikel_id;
    END IF;
    
    -- Setze neue Position für den Artikel
    UPDATE public.blog_artikel_2025_10_25_20_00
    SET reihenfolge = new_position
    WHERE id = artikel_id;
    
    -- Normalisiere Reihenfolge (schließe Lücken)
    WITH numbered_articles AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY reihenfolge ASC, erstellt_am ASC) as new_order
        FROM public.blog_artikel_2025_10_25_20_00
    )
    UPDATE public.blog_artikel_2025_10_25_20_00
    SET reihenfolge = numbered_articles.new_order
    FROM numbered_articles
    WHERE blog_artikel_2025_10_25_20_00.id = numbered_articles.id;
END;
$$;

-- Funktion zum automatischen Setzen der Reihenfolge bei neuen Artikeln
CREATE OR REPLACE FUNCTION set_new_article_position()
RETURNS TRIGGER AS $$
BEGIN
    -- Setze Reihenfolge für neue Artikel an erste Position
    IF NEW.reihenfolge IS NULL OR NEW.reihenfolge = 0 THEN
        -- Verschiebe alle anderen Artikel nach unten
        UPDATE public.blog_artikel_2025_10_25_20_00
        SET reihenfolge = reihenfolge + 1
        WHERE id != NEW.id;
        
        -- Setze neuen Artikel an Position 1
        NEW.reihenfolge = 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für neue Artikel
CREATE TRIGGER set_article_position_trigger
    BEFORE INSERT ON public.blog_artikel_2025_10_25_20_00
    FOR EACH ROW
    EXECUTE FUNCTION set_new_article_position();

-- Kommentare
COMMENT ON COLUMN public.blog_artikel_2025_10_25_20_00.reihenfolge IS 'Anzeigereihenfolge der Artikel (1 = oben)';
COMMENT ON FUNCTION move_article_position IS 'Verschiebt einen Artikel an eine neue Position in der Reihenfolge';
COMMENT ON FUNCTION set_new_article_position IS 'Setzt automatisch die Reihenfolge für neue Artikel';

-- Erfolgsmeldung
SELECT 'Reihenfolge-System für Blog-Artikel erfolgreich hinzugefügt!' as status;