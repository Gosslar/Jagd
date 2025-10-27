import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthProvider';
import { Bug, RefreshCw, Database, User, Shield } from 'lucide-react';

export const AdminDebug: React.FC = () => {
  const { user, session } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    if (!user) return;
    
    setLoading(true);
    const diagnostics: any = {
      user_id: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    };

    try {
      // Check user profile
      console.log('Checking user profile...');
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles_2025_10_25_19_00')
        .select('*')
        .eq('user_id', user.id)
        .single();

      diagnostics.profile = {
        exists: !!profile,
        data: profile,
        error: profileError?.message
      };

      // Check admin roles
      console.log('Checking admin roles...');
      const { data: roles, error: rolesError } = await supabase
        .from('admin_rollen_2025_10_25_19_00')
        .select('*')
        .eq('user_id', user.id);

      diagnostics.admin_roles = {
        exists: !!(roles && roles.length > 0),
        data: roles,
        error: rolesError?.message
      };

      // Test RLS policies
      console.log('Testing RLS policies...');
      const { data: testProfiles, error: testError } = await supabase
        .from('user_profiles_2025_10_25_19_00')
        .select('*')
        .limit(5);

      diagnostics.rls_test = {
        can_read_profiles: !!testProfiles,
        profiles_count: testProfiles?.length || 0,
        error: testError?.message
      };

      // Check table existence
      console.log('Checking table existence...');
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['user_profiles_2025_10_25_19_00', 'admin_rollen_2025_10_25_19_00']);

      diagnostics.tables = {
        data: tables,
        error: tablesError?.message
      };

      setDebugInfo(diagnostics);
      console.log('Diagnostics complete:', diagnostics);

    } catch (error: any) {
      console.error('Diagnostics error:', error);
      diagnostics.general_error = error.message;
      setDebugInfo(diagnostics);
    } finally {
      setLoading(false);
    }
  };

  const quickAdminSetup = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Direkte SQL-Funktion aufrufen
      const { data, error } = await supabase.rpc('setup_admin_by_email', {
        target_email: user.email
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Admin-Setup erfolgreich!",
        description: "Sie sind jetzt Super-Administrator. Laden Sie die Seite neu.",
      });

      // Re-run diagnostics
      await runDiagnostics();

    } catch (error: any) {
      console.error('Quick setup error:', error);
      toast({
        title: "Setup fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fixUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Create or update user profile
      const { error: upsertError } = await supabase
        .from('user_profiles_2025_10_25_19_00')
        .upsert({
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          freigabe_status: 'freigegeben',
          freigabe_datum: new Date().toISOString(),
          freigabe_notiz: 'Admin-Fix - automatisch freigegeben'
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      // Create admin role
      const { error: roleError } = await supabase
        .from('admin_rollen_2025_10_25_19_00')
        .upsert({
          user_id: user.id,
          rolle: 'super_admin',
          erstellt_von: user.id
        }, {
          onConflict: 'user_id,rolle'
        });

      if (roleError) throw roleError;

      toast({
        title: "Fix erfolgreich",
        description: "Profil und Admin-Rolle wurden erstellt/aktualisiert",
      });

      // Re-run diagnostics
      await runDiagnostics();

    } catch (error: any) {
      console.error('Fix error:', error);
      toast({
        title: "Fix fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      runDiagnostics();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Nicht angemeldet</h3>
            <p className="text-gray-600">
              Bitte melden Sie sich an, um die Diagnose zu starten.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Admin-Berechtigungen Diagnose
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={runDiagnostics} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Diagnose ausführen
            </Button>
            <Button onClick={quickAdminSetup} disabled={loading} className="bg-green-600 hover:bg-green-700">
              <Shield className="h-4 w-4 mr-2" />
              Schnell-Setup (Empfohlen)
            </Button>
            <Button onClick={fixUserProfile} disabled={loading} variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Manuell reparieren
            </Button>
          </div>

          {debugInfo && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Benutzer-Informationen:</h4>
                <div className="text-sm space-y-1">
                  <div><strong>User ID:</strong> {debugInfo.user_id}</div>
                  <div><strong>E-Mail:</strong> {debugInfo.email}</div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Benutzerprofil:</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Existiert:</strong> {debugInfo.profile?.exists ? '✅ Ja' : '❌ Nein'}</div>
                  {debugInfo.profile?.data && (
                    <>
                      <div><strong>Status:</strong> {debugInfo.profile.data.freigabe_status}</div>
                      <div><strong>Freigabe-Datum:</strong> {debugInfo.profile.data.freigabe_datum || 'Nicht gesetzt'}</div>
                    </>
                  )}
                  {debugInfo.profile?.error && (
                    <div className="text-red-600"><strong>Fehler:</strong> {debugInfo.profile.error}</div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">Admin-Rollen:</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Hat Admin-Rolle:</strong> {debugInfo.admin_roles?.exists ? '✅ Ja' : '❌ Nein'}</div>
                  {debugInfo.admin_roles?.data && debugInfo.admin_roles.data.length > 0 && (
                    <div><strong>Rollen:</strong> {debugInfo.admin_roles.data.map((r: any) => r.rolle).join(', ')}</div>
                  )}
                  {debugInfo.admin_roles?.error && (
                    <div className="text-red-600"><strong>Fehler:</strong> {debugInfo.admin_roles.error}</div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold mb-2">RLS-Test:</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Kann Profile lesen:</strong> {debugInfo.rls_test?.can_read_profiles ? '✅ Ja' : '❌ Nein'}</div>
                  <div><strong>Profile gefunden:</strong> {debugInfo.rls_test?.profiles_count || 0}</div>
                  {debugInfo.rls_test?.error && (
                    <div className="text-red-600"><strong>Fehler:</strong> {debugInfo.rls_test.error}</div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold mb-2">Tabellen-Check:</h4>
                <div className="text-sm space-y-1">
                  {debugInfo.tables?.data ? (
                    <div><strong>Gefundene Tabellen:</strong> {debugInfo.tables.data.map((t: any) => t.table_name).join(', ')}</div>
                  ) : (
                    <div className="text-red-600">❌ Tabellen nicht gefunden</div>
                  )}
                  {debugInfo.tables?.error && (
                    <div className="text-red-600"><strong>Fehler:</strong> {debugInfo.tables.error}</div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Vollständige Debug-Daten:</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};