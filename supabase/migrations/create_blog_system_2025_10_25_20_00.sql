-- Erstelle Blog-Artikel Tabelle
CREATE TABLE public.blog_artikel_2025_10_25_20_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titel TEXT NOT NULL,
    untertitel TEXT,
    inhalt TEXT NOT NULL,
    autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    autor_name TEXT NOT NULL,
    kategorie TEXT DEFAULT 'Allgemein' CHECK (kategorie IN ('Allgemein', 'Jagd', 'Wildtiere', 'Revier', 'Veranstaltungen', 'Sicherheit')),
    status TEXT DEFAULT 'entwurf' CHECK (status IN ('entwurf', 'veröffentlicht', 'archiviert')),
    featured_image TEXT, -- URL zum Hauptbild
    excerpt TEXT, -- Kurze Zusammenfassung
    tags TEXT[], -- Array von Tags
    veröffentlicht_am TIMESTAMP WITH TIME ZONE,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0
);

-- Aktiviere RLS
ALTER TABLE public.blog_artikel_2025_10_25_20_00 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Jeder kann veröffentlichte Artikel lesen
CREATE POLICY "Jeder kann veröffentlichte Artikel lesen" 
ON public.blog_artikel_2025_10_25_20_00 
FOR SELECT 
USING (status = 'veröffentlicht');

-- Admins können alle Artikel verwalten
CREATE POLICY "Admins können alle Artikel verwalten" 
ON public.blog_artikel_2025_10_25_20_00 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 
        WHERE user_id = auth.uid() 
        AND rolle IN ('super_admin', 'benutzer_admin')
    )
);

-- Autoren können ihre eigenen Artikel verwalten
CREATE POLICY "Autoren können eigene Artikel verwalten" 
ON public.blog_artikel_2025_10_25_20_00 
FOR ALL 
USING (autor_id = auth.uid());

-- Trigger für automatische Zeitstempel-Updates
CREATE OR REPLACE FUNCTION update_blog_artikel_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.aktualisiert_am = NOW();
    
    -- Setze Veröffentlichungsdatum wenn Status auf veröffentlicht geändert wird
    IF NEW.status = 'veröffentlicht' AND OLD.status != 'veröffentlicht' THEN
        NEW.veröffentlicht_am = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_artikel_timestamp_trigger
    BEFORE UPDATE ON public.blog_artikel_2025_10_25_20_00
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_artikel_timestamp();

-- Funktion zum Erhöhen der Views
CREATE OR REPLACE FUNCTION increment_article_views(artikel_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.blog_artikel_2025_10_25_20_00
    SET views = views + 1
    WHERE id = artikel_id AND status = 'veröffentlicht';
END;
$$;

-- Funktion zum Liken von Artikeln
CREATE OR REPLACE FUNCTION toggle_article_like(artikel_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_likes INTEGER;
BEGIN
    -- Erhöhe Likes (vereinfacht - in Realität würde man User-Likes tracken)
    UPDATE public.blog_artikel_2025_10_25_20_00
    SET likes = likes + 1
    WHERE id = artikel_id AND status = 'veröffentlicht'
    RETURNING likes INTO current_likes;
    
    IF current_likes IS NULL THEN
        RETURN json_build_object('error', 'Artikel nicht gefunden');
    END IF;
    
    RETURN json_build_object('success', true, 'likes', current_likes);
END;
$$;

-- Erstelle Indizes für bessere Performance
CREATE INDEX idx_blog_artikel_status ON public.blog_artikel_2025_10_25_20_00(status);
CREATE INDEX idx_blog_artikel_kategorie ON public.blog_artikel_2025_10_25_20_00(kategorie);
CREATE INDEX idx_blog_artikel_veröffentlicht ON public.blog_artikel_2025_10_25_20_00(veröffentlicht_am DESC);
CREATE INDEX idx_blog_artikel_autor ON public.blog_artikel_2025_10_25_20_00(autor_id);

-- Beispiel-Artikel einfügen
INSERT INTO public.blog_artikel_2025_10_25_20_00 (
    titel, 
    untertitel,
    inhalt, 
    autor_name, 
    kategorie, 
    status,
    excerpt,
    tags,
    veröffentlicht_am
) VALUES 
(
    'Erfolgreiche Rehkitzrettung 2024',
    'Moderne Drohnentechnik rettet Jungtiere',
    'In diesem Jahr konnten wir mit Hilfe modernster Drohnentechnik und Wärmebildkameras wieder zahlreiche Rehkitze vor dem Mähtod bewahren. Die Zusammenarbeit mit den örtlichen Landwirten war dabei von entscheidender Bedeutung.

Die Rehkitzrettung ist ein wichtiger Bestandteil unseres Wildtiermanagements. Jedes Jahr im Mai und Juni, wenn die Mahd beginnt, sind die Rehkitze besonders gefährdet. Sie ducken sich bei Gefahr instinktiv und versuchen nicht zu fliehen.

Unsere Erfolge in Zahlen:
- 23 gerettete Rehkitze
- 15 Einsätze mit der Drohne
- 100% Erfolgsquote bei der Ortung

Die moderne Technik ermöglicht es uns, die Tiere schnell und stressfrei zu lokalisieren und in Sicherheit zu bringen.',
    'Jagdrevier Weetzen',
    'Wildtiere',
    'veröffentlicht',
    'Mit modernster Drohnentechnik konnten wir 2024 erfolgreich 23 Rehkitze vor dem Mähtod bewahren.',
    ARRAY['Rehkitzrettung', 'Drohne', 'Wildtierschutz', 'Landwirtschaft'],
    NOW() - INTERVAL '7 days'
),
(
    'Winterfütterung beginnt',
    'Unterstützung für das Wild in der kalten Jahreszeit',
    'Mit den ersten frostigen Nächten beginnt traditionell die Winterfütterung in unserem Revier. Diese wichtige Maßnahme hilft dem Wild, die nahrungsarme Zeit zu überstehen.

Die Fütterung erfolgt an strategisch platzierten Futterstellen, die regelmäßig kontrolliert und befüllt werden. Dabei achten wir auf eine ausgewogene Ernährung mit hochwertigem Futter.

Unsere Futterstellen:
- 8 Futterstellen für Rehwild
- 4 Kirrungen für Schwarzwild
- Spezielle Äsungsflächen

Die Winterfütterung ist nicht nur eine Unterstützung für das Wild, sondern auch eine wichtige Lenkungsmaßnahme, um Wildschäden zu vermeiden.',
    'Jagdrevier Weetzen',
    'Revier',
    'veröffentlicht',
    'Die Winterfütterung hat begonnen - wichtige Unterstützung für unser Wild in der kalten Jahreszeit.',
    ARRAY['Winterfütterung', 'Wildmanagement', 'Futterstellen'],
    NOW() - INTERVAL '3 days'
);

-- Kommentare
COMMENT ON TABLE public.blog_artikel_2025_10_25_20_00 IS 'Blog-Artikel für "Neues aus dem Revier"';
COMMENT ON FUNCTION increment_article_views IS 'Erhöht die Anzahl der Artikel-Aufrufe';
COMMENT ON FUNCTION toggle_article_like IS 'Erhöht die Likes für einen Artikel';

-- Erfolgsmeldung
SELECT 'Blog-System für "Neues aus dem Revier" erfolgreich erstellt!' as status;