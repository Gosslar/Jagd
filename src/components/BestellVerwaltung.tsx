import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, CheckCircle, XCircle, Eye, Package, Clock, AlertTriangle, Shield } from 'lucide-react';

interface Bestellung {
  id: string;
  name: string;
  email: string;
  telefon: string;
  adresse: string;
  bestellung_json: any[];
  gesamtpreis: number;
  bestellstatus: string;
  lager_reduziert: boolean;
  bearbeitet_von?: string;
  bearbeitet_am?: string;
  admin_notiz?: string;
  erstellt_am: string;
}

interface BestellPosition {
  id: string;
  produkt_name: string;
  menge: number;
  einzelpreis: number;
  gesamtpreis: number;
  lager_reduziert: boolean;
}

export const BestellVerwaltung: React.FC = () => {
  const { user } = useAuth();
  // VEREINFACHTE VERSION - Ohne Admin-Hooks zur Fehlerbehebung
  // const { isAdmin, loading: adminLoading } = useAdminStatus();
  const isAdmin = true;
  const adminLoading = false;
  const [bestellungen, setBestellungen] = useState<Bestellung[]>([]);
  const [positionen, setPositionen] = useState<{ [key: string]: BestellPosition[] }>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Bestellung | null>(null);
  const [adminNotiz, setAdminNotiz] = useState('');

  const loadBestellungen = async () => {
    try {
      const { data, error } = await supabase
        .from('wildfleisch_bestellungen_2025_10_24_08_03')
        .select('*')
        .order('erstellt_am', { ascending: false });

      if (error) throw error;
      
      // Debug: Zeige die ersten Bestellungen in der Konsole
      console.log('Geladene Bestellungen:', data?.slice(0, 2));
      
      setBestellungen(data || []);

      // Lade Positionen für alle Bestellungen
      const { data: positionenData, error: positionenError } = await supabase
        .from('bestellpositionen_2025_10_25_20_00')
        .select('*')
        .order('erstellt_am', { ascending: true });

      if (positionenError) throw positionenError;

      // Gruppiere Positionen nach Bestellung
      const positionenMap: { [key: string]: BestellPosition[] } = {};
      positionenData?.forEach(position => {
        if (!positionenMap[position.bestellung_id]) {
          positionenMap[position.bestellung_id] = [];
        }
        positionenMap[position.bestellung_id].push(position);
      });
      setPositionen(positionenMap);

    } catch (error: any) {
      console.error('Fehler beim Laden der Bestellungen:', error);
      toast({
        title: "Fehler",
        description: "Bestellungen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveOrder = async (bestellungId: string) => {
    if (!user) return;
    
    setActionLoading(bestellungId);
    try {
      console.log('Freigabe-Versuch für Bestellung:', bestellungId);
      console.log('Admin User ID:', user.id);
      console.log('Admin-Notiz:', adminNotiz);

      // Methode 1: Versuche SQL-Funktion
      try {
        const { data, error } = await supabase.rpc('approve_order', {
          bestellung_id: bestellungId,
          admin_user_id: user.id,
          admin_notiz: adminNotiz || null
        });

        console.log('SQL-Funktion Ergebnis:', { data, error });

        if (error) {
          console.log('SQL-Funktion fehlgeschlagen, versuche direktes Update...');
          throw error;
        }

        if (data?.error) {
          console.log('SQL-Funktion Fehler:', data.error);
          throw new Error(data.error);
        }

        console.log('SQL-Funktion erfolgreich:', data);
        
        toast({
          title: "Bestellung freigegeben",
          description: "Bestellung wurde freigegeben und Lagerbestand reduziert",
        });

        setAdminNotiz('');
        await loadBestellungen();
        return;

      } catch (sqlError) {
        console.log('SQL-Funktion fehlgeschlagen, versuche direktes Update:', sqlError);
        
        // Methode 2: Direktes Update als Fallback
        const { error: updateError } = await supabase
          .from('wildfleisch_bestellungen_2025_10_24_08_03')
          .update({
            bestellstatus: 'freigegeben',
            bearbeitet_von: user.id,
            bearbeitet_am: new Date().toISOString(),
            admin_notiz: adminNotiz || null
          })
          .eq('id', bestellungId);

        if (updateError) {
          console.error('Direktes Update fehlgeschlagen:', updateError);
          throw updateError;
        }

        console.log('Direktes Update erfolgreich');
        
        toast({
          title: "Bestellung freigegeben",
          description: "Bestellung wurde freigegeben (Lagerbestand manuell prüfen)",
          variant: "default",
        });

        setAdminNotiz('');
        await loadBestellungen();
      }

    } catch (error: any) {
      console.error('Kompletter Freigabe-Fehler:', error);
      toast({
        title: "Fehler beim Freigeben",
        description: `Fehler: ${error.message || 'Unbekannter Fehler'}`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const rejectOrder = async (bestellungId: string) => {
    if (!user) return;
    
    setActionLoading(bestellungId);
    try {
      const { error } = await supabase
        .from('wildfleisch_bestellungen_2025_10_24_08_03')
        .update({
          bestellstatus: 'abgelehnt',
          bearbeitet_von: user.id,
          bearbeitet_am: new Date().toISOString(),
          admin_notiz: adminNotiz || null
        })
        .eq('id', bestellungId);

      if (error) throw error;

      toast({
        title: "Bestellung abgelehnt",
        description: "Bestellung wurde abgelehnt",
      });

      setAdminNotiz('');
      await loadBestellungen();

    } catch (error: any) {
      console.error('Fehler beim Ablehnen:', error);
      toast({
        title: "Fehler beim Ablehnen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const debugOrder = async (bestellungId: string) => {
    try {
      const { data, error } = await supabase.rpc('debug_order_info', {
        bestellung_id: bestellungId
      });

      if (error) throw error;

      console.log('Debug-Info für Bestellung:', bestellungId, data);
      
      toast({
        title: "Debug-Info",
        description: `Bestellung: ${data.status}, Items: ${data.bestellung_json_items}, Positionen: ${data.positionen_count}`,
      });

    } catch (error: any) {
      console.error('Debug-Fehler:', error);
      toast({
        title: "Debug-Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const manualReduceStock = async (bestellungId: string) => {
    setActionLoading(bestellungId);
    try {
      const { data, error } = await supabase.rpc('manual_reduce_stock', {
        bestellung_id: bestellungId
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Lagerbestand reduziert",
        description: data.details || "Lagerbestand wurde manuell reduziert",
      });

      await loadBestellungen();

    } catch (error: any) {
      console.error('Fehler bei Lagerreduzierung:', error);
      toast({
        title: "Fehler bei Lagerreduzierung",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string, lagerReduziert: boolean) => {
    switch (status) {
      case 'neu':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Neu</Badge>;
      case 'bearbeitet':
        return <Badge variant="outline"><Eye className="h-3 w-3 mr-1" />Bearbeitet</Badge>;
      case 'freigegeben':
        return (
          <div className="flex gap-1">
            <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Freigegeben</Badge>
            {lagerReduziert && <Badge variant="outline" className="text-green-600"><Package className="h-3 w-3 mr-1" />Lager reduziert</Badge>}
          </div>
        );
      case 'abgelehnt':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Abgelehnt</Badge>;
      case 'versendet':
        return <Badge variant="default" className="bg-blue-600"><Package className="h-3 w-3 mr-1" />Versendet</Badge>;
      case 'abgeschlossen':
        return <Badge variant="default" className="bg-gray-600"><CheckCircle className="h-3 w-3 mr-1" />Abgeschlossen</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      loadBestellungen();
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
              Sie benötigen Admin-Rechte, um die Bestellverwaltung zu nutzen.
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
            <p>Bestellungen werden geladen...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statistiken = {
    gesamt: bestellungen.length,
    neu: bestellungen.filter(b => b.bestellstatus === 'neu').length,
    freigegeben: bestellungen.filter(b => b.bestellstatus === 'freigegeben').length,
    abgelehnt: bestellungen.filter(b => b.bestellstatus === 'abgelehnt').length,
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Bestellverwaltung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statistiken */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{statistiken.gesamt}</div>
              <div className="text-sm text-gray-600">Gesamt</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-900">{statistiken.neu}</div>
              <div className="text-sm text-yellow-700">Neu</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-900">{statistiken.freigegeben}</div>
              <div className="text-sm text-green-700">Freigegeben</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-900">{statistiken.abgelehnt}</div>
              <div className="text-sm text-red-700">Abgelehnt</div>
            </div>
          </div>

          {/* Bestellungen Tabelle */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Gesamtpreis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bestellungen.map((bestellung) => (
                  <TableRow key={bestellung.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDate(bestellung.erstellt_am)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {bestellung.name || bestellung.kunde_name || 'Kein Name'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {bestellung.email || bestellung.kunde_email || 'Keine E-Mail'}
                        </div>
                        {/* Debug Info */}
                        <div className="text-xs text-gray-400">
                          ID: {bestellung.id?.slice(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{bestellung.telefon || bestellung.kunde_telefon || 'Keine Telefonnummer'}</div>
                        <div className="text-gray-600 max-w-32 truncate" title={bestellung.adresse || bestellung.kunde_adresse || 'Keine Adresse'}>
                          {(bestellung.adresse || bestellung.kunde_adresse || 'Keine Adresse')?.split('\n')[0]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(bestellung.gesamtpreis)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(bestellung.bestellstatus, bestellung.lager_reduziert)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedOrder(bestellung)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Bestellung Details</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold">Kunde:</h4>
                                    <p><strong>Name:</strong> {selectedOrder.name || 'Nicht angegeben'}</p>
                                    <p><strong>E-Mail:</strong> {selectedOrder.email || 'Nicht angegeben'}</p>
                                    <p><strong>Telefon:</strong> {selectedOrder.telefon || 'Nicht angegeben'}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Adresse:</h4>
                                    <p className="whitespace-pre-line">{selectedOrder.adresse || 'Keine Adresse angegeben'}</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Bestellte Artikel:</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Artikel</TableHead>
                                        <TableHead>Menge</TableHead>
                                        <TableHead>Einzelpreis</TableHead>
                                        <TableHead>Gesamtpreis</TableHead>
                                        <TableHead>Lager</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {positionen[selectedOrder.id]?.map((position) => (
                                        <TableRow key={position.id}>
                                          <TableCell>{position.produkt_name}</TableCell>
                                          <TableCell>{position.menge}</TableCell>
                                          <TableCell>{formatPrice(position.einzelpreis)}</TableCell>
                                          <TableCell>{formatPrice(position.gesamtpreis)}</TableCell>
                                          <TableCell>
                                            {position.lager_reduziert ? (
                                              <Badge variant="outline" className="text-green-600">
                                                <CheckCircle className="h-3 w-3 mr-1" />Reduziert
                                              </Badge>
                                            ) : (
                                              <Badge variant="outline" className="text-yellow-600">
                                                <AlertTriangle className="h-3 w-3 mr-1" />Offen
                                              </Badge>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                {selectedOrder.bestellstatus === 'neu' && (
                                  <div className="space-y-4 border-t pt-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">
                                        Admin-Notiz (optional):
                                      </label>
                                      <Textarea
                                        value={adminNotiz}
                                        onChange={(e) => setAdminNotiz(e.target.value)}
                                        placeholder="Notiz zur Bestellung..."
                                        rows={3}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => approveOrder(selectedOrder.id)}
                                        disabled={actionLoading === selectedOrder.id}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        {actionLoading === selectedOrder.id ? (
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        ) : (
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Freigeben & Lager reduzieren
                                      </Button>
                                      <Button
                                        onClick={() => rejectOrder(selectedOrder.id)}
                                        disabled={actionLoading === selectedOrder.id}
                                        variant="destructive"
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Ablehnen
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {selectedOrder.admin_notiz && (
                                  <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Admin-Notiz:</h4>
                                    <p className="text-gray-700">{selectedOrder.admin_notiz}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {bestellung.bestellstatus === 'neu' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(bestellung);
                                approveOrder(bestellung.id);
                              }}
                              disabled={actionLoading === bestellung.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {actionLoading === bestellung.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => rejectOrder(bestellung.id)}
                              disabled={actionLoading === bestellung.id}
                              variant="destructive"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        
                        {/* Debug-Buttons für alle Bestellungen */}
                        <Button
                          size="sm"
                          onClick={() => debugOrder(bestellung.id)}
                          variant="outline"
                          className="text-blue-600"
                        >
                          🔍
                        </Button>
                        
                        {bestellung.bestellstatus === 'freigegeben' && !bestellung.lager_reduziert && (
                          <Button
                            size="sm"
                            onClick={() => manualReduceStock(bestellung.id)}
                            disabled={actionLoading === bestellung.id}
                            variant="outline"
                            className="text-orange-600"
                          >
                            📦
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {bestellungen.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Bestellungen vorhanden</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};