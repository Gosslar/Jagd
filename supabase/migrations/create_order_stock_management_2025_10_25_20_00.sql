-- Erweitere die Bestellungen-Tabelle um bessere Verwaltung
ALTER TABLE public.wildfleisch_bestellungen_2025_10_24_08_03 
ADD COLUMN IF NOT EXISTS bestellstatus TEXT DEFAULT 'neu' CHECK (bestellstatus IN ('neu', 'bearbeitet', 'freigegeben', 'abgelehnt', 'versendet', 'abgeschlossen'));

ALTER TABLE public.wildfleisch_bestellungen_2025_10_24_08_03 
ADD COLUMN IF NOT EXISTS bearbeitet_von UUID REFERENCES auth.users(id);

ALTER TABLE public.wildfleisch_bestellungen_2025_10_24_08_03 
ADD COLUMN IF NOT EXISTS bearbeitet_am TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.wildfleisch_bestellungen_2025_10_24_08_03 
ADD COLUMN IF NOT EXISTS admin_notiz TEXT;

ALTER TABLE public.wildfleisch_bestellungen_2025_10_24_08_03 
ADD COLUMN IF NOT EXISTS lager_reduziert BOOLEAN DEFAULT FALSE;

-- Erstelle Bestellpositionen-Tabelle für bessere Verwaltung
CREATE TABLE IF NOT EXISTS public.bestellpositionen_2025_10_25_20_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bestellung_id UUID REFERENCES public.wildfleisch_bestellungen_2025_10_24_08_03(id) ON DELETE CASCADE,
    produkt_name TEXT NOT NULL,
    menge INTEGER NOT NULL CHECK (menge > 0),
    einzelpreis DECIMAL(10,2) NOT NULL,
    gesamtpreis DECIMAL(10,2) GENERATED ALWAYS AS (menge * einzelpreis) STORED,
    lager_reduziert BOOLEAN DEFAULT FALSE,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS für Bestellpositionen
