-- Vereinfachte Funktion zur Bestellfreigabe ohne komplexe Lagerlogik
CREATE OR REPLACE FUNCTION simple_approve_order(
    bestellung_id UUID,
    admin_user_id UUID,
    admin_notiz TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Einfaches Update der Bestellung
    UPDATE public.wildfleisch_bestellungen_2025_10_24_08_03
    SET 
        bestellstatus = 'freigegeben',
        bearbeitet_von = admin_user_id,
        bearbeitet_am = NOW(),
        admin_notiz = admin_notiz
    WHERE id = bestellung_id;
    
    -- Prüfe ob Update erfolgreich war
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Bestellung nicht gefunden');
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Bestellung erfolgreich freigegeben',
        'bestellung_id', bestellung_id
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'error', 'Fehler beim Freigeben der Bestellung: ' || SQLERRM
        );
END;
$$;

-- Funktion zur manuellen Lagerbestand-Reduzierung
CREATE OR REPLACE FUNCTION manual_reduce_stock(
    bestellung_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    bestellung_record RECORD;
    item JSONB;
    current_stock INTEGER;
    result_items TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Hole Bestellung
    SELECT * INTO bestellung_record 
    FROM public.wildfleisch_bestellungen_2025_10_24_08_03 
    WHERE id = bestellung_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Bestellung nicht gefunden');
    END IF;
    
    -- Verarbeite jedes Item in der Bestellung
    FOR item IN SELECT * FROM jsonb_array_elements(bestellung_record.bestellung_json)
    LOOP
        -- Hole aktuellen Lagerbestand
        SELECT lagerbestand INTO current_stock
        FROM public.wildfleisch_lager_2025_10_24_14_00
        WHERE produkt_name = item->>'produkt';
        
        IF NOT FOUND THEN
            result_items := result_items || (item->>'produkt' || ': Produkt nicht im Lager gefunden');
            CONTINUE;
        END IF;
        
        -- Prüfe Verfügbarkeit
        IF current_stock < (item->>'menge')::INTEGER THEN
            result_items := result_items || (item->>'produkt' || ': Nicht genug Lagerbestand (verfügbar: ' || current_stock || ', benötigt: ' || (item->>'menge') || ')');
            CONTINUE;
        END IF;
        
        -- Reduziere Lagerbestand
        UPDATE public.wildfleisch_lager_2025_10_24_14_00
        SET lagerbestand = lagerbestand - (item->>'menge')::INTEGER
        WHERE produkt_name = item->>'produkt';
        
        result_items := result_items || (item->>'produkt' || ': ' || (item->>'menge') || ' reduziert, neuer Bestand: ' || (current_stock - (item->>'menge')::INTEGER));
    END LOOP;
    
    -- Markiere Bestellung als lager-reduziert
    UPDATE public.wildfleisch_bestellungen_2025_10_24_08_03
    SET lager_reduziert = TRUE
    WHERE id = bestellung_id;
    
    RETURN json_build_object(
        'success', true,
        'bestellung_id', bestellung_id,
        'details', array_to_string(result_items, '; ')
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'error', 'Fehler beim Reduzieren des Lagerbestands: ' || SQLERRM
        );
END;
$$;

-- Test-Funktion um Bestellungen zu prüfen
CREATE OR REPLACE FUNCTION debug_order_info(bestellung_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    bestellung_record RECORD;
    positionen_count INTEGER;
BEGIN
    -- Hole Bestellung
    SELECT * INTO bestellung_record 
    FROM public.wildfleisch_bestellungen_2025_10_24_08_03 
    WHERE id = bestellung_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Bestellung nicht gefunden');
    END IF;
    
    -- Zähle Positionen
    SELECT COUNT(*) INTO positionen_count
    FROM public.bestellpositionen_2025_10_25_20_00
    WHERE bestellung_id = bestellung_id;
    
    RETURN json_build_object(
        'bestellung_id', bestellung_id,
        'status', bestellung_record.bestellstatus,
        'lager_reduziert', bestellung_record.lager_reduziert,
        'bestellung_json_items', jsonb_array_length(bestellung_record.bestellung_json),
        'positionen_count', positionen_count,
        'name', bestellung_record.name,
        'email', bestellung_record.email,
        'erstellt_am', bestellung_record.erstellt_am
    );
END;
$$;

-- Kommentare
COMMENT ON FUNCTION simple_approve_order IS 'Vereinfachte Bestellfreigabe ohne Lagerlogik';
COMMENT ON FUNCTION manual_reduce_stock IS 'Manuelle Lagerbestand-Reduzierung für freigegebene Bestellungen';
COMMENT ON FUNCTION debug_order_info IS 'Debug-Informationen für eine Bestellung';

-- Erfolgsmeldung
SELECT 'Vereinfachte Bestellfreigabe-Funktionen erstellt!' as status;