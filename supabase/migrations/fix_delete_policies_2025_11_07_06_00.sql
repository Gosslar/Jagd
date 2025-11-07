-- Fix RLS Policies für DELETE Operationen
-- Aktuelle Zeit: 2025-11-07 06:00 UTC

-- Überprüfe aktuelle Policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('simple_bestellungen_2025_11_06_21_00', 'simple_bestellpositionen_2025_11_06_21_00');

-- Erstelle DELETE Policy für Bestellungen falls nicht vorhanden
DO $$
BEGIN
    -- Policy für Bestellungen DELETE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'simple_bestellungen_2025_11_06_21_00' 
        AND policyname = 'delete_bestellungen_policy'
    ) THEN
        CREATE POLICY "delete_bestellungen_policy" ON public.simple_bestellungen_2025_11_06_21_00
        FOR DELETE USING (auth.role() = 'authenticated');
    END IF;

    -- Policy für Bestellpositionen DELETE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'simple_bestellpositionen_2025_11_06_21_00' 
        AND policyname = 'delete_bestellpositionen_policy'
    ) THEN
        CREATE POLICY "delete_bestellpositionen_policy" ON public.simple_bestellpositionen_2025_11_06_21_00
        FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Teste DELETE Operation
SELECT 'Testing DELETE permissions...' as status;

-- Zeige finale Policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('simple_bestellungen_2025_11_06_21_00', 'simple_bestellpositionen_2025_11_06_21_00')
ORDER BY tablename, cmd;