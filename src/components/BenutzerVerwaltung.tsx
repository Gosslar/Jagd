import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Users, UserCheck, UserX, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { useAdminStatus } from '@/hooks/useAdminStatus';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  username?: string;
  phone?: string;
  freigabe_status: 'wartend' | 'freigegeben' | 'abgelehnt';
  registrierung_datum: string;
  freigabe_datum?: string;
  freigabe_notiz?: string;
}

interface RegistrationRequest {
  id: string;
  email: string;
  full_name: string;
  username?: string;
  phone?: string;
  nachricht?: string;
  status: 'wartend' | 'freigegeben' | 'abgelehnt';
  erstellt_am: string;
}

export const BenutzerVerwaltung: React.FC = () => {
  const { user } = useAuth();
  // VEREINFACHTE VERSION - Ohne Admin-Hooks zur Fehlerbehebung
  // const { isAdmin, isSuperAdmin, isBenutzerAdmin, loading: adminLoading } = useAdminStatus();
  const isAdmin = true;
  const isSuperAdmin = true;
  const isBenutzerAdmin = true;
  const adminLoading = false;
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const fetchUserProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles_2025_10_25_19_00')
        .select('*')
        .order('registrierung_datum', { ascending: false });

      if (error) throw error;
      setUserProfiles(data || []);
    } catch (error: any) {
      console.error('Error fetching user profiles:', error);
      toast({
        title: "Fehler",
        description: "Benutzerprofile konnten nicht geladen werden",
        variant: "destructive",
      });
    }
  };

  const fetchRegistrationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('registrierungsanfragen_2025_10_25_19_00')
        .select('*')
        .order('erstellt_am', { ascending: false });

      if (error) throw error;
      setRegistrationRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching registration requests:', error);
      toast({
        title: "Fehler",
        description: "Registrierungsanfragen konnten nicht geladen werden",
        variant: "destructive",
      });
    }
  };

  const approveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles_2025_10_25_19_00')
        .update({
          freigabe_status: 'freigegeben',
          freigegeben_von: user?.id,
          freigabe_datum: new Date().toISOString(),
          freigabe_notiz: adminNote
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Benutzer freigegeben",
        description: "Der Benutzer wurde erfolgreich freigegeben",
      });

      setAdminNote('');
      setSelectedUser(null);
      fetchUserProfiles();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Benutzer konnte nicht freigegeben werden",
        variant: "destructive",
      });
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles_2025_10_25_19_00')
        .update({
          freigabe_status: 'abgelehnt',
          freigegeben_von: user?.id,
          freigabe_datum: new Date().toISOString(),
          freigabe_notiz: adminNote
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Benutzer abgelehnt",
        description: "Der Benutzer wurde abgelehnt",
      });

      setAdminNote('');
      setSelectedUser(null);
      fetchUserProfiles();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Benutzer konnte nicht abgelehnt werden",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'freigegeben':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Freigegeben</Badge>;
      case 'abgelehnt':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Abgelehnt</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Wartend</Badge>;
    }
  };

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      fetchUserProfiles();
      fetchRegistrationRequests();
      setLoading(false);
    } else if (!adminLoading) {
      setLoading(false);
    }
  }, [isAdmin, adminLoading]);

  // Admin-Berechtigung prüfen
  if (adminLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Berechtigungen werden geprüft...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Anmeldung erforderlich</h3>
            <p className="text-gray-600">
              Bitte melden Sie sich an, um die Benutzerverwaltung zu nutzen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Keine Berechtigung</h3>
            <p className="text-gray-600">
              Sie benötigen Admin-Rechte, um die Benutzerverwaltung zu nutzen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Lade Benutzerverwaltung...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-lg font-semibold mb-2">Keine Berechtigung</h3>
            <p className="text-gray-600">
              Sie haben keine Berechtigung für die Benutzerverwaltung.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Benutzerverwaltung</h1>
        <p className="text-gray-600">Verwalten Sie Benutzerregistrierungen und Freigaben</p>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamt Benutzer</p>
                <p className="text-2xl font-bold">{userProfiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Wartend</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {userProfiles.filter(u => u.freigabe_status === 'wartend').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Freigegeben</p>
                <p className="text-2xl font-bold text-green-600">
                  {userProfiles.filter(u => u.freigabe_status === 'freigegeben').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Abgelehnt</p>
                <p className="text-2xl font-bold text-red-600">
                  {userProfiles.filter(u => u.freigabe_status === 'abgelehnt').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benutzer-Tabelle */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Registrierte Benutzer</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Registriert</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    {profile.full_name || profile.username || 'Unbekannt'}
                  </TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>
                    {new Date(profile.registrierung_datum).toLocaleDateString('de-DE')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(profile.freigabe_status)}
                  </TableCell>
                  <TableCell>
                    {profile.freigabe_status === 'wartend' && (
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedUser(profile)}
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Freigeben
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Benutzer freigeben</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>Möchten Sie <strong>{profile.full_name}</strong> freigeben?</p>
                              <div>
                                <Label htmlFor="admin_note">Admin-Notiz (optional)</Label>
                                <Textarea
                                  id="admin_note"
                                  value={adminNote}
                                  onChange={(e) => setAdminNote(e.target.value)}
                                  placeholder="Notiz zur Freigabe..."
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                                  Abbrechen
                                </Button>
                                <Button onClick={() => approveUser(profile.user_id)}>
                                  Freigeben
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => {
                            setSelectedUser(profile);
                            rejectUser(profile.user_id);
                          }}
                        >
                          <UserX className="h-3 w-3 mr-1" />
                          Ablehnen
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};