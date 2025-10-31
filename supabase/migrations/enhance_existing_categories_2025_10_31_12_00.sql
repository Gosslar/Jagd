-- Verwende bestehende Kategorien-Tabelle und erweitere sie

-- 1. Zeige bestehende Kategorien-Tabelle
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name LIKE '%kategorie%'
ORDER BY table_name;

-- 2. Zeige Struktur der bestehenden Kategorien-Tabelle
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'shop_kategorien_2025_10_27_14_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Zeige bestehende Kategorien
SELECT * FROM public.shop_kategorien_2025_10_27_14_00 ORDER BY name;

-- 4. Erweitere bestehende Kategorien-Tabelle um professionelle Felder
ALTER TABLE public.shop_kategorien_2025_10_27_14_00 
ADD COLUMN IF NOT EXISTS beschreibung TEXT,
ADD COLUMN IF NOT EXISTS reihenfolge INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS icon VARCHAR(50),
ADD COLUMN IF NOT EXISTS farbe VARCHAR(20) DEFAULT '#8B4513';

-- 5. Aktualisiere bestehende Kategorien mit professionellen Daten
UPDATE public.shop_kategorien_2025_10_27_14_00 SET
    beschreibung = CASE 
        WHEN name ILIKE '%reh%' THEN 'Zartes Rehfleisch aus heimischen Wäldern'
        WHEN name ILIKE '%hirsch%' OR name ILIKE '%rot%' THEN 'Kräftiges Hirschfleisch von höchster Qualität'
        WHEN name ILIKE '%schwein%' OR name ILIKE '%sau%' THEN 'Würziges Wildschweinefleisch'
        WHEN name ILIKE '%ente%' OR name ILIKE '%fasan%' OR name ILIKE '%geflügel%' THEN 'Delikates Geflügel aus freier Wildbahn'
        WHEN name ILIKE '%wurst%' THEN 'Hausgemachte Wildwurst nach traditionellen Rezepten'
        ELSE 'Besondere Wildspezialitäten und Delikatessen'
    END,
    reihenfolge = CASE 
        WHEN name ILIKE '%reh%' THEN 1
        WHEN name ILIKE '%hirsch%' OR name ILIKE '%rot%' THEN 2
        WHEN name ILIKE '%schwein%' OR name ILIKE '%sau%' THEN 3
        WHEN name ILIKE '%ente%' OR name ILIKE '%fasan%' OR name ILIKE '%geflügel%' THEN 4
        WHEN name ILIKE '%wurst%' THEN 5
        ELSE 6
    END,
    icon = CASE 
        WHEN name ILIKE '%reh%' THEN '🦌'
        WHEN name ILIKE '%hirsch%' OR name ILIKE '%rot%' THEN '🦌'
        WHEN name ILIKE '%schwein%' OR name ILIKE '%sau%' THEN '🐗'
        WHEN name ILIKE '%ente%' OR name ILIKE '%fasan%' OR name ILIKE '%geflügel%' THEN '🦆'
        WHEN name ILIKE '%wurst%' THEN '🌭'
        ELSE '⭐'
    END,
    farbe = CASE 
        WHEN name ILIKE '%reh%' THEN '#8B4513'
        WHEN name ILIKE '%hirsch%' OR name ILIKE '%rot%' THEN '#A0522D'
        WHEN name ILIKE '%schwein%' OR name ILIKE '%sau%' THEN '#654321'
        WHEN name ILIKE '%ente%' OR name ILIKE '%fasan%' OR name ILIKE '%geflügel%' THEN '#228B22'
        WHEN name ILIKE '%wurst%' THEN '#B22222'
        ELSE '#DAA520'
    END
WHERE beschreibung IS NULL OR reihenfolge = 0;

-- 6. Füge fehlende Standard-Kategorien hinzu
INSERT INTO public.shop_kategorien_2025_10_27_14_00 (name, beschreibung, reihenfolge, icon, farbe) VALUES
('Rehwild', 'Zartes Rehfleisch aus heimischen Wäldern', 1, '🦌', '#8B4513'),
('Rotwild', 'Kräftiges Hirschfleisch von höchster Qualität', 2, '🦌', '#A0522D'),
('Schwarzwild', 'Würziges Wildschweinefleisch', 3, '🐗', '#654321'),
('Federwild', 'Delikates Geflügel aus freier Wildbahn', 4, '🦆', '#228B22'),
('Wurstspezialitäten', 'Hausgemachte Wildwurst nach traditionellen Rezepten', 5, '🌭', '#B22222'),
('Spezialitäten', 'Besondere Wildspezialitäten und Delikatessen', 6, '⭐', '#DAA520')
ON CONFLICT (name) DO UPDATE SET
    beschreibung = EXCLUDED.beschreibung,
    reihenfolge = EXCLUDED.reihenfolge,
    icon = EXCLUDED.icon,
    farbe = EXCLUDED.farbe;

-- 7. Zeige erweiterte Kategorien
SELECT 
    name,
    beschreibung,
    reihenfolge,
    icon,
    farbe
FROM public.shop_kategorien_2025_10_27_14_00 
ORDER BY reihenfolge, name;

-- 8. Zeige Produkte mit erweiterten Kategorien
SELECT 
    p.name as produkt_name,
    k.name as kategorie_name,
    k.beschreibung,
    k.icon,
    k.farbe,
    p.preis,
    p.einheit,
    p.lagerbestand
FROM public.shop_produkte_2025_10_27_14_00 p
LEFT JOIN public.shop_kategorien_2025_10_27_14_00 k ON p.kategorie_id = k.id
WHERE p.lagerbestand > 0
ORDER BY k.reihenfolge, p.name;

-- 9. Zeige Kategorien-Statistik
SELECT 
    k.name as kategorie,
    k.icon,
    k.farbe,
    COUNT(p.id) as anzahl_produkte,
    COUNT(p.id) FILTER (WHERE p.lagerbestand > 0) as verfuegbare_produkte
FROM public.shop_kategorien_2025_10_27_14_00 k
LEFT JOIN public.shop_produkte_2025_10_27_14_00 p ON k.id = p.kategorie_id
GROUP BY k.id, k.name, k.icon, k.farbe, k.reihenfolge
ORDER BY k.reihenfolge;

COMMENT ON COLUMN public.shop_kategorien_2025_10_27_14_00.beschreibung IS 'Beschreibung der Kategorie für professionelle Darstellung';
COMMENT ON COLUMN public.shop_kategorien_2025_10_27_14_00.reihenfolge IS 'Sortierreihenfolge für Kategorien';
COMMENT ON COLUMN public.shop_kategorien_2025_10_27_14_00.icon IS 'Emoji-Icon für die Kategorie';
COMMENT ON COLUMN public.shop_kategorien_2025_10_27_14_00.farbe IS 'Hex-Farbcode für die Kategorie';