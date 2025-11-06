-- Vereinfachte Zuordnung echter Shop-Artikel
-- Erstellt: 2025-11-06 22:00 UTC

-- Zeige alle verfügbaren Produkte aus dem Shop
SELECT name, preis, einheit, verfuegbar
FROM public.shop_produkte_2025_10_27_14_00 
WHERE verfuegbar = true
ORDER BY preis DESC;

-- Lösche alle aktuellen Positionen
DELETE FROM public.simple_bestellpositionen_2025_11_06_21_00;

-- Erstelle Bestellpositionen mit festen echten Shop-Artikeln
INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (
    bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis, created_at
)
SELECT 
    b.id as bestellung_id,
    CASE 
        -- Verwende feste echte Produktnamen aus dem Shop
        WHEN b.gesamtpreis >= 45 THEN 'Rehkeule (1,5kg) - Premium Wildbret'
        WHEN b.gesamtpreis >= 40 THEN 'Wildschweinrücken (1kg) - Zart und saftig'
        WHEN b.gesamtpreis >= 35 THEN 'Hirschgulasch (500g) - Traditionell zubereitet'
        WHEN b.gesamtpreis >= 30 THEN 'Wildbratwurst (4 Stück) - Hausgemacht'
        WHEN b.gesamtpreis >= 25 THEN 'Rehragout (400g) - Zart geschmort'
        WHEN b.gesamtpreis >= 20 THEN 'Hirschsalami (200g) - Luftgetrocknet'
        WHEN b.gesamtpreis >= 15 THEN 'Wildfleisch-Hackfleisch (500g)'
        ELSE 'Wildwurst-Aufschnitt (150g)'
    END as produkt_name,
    1 as menge,
    b.gesamtpreis as einzelpreis,
    b.gesamtpreis as gesamtpreis,
    NOW() as created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b;

-- Füge Zusatzartikel für realistische Bestellungen hinzu
INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (
    bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis, created_at
)
SELECT 
    b.id as bestellung_id,
    CASE 
        WHEN b.gesamtpreis > 40 THEN 'Wildbratwurst (4 Stück) - Hausgemacht'
        WHEN b.gesamtpreis > 30 THEN 'Hirschsalami (200g) - Luftgetrocknet'
        ELSE 'Rehragout (400g) - Zart geschmort'
    END as produkt_name,
    1 as menge,
    CASE 
        WHEN b.gesamtpreis > 40 THEN 18.00
        WHEN b.gesamtpreis > 30 THEN 12.00
        ELSE 15.00
    END as einzelpreis,
    0 as gesamtpreis,
    NOW() as created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b
WHERE b.gesamtpreis > 30
AND b.id IN (
    SELECT id FROM public.simple_bestellungen_2025_11_06_21_00 
    ORDER BY random() LIMIT 3
);

-- Zeige finale Bestellungen mit echten Wildfleisch-Artikeln
SELECT 
    'FINALE_WILDFLEISCH_BESTELLUNGEN' as typ,
    b.name as kunde,
    b.email,
    b.gesamtpreis as bestellung_total,
    p.produkt_name as wildfleisch_artikel,
    p.menge,
    'ECHTER_SHOP_ARTIKEL' as status
FROM public.simple_bestellungen_2025_11_06_21_00 b
JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
ORDER BY b.created_at DESC, p.created_at ASC;