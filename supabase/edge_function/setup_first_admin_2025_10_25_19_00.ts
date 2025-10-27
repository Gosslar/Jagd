import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('=== Setup First Admin ===');
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Keine Authentifizierung' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Ungültiger Benutzer' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User ID:', user.id);
    console.log('User Email:', user.email);

    // Check if user profile exists, create if not
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('user_profiles_2025_10_25_19_00')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileCheckError && profileCheckError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      console.log('Creating user profile...');
      const { error: createProfileError } = await supabase
        .from('user_profiles_2025_10_25_19_00')
        .insert({
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          freigabe_status: 'freigegeben', // Auto-approve first admin
          freigabe_datum: new Date().toISOString(),
          freigabe_notiz: 'Erster Administrator - automatisch freigegeben'
        });

      if (createProfileError) {
        console.error('Error creating profile:', createProfileError);
        return new Response(
          JSON.stringify({ error: 'Fehler beim Erstellen des Profils', details: createProfileError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (existingProfile) {
      // Update existing profile to approved
      console.log('Updating existing profile...');
      const { error: updateProfileError } = await supabase
        .from('user_profiles_2025_10_25_19_00')
        .update({
          freigabe_status: 'freigegeben',
          freigabe_datum: new Date().toISOString(),
          freigabe_notiz: 'Administrator - automatisch freigegeben'
        })
        .eq('user_id', user.id);

      if (updateProfileError) {
        console.error('Error updating profile:', updateProfileError);
        return new Response(
          JSON.stringify({ error: 'Fehler beim Aktualisieren des Profils', details: updateProfileError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check if admin role exists
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('admin_rollen_2025_10_25_19_00')
      .select('*')
      .eq('user_id', user.id)
      .eq('rolle', 'super_admin')
      .single();

    if (roleCheckError && roleCheckError.code === 'PGRST116') {
      // Role doesn't exist, create it
      console.log('Creating super admin role...');
      const { error: createRoleError } = await supabase
        .from('admin_rollen_2025_10_25_19_00')
        .insert({
          user_id: user.id,
          rolle: 'super_admin',
          erstellt_von: user.id
        });

      if (createRoleError) {
        console.error('Error creating admin role:', createRoleError);
        return new Response(
          JSON.stringify({ error: 'Fehler beim Erstellen der Admin-Rolle', details: createRoleError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Verify the setup
    const { data: finalProfile } = await supabase
      .from('user_profiles_2025_10_25_19_00')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: finalRole } = await supabase
      .from('admin_rollen_2025_10_25_19_00')
      .select('*')
      .eq('user_id', user.id)
      .eq('rolle', 'super_admin')
      .single();

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Super-Admin erfolgreich eingerichtet',
        user_id: user.id,
        email: user.email,
        profile_status: finalProfile?.freigabe_status,
        admin_role: finalRole?.rolle,
        setup_complete: true
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('General error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Fehler beim Setup',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});