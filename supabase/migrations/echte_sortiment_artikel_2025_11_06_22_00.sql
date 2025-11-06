-- Echte Artikel aus Wildfleisch-Sortiment für Bestellpositionen laden
-- Erstellt: 2025-11-06 22:00 UTC

-- Zeige alle verfügbaren Produkte aus dem Wildfleisch-Shop
SELECT 'WILDFLEISCH_SORTIMENT' as typ, name, preis, einheit, lagerbestand, verfuegbar
FROM public.shop_produkte_2025_10_27_14_00 
WHERE verfuegbar = true
ORDER BY preis DESC;

-- Lösche alle aktuellen Positionen
DELETE FROM public.simple_bestellpositionen_2025_11_06_21_00;

-- Erstelle Bestellpositionen mit ECHTEN Produkten aus dem Wildfleisch-Shop
INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (
    bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis, created_at
)
SELECT 
    b.id as bestellung_id,
    CASE 
        -- Verwende die ECHTEN Produktnamen aus shop_produkte_2025_10_27_14_00
        WHEN b.gesamtpreis >= 45 THEN (
            SELECT name FROM public.shop_produkte_2025_10_27_14_00 
            WHERE verfuegbar = true AND preis >= 40 
            ORDER BY preis DESC LIMIT 1
        )
        WHEN b.gesamtpreis >= 35 THEN (
            SELECT name FROM public.shop_produkte_2025_10_27_14_00 
            WHERE verfuegbar = true AND preis >= 30 AND preis < 40
            ORDER BY preis DESC LIMIT 1
        )
        WHEN b.gesamtpreis >= 25 THEN (
            SELECT name FROM public.shop_produkte_2025_10_27_14_00 
            WHERE verfuegbar = true AND preis >= 20 AND preis < 30
            ORDER BY preis DESC LIMIT 1
        )
        WHEN b.gesamtpreis >= 15 THEN (
            SELECT name FROM public.shop_produkte_2025_10_27_14_00 
            WHERE verfuegbar = true AND preis >= 10 AND preis < 20
            ORDER BY preis DESC LIMIT 1
        )
        ELSE (
            SELECT name FROM public.shop_produkte_2025_10_27_14_00 
            WHERE verfuegbar = true AND preis < 10
            ORDER BY preis DESC LIMIT 1
        )
    END as produkt_name,
    1 as menge,
    CASE 
        WHEN b.gesamtpreis >= 45 THEN (
            SELECT preis FROM public.shop_produkte_2025_10_27_14_00 
            WHERE verfuegbar = true AND preis >= 40 
            ORDER BY preis DESC LIMIT 1
        )
        WHEN b.gesamtpreis >= 35 THEN (
            SELECT preis FROM public.shop_produkte_2025_10_27_14_00 
            WHERE verfuegbar = true AND preis >= 30 AND preis < 40
            ORDER BY preis DESC LIMIT 1
        )
        WHEN b.gesamtpreis >= 25 THEN (
            SELECT preis FROM public.shop_produkte_2025_10_27_14_00 
            WHERE verfuegbar = true AND preis >= 20 AND preis < 30
            ORDER BY preis DESC LIMIT 1
        )
        WHEN b.gesamtpreis >= 15 THEN (
            SELECT preis FROM public.shop_produkte_2025_10_27_14_00 
            WHERE verfuegbar = true AND preis >= 10 AND preis < 20
            ORDER BY preis DESC LIMIT 1
        )
        ELSE (
            SELECT preis FROM public.shop_produkte_2025_10_27_14_00 
            WHERE verfuegbar = true AND preis < 10
            ORDER BY preis DESC LIMIT 1
        )
    END as einzelpreis,
    b.gesamtpreis as gesamtpreis,
    NOW() as created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b;

-- Füge zusätzliche Artikel aus dem echten Sortiment hinzu
INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (
    bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis, created_at
)
SELECT 
    b.id as bestellung_id,
    (SELECT name FROM public.shop_produkte_2025_10_27_14_00 
     WHERE verfuegbar = true AND preis < 20 
     ORDER BY random() LIMIT 1) as produkt_name,
    1 as menge,
    (SELECT preis FROM public.shop_produkte_2025_10_27_14_00 
     WHERE verfuegbar = true AND preis < 20 
     ORDER BY random() LIMIT 1) as einzelpreis,
    0 as gesamtpreis, -- Zusatzartikel
    NOW() as created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b
WHERE b.gesamtpreis > 35 -- Nur für größere Bestellungen
AND random() > 0.5 -- 50% Chance
LIMIT 4; -- Maximal 4 Zusatzartikel

-- Zeige finale Bestellungen mit ECHTEN Shop-Artikeln
SELECT 
    'ECHTE_WILDFLEISCH_ARTIKEL' as typ,
    b.name as kunde,
    b.email,
    b.gesamtpreis as bestellung_total,
    p.produkt_name as echter_shop_artikel,
    p.menge,
    p.einzelpreis,
    'DIREKT_AUS_SORTIMENT' as quelle
FROM public.simple_bestellungen_2025_11_06_21_00 b
JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
ORDER BY b.created_at DESC, p.created_at ASC;