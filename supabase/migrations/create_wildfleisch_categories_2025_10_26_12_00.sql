-- Erstelle Tabelle für Wildfleisch-Kategorien
CREATE TABLE IF NOT EXISTS public.wildfleisch_kategorien_2025_10_26_12_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    beschreibung TEXT,
    farbe VARCHAR(7) DEFAULT '#059669', -- Hex-Farbcode für Badge-Styling
    reihenfolge INTEGER DEFAULT 0,
    aktiv BOOLEAN DEFAULT true,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies für Wildfleisch-Kategorien
ALTER TABLE public.wildfleisch_kategorien_2025_10_26_12_00 ENABLE ROW LEVEL SECURITY;

-- Alle können Kategorien lesen
CREATE POLICY "Wildfleisch-Kategorien sind öffentlich lesbar" ON public.wildfleisch_kategorien_2025_10_26_12_00
    FOR SELECT USING (true);

-- Nur authentifizierte Benutzer können Kategorien verwalten
CREATE POLICY "Authentifizierte Benutzer können Wildfleisch-Kategorien verwalten" ON public.wildfleisch_kategorien_2025_10_26_12_00
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger für aktualisiert_am
CREATE OR REPLACE FUNCTION update_wildfleisch_kategorien_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.aktualisiert_am = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wildfleisch_kategorien_timestamp_trigger
    BEFORE UPDATE ON public.wildfleisch_kategorien_2025_10_26_12_00
    FOR EACH ROW
    EXECUTE FUNCTION update_wildfleisch_kategorien_timestamp();

-- Trigger für automatische Reihenfolge bei neuen Kategorien
CREATE OR REPLACE FUNCTION set_new_wildfleisch_category_position()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reihenfolge IS NULL OR NEW.reihenfolge = 0 THEN
        SELECT COALESCE(MAX(reihenfolge), 0) + 1 INTO NEW.reihenfolge
        FROM public.wildfleisch_kategorien_2025_10_26_12_00
        WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_wildfleisch_category_position_trigger
    BEFORE INSERT ON public.wildfleisch_kategorien_2025_10_26_12_00
    FOR EACH ROW
    EXECUTE FUNCTION set_new_wildfleisch_category_position();

-- Funktion zum Verschieben von Wildfleisch-Kategorien
CREATE OR REPLACE FUNCTION move_wildfleisch_category_position(
    kategorie_id UUID,
    direction TEXT -- 'up' oder 'down'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_category RECORD;
    target_category RECORD;
    temp_position INTEGER;
BEGIN
    -- Hole aktuelle Kategorie
    SELECT * INTO current_category
    FROM public.wildfleisch_kategorien_2025_10_26_12_00
    WHERE id = kategorie_id;
    
    IF current_category IS NULL THEN
        RAISE EXCEPTION 'Kategorie nicht gefunden';
    END IF;
    
    -- Finde Ziel-Kategorie zum Tauschen
    IF direction = 'up' THEN
        SELECT * INTO target_category
        FROM public.wildfleisch_kategorien_2025_10_26_12_00
        WHERE reihenfolge < current_category.reihenfolge
        ORDER BY reihenfolge DESC
        LIMIT 1;
    ELSIF direction = 'down' THEN
        SELECT * INTO target_category
        FROM public.wildfleisch_kategorien_2025_10_26_12_00
        WHERE reihenfolge > current_category.reihenfolge
        ORDER BY reihenfolge ASC
        LIMIT 1;
    END IF;
    
    -- Wenn kein Ziel gefunden, nichts tun
    IF target_category IS NULL THEN
        RETURN;
    END IF;
    
    -- Tausche die Positionen
    temp_position := current_category.reihenfolge;
    
    UPDATE public.wildfleisch_kategorien_2025_10_26_12_00
    SET reihenfolge = target_category.reihenfolge
    WHERE id = current_category.id;
    
    UPDATE public.wildfleisch_kategorien_2025_10_26_12_00
    SET reihenfolge = temp_position
    WHERE id = target_category.id;
END;
$$;

-- Standard-Kategorien für Wildfleisch einfügen
INSERT INTO public.wildfleisch_kategorien_2025_10_26_12_00 (name, beschreibung, farbe, reihenfolge) VALUES
('Rehwild', 'Produkte vom Rehwild', '#059669', 1),
('Schwarzwild', 'Produkte vom Schwarzwild', '#047857', 2),
('Federwild', 'Produkte vom Federwild', '#065F46', 3),
('Wildmettwurst', 'Verschiedene Wildmettwurst-Sorten', '#0F766E', 4)
ON CONFLICT (name) DO NOTHING;

-- Kommentare
COMMENT ON TABLE public.wildfleisch_kategorien_2025_10_26_12_00 IS 'Kategorien für Wildfleisch-Produkte';
COMMENT ON COLUMN public.wildfleisch_kategorien_2025_10_26_12_00.farbe IS 'Hex-Farbcode für Badge-Styling (#RRGGBB)';
COMMENT ON FUNCTION move_wildfleisch_category_position IS 'Verschiebt eine Wildfleisch-Kategorie nach oben oder unten';

-- Erfolgsmeldung
SELECT 'Wildfleisch-Kategorie-System erfolgreich erstellt!' as status;