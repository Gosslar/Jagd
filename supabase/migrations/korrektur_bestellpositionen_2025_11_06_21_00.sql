-- Prüfung der Bestellpositionen und Korrektur
-- Erstellt: 2025-11-06 21:00 UTC

-- Zeige alle Bestellungen mit ihren Positionen
SELECT 
    b.name as kunde,
    b.email,
    b.gesamtpreis,
    p.produkt_name,
    p.menge,
    b.created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b
LEFT JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
ORDER BY b.created_at DESC;

-- Lösche die automatisch erstellten "Wildfleisch-Paket" Einträge
DELETE FROM public.simple_bestellpositionen_2025_11_06_21_00 
WHERE produkt_name = 'Wildfleisch-Paket';

-- Erstelle spezifische Artikel für die Test-Bestellungen
INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (
    bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis, created_at
)
SELECT 
    b.id,
    CASE 
        WHEN b.name = 'Max Mustermann' THEN 'Rehkeule (1kg)'
        WHEN b.name = 'Anna Schmidt' THEN 'Wildschweinbratwurst (500g)'
        WHEN b.name = 'Tom Weber' THEN 'Hirschgulasch (750g)'
        ELSE 'Wildbret-Mischpaket'
    END as produkt_name,
    1 as menge,
    b.gesamtpreis as einzelpreis,
    b.gesamtpreis as gesamtpreis,
    b.created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b
WHERE NOT EXISTS (
    SELECT 1 FROM public.simple_bestellpositionen_2025_11_06_21_00 p 
    WHERE p.bestellung_id = b.id
);

-- Zeige Ergebnis nach Korrektur
SELECT 
    b.name as kunde,
    b.email,
    p.produkt_name,
    p.menge,
    'Korrigiert' as status
FROM public.simple_bestellungen_2025_11_06_21_00 b
JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
ORDER BY b.created_at DESC;