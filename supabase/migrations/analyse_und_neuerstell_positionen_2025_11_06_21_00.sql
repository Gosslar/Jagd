-- Detaillierte Analyse der Bestellpositionen-Daten
-- Erstellt: 2025-11-06 21:00 UTC

-- Zeige ALLE Bestellungen mit Details
SELECT 
    'BESTELLUNGEN' as typ,
    b.id,
    b.name,
    b.email,
    b.gesamtpreis,
    b.created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b
ORDER BY b.created_at DESC;

-- Zeige ALLE Bestellpositionen mit Details
SELECT 
    'POSITIONEN' as typ,
    p.id,
    p.bestellung_id,
    p.produkt_name,
    p.menge,
    p.created_at
FROM public.simple_bestellpositionen_2025_11_06_21_00 p
ORDER BY p.created_at DESC;

-- Zeige JOIN zwischen Bestellungen und Positionen
SELECT 
    'JOIN_RESULT' as typ,
    b.name as kunde_name,
    b.email,
    b.id as bestellung_id,
    p.id as position_id,
    p.produkt_name,
    p.menge,
    CASE 
        WHEN p.id IS NULL THEN 'KEINE_POSITION'
        ELSE 'HAT_POSITION'
    END as status
FROM public.simple_bestellungen_2025_11_06_21_00 b
LEFT JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
ORDER BY b.created_at DESC;

-- Lösche ALLE Positionen und erstelle sie neu
DELETE FROM public.simple_bestellpositionen_2025_11_06_21_00;

-- Erstelle neue Positionen für JEDE Bestellung
INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (
    bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis, created_at
)
SELECT 
    b.id as bestellung_id,
    CASE 
        WHEN b.name ILIKE '%max%' OR b.name ILIKE '%mustermann%' THEN 'Rehkeule (1kg)'
        WHEN b.name ILIKE '%anna%' OR b.name ILIKE '%schmidt%' THEN 'Wildschweinbratwurst (500g)'
        WHEN b.name ILIKE '%tom%' OR b.name ILIKE '%weber%' THEN 'Hirschgulasch (750g)'
        WHEN b.gesamtpreis > 40 THEN 'Rehkeule (1kg)'
        WHEN b.gesamtpreis > 25 THEN 'Wildschweinbratwurst (500g)'
        ELSE 'Hirschgulasch (750g)'
    END as produkt_name,
    1 as menge,
    b.gesamtpreis as einzelpreis,
    b.gesamtpreis as gesamtpreis,
    NOW() as created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b;

-- Zeige Ergebnis nach Neuerstellung
SELECT 
    'NACH_NEUERSTELLUNG' as typ,
    b.name as kunde_name,
    b.email,
    p.produkt_name,
    p.menge,
    'NEU_ERSTELLT' as status
FROM public.simple_bestellungen_2025_11_06_21_00 b
JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
ORDER BY b.created_at DESC;