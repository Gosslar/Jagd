-- Migration der bestehenden Artikel aus der alten Lagerverwaltung in den neuen Shop

-- Zuerst prüfen, welche Artikel in der alten Tabelle vorhanden sind
-- und diese in die neue Shop-Struktur übertragen

-- Wildmettwurst-Kategorie für die speziellen Mettwurst-Sorten
DO $$
DECLARE
    rehwild_kategorie_id UUID;
    schwarzwild_kategorie_id UUID;
    wildgeflügel_kategorie_id UUID;
    wildwurst_kategorie_id UUID;
    wildmettwurst_kategorie_id UUID;
BEGIN
    -- Kategorie-IDs ermitteln
    SELECT id INTO rehwild_kategorie_id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Rehwild';
    SELECT id INTO schwarzwild_kategorie_id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Schwarzwild';
    SELECT id INTO wildgeflügel_kategorie_id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Wildgeflügel';
    SELECT id INTO wildwurst_kategorie_id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Wildwurst';
    SELECT id INTO wildmettwurst_kategorie_id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Wildmettwurst';

    -- Bestehende Artikel aus der alten Lagerverwaltung migrieren
    -- Zuerst alle vorhandenen Beispiel-Artikel löschen, um Duplikate zu vermeiden
    DELETE FROM public.shop_produkte_2025_10_27_14_00;

    -- Artikel aus der alten Tabelle übertragen (falls vorhanden)
    INSERT INTO public.shop_produkte_2025_10_27_14_00 (
        kategorie_id, name, preis, einheit, lagerbestand, mindestbestand, reihenfolge,
        beschreibung, kurzbeschreibung, aktiv, sichtbar_fuer_kunden
    )
    SELECT 
        CASE 
            WHEN LOWER(produktname) LIKE '%reh%' AND LOWER(produktname) LIKE '%hack%' THEN rehwild_kategorie_id
            WHEN LOWER(produktname) LIKE '%reh%' AND LOWER(produktname) LIKE '%rücken%' THEN rehwild_kategorie_id
            WHEN LOWER(produktname) LIKE '%reh%' AND LOWER(produktname) LIKE '%filet%' THEN rehwild_kategorie_id
            WHEN LOWER(produktname) LIKE '%reh%' AND LOWER(produktname) LIKE '%gulasch%' THEN rehwild_kategorie_id
            WHEN LOWER(produktname) LIKE '%bratwurst%' AND LOWER(produktname) LIKE '%schwarzwild%' THEN schwarzwild_kategorie_id
            WHEN LOWER(produktname) LIKE '%gänse%' THEN wildgeflügel_kategorie_id
            WHEN LOWER(produktname) LIKE '%mettwurst%' THEN wildmettwurst_kategorie_id
            ELSE wildwurst_kategorie_id
        END as kategorie_id,
        produktname as name,
        preis,
        einheit,
        lagerbestand,
        mindestbestand,
        reihenfolge,
        'Frisches Wildfleisch aus nachhaltiger Jagd' as beschreibung,
        CASE 
            WHEN LOWER(produktname) LIKE '%hack%' THEN 'Zartes Wildhack, perfekt für Bolognese oder Frikadellen'
            WHEN LOWER(produktname) LIKE '%rücken%' THEN 'Edler Rücken, perfekt für besondere Anlässe'
            WHEN LOWER(produktname) LIKE '%filet%' THEN 'Das Beste vom Wild - zartes Filet für Feinschmecker'
            WHEN LOWER(produktname) LIKE '%gulasch%' THEN 'Kräftiges Gulaschfleisch, ideal für herzhafte Eintöpfe'
            WHEN LOWER(produktname) LIKE '%bratwurst%' THEN 'Herzhafte Bratwurst aus Wildfleisch'
            WHEN LOWER(produktname) LIKE '%gänse%' THEN 'Saftige Gänsebrust aus der Region'
            WHEN LOWER(produktname) LIKE '%mettwurst%' THEN 'Luftgetrocknete Mettwurst-Spezialität'
            ELSE 'Hochwertiges Wildfleisch-Produkt'
        END as kurzbeschreibung,
        true as aktiv,
        true as sichtbar_fuer_kunden
    FROM public.wildfleisch_lager_2025_10_24_14_00
    WHERE produktname IS NOT NULL AND produktname != ''
    ON CONFLICT DO NOTHING;

    -- Falls keine Artikel in der alten Tabelle vorhanden sind, Standard-Artikel einfügen
    IF NOT EXISTS (SELECT 1 FROM public.wildfleisch_lager_2025_10_24_14_00) THEN
        -- Standard Wildfleisch-Sortiment einfügen
        INSERT INTO public.shop_produkte_2025_10_27_14_00 (
            kategorie_id, name, preis, einheit, lagerbestand, mindestbestand, reihenfolge,
            beschreibung, kurzbeschreibung, herkunft, haltbarkeit_tage, 
            lagerung_hinweise, zubereitungs_hinweise
        ) VALUES
        -- Rehwild
        (
            rehwild_kategorie_id, 'Rehhack', 7.00, '500g', 10, 2, 1,
            'Frisches Rehhack aus nachhaltiger Jagd, ideal für Bolognese, Frikadellen oder Hackbraten. Das magere Fleisch hat einen milden, aromatischen Geschmack.',
            'Zartes Rehhack, 500g Packung',
            'Weetzen, Niedersachsen', 3,
            'Bei 2-4°C lagern, innerhalb von 3 Tagen verbrauchen',
            'Vor Zubereitung auftauen lassen, gut durchgaren'
        ),
        (
            rehwild_kategorie_id, 'Rehrücken', 32.00, 'je Kg', 5, 1, 2,
            'Edler Rehrücken, das Filetstück vom Reh. Besonders zart und aromatisch, perfekt für festliche Anlässe. Kurz anbraten und rosa servieren.',
            'Premium Rehrücken, verkauft per Kilogramm',
            'Weetzen, Niedersachsen', 5,
            'Bei 2-4°C lagern, innerhalb von 5 Tagen verbrauchen',
            'Kurz scharf anbraten, dann bei niedriger Temperatur garen'
        ),
        (
            rehwild_kategorie_id, 'Rehfilet', 40.00, 'je Kg', 3, 1, 3,
            'Das Beste vom Reh - zartes Filet für Feinschmecker. Besonders mageres und zartes Fleisch mit feinem Wildgeschmack.',
            'Edles Rehfilet, höchste Qualität',
            'Weetzen, Niedersachsen', 5,
            'Bei 2-4°C lagern, innerhalb von 5 Tagen verbrauchen',
            'Nur kurz anbraten, rosa servieren für optimalen Geschmack'
        ),
        (
            rehwild_kategorie_id, 'Rehgulasch', 16.00, 'je Kg', 8, 2, 4,
            'Kräftiges Rehgulasch-Fleisch, perfekt für herzhafte Eintöpfe und Schmorgerichte. Wird beim langsamen Garen besonders zart.',
            'Rehgulasch für herzhafte Gerichte',
            'Weetzen, Niedersachsen', 4,
            'Bei 2-4°C lagern, innerhalb von 4 Tagen verbrauchen',
            'Langsam schmoren für optimale Zartheit'
        ),
        
        -- Schwarzwild
        (
            schwarzwild_kategorie_id, 'Grobe Bratwurst vom Schwarzwild', 9.00, '5er Pack', 8, 2, 1,
            'Herzhafte Bratwurst aus Wildschwein-Fleisch, grob gewürzt mit traditionellen Gewürzen. Kräftiger Geschmack, perfekt zum Grillen.',
            'Kräftige Wildbratwurst im 5er Pack',
            'Weetzen, Niedersachsen', 7,
            'Bei 2-4°C lagern, innerhalb von 7 Tagen verbrauchen',
            'Grillen oder in der Pfanne braten, gut durchgaren'
        ),
        
        -- Wildgeflügel
        (
            wildgeflügel_kategorie_id, 'Gänsebrust', 25.00, 'je Stück', 4, 1, 1,
            'Saftige Gänsebrust aus der Region, perfekt für Festtage. Zartes Fleisch mit charakteristischem Wildgeschmack.',
            'Regionale Gänsebrust, ca. 800g',
            'Weetzen, Niedersachsen', 5,
            'Bei 2-4°C lagern, innerhalb von 5 Tagen verbrauchen',
            'Bei niedriger Temperatur langsam garen'
        ),
        
        -- Wildmettwurst
        (
            wildmettwurst_kategorie_id, 'Wildmettwurst Knoblauch', 14.00, 'je Stück ca. 300g', 6, 1, 1,
            'Luftgetrocknete Wildmettwurst mit Knoblauch, nach traditionellem Rezept hergestellt. Intensive Würzung und fester Biss.',
            'Luftgetrocknete Mettwurst mit Knoblauch',
            'Weetzen, Niedersachsen', 30,
            'Kühl und trocken lagern, nach Anbruch innerhalb von 14 Tagen verbrauchen',
            'In dünne Scheiben schneiden, als Brotbelag oder zu Wein'
        ),
        (
            wildmettwurst_kategorie_id, 'Wildmettwurst Mediterran', 14.00, 'je Stück ca. 300g', 5, 1, 2,
            'Luftgetrocknete Wildmettwurst mit mediterranen Kräutern. Verfeinert mit Rosmarin, Thymian und Oregano.',
            'Mediterrane Mettwurst mit Kräutern',
            'Weetzen, Niedersachsen', 30,
            'Kühl und trocken lagern, nach Anbruch innerhalb von 14 Tagen verbrauchen',
            'In dünne Scheiben schneiden, passt hervorragend zu Antipasti'
        ),
        (
            wildmettwurst_kategorie_id, 'Wildmettwurst Ganzer Pfeffer', 14.00, 'je Stück ca. 300g', 4, 1, 3,
            'Luftgetrocknete Wildmettwurst mit ganzen Pfefferkörnern. Kräftig-würzig mit angenehmer Schärfe.',
            'Pfeffrige Mettwurst mit ganzen Körnern',
            'Weetzen, Niedersachsen', 30,
            'Kühl und trocken lagern, nach Anbruch innerhalb von 14 Tagen verbrauchen',
            'In dünne Scheiben schneiden, ideal zu kräftigem Brot'
        ),
        (
            wildmettwurst_kategorie_id, 'Wildmettwurst Walnuss', 16.00, 'je Stück ca. 300g', 3, 1, 4,
            'Exklusive luftgetrocknete Wildmettwurst mit Walnüssen. Besondere Delikatesse mit nussigem Aroma.',
            'Edle Mettwurst mit Walnüssen - Premium',
            'Weetzen, Niedersachsen', 30,
            'Kühl und trocken lagern, nach Anbruch innerhalb von 14 Tagen verbrauchen',
            'In dünne Scheiben schneiden, perfekt zu Rotwein und Käse'
        );
    END IF;

END $$;