import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Ban
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  telefon?: string;
  adresse?: string;
  freigabe_status: string;
  benutzer_typ: string;
  aktiv: boolean;
  erstellt_am: string;
  letzter_login?: string;
  notizen?: string;
  roles: string[];
}

export const ErweiterteBenutzerverwaltung: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin, isSuperAdmin, loading: adminLoading } = useAdminStatus();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [filter, setFilter] = useState<string>('alle');

  useEffect(() => {
    if (!adminLoading && isAdmin) {
      loadUsers();
    }
  }, [isAdmin, adminLoading]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Lade Benutzerprofile
      const { data: profiles, error: profilesError } = await supabase
        .from('benutzer_profile_2025_10_31_11_00')
        .select('*')
        .order('erstellt_am', { ascending: false });

      if (profilesError) throw profilesError;

      // Lade Rollen für alle Benutzer
      const { data: roles, error: rolesError } = await supabase
        .from('benutzer_rollen_2025_10_31_11_00')
        .select('user_id, rolle')
        .eq('aktiv', true);

      if (rolesError) throw rolesError;

      // Kombiniere Profile mit Rollen
      const usersWithRoles = (profiles || []).map(profile => ({
        ...profile,
        roles: (roles || [])
          .filter(role => role.user_id === profile.user_id)
          .map(role => role.rolle)
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Fehler beim Laden der Benutzer:', error);
      toast({
        title: "Fehler beim Laden",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Verwende die korrigierte Funktion die Key Constraint Violations vermeidet
      const { error } = await supabase.rpc('set_user_role_fixed', {
        target_user_id: userId,
        new_role: newRole
      });

      if (error) throw error;

      toast({
        title: "Rolle aktualisiert",
        description: `Benutzer wurde als ${getRoleLabel(newRole)} eingestuft.`,
      });

      loadUsers();
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren der Rolle:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const approveUser = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('approve_user', {
        target_user_id: userId
      });

      if (error) throw error;

      toast({
        title: "Benutzer freigegeben",
        description: "Der Benutzer wurde erfolgreich freigegeben.",
      });

      loadUsers();
    } catch (error: any) {
      console.error('Fehler beim Freigeben:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Keine Berechtigung",
        description: "Nur Super-Admins können Benutzer löschen.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('delete_user_complete', {
        target_user_id: userId
      });

      if (error) throw error;

      toast({
        title: "Benutzer gelöscht",
        description: "Der Benutzer wurde vollständig gelöscht.",
      });

      setDeleteDialog(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      console.error('Fehler beim Löschen:', error);
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('benutzer_profile_2025_10_31_11_00')
        .update({ freigabe_status: status })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Status aktualisiert",
        description: `Benutzerstatus wurde auf "${getStatusLabel(status)}" gesetzt.`,
      });

      loadUsers();
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren des Status:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super-Admin';
      case 'admin': return 'Administrator';
      case 'shop_user': return 'Shop-Benutzer';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'wartend': return 'Wartend';
      case 'freigegeben': return 'Freigegeben';
      case 'abgelehnt': return 'Abgelehnt';
      case 'gesperrt': return 'Gesperrt';
      default: return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'wartend':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Wartend
        </Badge>;
      case 'freigegeben':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Freigegeben
        </Badge>;
      case 'abgelehnt':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Abgelehnt
        </Badge>;
      case 'gesperrt':
        return <Badge variant="destructive" className="flex items-center gap-1 bg-orange-600">
          <Ban className="h-3 w-3" />
          Gesperrt
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadges = (roles: string[]) => {
    return roles.map(role => {
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      let icon = <Shield className="h-3 w-3" />;
      
      if (role === 'super_admin') {
        variant = "destructive";
        icon = <ShieldCheck className="h-3 w-3" />;
      } else if (role === 'admin') {
        variant = "default";
        icon = <Shield className="h-3 w-3" />;
      } else if (role === 'shop_user') {
        variant = "secondary";
        icon = <Users className="h-3 w-3" />;
      }

      return (
        <Badge key={role} variant={variant} className="flex items-center gap-1 mr-1">
          {icon}
          {getRoleLabel(role)}
        </Badge>
      );
    });
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'alle') return true;
    if (filter === 'admin') return user.roles.includes('admin') || user.roles.includes('super_admin');
    if (filter === 'shop_user') return user.roles.includes('shop_user');
    if (filter === 'wartend') return user.freigabe_status === 'wartend';
    if (filter === 'freigegeben') return user.freigabe_status === 'freigegeben';
    return true;
  });

  if (adminLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mr-2" />
          <span>Lade Berechtigungen...</span>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Sie haben keine Berechtigung, die Benutzerverwaltung zu verwenden.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Erweiterte Benutzerverwaltung
            {isSuperAdmin && (
              <Badge variant="destructive" className="ml-2">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Super-Admin
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={filter === 'alle' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('alle')}
            >
              Alle ({users.length})
            </Button>
            <Button
              variant={filter === 'admin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('admin')}
            >
              <Shield className="h-4 w-4 mr-1" />
              Admins ({users.filter(u => u.roles.includes('admin') || u.roles.includes('super_admin')).length})
            </Button>
            <Button
              variant={filter === 'shop_user' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('shop_user')}
            >
              <Users className="h-4 w-4 mr-1" />
              Shop-User ({users.filter(u => u.roles.includes('shop_user')).length})
            </Button>
            <Button
              variant={filter === 'wartend' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('wartend')}
            >
              <Clock className="h-4 w-4 mr-1" />
              Wartend ({users.filter(u => u.freigabe_status === 'wartend').length})
            </Button>
            <Button
              variant={filter === 'freigegeben' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('freigegeben')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Freigegeben ({users.filter(u => u.freigabe_status === 'freigegeben').length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadUsers}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          </div>

          {/* Benutzer-Tabelle */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Benutzer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rollen</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Erstellt</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Lade Benutzer...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Keine Benutzer gefunden
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name || 'Unbekannt'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.telefon && (
                            <div className="text-xs text-gray-400">{user.telefon}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.freigabe_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length > 0 ? getRoleBadges(user.roles) : (
                            <Badge variant="outline" className="text-gray-500">
                              Keine Rolle
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.benutzer_typ === 'admin' ? 'default' : 'secondary'}>
                          {user.benutzer_typ === 'admin' ? 'Administrator' : 'Shop-Benutzer'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.erstellt_am).toLocaleDateString('de-DE')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {user.freigabe_status === 'wartend' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => approveUser(user.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Benutzer-Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <div className="font-medium">{selectedUser.full_name || 'Nicht angegeben'}</div>
                                    </div>
                                    <div>
                                      <Label>E-Mail</Label>
                                      <div className="font-medium">{selectedUser.email}</div>
                                    </div>
                                    <div>
                                      <Label>Telefon</Label>
                                      <div>{selectedUser.telefon || 'Nicht angegeben'}</div>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <div>{getStatusBadge(selectedUser.freigabe_status)}</div>
                                    </div>
                                  </div>
                                  
                                  {selectedUser.adresse && (
                                    <div>
                                      <Label>Adresse</Label>
                                      <div className="whitespace-pre-wrap">{selectedUser.adresse}</div>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <Label>Rollen</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {getRoleBadges(selectedUser.roles)}
                                    </div>
                                  </div>
                                  
                                  {selectedUser.notizen && (
                                    <div>
                                      <Label>Notizen</Label>
                                      <div className="whitespace-pre-wrap text-sm">{selectedUser.notizen}</div>
                                    </div>
                                  )}
                                  
                                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div>
                                      <Label>Erstellt am</Label>
                                      <div>{new Date(selectedUser.erstellt_am).toLocaleString('de-DE')}</div>
                                    </div>
                                    {selectedUser.letzter_login && (
                                      <div>
                                        <Label>Letzter Login</Label>
                                        <div>{new Date(selectedUser.letzter_login).toLocaleString('de-DE')}</div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Admin-Aktionen */}
                                  <div className="border-t pt-4 space-y-3">
                                    <Label>Admin-Aktionen</Label>
                                    
                                    <div className="flex flex-wrap gap-2">
                                      {/* Rolle ändern */}
                                      <Select onValueChange={(value) => updateUserRole(selectedUser.id, value)}>
                                        <SelectTrigger className="w-48">
                                          <SelectValue placeholder="Rolle zuweisen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="shop_user">Shop-Benutzer</SelectItem>
                                          <SelectItem value="admin">Administrator</SelectItem>
                                          {isSuperAdmin && (
                                            <SelectItem value="super_admin">Super-Admin</SelectItem>
                                          )}
                                        </SelectContent>
                                      </Select>
                                      
                                      {/* Status ändern */}
                                      <Select onValueChange={(value) => updateUserStatus(selectedUser.id, value)}>
                                        <SelectTrigger className="w-48">
                                          <SelectValue placeholder="Status ändern" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="freigegeben">Freigeben</SelectItem>
                                          <SelectItem value="wartend">Auf Wartend setzen</SelectItem>
                                          <SelectItem value="gesperrt">Sperren</SelectItem>
                                          <SelectItem value="abgelehnt">Ablehnen</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      
                                      {/* Benutzer löschen (nur Super-Admin) */}
                                      {isSuperAdmin && (
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                            setDeleteDialog(true);
                                          }}
                                        >
                                          <Trash2 className="h-3 w-3 mr-1" />
                                          Löschen
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Lösch-Bestätigung */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Benutzer löschen
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Warnung:</strong> Diese Aktion kann nicht rückgängig gemacht werden. 
                Alle Daten des Benutzers werden permanent gelöscht.
              </AlertDescription>
            </Alert>
            
            {selectedUser && (
              <div>
                <p>Möchten Sie den Benutzer <strong>{selectedUser.full_name}</strong> ({selectedUser.email}) wirklich löschen?</p>
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteDialog(false)}>
                Abbrechen
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedUser && deleteUser(selectedUser.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Endgültig löschen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};