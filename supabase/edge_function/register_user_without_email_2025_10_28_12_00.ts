import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password, userData } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'E-Mail und Passwort sind erforderlich' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Supabase Admin Client für Benutzerregistrierung
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Benutzer direkt erstellen ohne E-Mail-Bestätigung
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // E-Mail als bestätigt markieren
      user_metadata: userData || {}
    });

    if (createError) {
      console.error('Fehler beim Erstellen des Benutzers:', createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Benutzerprofil in user_profiles erstellen
    if (user.user) {
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles_2025_10_25_19_00')
        .insert({
          user_id: user.user.id,
          email: email,
          full_name: userData?.full_name || '',
          freigabe_status: 'wartend',
          erstellt_am: new Date().toISOString()
        });

      if (profileError) {
        console.error('Fehler beim Erstellen des Profils:', profileError);
        // Benutzer trotzdem erfolgreich erstellt, nur Profil fehlt
      }

      // Registrierungsanfrage erstellen
      const { error: requestError } = await supabaseAdmin
        .from('registrierungsanfragen_2025_10_25_19_00')
        .insert({
          user_id: user.user.id,
          email: email,
          full_name: userData?.full_name || '',
          status: 'wartend',
          erstellt_am: new Date().toISOString()
        });

      if (requestError) {
        console.error('Fehler beim Erstellen der Registrierungsanfrage:', requestError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Benutzer erfolgreich registriert',
        user: {
          id: user.user?.id,
          email: user.user?.email
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unerwarteter Fehler:', error);
    return new Response(
      JSON.stringify({ error: 'Interner Serverfehler' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});