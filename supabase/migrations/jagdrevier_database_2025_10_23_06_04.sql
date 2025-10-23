-- Benutzerprofile für erweiterte Informationen
CREATE TABLE IF NOT EXISTS public.user_profiles_2025_10_23_06_04 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'guest' CHECK (role IN ('guest', 'member', 'admin')),
    phone TEXT,
    membership_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News/Aktuelles Tabelle
CREATE TABLE IF NOT EXISTS public.news_2025_10_23_06_04 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    author_id UUID REFERENCES auth.users(id),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bildergalerie Tabelle
CREATE TABLE IF NOT EXISTS public.gallery_2025_10_23_06_04 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'wildlife', 'hunting', 'facilities')),
    is_public BOOLEAN DEFAULT true,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kontaktanfragen Tabelle
CREATE TABLE IF NOT EXISTS public.contact_requests_2025_10_23_06_04 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies aktivieren
ALTER TABLE public.user_profiles_2025_10_23_06_04 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_2025_10_23_06_04 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_2025_10_23_06_04 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests_2025_10_23_06_04 ENABLE ROW LEVEL SECURITY;

-- Policies für user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles_2025_10_23_06_04
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles_2025_10_23_06_04
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles_2025_10_23_06_04
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies für news
CREATE POLICY "Everyone can view public news" ON public.news_2025_10_23_06_04
    FOR SELECT USING (is_public = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins can manage news" ON public.news_2025_10_23_06_04
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles_2025_10_23_06_04 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Policies für gallery
CREATE POLICY "Everyone can view public gallery" ON public.gallery_2025_10_23_06_04
    FOR SELECT USING (is_public = true OR auth.role() = 'authenticated');

CREATE POLICY "Members can upload images" ON public.gallery_2025_10_23_06_04
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies für contact_requests
CREATE POLICY "Anyone can submit contact requests" ON public.contact_requests_2025_10_23_06_04
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact requests" ON public.contact_requests_2025_10_23_06_04
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles_2025_10_23_06_04 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Trigger für automatische Profilerstellung
CREATE OR REPLACE FUNCTION public.handle_new_user_2025_10_23_06_04()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles_2025_10_23_06_04 (user_id, full_name, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'guest');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created_2025_10_23_06_04
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_2025_10_23_06_04();

-- Beispieldaten einfügen
INSERT INTO public.news_2025_10_23_06_04 (title, content, excerpt, is_public) VALUES
('Jagdsaison 2024/2025 eröffnet', 'Die neue Jagdsaison hat begonnen. Alle wichtigen Informationen zu Jagdzeiten und Bestimmungen finden Sie hier.', 'Neue Jagdsaison beginnt mit aktualisierten Bestimmungen', true),
('Wildbestand im Revier', 'Aktuelle Zahlen zum Wildbestand in unserem Revier. Der Bestand entwickelt sich positiv.', 'Positive Entwicklung des Wildbestands', true),
('Neue Hochsitze errichtet', 'Im südlichen Revierteil wurden drei neue Hochsitze errichtet, um die Jagdmöglichkeiten zu verbessern.', 'Erweiterung der jagdlichen Einrichtungen', false);

INSERT INTO public.gallery_2025_10_23_06_04 (title, description, image_url, category, is_public) VALUES
('Rehwild im Morgengrauen', 'Rehbock im frühen Morgenlicht', '/images/wildarten_2.jpeg', 'wildlife', true),
('Hochsitz im Wald', 'Einer unserer Hochsitze im Waldgebiet', '/images/jagd_einrichtungen_1.jpeg', 'facilities', true),
('Schwarzwild', 'Wildschweine in ihrem natürlichen Lebensraum', '/images/wildarten_3.jpeg', 'wildlife', true);