ALTER TABLE public.bestellpositionen_2025_10_25_20_00 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authentifizierte Benutzer können Bestellpositionen verwalten" 
ON public.bestellpositionen_2025_10_25_20_00 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Funktion zur Lagerbestand-Reduzierung
CREATE OR REPLACE FUNCTION reduce_stock_for_order(bestellung_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    bestellung_record RECORD;
    position_record RECORD;
    current_stock INTEGER;
    result JSON := json_build_object('success', true, 'updated_items', json_build_array());
    updated_items JSON[] := ARRAY[]::JSON[];
BEGIN
    -- Prüfe ob Bestellung existiert und noch nicht bearbeitet wurde
    SELECT * INTO bestellung_record 
    FROM public.wildfleisch_bestellungen_2025_10_24_08_03 
    WHERE id = bestellung_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Bestellung nicht gefunden');
    END IF;
    
    IF bestellung_record.lager_reduziert = TRUE THEN
        RETURN json_build_object('error', 'Lagerbestand bereits reduziert');
    END IF;
    
    -- Verarbeite jede Position in der Bestellung
    FOR position_record IN 
        SELECT * FROM public.bestellpositionen_2025_10_25_20_00 
        WHERE bestellung_id = bestellung_id
    LOOP
        -- Hole aktuellen Lagerbestand
        SELECT lagerbestand INTO current_stock
        FROM public.wildfleisch_lager_2025_10_24_14_00
        WHERE produkt_name = position_record.produkt_name;
        
        IF NOT FOUND THEN
            -- Produkt nicht im Lager gefunden, überspringe
            updated_items := updated_items || json_build_object(
                'produkt', position_record.produkt_name,
                'status', 'error',
                'message', 'Produkt nicht im Lager gefunden'
            );
            CONTINUE;
        END IF;
        
        -- Prüfe ob genug Lagerbestand vorhanden
        IF current_stock < position_record.menge THEN
            updated_items := updated_items || json_build_object(
                'produkt', position_record.produkt_name,
                'status', 'error',
                'message', 'Nicht genug Lagerbestand (verfügbar: ' || current_stock || ', benötigt: ' || position_record.menge || ')'
            );
            CONTINUE;
        END IF;
        
        -- Reduziere Lagerbestand
        UPDATE public.wildfleisch_lager_2025_10_24_14_00
        SET lagerbestand = lagerbestand - position_record.menge
        WHERE produkt_name = position_record.produkt_name;
        
        -- Markiere Position als bearbeitet
        UPDATE public.bestellpositionen_2025_10_25_20_00
        SET lager_reduziert = TRUE
        WHERE id = position_record.id;
        
        updated_items := updated_items || json_build_object(
            'produkt', position_record.produkt_name,
            'status', 'success',
            'menge_reduziert', position_record.menge,
            'neuer_bestand', current_stock - position_record.menge
        );
    END LOOP;
    
    -- Markiere Bestellung als lager-reduziert
    UPDATE public.wildfleisch_bestellungen_2025_10_24_08_03
    SET lager_reduziert = TRUE
    WHERE id = bestellung_id;
    
    RETURN json_build_object(
        'success', true,
        'bestellung_id', bestellung_id,
        'updated_items', array_to_json(updated_items)
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'error', 'Fehler beim Reduzieren des Lagerbestands: ' || SQLERRM
        );
END;
$$;

-- Funktion zur Bestellfreigabe mit automatischer Lagerreduzierung
CREATE OR REPLACE FUNCTION approve_order(
    bestellung_id UUID,
    admin_user_id UUID,
    admin_notiz TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stock_result JSON;
BEGIN
    -- Aktualisiere Bestellstatus
    UPDATE public.wildfleisch_bestellungen_2025_10_24_08_03
    SET 
        bestellstatus = 'freigegeben',
        bearbeitet_von = admin_user_id,
        bearbeitet_am = NOW(),
        admin_notiz = admin_notiz
    WHERE id = bestellung_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Bestellung nicht gefunden');
    END IF;
    
    -- Reduziere Lagerbestand
    SELECT reduce_stock_for_order(bestellung_id) INTO stock_result;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Bestellung freigegeben und Lagerbestand reduziert',
        'bestellung_id', bestellung_id,
        'stock_update', stock_result
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'error', 'Fehler beim Freigeben der Bestellung: ' || SQLERRM
        );
END;
$$;

-- Trigger zum automatischen Erstellen von Bestellpositionen
CREATE OR REPLACE FUNCTION create_order_positions()
RETURNS TRIGGER AS $$
DECLARE
    item JSON;
BEGIN
    -- Lösche alte Positionen falls vorhanden
    DELETE FROM public.bestellpositionen_2025_10_25_20_00 
    WHERE bestellung_id = NEW.id;
    
    -- Erstelle neue Positionen aus bestellung_json
    FOR item IN SELECT * FROM json_array_elements(NEW.bestellung_json)
    LOOP
        INSERT INTO public.bestellpositionen_2025_10_25_20_00 (
            bestellung_id,
            produkt_name,
            menge,
            einzelpreis
        ) VALUES (
            NEW.id,
            item->>'produkt',
            (item->>'menge')::INTEGER,
            (item->>'preis')::DECIMAL
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für automatische Positionserstellung
DROP TRIGGER IF EXISTS create_order_positions_trigger ON public.wildfleisch_bestellungen_2025_10_24_08_03;
CREATE TRIGGER create_order_positions_trigger
    AFTER INSERT OR UPDATE OF bestellung_json ON public.wildfleisch_bestellungen_2025_10_24_08_03
    FOR EACH ROW
    EXECUTE FUNCTION create_order_positions();

-- Aktualisiere bestehende Bestellungen um Positionen zu erstellen
UPDATE public.wildfleisch_bestellungen_2025_10_24_08_03 
SET bestellung_json = bestellung_json 
WHERE bestellung_json IS NOT NULL;

-- Kommentare
COMMENT ON FUNCTION reduce_stock_for_order IS 'Reduziert Lagerbestand basierend auf Bestellpositionen';
COMMENT ON FUNCTION approve_order IS 'Gibt Bestellung frei und reduziert automatisch Lagerbestand';
COMMENT ON TABLE public.bestellpositionen_2025_10_25_20_00 IS 'Einzelne Positionen einer Wildfleisch-Bestellung';

-- Erfolgsmeldung
SELECT 'Bestellverwaltung mit Lagerbestand-Management erfolgreich eingerichtet!' as status;