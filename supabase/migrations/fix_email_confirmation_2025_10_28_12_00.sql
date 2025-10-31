-- E-Mail-Bestätigung für Registrierung temporär deaktivieren
-- Dies ermöglicht sofortige Registrierung ohne E-Mail-Bestätigung

-- Hinweis: Diese Einstellung wird normalerweise über das Supabase Dashboard vorgenommen
-- unter Authentication > Settings > Email Confirmation
-- Aber wir können auch eine Funktion erstellen, die Benutzer direkt aktiviert

-- Funktion zum automatischen Aktivieren neuer Benutzer
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Setze email_confirmed_at auf die aktuelle Zeit für neue Benutzer
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für automatische Benutzerbestätigung
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();

-- Kommentar für bessere Dokumentation
COMMENT ON FUNCTION public.auto_confirm_user() IS 'Automatische Bestätigung neuer Benutzer ohne E-Mail-Bestätigung';
COMMENT ON TRIGGER auto_confirm_user_trigger ON auth.users IS 'Trigger für automatische Benutzerbestätigung bei Registrierung';