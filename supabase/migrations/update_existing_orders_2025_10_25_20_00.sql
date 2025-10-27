-- Aktualisiere bestehende Bestellungen um Positionen zu erstellen
-- Dies triggert den create_order_positions Trigger für alle bestehenden Bestellungen

UPDATE public.wildfleisch_bestellungen_2025_10_24_08_03 
SET bestellung_json = bestellung_json 
WHERE bestellung_json IS NOT NULL AND bestellung_json != 'null'::jsonb;

-- Setze Standardstatus für bestehende Bestellungen
UPDATE public.wildfleisch_bestellungen_2025_10_24_08_03 
SET bestellstatus = 'neu' 
WHERE bestellstatus IS NULL;

-- Setze lager_reduziert auf false für bestehende Bestellungen
UPDATE public.wildfleisch_bestellungen_2025_10_24_08_03 
SET lager_reduziert = FALSE 
WHERE lager_reduziert IS NULL;

-- Zeige Statistiken
SELECT 
    'Bestellungen aktualisiert!' as status,
    COUNT(*) as anzahl_bestellungen,
    COUNT(CASE WHEN bestellstatus = 'neu' THEN 1 END) as neue_bestellungen,
    COUNT(CASE WHEN lager_reduziert = FALSE THEN 1 END) as offene_lager_reduzierungen
FROM public.wildfleisch_bestellungen_2025_10_24_08_03;

-- Zeige erstellte Positionen
SELECT 
    'Bestellpositionen erstellt!' as status,
    COUNT(*) as anzahl_positionen,
    COUNT(DISTINCT bestellung_id) as bestellungen_mit_positionen
FROM public.bestellpositionen_2025_10_25_20_00;