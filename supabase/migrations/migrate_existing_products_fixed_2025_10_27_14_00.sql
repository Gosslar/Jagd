-- Migration der bestehenden Artikel aus der alten Lagerverwaltung in den neuen Shop
-- Mit korrektem Spaltennamen: produkt_name statt produktname

DO $$
DECLARE
    rehwild_kategorie_id UUID;
    schwarzwild_kategorie_id UUID;
    wildgeflügel_kategorie_id UUID;
    wildwurst_kategorie_id UUID;
    wildmettwurst_kategorie_id UUID;
    artikel_count INTEGER;
BEGIN
    -- Kategorie-IDs ermitteln
    SELECT id INTO rehwild_kategorie_id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Rehwild';
    SELECT id INTO schwarzwild_kategorie_id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Schwarzwild';
    SELECT id INTO wildgeflügel_kategorie_id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Wildgeflügel';
    SELECT id INTO wildwurst_kategorie_id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Wildwurst';
    SELECT id INTO wildmettwurst_kategorie_id FROM public.shop_kategorien_2025_10_27_14_00 WHERE name = 'Wildmettwurst';

    -- Prüfen, ob bereits Artikel in der neuen Tabelle vorhanden sind
    SELECT COUNT(*) INTO artikel_count FROM public.shop_produkte_2025_10_27_14_00;
    
    -- Nur migrieren, wenn noch keine oder wenige Artikel vorhanden sind
    IF artikel_count <= 5 THEN
        -- Bestehende Beispiel-Artikel löschen
        DELETE FROM public.shop_produkte_2025_10_27_14_00;

        -- Artikel aus der alten Tabelle übertragen (mit korrektem Spaltennamen)
        INSERT INTO public.shop_produkte_2025_10_27_14_00 (
            kategorie_id, name, preis, einheit, lagerbestand, mindestbestand, reihenfolge,
            beschreibung, kurzbeschreibung, aktiv, sichtbar_fuer_kunden, herkunft, haltbarkeit_tage
        )
        SELECT 
            CASE 
                WHEN LOWER(produkt_name) LIKE '%reh%' AND LOWER(produkt_name) LIKE '%hack%' THEN rehwild_kategorie_id
                WHEN LOWER(produkt_name) LIKE '%reh%' AND LOWER(produkt_name) LIKE '%rücken%' THEN rehwild_kategorie_id
                WHEN LOWER(produkt_name) LIKE '%reh%' AND LOWER(produkt_name) LIKE '%filet%' THEN rehwild_kategorie_id
                WHEN LOWER(produkt_name) LIKE '%reh%' AND LOWER(produkt_name) LIKE '%gulasch%' THEN rehwild_kategorie_id
                WHEN LOWER(produkt_name) LIKE '%bratwurst%' AND LOWER(produkt_name) LIKE '%schwarzwild%' THEN schwarzwild_kategorie_id
                WHEN LOWER(produkt_name) LIKE '%gänse%' THEN wildgeflügel_kategorie_id
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%knoblauch%' THEN wildmettwurst_kategorie_id
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%mediterran%' THEN wildmettwurst_kategorie_id
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%pfeffer%' THEN wildmettwurst_kategorie_id
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%walnuss%' THEN wildmettwurst_kategorie_id
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' THEN wildmettwurst_kategorie_id
                ELSE wildwurst_kategorie_id
            END as kategorie_id,
            produkt_name as name,
            preis,
            einheit,
            lagerbestand,
            mindestbestand,
            COALESCE(reihenfolge, 1) as reihenfolge,
            CASE 
                WHEN LOWER(produkt_name) LIKE '%hack%' THEN 'Frisches Rehhack aus nachhaltiger Jagd, ideal für Bolognese, Frikadellen oder Hackbraten. Das magere Fleisch hat einen milden, aromatischen Geschmack.'
                WHEN LOWER(produkt_name) LIKE '%rücken%' THEN 'Edler Rehrücken, das Filetstück vom Reh. Besonders zart und aromatisch, perfekt für festliche Anlässe.'
                WHEN LOWER(produkt_name) LIKE '%filet%' THEN 'Das Beste vom Reh - zartes Filet für Feinschmecker. Besonders mageres und zartes Fleisch mit feinem Wildgeschmack.'
                WHEN LOWER(produkt_name) LIKE '%gulasch%' THEN 'Kräftiges Rehgulasch-Fleisch, perfekt für herzhafte Eintöpfe und Schmorgerichte. Wird beim langsamen Garen besonders zart.'
                WHEN LOWER(produkt_name) LIKE '%bratwurst%' THEN 'Herzhafte Bratwurst aus Wildschwein-Fleisch, grob gewürzt mit traditionellen Gewürzen. Kräftiger Geschmack, perfekt zum Grillen.'
                WHEN LOWER(produkt_name) LIKE '%gänse%' THEN 'Saftige Gänsebrust aus der Region, perfekt für Festtage. Zartes Fleisch mit charakteristischem Wildgeschmack.'
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%knoblauch%' THEN 'Luftgetrocknete Wildmettwurst mit Knoblauch, nach traditionellem Rezept hergestellt. Intensive Würzung und fester Biss.'
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%mediterran%' THEN 'Luftgetrocknete Wildmettwurst mit mediterranen Kräutern. Verfeinert mit Rosmarin, Thymian und Oregano.'
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%pfeffer%' THEN 'Luftgetrocknete Wildmettwurst mit ganzen Pfefferkörnern. Kräftig-würzig mit angenehmer Schärfe.'
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%walnuss%' THEN 'Exklusive luftgetrocknete Wildmettwurst mit Walnüssen. Besondere Delikatesse mit nussigem Aroma.'
                ELSE 'Hochwertiges Wildfleisch-Produkt aus nachhaltiger Jagd'
            END as beschreibung,
            CASE 
                WHEN LOWER(produkt_name) LIKE '%hack%' THEN 'Zartes Wildhack, perfekt für Bolognese oder Frikadellen'
                WHEN LOWER(produkt_name) LIKE '%rücken%' THEN 'Edler Rücken, perfekt für besondere Anlässe'
                WHEN LOWER(produkt_name) LIKE '%filet%' THEN 'Das Beste vom Wild - zartes Filet für Feinschmecker'
                WHEN LOWER(produkt_name) LIKE '%gulasch%' THEN 'Kräftiges Gulaschfleisch, ideal für herzhafte Eintöpfe'
                WHEN LOWER(produkt_name) LIKE '%bratwurst%' THEN 'Herzhafte Bratwurst aus Wildfleisch'
                WHEN LOWER(produkt_name) LIKE '%gänse%' THEN 'Saftige Gänsebrust aus der Region'
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%knoblauch%' THEN 'Luftgetrocknete Mettwurst mit Knoblauch'
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%mediterran%' THEN 'Mediterrane Mettwurst mit Kräutern'
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%pfeffer%' THEN 'Pfeffrige Mettwurst mit ganzen Körnern'
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' AND LOWER(produkt_name) LIKE '%walnuss%' THEN 'Edle Mettwurst mit Walnüssen - Premium'
                ELSE 'Hochwertiges Wildfleisch-Produkt'
            END as kurzbeschreibung,
            true as aktiv,
            true as sichtbar_fuer_kunden,
            'Weetzen, Niedersachsen' as herkunft,
            CASE 
                WHEN LOWER(produkt_name) LIKE '%hack%' THEN 3
                WHEN LOWER(produkt_name) LIKE '%rücken%' OR LOWER(produkt_name) LIKE '%filet%' OR LOWER(produkt_name) LIKE '%gänse%' THEN 5
                WHEN LOWER(produkt_name) LIKE '%gulasch%' THEN 4
                WHEN LOWER(produkt_name) LIKE '%bratwurst%' THEN 7
                WHEN LOWER(produkt_name) LIKE '%mettwurst%' THEN 30
                ELSE 7
            END as haltbarkeit_tage
        FROM public.wildfleisch_lager_2025_10_24_14_00
        WHERE produkt_name IS NOT NULL AND produkt_name != ''
        ON CONFLICT DO NOTHING;

        RAISE NOTICE 'Artikel aus alter Tabelle migriert: %', (SELECT COUNT(*) FROM public.wildfleisch_lager_2025_10_24_14_00);
    ELSE
        RAISE NOTICE 'Migration übersprungen - bereits % Artikel vorhanden', artikel_count;
    END IF;

    -- Reihenfolge innerhalb der Kategorien korrigieren
    UPDATE public.shop_produkte_2025_10_27_14_00 SET reihenfolge = subquery.new_reihenfolge
    FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY kategorie_id ORDER BY name) as new_reihenfolge
        FROM public.shop_produkte_2025_10_27_14_00
    ) AS subquery
    WHERE public.shop_produkte_2025_10_27_14_00.id = subquery.id;

    RAISE NOTICE 'Migration abgeschlossen. Artikel in neuer Tabelle: %', (SELECT COUNT(*) FROM public.shop_produkte_2025_10_27_14_00);

END $$;