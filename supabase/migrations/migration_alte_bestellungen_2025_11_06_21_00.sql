-- Migration der alten Bestellungen in neue Tabelle
-- Erstellt: 2025-11-06 21:00 UTC

-- Prüfe alte Bestellungen
SELECT 'Alte Bestellungen in simple_bestellungen_2025_10_31_12_00' as info, count(*) as anzahl
FROM public.simple_bestellungen_2025_10_31_12_00;

-- Zeige alle alten Bestellungen
SELECT id, name, email, status, gesamtpreis, created_at
FROM public.simple_bestellungen_2025_10_31_12_00
ORDER BY created_at DESC;

-- Migriere alte Bestellungen in neue Tabelle (nur wenn sie nicht bereits existieren)
INSERT INTO public.simple_bestellungen_2025_11_06_21_00 (
    id, name, email, telefon, adresse, nachricht, gesamtpreis, status, created_at, updated_at
)
SELECT 
    id,
    name,
    email,
    telefon,
    adresse,
    nachricht,
    gesamtpreis,
    COALESCE(status, 'neu') as status,
    created_at,
    COALESCE(updated_at, created_at) as updated_at
FROM public.simple_bestellungen_2025_10_31_12_00
WHERE id NOT IN (
    SELECT id FROM public.simple_bestellungen_2025_11_06_21_00
);

-- Migriere alte Bestellpositionen (falls Tabelle existiert)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'simple_bestellpositionen_2025_10_31_12_00') THEN
        INSERT INTO public.simple_bestellpositionen_2025_11_06_21_00 (
            id, bestellung_id, produkt_name, menge, einzelpreis, gesamtpreis, created_at
        )
        SELECT 
            id,
            bestellung_id,
            produkt_name,
            menge,
            einzelpreis,
            gesamtpreis,
            created_at
        FROM public.simple_bestellpositionen_2025_10_31_12_00
        WHERE id NOT IN (
            SELECT id FROM public.simple_bestellpositionen_2025_11_06_21_00
        )
        AND bestellung_id IN (
            SELECT id FROM public.simple_bestellungen_2025_11_06_21_00
        );
    END IF;
END $$;

-- Zeige Ergebnis der Migration
SELECT 'Nach Migration - Neue Tabelle' as info, count(*) as anzahl
FROM public.simple_bestellungen_2025_11_06_21_00;

SELECT 'Nach Migration - Bestellpositionen' as info, count(*) as anzahl
FROM public.simple_bestellpositionen_2025_11_06_21_00;

-- Zeige alle Bestellungen in neuer Tabelle
SELECT id, name, email, status, gesamtpreis, created_at
FROM public.simple_bestellungen_2025_11_06_21_00
ORDER BY created_at DESC;