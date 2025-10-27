import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';
import { User, Copy, Database, Settings, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const UserInfo: React.FC = () => {
  const { user, session, checkApprovalStatus } = useAuth();
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Kopiert!",
        description: "User-ID wurde in die Zwischenablage kopiert",
      });
    });
  };

  const setupFirstAdmin = async () => {
    if (!user) return;
    
    setSetupLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup_first_admin_2025_10_25_19_00', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        }
      });

      if (error) {
        console.error('Setup error:', error);
        throw new Error(error.message || 'Fehler beim Setup');
      }

      if (data?.error) {
        console.error('Edge function error:', data);
        throw new Error(data.details || data.error || 'Setup fehlgeschlagen');
      }

      toast({
        title: "Setup erfolgreich!",
        description: "Sie sind jetzt Super-Administrator. Laden Sie die Seite neu.",
      });

      setSetupComplete(true);
      
      // Refresh approval status
      if (checkApprovalStatus) {
        await checkApprovalStatus();
      }

    } catch (error: any) {
      console.error('Setup failed:', error);
      toast({
        title: "Setup fehlgeschlagen",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setSetupLoading(false);
    }
  };

  const copyAdminSQL = () => {
    if (!user) return;
    
    const sql = `-- Setzen Sie sich als Super-Admin
INSERT INTO public.admin_rollen_2025_10_25_19_00 (user_id, rolle, erstellt_von) 
VALUES ('${user.id}', 'super_admin', '${user.id}');

-- Geben Sie sich selbst frei
UPDATE public.user_profiles_2025_10_25_19_00 
SET freigabe_status = 'freigegeben', freigabe_datum = NOW() 
WHERE user_id = '${user.id}';`;

    navigator.clipboard.writeText(sql).then(() => {
      toast({
        title: "SQL kopiert!",
        description: "Admin-Setup SQL wurde in die Zwischenablage kopiert",
      });
    });
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Nicht angemeldet</h3>
            <p className="text-gray-600">
              Bitte melden Sie sich an, um Ihre User-ID zu sehen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Benutzer-Informationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Ihre User-ID:</h4>
            <div className="flex items-center gap-2">
              <code className="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">
                {user.id}
              </code>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard(user.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Weitere Informationen:</h4>
            <div className="space-y-2 text-sm">
              <div><strong>E-Mail:</strong> {user.email}</div>
              <div><strong>Erstellt:</strong> {new Date(user.created_at).toLocaleString('de-DE')}</div>
              <div><strong>Letzter Login:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('de-DE') : 'Nie'}</div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Automatisches Admin-Setup
            </h4>
            <p className="text-sm text-green-800 mb-3">
              Klicken Sie hier, um sich automatisch als Super-Administrator einzurichten:
            </p>
            <Button 
              onClick={setupFirstAdmin}
              disabled={setupLoading || setupComplete}
              className="mb-3"
            >
              {setupLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setup läuft...
                </>
              ) : setupComplete ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Setup abgeschlossen
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Als Admin einrichten
                </>
              )}
            </Button>
            {setupComplete && (
              <div className="p-2 bg-white rounded border text-sm text-green-800">
                ✅ Sie sind jetzt Super-Administrator! Laden Sie die Seite neu, um die Benutzerverwaltung zu nutzen.
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Manuelles Setup (Alternative)
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Falls das automatische Setup nicht funktioniert, können Sie diesen SQL-Code manuell in der Supabase-Konsole ausführen:
            </p>
            <div className="bg-white p-3 rounded border">
              <pre className="text-xs text-gray-800 whitespace-pre-wrap">
{`-- Setzen Sie sich als Super-Admin
INSERT INTO public.admin_rollen_2025_10_25_19_00 (user_id, rolle, erstellt_von) 
VALUES ('${user.id}', 'super_admin', '${user.id}');

-- Geben Sie sich selbst frei
UPDATE public.user_profiles_2025_10_25_19_00 
SET freigabe_status = 'freigegeben', freigabe_datum = NOW() 
WHERE user_id = '${user.id}';`}
              </pre>
            </div>
            <Button 
              className="mt-3" 
              onClick={copyAdminSQL}
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              SQL kopieren
            </Button>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Anleitung:</h4>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Kopieren Sie den SQL-Code oben</li>
              <li>Gehen Sie zu Ihrer Supabase-Konsole</li>
              <li>Öffnen Sie den SQL-Editor</li>
              <li>Fügen Sie den Code ein und führen Sie ihn aus</li>
              <li>Laden Sie diese Seite neu</li>
              <li>Sie haben jetzt Admin-Rechte!</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};