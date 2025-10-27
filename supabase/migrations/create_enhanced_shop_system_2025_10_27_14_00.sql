-- Erweiterte Kategorien-Tabelle für Wildfleisch-Shop
CREATE TABLE IF NOT EXISTS public.shop_kategorien_2025_10_27_14_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    beschreibung TEXT,
    bild_url TEXT,
    farbe VARCHAR(7) DEFAULT '#10b981', -- Hex-Farbcode
    reihenfolge INTEGER DEFAULT 0,
    aktiv BOOLEAN DEFAULT true,
    sichtbar_fuer_kunden BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Erweiterte Produkt-Tabelle für Wildfleisch-Shop
CREATE TABLE IF NOT EXISTS public.shop_produkte_2025_10_27_14_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kategorie_id UUID REFERENCES public.shop_kategorien_2025_10_27_14_00(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    beschreibung TEXT,
    kurzbeschreibung VARCHAR(500),
    preis DECIMAL(10,2) NOT NULL,
    einheit VARCHAR(50) NOT NULL DEFAULT 'Stück',
    gewicht DECIMAL(8,3), -- in kg
    lagerbestand INTEGER DEFAULT 0,
    mindestbestand INTEGER DEFAULT 0,
    verfuegbar BOOLEAN GENERATED ALWAYS AS (lagerbestand > 0) STORED,
    reihenfolge INTEGER DEFAULT 0,
    aktiv BOOLEAN DEFAULT true,
    sichtbar_fuer_kunden BOOLEAN DEFAULT true,
    hauptbild_url TEXT,
    bilder_urls TEXT[], -- Array für mehrere Produktbilder
    naehrwerte JSONB, -- Nährwerte für Fleischprodukte
    herkunft VARCHAR(200),
    haltbarkeit_tage INTEGER,
    lagerung_hinweise TEXT,
    zubereitungs_hinweise TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bestellungen-Tabelle erweitern
CREATE TABLE IF NOT EXISTS public.shop_bestellungen_2025_10_27_14_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bestellnummer VARCHAR(20) UNIQUE NOT NULL,
    kunde_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kunde_name VARCHAR(200) NOT NULL,
    kunde_email VARCHAR(200) NOT NULL,
    kunde_telefon VARCHAR(50),
    abholung_datum DATE,
    abholung_uhrzeit TIME,
    abholung_notiz TEXT,
    gesamtpreis DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'neu' CHECK (status IN ('neu', 'bestaetigt', 'bereit', 'abgeholt', 'storniert')),
    zahlungsart VARCHAR(50) DEFAULT 'bar' CHECK (zahlungsart IN ('bar', 'paypal', 'ueberweisung')),
    zahlungsstatus VARCHAR(50) DEFAULT 'offen' CHECK (zahlungsstatus IN ('offen', 'bezahlt', 'erstattet')),
    admin_notiz TEXT,
    bearbeitet_von UUID REFERENCES auth.users(id),
    bearbeitet_am TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bestellpositionen-Tabelle
CREATE TABLE IF NOT EXISTS public.shop_bestellpositionen_2025_10_27_14_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bestellung_id UUID REFERENCES public.shop_bestellungen_2025_10_27_14_00(id) ON DELETE CASCADE,
    produkt_id UUID REFERENCES public.shop_produkte_2025_10_27_14_00(id) ON DELETE CASCADE,
    produkt_name VARCHAR(200) NOT NULL,
    menge INTEGER NOT NULL,
    einzelpreis DECIMAL(10,2) NOT NULL,
    gesamtpreis DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_shop_kategorien_reihenfolge ON public.shop_kategorien_2025_10_27_14_00(reihenfolge);
CREATE INDEX IF NOT EXISTS idx_shop_kategorien_aktiv ON public.shop_kategorien_2025_10_27_14_00(aktiv);

CREATE INDEX IF NOT EXISTS idx_shop_produkte_kategorie ON public.shop_produkte_2025_10_27_14_00(kategorie_id);
CREATE INDEX IF NOT EXISTS idx_shop_produkte_reihenfolge ON public.shop_produkte_2025_10_27_14_00(reihenfolge);
CREATE INDEX IF NOT EXISTS idx_shop_produkte_aktiv ON public.shop_produkte_2025_10_27_14_00(aktiv);
CREATE INDEX IF NOT EXISTS idx_shop_produkte_verfuegbar ON public.shop_produkte_2025_10_27_14_00(verfuegbar);

CREATE INDEX IF NOT EXISTS idx_shop_bestellungen_status ON public.shop_bestellungen_2025_10_27_14_00(status);
CREATE INDEX IF NOT EXISTS idx_shop_bestellungen_kunde ON public.shop_bestellungen_2025_10_27_14_00(kunde_id);

-- RLS Policies
ALTER TABLE public.shop_kategorien_2025_10_27_14_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_produkte_2025_10_27_14_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_bestellungen_2025_10_27_14_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_bestellpositionen_2025_10_27_14_00 ENABLE ROW LEVEL SECURITY;

-- Kategorien: Lesen für alle, Schreiben nur für Admins
CREATE POLICY "Kategorien öffentlich lesbar" ON public.shop_kategorien_2025_10_27_14_00
    FOR SELECT USING (aktiv = true AND sichtbar_fuer_kunden = true);

CREATE POLICY "Kategorien Admin Vollzugriff" ON public.shop_kategorien_2025_10_27_14_00
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.admin_rollen_2025_10_25_19_00 
        WHERE rolle IN ('super_admin', 'lager_admin') AND aktiv = true
    ));

