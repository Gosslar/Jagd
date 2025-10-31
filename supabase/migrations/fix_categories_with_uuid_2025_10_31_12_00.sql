-- Prüfe Datentypen und erstelle korrekte Kategorisierung

-- 1. Zeige detaillierte Tabellenstruktur
SELECT 
    column_name,
    data_type,
    udt_name,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'shop_produkte_2025_10_27_14_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Zeige Beispieldaten mit Datentypen
SELECT 
    name,
    kategorie_id,
    pg_typeof(kategorie_id) as kategorie_id_type,
    preis,
    lagerbestand
FROM public.shop_produkte_2025_10_27_14_00
LIMIT 5;

-- 3. Erstelle Kategorien-Tabelle
CREATE TABLE IF NOT EXISTS public.produkt_kategorien_2025_10_31_12_00 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    beschreibung TEXT,
    reihenfolge INTEGER DEFAULT 0,
    icon VARCHAR(50),
    farbe VARCHAR(20) DEFAULT '#8B4513',
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Füge Standard-Kategorien hinzu
INSERT INTO public.produkt_kategorien_2025_10_31_12_00 (name, beschreibung, reihenfolge, icon, farbe) VALUES
('Rehwild', 'Zartes Rehfleisch aus heimischen Wäldern', 1, '🦌', '#8B4513'),
('Rotwild', 'Kräftiges Hirschfleisch von höchster Qualität', 2, '🦌', '#A0522D'),
('Schwarzwild', 'Würziges Wildschweinefleisch', 3, '🐗', '#654321'),
('Federwild', 'Delikates Geflügel aus freier Wildbahn', 4, '🦆', '#228B22'),
('Wurstspezialitäten', 'Hausgemachte Wildwurst nach traditionellen Rezepten', 5, '🌭', '#B22222'),
('Spezialitäten', 'Besondere Wildspezialitäten und Delikatessen', 6, '⭐', '#DAA520')
ON CONFLICT (name) DO NOTHING;

-- 5. Zeige erstellte Kategorien
SELECT * FROM public.produkt_kategorien_2025_10_31_12_00 ORDER BY reihenfolge;

-- 6. Aktualisiere Produkte mit Kategorien (UUID-kompatibel)
DO $$
DECLARE
    rehwild_id UUID;
    rotwild_id UUID;
    schwarzwild_id UUID;
    federwild_id UUID;
    wurst_id UUID;
    spezial_id UUID;
BEGIN
    -- Hole Kategorie-IDs
    SELECT id INTO rehwild_id FROM public.produkt_kategorien_2025_10_31_12_00 WHERE name = 'Rehwild';
    SELECT id INTO rotwild_id FROM public.produkt_kategorien_2025_10_31_12_00 WHERE name = 'Rotwild';
    SELECT id INTO schwarzwild_id FROM public.produkt_kategorien_2025_10_31_12_00 WHERE name = 'Schwarzwild';
    SELECT id INTO federwild_id FROM public.produkt_kategorien_2025_10_31_12_00 WHERE name = 'Federwild';
    SELECT id INTO wurst_id FROM public.produkt_kategorien_2025_10_31_12_00 WHERE name = 'Wurstspezialitäten';
    SELECT id INTO spezial_id FROM public.produkt_kategorien_2025_10_31_12_00 WHERE name = 'Spezialitäten';
    
    -- Aktualisiere Produkte
    UPDATE public.shop_produkte_2025_10_27_14_00 
    SET kategorie_id = CASE 
        WHEN name ILIKE '%reh%' THEN rehwild_id
        WHEN name ILIKE '%hirsch%' OR name ILIKE '%rot%' THEN rotwild_id
        WHEN name ILIKE '%schwein%' OR name ILIKE '%sau%' THEN schwarzwild_id
        WHEN name ILIKE '%ente%' OR name ILIKE '%fasan%' OR name ILIKE '%gans%' THEN federwild_id
        WHEN name ILIKE '%wurst%' OR name ILIKE '%bratwurst%' THEN wurst_id
        ELSE spezial_id
    END;
    
    RAISE NOTICE 'Produkte erfolgreich kategorisiert';
END $$;

-- 7. Zeige Produkte mit Kategorien
SELECT 
    p.name as produkt_name,
    k.name as kategorie_name,
    k.icon,
    k.farbe,
    p.preis,
    p.einheit,
    p.lagerbestand
FROM public.shop_produkte_2025_10_27_14_00 p
LEFT JOIN public.produkt_kategorien_2025_10_31_12_00 k ON p.kategorie_id = k.id
WHERE p.lagerbestand > 0
ORDER BY k.reihenfolge, p.name;

COMMENT ON TABLE public.produkt_kategorien_2025_10_31_12_00 IS 'Kategorien für professionelle Wildfleisch-Sortiment Darstellung';