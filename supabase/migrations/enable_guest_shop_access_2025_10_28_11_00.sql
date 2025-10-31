-- Shop-Zugriff ohne Anmeldung ermöglichen
-- RLS-Policies für Shop-Tabellen anpassen

-- 1. Shop-Kategorien: Lesezugriff für alle (auch nicht-angemeldete Benutzer)
DROP POLICY IF EXISTS "Jeder kann Shop-Kategorien sehen" ON public.shop_kategorien_2025_10_27_14_00;
CREATE POLICY "Jeder kann Shop-Kategorien sehen" ON public.shop_kategorien_2025_10_27_14_00
    FOR SELECT USING (true);

-- 2. Shop-Produkte: Lesezugriff für alle (auch nicht-angemeldete Benutzer)
DROP POLICY IF EXISTS "Jeder kann Shop-Produkte sehen" ON public.shop_produkte_2025_10_27_14_00;
CREATE POLICY "Jeder kann Shop-Produkte sehen" ON public.shop_produkte_2025_10_27_14_00
    FOR SELECT USING (verfuegbar = true);

-- 3. Shop-Bestellungen: Erstellen ohne Anmeldung erlauben
DROP POLICY IF EXISTS "Jeder kann Bestellungen erstellen" ON public.shop_bestellungen_2025_10_27_14_00;
CREATE POLICY "Jeder kann Bestellungen erstellen" ON public.shop_bestellungen_2025_10_27_14_00
    FOR INSERT WITH CHECK (true);

-- Bestellungen lesen: Nur eigene oder Admin
DROP POLICY IF EXISTS "Benutzer können eigene Bestellungen sehen" ON public.shop_bestellungen_2025_10_27_14_00;
CREATE POLICY "Benutzer können eigene Bestellungen sehen" ON public.shop_bestellungen_2025_10_27_14_00
    FOR SELECT USING (
        kunde_id = auth.uid() OR 
        kunde_id IS NULL OR
        EXISTS (
            SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 ar
            JOIN public.user_profiles_2025_10_25_19_00 up ON ar.user_id = up.user_id
            WHERE ar.user_id = auth.uid() 
            AND up.freigabe_status = 'freigegeben'
            AND ar.rolle IN ('super_admin', 'benutzer_admin', 'lager_admin')
        )
    );

-- 4. Shop-Bestellpositionen: Erstellen ohne Anmeldung erlauben
DROP POLICY IF EXISTS "Jeder kann Bestellpositionen erstellen" ON public.shop_bestellpositionen_2025_10_27_14_00;
CREATE POLICY "Jeder kann Bestellpositionen erstellen" ON public.shop_bestellpositionen_2025_10_27_14_00
    FOR INSERT WITH CHECK (true);

-- Bestellpositionen lesen: Nur zu eigenen Bestellungen oder Admin
DROP POLICY IF EXISTS "Benutzer können eigene Bestellpositionen sehen" ON public.shop_bestellpositionen_2025_10_27_14_00;
CREATE POLICY "Benutzer können eigene Bestellpositionen sehen" ON public.shop_bestellpositionen_2025_10_27_14_00
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.shop_bestellungen_2025_10_27_14_00 b
            WHERE b.id = bestellung_id 
            AND (
                b.kunde_id = auth.uid() OR 
                b.kunde_id IS NULL OR
                EXISTS (
                    SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 ar
                    JOIN public.user_profiles_2025_10_25_19_00 up ON ar.user_id = up.user_id
                    WHERE ar.user_id = auth.uid() 
                    AND up.freigabe_status = 'freigegeben'
                    AND ar.rolle IN ('super_admin', 'benutzer_admin', 'lager_admin')
                )
            )
        )
    );

-- Kommentar für bessere Dokumentation
COMMENT ON POLICY "Jeder kann Shop-Kategorien sehen" ON public.shop_kategorien_2025_10_27_14_00 IS 'Ermöglicht allen Besuchern das Anzeigen von Shop-Kategorien ohne Anmeldung';
COMMENT ON POLICY "Jeder kann Shop-Produkte sehen" ON public.shop_produkte_2025_10_27_14_00 IS 'Ermöglicht allen Besuchern das Anzeigen verfügbarer Produkte ohne Anmeldung';
COMMENT ON POLICY "Jeder kann Bestellungen erstellen" ON public.shop_bestellungen_2025_10_27_14_00 IS 'Ermöglicht Gästen das Aufgeben von Bestellungen ohne Anmeldung';
COMMENT ON POLICY "Jeder kann Bestellpositionen erstellen" ON public.shop_bestellpositionen_2025_10_27_14_00 IS 'Ermöglicht das Hinzufügen von Bestellpositionen ohne Anmeldung';