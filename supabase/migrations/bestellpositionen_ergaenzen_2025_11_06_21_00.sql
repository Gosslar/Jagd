-- Bestellpositionen für migrierte Bestellungen erstellen
-- Erstellt: 2025-11-06 21:00 UTC

-- Prüfe welche Bestellungen keine Positionen haben
SELECT b.id, b.name, b.email, b.gesamtpreis,
       CASE WHEN p.bestellung_id IS NULL THEN 'Keine Positionen' ELSE 'Hat Positionen' END as status
FROM public.simple_bestellungen_2025_11_06_21_00 b
LEFT JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
ORDER BY b.created_at DESC;

-- Erstelle Standard-Positionen für Bestellungen ohne Artikeldetails
INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (
    bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis, created_at
)
SELECT 
    b.id,
    'Wildfleisch-Paket' as produkt_name,
    1 as menge,
    b.gesamtpreis as einzelpreis,
    b.gesamtpreis as gesamtpreis,
    b.created_at
FROM public.simple_bestellungen_2025_11_06_21_00 b
WHERE NOT EXISTS (
    SELECT 1 FROM public.simple_bestellpositionen_2025_11_06_21_00 p 
    WHERE p.bestellung_id = b.id
);

-- Zeige Ergebnis
SELECT 'Bestellungen mit Positionen' as info, count(*) as anzahl
FROM public.simple_bestellungen_2025_11_06_21_00 b
WHERE EXISTS (
    SELECT 1 FROM public.simple_bestellpositionen_2025_11_06_21_00 p 
    WHERE p.bestellung_id = b.id
);

-- Zeige alle Positionen
SELECT b.name, b.email, p.produkt_name, p.menge
FROM public.simple_bestellungen_2025_11_06_21_00 b
JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
ORDER BY b.created_at DESC;