-- Produkte: Lesen für alle verfügbaren, Schreiben nur für Admins
CREATE POLICY "Produkte öffentlich lesbar" ON public.shop_produkte_2025_10_27_14_00
    FOR SELECT USING (aktiv = true AND sichtbar_fuer_kunden = true);

CREATE POLICY "Produkte Admin Vollzugriff" ON public.shop_produkte_2025_10_27_14_00
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.admin_rollen_2025_10_25_19_00 
        WHERE rolle IN ('super_admin', 'lager_admin') AND aktiv = true
    ));

-- Bestellungen: Eigene Bestellungen einsehen, Admins alle
CREATE POLICY "Eigene Bestellungen einsehen" ON public.shop_bestellungen_2025_10_27_14_00
    FOR SELECT USING (kunde_id = auth.uid());

CREATE POLICY "Bestellungen erstellen" ON public.shop_bestellungen_2025_10_27_14_00
    FOR INSERT WITH CHECK (kunde_id = auth.uid());

CREATE POLICY "Bestellungen Admin Vollzugriff" ON public.shop_bestellungen_2025_10_27_14_00
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.admin_rollen_2025_10_25_19_00 
        WHERE rolle IN ('super_admin', 'benutzer_admin') AND aktiv = true
    ));

-- Bestellpositionen: Zugriff über Bestellung
CREATE POLICY "Bestellpositionen über Bestellung" ON public.shop_bestellpositionen_2025_10_27_14_00
    FOR SELECT USING (
        bestellung_id IN (
            SELECT id FROM public.shop_bestellungen_2025_10_27_14_00 
            WHERE kunde_id = auth.uid()
        )
    );

CREATE POLICY "Bestellpositionen Admin Vollzugriff" ON public.shop_bestellpositionen_2025_10_27_14_00
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.admin_rollen_2025_10_25_19_00 
        WHERE rolle IN ('super_admin', 'benutzer_admin') AND aktiv = true
    ));

-- Funktionen für Reihenfolge-Verwaltung
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

CREATE TRIGGER update_shop_kategorien_updated_at
    BEFORE UPDATE ON public.shop_kategorien_2025_10_27_14_00
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shop_produkte_updated_at
    BEFORE UPDATE ON public.shop_produkte_2025_10_27_14_00
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shop_bestellungen_updated_at
    BEFORE UPDATE ON public.shop_bestellungen_2025_10_27_14_00
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Standard-Kategorien einfügen
INSERT INTO public.shop_kategorien_2025_10_27_14_00 (name, beschreibung, farbe, reihenfolge) VALUES
('Rehwild', 'Zartes Fleisch vom Reh aus nachhaltiger Jagd', '#8B4513', 1),
('Schwarzwild', 'Kräftiges Wildschwein-Fleisch', '#654321', 2),
('Wildgeflügel', 'Gänse und andere Wildvögel', '#228B22', 3),
('Wildwurst', 'Hausgemachte Würste aus Wildfleisch', '#DC143C', 4),
('Wildmettwurst', 'Luftgetrocknete Mettwurst-Spezialitäten', '#B22222', 5);

-- Beispiel-Produkte aus der alten Tabelle migrieren (falls vorhanden)
INSERT INTO public.shop_produkte_2025_10_27_14_00 (
    kategorie_id, name, preis, einheit, lagerbestand, mindestbestand, reihenfolge,
    beschreibung, kurzbeschreibung
)
SELECT 
    (SELECT id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Rehwild' LIMIT 1),
    'Rehhack', 7.00, '500g', 10, 2, 1,
    'Frisches Rehhack aus nachhaltiger Jagd, ideal für Bolognese oder Frikadellen.',
    'Zartes Rehhack, 500g Packung'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_produkte_2025_10_27_14_00 WHERE name = 'Rehhack');

INSERT INTO public.shop_produkte_2025_10_27_14_00 (
    kategorie_id, name, preis, einheit, lagerbestand, mindestbestand, reihenfolge,
    beschreibung, kurzbeschreibung
)
SELECT 
    (SELECT id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Rehwild' LIMIT 1),
    'Rehrücken', 32.00, 'je Kg', 5, 1, 2,
    'Edler Rehrücken, perfekt für besondere Anlässe. Zart und aromatisch.',
    'Premium Rehrücken, verkauft per Kilogramm'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_produkte_2025_10_27_14_00 WHERE name = 'Rehrücken');