import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthProvider';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { AlertTriangle, CheckCircle, User, Shield } from 'lucide-react';

export const AdminStatusDebug: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const adminStatus = useAdminStatus();

  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="h-5 w-5" />
          Admin-Status Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auth Status */}
        <div>
          <h4 className="font-semibold mb-2">Authentifizierung:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Auth Loading: <Badge variant={authLoading ? "secondary" : "default"}>{authLoading ? "Ja" : "Nein"}</Badge></div>
            <div>User ID: <code className="bg-gray-100 px-1 rounded">{user?.id || "Nicht angemeldet"}</code></div>
            <div>Email: <code className="bg-gray-100 px-1 rounded">{user?.email || "Keine"}</code></div>
          </div>
        </div>

        {/* Admin Status */}
        <div>
          <h4 className="font-semibold mb-2">Admin-Status:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Loading: <Badge variant={adminStatus.loading ? "secondary" : "default"}>{adminStatus.loading ? "Ja" : "Nein"}</Badge></div>
            <div>Is Admin: <Badge variant={adminStatus.isAdmin ? "default" : "destructive"}>{adminStatus.isAdmin ? "Ja" : "Nein"}</Badge></div>
            <div>Is Super Admin: <Badge variant={adminStatus.isSuperAdmin ? "default" : "destructive"}>{adminStatus.isSuperAdmin ? "Ja" : "Nein"}</Badge></div>
            <div>Is Shop User: <Badge variant={adminStatus.isShopUser ? "default" : "destructive"}>{adminStatus.isShopUser ? "Ja" : "Nein"}</Badge></div>
            <div>Is Approved: <Badge variant={adminStatus.isApproved ? "default" : "destructive"}>{adminStatus.isApproved ? "Ja" : "Nein"}</Badge></div>
            <div>User Type: <Badge variant="outline">{adminStatus.userType}</Badge></div>
          </div>
        </div>

        {/* Rollen */}
        <div>
          <h4 className="font-semibold mb-2">Rollen:</h4>
          <div className="flex flex-wrap gap-1">
            {adminStatus.roles.length > 0 ? (
              adminStatus.roles.map(role => (
                <Badge key={role} variant={role === 'super_admin' ? 'destructive' : role === 'admin' ? 'default' : 'secondary'}>
                  <Shield className="h-3 w-3 mr-1" />
                  {role}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-gray-500">Keine Rollen</Badge>
            )}
          </div>
        </div>

        {/* Berechnete Berechtigung */}
        <div>
          <h4 className="font-semibold mb-2">Berechnete Berechtigung:</h4>
          <div className="p-3 bg-white rounded border">
            {user && adminStatus.isAdmin && !adminStatus.loading ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Admin-Bereiche sollten sichtbar sein</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Admin-Bereiche sind nicht sichtbar</span>
                <div className="text-xs text-gray-500 ml-2">
                  (user: {user ? "✓" : "✗"}, isAdmin: {adminStatus.isAdmin ? "✓" : "✗"}, loading: {adminStatus.loading ? "✓" : "✗"})
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Raw Data */}
        <div>
          <h4 className="font-semibold mb-2">Raw Admin Status:</h4>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(adminStatus, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};