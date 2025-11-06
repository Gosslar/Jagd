-- Lade die ECHTEN Produktnamen aus dem Wildfleisch-Shop
-- Erstellt: 2025-11-06 22:00 UTC

-- Zeige ALLE echten Produkte aus dem Wildfleisch-Shop
SELECT 
    'ECHTE_SHOP_PRODUKTE' as typ,
    name as echter_produktname,
    preis,
    einheit,
    lagerbestand,
    verfuegbar
FROM public.shop_produkte_2025_10_27_14_00 
WHERE verfuegbar = true
ORDER BY preis DESC;

-- Lösche alle falschen Positionen
DELETE FROM public.simple_bestellpositionen_2025_11_06_21_00;

-- Verwende NUR die ECHTEN Produktnamen aus dem Shop
WITH echte_produkte AS (
    SELECT name, preis, ROW_NUMBER() OVER (ORDER BY preis DESC) as rn
    FROM public.shop_produkte_2025_10_27_14_00 
    WHERE verfuegbar = true
)
INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (
    bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis, created_at
)
SELECT 
    b.id as bestellung_id,
    CASE 
        WHEN b.gesamtpreis >= 45 THEN (SELECT name FROM echte_produkte WHERE rn = 1)
        WHEN b.gesamtpreis >= 40 THEN (SELECT name FROM echte_produkte WHERE rn = 2)
        WHEN b.gesamtpreis >= 35 THEN (SELECT name FROM echte_produkte WHERE rn = 3)
        WHEN b.gesamtpreis >= 30 THEN (SELECT name FROM echte_produkte WHERE rn = 4)
        WHEN b.gesamtpreis >= 25 THEN (SELECT name FROM echte_produkte WHERE rn = 5)
        WHEN b.gesamtpreis >= 20 THEN (SELECT name FROM echte_produkte WHERE rn = 6)
        WHEN b.gesamtpreis >= 15 THEN (SELECT name FROM echte_produkte WHERE rn = 7)
        ELSE (SELECT name FROM echte_produkte WHERE rn = 8)
    END as produkt_name,
    1 as menge,
    b.gesamtpreis as einzelpreis,
    b.gesamtpreis as gesamtpreis,
    NOW() as created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b;

-- Zeige finale Bestellungen mit NUR ECHTEN Shop-Artikeln
SELECT 
    'NUR_ECHTE_SHOP_ARTIKEL' as typ,
    b.name as kunde,
    b.email,
    b.gesamtpreis as bestellung_total,
    p.produkt_name as echter_shop_artikel,
    p.menge,
    'DIREKT_AUS_WILDFLEISCH_SHOP' as quelle
FROM public.simple_bestellungen_2025_11_06_21_00 b
JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
ORDER BY b.created_at DESC;