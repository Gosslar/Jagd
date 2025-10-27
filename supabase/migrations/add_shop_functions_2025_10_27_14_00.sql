-- Funktionen für Reihenfolge-Verwaltung (Drag & Drop)

-- Kategorie-Position verschieben
CREATE OR REPLACE FUNCTION move_shop_category_position(
    category_id UUID,
    new_position INTEGER
) RETURNS VOID AS $$
DECLARE
    old_position INTEGER;
BEGIN
    -- Aktuelle Position ermitteln
    SELECT reihenfolge INTO old_position 
    FROM public.shop_kategorien_2025_10_27_14_00 
    WHERE id = category_id;
    
    IF old_position IS NULL THEN
        RAISE EXCEPTION 'Kategorie nicht gefunden';
    END IF;
    
    -- Andere Kategorien anpassen
    IF new_position > old_position THEN
        UPDATE public.shop_kategorien_2025_10_27_14_00 
        SET reihenfolge = reihenfolge - 1
        WHERE reihenfolge > old_position AND reihenfolge <= new_position;
    ELSE
        UPDATE public.shop_kategorien_2025_10_27_14_00 
        SET reihenfolge = reihenfolge + 1
        WHERE reihenfolge >= new_position AND reihenfolge < old_position;
    END IF;
    
    -- Kategorie auf neue Position setzen
    UPDATE public.shop_kategorien_2025_10_27_14_00 
    SET reihenfolge = new_position, updated_at = NOW()
    WHERE id = category_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Produkt-Position verschieben (innerhalb Kategorie oder zwischen Kategorien)
CREATE OR REPLACE FUNCTION move_shop_product_position(
    product_id UUID,
    new_position INTEGER,
    target_category_id UUID DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    old_position INTEGER;
    old_category_id UUID;
BEGIN
    -- Aktuelle Position und Kategorie ermitteln
    SELECT reihenfolge, kategorie_id INTO old_position, old_category_id
    FROM public.shop_produkte_2025_10_27_14_00 
    WHERE id = product_id;
    
    IF old_position IS NULL THEN
        RAISE EXCEPTION 'Produkt nicht gefunden';
    END IF;
    
    -- Wenn Kategorie gewechselt wird
    IF target_category_id IS NOT NULL AND target_category_id != old_category_id THEN
        -- Alte Kategorie: Positionen nach oben verschieben
        UPDATE public.shop_produkte_2025_10_27_14_00 
        SET reihenfolge = reihenfolge - 1
        WHERE kategorie_id = old_category_id AND reihenfolge > old_position;
        
        -- Neue Kategorie: Platz schaffen
        UPDATE public.shop_produkte_2025_10_27_14_00 
        SET reihenfolge = reihenfolge + 1
        WHERE kategorie_id = target_category_id AND reihenfolge >= new_position;
        
        -- Produkt in neue Kategorie und Position setzen
        UPDATE public.shop_produkte_2025_10_27_14_00 
        SET kategorie_id = target_category_id, reihenfolge = new_position, updated_at = NOW()
        WHERE id = product_id;
    ELSE
        -- Innerhalb derselben Kategorie verschieben
        IF new_position > old_position THEN
            UPDATE public.shop_produkte_2025_10_27_14_00 
            SET reihenfolge = reihenfolge - 1
            WHERE kategorie_id = old_category_id 
            AND reihenfolge > old_position AND reihenfolge <= new_position;
        ELSE
            UPDATE public.shop_produkte_2025_10_27_14_00 
            SET reihenfolge = reihenfolge + 1
            WHERE kategorie_id = old_category_id 
            AND reihenfolge >= new_position AND reihenfolge < old_position;
        END IF;
        
        -- Produkt auf neue Position setzen
        UPDATE public.shop_produkte_2025_10_27_14_00 
        SET reihenfolge = new_position, updated_at = NOW()
        WHERE id = product_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion für automatische Bestellnummer
CREATE OR REPLACE FUNCTION generate_order_number() RETURNS TEXT AS $$
DECLARE
    order_number TEXT;
    counter INTEGER;
BEGIN
    -- Format: WF-YYYYMMDD-XXX (WF = Wildfleisch)
    SELECT COALESCE(MAX(CAST(SUBSTRING(bestellnummer FROM 12) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.shop_bestellungen_2025_10_27_14_00
    WHERE bestellnummer LIKE 'WF-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-%';
    
    order_number := 'WF-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 3, '0');
    
    RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger für automatische Bestellnummer
CREATE OR REPLACE FUNCTION set_order_number() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.bestellnummer IS NULL OR NEW.bestellnummer = '' THEN
        NEW.bestellnummer := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number_trigger ON public.shop_bestellungen_2025_10_27_14_00;
CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON public.shop_bestellungen_2025_10_27_14_00
    FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Trigger für Updated-At Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_shop_kategorien_updated_at ON public.shop_kategorien_2025_10_27_14_00;
CREATE TRIGGER update_shop_kategorien_updated_at
    BEFORE UPDATE ON public.shop_kategorien_2025_10_27_14_00
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shop_produkte_updated_at ON public.shop_produkte_2025_10_27_14_00;
CREATE TRIGGER update_shop_produkte_updated_at
    BEFORE UPDATE ON public.shop_produkte_2025_10_27_14_00
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shop_bestellungen_updated_at ON public.shop_bestellungen_2025_10_27_14_00;
CREATE TRIGGER update_shop_bestellungen_updated_at
    BEFORE UPDATE ON public.shop_bestellungen_2025_10_27_14_00
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Funktion für Lagerbestand reduzieren bei Bestellung
CREATE OR REPLACE FUNCTION reduce_stock_for_shop_order(order_id UUID) RETURNS VOID AS $$
DECLARE
    position_record RECORD;
BEGIN
    -- Für jede Bestellposition den Lagerbestand reduzieren
    FOR position_record IN 
        SELECT produkt_id, menge 
        FROM public.shop_bestellpositionen_2025_10_27_14_00 
        WHERE bestellung_id = order_id
    LOOP
        UPDATE public.shop_produkte_2025_10_27_14_00 
        SET lagerbestand = lagerbestand - position_record.menge,
            updated_at = NOW()
        WHERE id = position_record.produkt_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion für Bestellung bestätigen
CREATE OR REPLACE FUNCTION approve_shop_order(
    order_id UUID,
    admin_user_id UUID,
    admin_note TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    -- Bestellung als bestätigt markieren
    UPDATE public.shop_bestellungen_2025_10_27_14_00 
    SET status = 'bestaetigt',
        bearbeitet_von = admin_user_id,
        bearbeitet_am = NOW(),
        admin_notiz = COALESCE(admin_note, admin_notiz),
        updated_at = NOW()
    WHERE id = order_id;
    
    -- Lagerbestand reduzieren
    PERFORM reduce_stock_for_shop_order(order_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;