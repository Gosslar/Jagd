import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Eye, Trash2, RefreshCw, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

interface Bestellung {
  id: string;
  name: string;
  email: string;
  telefon: string;
  adresse: string;
  nachricht?: string;
  gesamtpreis: number;
  status: string;
  created_at: string;
}

export const ShopBestellVerwaltung: React.FC = () => {
  const [bestellungen, setBestellungen] = useState<Bestellung[]>([]);
  const [filteredBestellungen, setFilteredBestellungen] = useState<Bestellung[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBestellungen = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('simple_bestellungen_2025_10_31_12_00')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const sortedData = (data || []).sort((a, b) => {
        // Sortierung: neu -> bestätigt -> storniert
        const statusOrder = { 'neu': 0, 'bestätigt': 1, 'storniert': 2 };
        const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
        const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
        
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        
        // Bei gleichem Status: neueste zuerst
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setBestellungen(sortedData);
      setFilteredBestellungen(sortedData);
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden der Bestellungen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBestellungStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('simple_bestellungen_2025_10_31_12_00')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Status aktualisiert",
        description: `Bestellung wurde als ${newStatus} markiert.`,
      });
      
      fetchBestellungen();
    } catch (error: any) {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteBestellung = async (id: string) => {
    try {
      const { error } = await supabase
        .from('simple_bestellungen_2025_10_31_12_00')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Bestellung gelöscht",
        description: "Die Bestellung wurde erfolgreich gelöscht.",
      });
      
      fetchBestellungen();
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Filter-Funktion
  const filterBestellungen = (status: string) => {
    setStatusFilter(status);
    if (status === 'alle') {
      setFilteredBestellungen(bestellungen);
    } else {
      setFilteredBestellungen(bestellungen.filter(b => b.status === status));
    }
  };

  // Status Badge Komponente
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'neu':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Neu
          </Badge>
        );
      case 'bestätigt':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Bestätigt
          </Badge>
        );
      case 'storniert':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Storniert
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  useEffect(() => {
    fetchBestellungen();
  }, []);

  useEffect(() => {
    filterBestellungen(statusFilter);
  }, [bestellungen, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Lade Bestellungen...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Bestellverwaltung - NEU mit Status-System
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter und Aktionen */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              <Select value={statusFilter} onValueChange={filterBestellungen}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle Bestellungen</SelectItem>
                  <SelectItem value="neu">Neue Bestellungen</SelectItem>
                  <SelectItem value="bestätigt">Bestätigte Bestellungen</SelectItem>
                  <SelectItem value="storniert">Stornierte Bestellungen</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="ml-2">
                {filteredBestellungen.length} Bestellung(en)
              </Badge>
            </div>
            <Button onClick={fetchBestellungen} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualisieren
            </Button>
          </div>

          {/* Bestellungen Tabelle */}
          {filteredBestellungen.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                {statusFilter === 'alle' 
                  ? 'Keine Bestellungen vorhanden' 
                  : `Keine ${statusFilter}n Bestellungen vorhanden`
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bestellnummer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Gesamtpreis</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBestellungen.map((bestellung) => (
                  <TableRow key={bestellung.id}>
                    <TableCell className="font-medium">
                      #{bestellung.id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(bestellung.status)}
                    </TableCell>
                    <TableCell>{bestellung.name}</TableCell>
                    <TableCell>{bestellung.email}</TableCell>
                    <TableCell>{bestellung.gesamtpreis.toFixed(2)}€</TableCell>
                    <TableCell>
                      {new Date(bestellung.created_at).toLocaleDateString('de-DE')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Status-Änderungs-Buttons */}
                        {bestellung.status === 'neu' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateBestellungStatus(bestellung.id, 'bestätigt')}
                              className="text-green-600 hover:text-green-700"
                              title="Bestellung bestätigen"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateBestellungStatus(bestellung.id, 'storniert')}
                              className="text-red-600 hover:text-red-700"
                              title="Bestellung stornieren"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {/* Details Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* TODO: Details anzeigen */}}
                          title="Details anzeigen"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {/* Löschen Button */}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteBestellung(bestellung.id)}
                          title="Bestellung löschen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};