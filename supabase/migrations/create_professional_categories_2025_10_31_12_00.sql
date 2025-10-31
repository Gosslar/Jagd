-- Prüfe Produktkategorien und erstelle professionelle Kategorisierung

-- 1. Zeige aktuelle Tabellenstruktur
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'shop_produkte_2025_10_27_14_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Zeige alle Produkte mit verfügbaren Kategorien
SELECT 
    name,
    kategorie_id,
    preis,
    einheit,
    lagerbestand,
    verfuegbar
FROM public.shop_produkte_2025_10_27_14_00
ORDER BY kategorie_id, name;

-- 3. Prüfe ob Kategorien-Tabelle existiert
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name LIKE '%kategorie%'
ORDER BY table_name;

-- 4. Erstelle Kategorien falls sie nicht existieren
CREATE TABLE IF NOT EXISTS public.produkt_kategorien_2025_10_31_12_00 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    beschreibung TEXT,
    reihenfolge INTEGER DEFAULT 0,
    icon VARCHAR(50),
    farbe VARCHAR(20) DEFAULT '#8B4513',
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Füge Standard-Kategorien hinzu
INSERT INTO public.produkt_kategorien_2025_10_31_12_00 (name, beschreibung, reihenfolge, icon, farbe) VALUES
('Rehwild', 'Zartes Rehfleisch aus heimischen Wäldern', 1, '🦌', '#8B4513'),
('Rotwild', 'Kräftiges Hirschfleisch von höchster Qualität', 2, '🦌', '#A0522D'),
('Schwarzwild', 'Würziges Wildschweinefleisch', 3, '🐗', '#654321'),
('Federwild', 'Delikates Geflügel aus freier Wildbahn', 4, '🦆', '#228B22'),
('Wurstspezialitäten', 'Hausgemachte Wildwurst nach traditionellen Rezepten', 5, '🌭', '#B22222'),
('Spezialitäten', 'Besondere Wildspezialitäten und Delikatessen', 6, '⭐', '#DAA520')
ON CONFLICT (name) DO NOTHING;

-- 6. Aktualisiere Produkte mit Kategorien (falls kategorie_id numerisch ist)
UPDATE public.shop_produkte_2025_10_27_14_00 
SET kategorie_id = CASE 
    WHEN name ILIKE '%reh%' THEN 1
    WHEN name ILIKE '%hirsch%' OR name ILIKE '%rot%' THEN 2
    WHEN name ILIKE '%schwein%' OR name ILIKE '%sau%' THEN 3
    WHEN name ILIKE '%ente%' OR name ILIKE '%fasan%' OR name ILIKE '%gans%' THEN 4
    WHEN name ILIKE '%wurst%' OR name ILIKE '%bratwurst%' THEN 5
    ELSE 6
END
WHERE kategorie_id IS NULL OR kategorie_id = 0;

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

-- 8. Zeige Kategorien-Statistik
SELECT 
    k.name as kategorie,
    k.icon,
    COUNT(p.id) as anzahl_produkte,
    COUNT(p.id) FILTER (WHERE p.lagerbestand > 0) as verfuegbare_produkte,
    AVG(p.preis) as durchschnittspreis
FROM public.produkt_kategorien_2025_10_31_12_00 k
LEFT JOIN public.shop_produkte_2025_10_27_14_00 p ON k.id = p.kategorie_id
GROUP BY k.id, k.name, k.icon, k.reihenfolge
ORDER BY k.reihenfolge;

COMMENT ON TABLE public.produkt_kategorien_2025_10_31_12_00 IS 'Kategorien für professionelle Wildfleisch-Sortiment Darstellung';