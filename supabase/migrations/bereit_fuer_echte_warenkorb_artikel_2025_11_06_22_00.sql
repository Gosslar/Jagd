-- Lösche alle Test-Artikel und verwende nur echte Warenkorb-Bestellungen
-- Erstellt: 2025-11-06 22:00 UTC

-- Lösche alle Test-Positionen
DELETE FROM public.simple_bestellpositionen_2025_11_06_21_00;

-- Zeige verfügbare Shop-Produkte für Referenz
SELECT 'VERFUEGBARE_SHOP_PRODUKTE' as typ, name, preis, einheit
FROM public.shop_produkte_2025_10_27_14_00 
WHERE verfuegbar = true
ORDER BY name;

-- Bestätige dass Tabelle bereit ist für echte Warenkorb-Artikel
SELECT 
    'TABELLE_BEREIT_FUER_ECHTE_ARTIKEL' as status,
    COUNT(*) as aktuelle_positionen
FROM public.simple_bestellpositionen_2025_11_06_21_00;

-- Zeige aktuelle Bestellungen (ohne Positionen)
SELECT 
    'AKTUELLE_BESTELLUNGEN' as typ,
    name as kunde,
    email,
    gesamtpreis,
    status,
    created_at
FROM public.simple_bestellungen_2025_11_06_21_00
ORDER BY created_at DESC;