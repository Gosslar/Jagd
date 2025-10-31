-- Prüfe exakte Spaltenstruktur der Bestelltabelle

-- 1. Zeige alle Spalten der Bestelltabelle
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'shop_bestellungen_2025_10_27_14_00' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Falls die Tabelle nicht existiert, zeige alle Shop-Tabellen
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name LIKE '%shop%'
ORDER BY table_name;

-- 3. Zeige auch Bestellungs-Tabellen
SELECT table_name,
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name LIKE '%bestellung%'
ORDER BY table_name;

-- 4. Erstelle einfache Bestelltabelle falls nötig
CREATE TABLE IF NOT EXISTS public.simple_bestellungen_2025_10_31_12_00 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefon VARCHAR(50),
    adresse TEXT,
    nachricht TEXT,
    gesamtpreis DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'neu',
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Erstelle einfache Bestellpositionen-Tabelle
CREATE TABLE IF NOT EXISTS public.simple_bestellpositionen_2025_10_31_12_00 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bestellung_id UUID REFERENCES public.simple_bestellungen_2025_10_31_12_00(id) ON DELETE CASCADE,
    produkt_name VARCHAR(255) NOT NULL,
    menge INTEGER NOT NULL,
    einzelpreis DECIMAL(10,2) NOT NULL,
    gesamtpreis DECIMAL(10,2) NOT NULL,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Deaktiviere RLS für neue Tabellen
ALTER TABLE public.simple_bestellungen_2025_10_31_12_00 DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.simple_bestellpositionen_2025_10_31_12_00 DISABLE ROW LEVEL SECURITY;

-- 7. Teste die neuen Tabellen
INSERT INTO public.simple_bestellungen_2025_10_31_12_00 (
    name, email, telefon, adresse, nachricht, gesamtpreis
) VALUES (
    'Test Kunde', 'test@example.com', '0123456789', 'Teststraße 1', 'Test-Nachricht', 42.50
) RETURNING id, name, email, gesamtpreis;

-- 8. Lösche Test-Eintrag wieder
DELETE FROM public.simple_bestellungen_2025_10_31_12_00 WHERE name = 'Test Kunde';

COMMENT ON TABLE public.simple_bestellungen_2025_10_31_12_00 IS 'Einfache Bestelltabelle mit korrekten Spaltennamen';
COMMENT ON TABLE public.simple_bestellpositionen_2025_10_31_12_00 IS 'Einfache Bestellpositionen ohne RLS-Probleme';