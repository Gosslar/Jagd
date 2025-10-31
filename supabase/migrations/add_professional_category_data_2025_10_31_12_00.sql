-- Füge professionelle Kategorien-Daten hinzu ohne Trigger-Konflikte

-- 1. Zeige aktuelle Kategorien
SELECT id, name FROM public.shop_kategorien_2025_10_27_14_00 ORDER BY name;

-- 2. Füge neue Spalten hinzu (falls sie nicht existieren)
DO $$
BEGIN
    -- Beschreibung
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'shop_kategorien_2025_10_27_14_00' 
        AND column_name = 'beschreibung'
    ) THEN
        ALTER TABLE public.shop_kategorien_2025_10_27_14_00 ADD COLUMN beschreibung TEXT;
    END IF;
    
    -- Reihenfolge
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'shop_kategorien_2025_10_27_14_00' 
        AND column_name = 'reihenfolge'
    ) THEN
        ALTER TABLE public.shop_kategorien_2025_10_27_14_00 ADD COLUMN reihenfolge INTEGER DEFAULT 0;
    END IF;
    
    -- Icon
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'shop_kategorien_2025_10_27_14_00' 
        AND column_name = 'icon'
    ) THEN
        ALTER TABLE public.shop_kategorien_2025_10_27_14_00 ADD COLUMN icon VARCHAR(50);
    END IF;
    
    -- Farbe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'shop_kategorien_2025_10_27_14_00' 
        AND column_name = 'farbe'
    ) THEN
        ALTER TABLE public.shop_kategorien_2025_10_27_14_00 ADD COLUMN farbe VARCHAR(20) DEFAULT '#8B4513';
    END IF;
END $$;

-- 3. Füge Standard-Kategorien hinzu (falls sie nicht existieren)
INSERT INTO public.shop_kategorien_2025_10_27_14_00 (name, beschreibung, reihenfolge, icon, farbe)
SELECT 'Rehwild', 'Zartes Rehfleisch aus heimischen Wäldern', 1, '🦌', '#8B4513'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Rehwild');

INSERT INTO public.shop_kategorien_2025_10_27_14_00 (name, beschreibung, reihenfolge, icon, farbe)
SELECT 'Rotwild', 'Kräftiges Hirschfleisch von höchster Qualität', 2, '🦌', '#A0522D'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Rotwild');

INSERT INTO public.shop_kategorien_2025_10_27_14_00 (name, beschreibung, reihenfolge, icon, farbe)
SELECT 'Schwarzwild', 'Würziges Wildschweinefleisch', 3, '🐗', '#654321'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Schwarzwild');

INSERT INTO public.shop_kategorien_2025_10_27_14_00 (name, beschreibung, reihenfolge, icon, farbe)
SELECT 'Federwild', 'Delikates Geflügel aus freier Wildbahn', 4, '🦆', '#228B22'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Federwild');

INSERT INTO public.shop_kategorien_2025_10_27_14_00 (name, beschreibung, reihenfolge, icon, farbe)
SELECT 'Wurstspezialitäten', 'Hausgemachte Wildwurst nach traditionellen Rezepten', 5, '🌭', '#B22222'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Wurstspezialitäten');

INSERT INTO public.shop_kategorien_2025_10_27_14_00 (name, beschreibung, reihenfolge, icon, farbe)
SELECT 'Spezialitäten', 'Besondere Wildspezialitäten und Delikatessen', 6, '⭐', '#DAA520'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Spezialitäten');

-- 4. Aktualisiere bestehende Kategorien mit professionellen Daten
UPDATE public.shop_kategorien_2025_10_27_14_00 SET
    beschreibung = COALESCE(beschreibung, CASE 
        WHEN name ILIKE '%reh%' THEN 'Zartes Rehfleisch aus heimischen Wäldern'
        WHEN name ILIKE '%hirsch%' OR name ILIKE '%rot%' THEN 'Kräftiges Hirschfleisch von höchster Qualität'
        WHEN name ILIKE '%schwein%' OR name ILIKE '%sau%' THEN 'Würziges Wildschweinefleisch'
        WHEN name ILIKE '%ente%' OR name ILIKE '%fasan%' OR name ILIKE '%geflügel%' THEN 'Delikates Geflügel aus freier Wildbahn'
        WHEN name ILIKE '%wurst%' THEN 'Hausgemachte Wildwurst nach traditionellen Rezepten'
        ELSE 'Besondere Wildspezialitäten und Delikatessen'
    END),
    reihenfolge = COALESCE(NULLIF(reihenfolge, 0), CASE 
        WHEN name ILIKE '%reh%' THEN 1
        WHEN name ILIKE '%hirsch%' OR name ILIKE '%rot%' THEN 2
        WHEN name ILIKE '%schwein%' OR name ILIKE '%sau%' THEN 3
        WHEN name ILIKE '%ente%' OR name ILIKE '%fasan%' OR name ILIKE '%geflügel%' THEN 4
        WHEN name ILIKE '%wurst%' THEN 5
        ELSE 6
    END),
    icon = COALESCE(icon, CASE 
        WHEN name ILIKE '%reh%' THEN '🦌'
        WHEN name ILIKE '%hirsch%' OR name ILIKE '%rot%' THEN '🦌'
        WHEN name ILIKE '%schwein%' OR name ILIKE '%sau%' THEN '🐗'
        WHEN name ILIKE '%ente%' OR name ILIKE '%fasan%' OR name ILIKE '%geflügel%' THEN '🦆'
        WHEN name ILIKE '%wurst%' THEN '🌭'
        ELSE '⭐'
    END),
    farbe = COALESCE(farbe, CASE 
        WHEN name ILIKE '%reh%' THEN '#8B4513'
        WHEN name ILIKE '%hirsch%' OR name ILIKE '%rot%' THEN '#A0522D'
        WHEN name ILIKE '%schwein%' OR name ILIKE '%sau%' THEN '#654321'
        WHEN name ILIKE '%ente%' OR name ILIKE '%fasan%' OR name ILIKE '%geflügel%' THEN '#228B22'
        WHEN name ILIKE '%wurst%' THEN '#B22222'
        ELSE '#DAA520'
    END);

-- 5. Zeige finale Kategorien
SELECT 
    name,
    beschreibung,
    reihenfolge,
    icon,
    farbe
FROM public.shop_kategorien_2025_10_27_14_00 
ORDER BY reihenfolge, name;

-- 6. Zeige Produkte pro Kategorie
SELECT 
    k.name as kategorie,
    k.icon,
    COUNT(p.id) as anzahl_produkte,
    COUNT(p.id) FILTER (WHERE p.lagerbestand > 0) as verfuegbare_produkte
FROM public.shop_kategorien_2025_10_27_14_00 k
LEFT JOIN public.shop_produkte_2025_10_27_14_00 p ON k.id = p.kategorie_id
GROUP BY k.id, k.name, k.icon, k.reihenfolge
ORDER BY k.reihenfolge;