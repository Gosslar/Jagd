-- Korrigierte Diagnose der Bestelltabellen ohne created_at Fehler
-- Erstellt: 2025-11-06 22:45 UTC

-- 1. Prüfe welche Bestelltabellen existieren
SELECT 
    'VERFUEGBARE_BESTELLTABELLEN' as info,
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name LIKE '%bestellung%' 
AND table_schema = 'public'
ORDER BY table_name;

-- 2. Zeige Struktur der neuen Tabelle
SELECT 
    'STRUKTUR_NEUE_TABELLE' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'simple_bestellungen_2025_11_06_21_00'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Zeige alle Bestellungen aus der NEUEN Tabelle (wo Bestellverwaltung liest)
SELECT 
    'ALLE_BESTELLUNGEN_NEUE_TABELLE' as quelle,
    id,
    name as kunde,
    email,
    gesamtpreis,
    status,
    COALESCE(created_at::text, 'KEIN_TIMESTAMP') as erstellt
FROM public.simple_bestellungen_2025_11_06_21_00 
ORDER BY COALESCE(created_at, NOW()) DESC;

-- 4. Zähle Bestellungen in neuer Tabelle
SELECT 
    'ANZAHL_NEUE_TABELLE' as info,
    COUNT(*) as total_bestellungen,
    COUNT(CASE WHEN status = 'neu' THEN 1 END) as neue_bestellungen,
    COUNT(CASE WHEN status = 'bestätigt' THEN 1 END) as bestaetigte_bestellungen
FROM public.simple_bestellungen_2025_11_06_21_00;

-- 5. Prüfe ob Bestellpositionen existieren
SELECT 
    'BESTELLPOSITIONEN_CHECK' as info,
    COUNT(*) as anzahl_positionen,
    COUNT(DISTINCT bestellung_id) as bestellungen_mit_artikeln
FROM public.simple_bestellpositionen_2025_11_06_21_00;

-- 6. Zeige Bestellungen mit ihren Artikeln
SELECT 
    'BESTELLUNGEN_MIT_ARTIKELN' as info,
    b.name as kunde,
    b.email,
    b.gesamtpreis,
    b.status,
    COUNT(p.id) as anzahl_artikel,
    STRING_AGG(p.produkt_name, ' | ') as artikel_liste
FROM public.simple_bestellungen_2025_11_06_21_00 b
LEFT JOIN public.simple_bestellpositionen_2025_11_06_21_00 p ON b.id = p.bestellung_id
GROUP BY b.id, b.name, b.email, b.gesamtpreis, b.status
ORDER BY b.name;