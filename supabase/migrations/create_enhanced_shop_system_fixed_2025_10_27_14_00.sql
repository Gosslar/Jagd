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

-- Kategorien: Lesen für alle aktiven
CREATE POLICY "Kategorien öffentlich lesbar" ON public.shop_kategorien_2025_10_27_14_00
    FOR SELECT USING (true);

CREATE POLICY "Kategorien Admin Vollzugriff" ON public.shop_kategorien_2025_10_27_14_00
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Produkte: Lesen für alle verfügbaren
CREATE POLICY "Produkte öffentlich lesbar" ON public.shop_produkte_2025_10_27_14_00
    FOR SELECT USING (true);

CREATE POLICY "Produkte Admin Vollzugriff" ON public.shop_produkte_2025_10_27_14_00
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Bestellungen: Eigene Bestellungen einsehen
CREATE POLICY "Eigene Bestellungen einsehen" ON public.shop_bestellungen_2025_10_27_14_00
    FOR SELECT USING (kunde_id = auth.uid());

CREATE POLICY "Bestellungen erstellen" ON public.shop_bestellungen_2025_10_27_14_00
    FOR INSERT WITH CHECK (kunde_id = auth.uid());

CREATE POLICY "Bestellungen Admin Vollzugriff" ON public.shop_bestellungen_2025_10_27_14_00
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Bestellpositionen: Zugriff über Bestellung
CREATE POLICY "Bestellpositionen über Bestellung" ON public.shop_bestellpositionen_2025_10_27_14_00
    FOR SELECT USING (
        bestellung_id IN (
            SELECT id FROM public.shop_bestellungen_2025_10_27_14_00 
            WHERE kunde_id = auth.uid()
        )
    );

CREATE POLICY "Bestellpositionen Admin Vollzugriff" ON public.shop_bestellpositionen_2025_10_27_14_00
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Standard-Kategorien einfügen
INSERT INTO public.shop_kategorien_2025_10_27_14_00 (name, beschreibung, farbe, reihenfolge) VALUES
('Rehwild', 'Zartes Fleisch vom Reh aus nachhaltiger Jagd', '#8B4513', 1),
('Schwarzwild', 'Kräftiges Wildschwein-Fleisch', '#654321', 2),
('Wildgeflügel', 'Gänse und andere Wildvögel', '#228B22', 3),
('Wildwurst', 'Hausgemachte Würste aus Wildfleisch', '#DC143C', 4),
('Wildmettwurst', 'Luftgetrocknete Mettwurst-Spezialitäten', '#B22222', 5);

-- Beispiel-Produkte einfügen
INSERT INTO public.shop_produkte_2025_10_27_14_00 (
    kategorie_id, name, preis, einheit, lagerbestand, mindestbestand, reihenfolge,
    beschreibung, kurzbeschreibung
) VALUES
(
    (SELECT id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Rehwild' LIMIT 1),
    'Rehhack', 7.00, '500g', 10, 2, 1,
    'Frisches Rehhack aus nachhaltiger Jagd, ideal für Bolognese oder Frikadellen.',
    'Zartes Rehhack, 500g Packung'
),
(
    (SELECT id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Rehwild' LIMIT 1),
    'Rehrücken', 32.00, 'je Kg', 5, 1, 2,
    'Edler Rehrücken, perfekt für besondere Anlässe. Zart und aromatisch.',
    'Premium Rehrücken, verkauft per Kilogramm'
),
(
    (SELECT id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Rehwild' LIMIT 1),
    'Rehfilet', 40.00, 'je Kg', 3, 1, 3,
    'Das Beste vom Reh - zartes Filet für Feinschmecker.',
    'Edles Rehfilet, höchste Qualität'
),
(
    (SELECT id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Schwarzwild' LIMIT 1),
    'Grobe Bratwurst vom Schwarzwild', 9.00, '5er Pack', 8, 2, 1,
    'Herzhafte Bratwurst aus Wildschwein-Fleisch, grob gewürzt.',
    'Kräftige Wildbratwurst im 5er Pack'
),
(
    (SELECT id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Wildgeflügel' LIMIT 1),
    'Gänsebrust', 25.00, 'je Stück', 4, 1, 1,
    'Saftige Gänsebrust aus der Region, perfekt für Festtage.',
    'Regionale Gänsebrust, ca. 800g'
);