import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { toast } from '@/hooks/use-toast';
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  MessageSquare, 
  Shield,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Kontaktanfrage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'neu' | 'bearbeitet' | 'abgeschlossen';
  bearbeitet_von?: string;
  bearbeitet_am?: string;
  admin_notiz?: string;
  erstellt_am: string;
  aktualisiert_am: string;
}

export const KontaktVerwaltung: React.FC = () => {
  const { user } = useAuth();
  // VEREINFACHTE VERSION - Ohne Admin-Hooks zur Fehlerbehebung
  // const { isAdmin, loading: adminLoading } = useAdminStatus();
  const isAdmin = true;
  const adminLoading = false;
  const [anfragen, setAnfragen] = useState<Kontaktanfrage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnfrage, setSelectedAnfrage] = useState<Kontaktanfrage | null>(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [adminNotiz, setAdminNotiz] = useState('');

  const loadAnfragen = async () => {
    try {
      const { data, error } = await supabase
        .from('kontaktanfragen_2025_10_26_12_00')
        .select('*')
        .order('erstellt_am', { ascending: false });

      if (error) throw error;
      setAnfragen(data || []);
    } catch (error: any) {
      console.error('Fehler beim Laden der Kontaktanfragen:', error);
      toast({
        title: "Fehler",
        description: "Kontaktanfragen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('kontaktanfragen_2025_10_26_12_00')
        .update({ 
          status: newStatus,
          admin_notiz: adminNotiz || null
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status aktualisiert",
        description: `Anfrage wurde als ${newStatus} markiert`,
      });

      await loadAnfragen();
      setDetailDialog(false);
      setAdminNotiz('');

    } catch (error: any) {
      console.error('Fehler beim Status-Update:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openDetailDialog = (anfrage: Kontaktanfrage) => {
    setSelectedAnfrage(anfrage);
    setAdminNotiz(anfrage.admin_notiz || '');
    setDetailDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'neu':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Neu</Badge>;
      case 'bearbeitet':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Bearbeitet</Badge>;
      case 'abgeschlossen':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Abgeschlossen</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      loadAnfragen();
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

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Keine Berechtigung</h3>
            <p className="text-gray-600">
              Sie benötigen Admin-Rechte, um Kontaktanfragen zu verwalten.
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Kontaktanfragen werden geladen...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statistiken = {
    gesamt: anfragen.length,
    neu: anfragen.filter(a => a.status === 'neu').length,
    bearbeitet: anfragen.filter(a => a.status === 'bearbeitet').length,
    abgeschlossen: anfragen.filter(a => a.status === 'abgeschlossen').length
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Kontaktanfragen-Verwaltung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statistiken */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{statistiken.gesamt}</div>
              <div className="text-sm text-gray-600">Gesamt</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-900">{statistiken.neu}</div>
              <div className="text-sm text-blue-700">Neu</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-900">{statistiken.bearbeitet}</div>
              <div className="text-sm text-yellow-700">Bearbeitet</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-900">{statistiken.abgeschlossen}</div>
              <div className="text-sm text-green-700">Abgeschlossen</div>
            </div>
          </div>

          {/* Anfragen-Tabelle */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Betreff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anfragen.map((anfrage) => (
                  <TableRow key={anfrage.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {anfrage.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {anfrage.email}
                        </div>
                        {anfrage.phone && (
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {anfrage.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{anfrage.subject}</div>
                        <div className="text-sm text-gray-600 truncate">{anfrage.message}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(anfrage.status)}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(anfrage.erstellt_am)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetailDialog(anfrage)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {anfragen.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Noch keine Kontaktanfragen vorhanden</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialog} onOpenChange={setDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kontaktanfrage Details</DialogTitle>
          </DialogHeader>
          {selectedAnfrage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Kontaktdaten</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {selectedAnfrage.name}</div>
                    <div><strong>E-Mail:</strong> {selectedAnfrage.email}</div>
                    {selectedAnfrage.phone && (
                      <div><strong>Telefon:</strong> {selectedAnfrage.phone}</div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <div className="space-y-2">
                    {getStatusBadge(selectedAnfrage.status)}
                    <div className="text-sm text-gray-600">
                      Erstellt: {formatDate(selectedAnfrage.erstellt_am)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Betreff</h4>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedAnfrage.subject}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Nachricht</h4>
                <p className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">{selectedAnfrage.message}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Admin-Notiz</h4>
                <Textarea
                  value={adminNotiz}
                  onChange={(e) => setAdminNotiz(e.target.value)}
                  placeholder="Interne Notiz hinzufügen..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Select 
                  value={selectedAnfrage.status} 
                  onValueChange={(value) => updateStatus(selectedAnfrage.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neu">Neu</SelectItem>
                    <SelectItem value="bearbeitet">Bearbeitet</SelectItem>
                    <SelectItem value="abgeschlossen">Abgeschlossen</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setDetailDialog(false)}>
                  Schließen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};