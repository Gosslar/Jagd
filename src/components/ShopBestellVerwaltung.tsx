import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import jsPDF from 'jspdf';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Eye,
  Edit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Euro,
  Download,
  XCircle,
  Filter,
  RefreshCw,
  ShoppingCart
} from 'lucide-react';

interface ShopBestellung {
  id: string;
  bestellnummer: string;
  kunde_id: string;
  kunde_name: string;
  kunde_email: string;
  kunde_telefon: string;
  kunde_adresse: string;
  bestelldatum: string;
  gesamtpreis: number;
  status: string;
  zahlungsstatus: string;
  lieferstatus: string;
  notizen?: string;
  created_at: string;
  updated_at: string;
}

interface BestellPosition {
  id: string;
  bestellung_id: string;
  produkt_name: string;
  menge: number;
  einzelpreis: number;
  gesamtpreis: number;
}

export const ShopBestellVerwaltung: React.FC = () => {
  const [bestellungen, setBestellungen] = useState<ShopBestellung[]>([]);
  const [filteredBestellungen, setFilteredBestellungen] = useState<ShopBestellung[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  const [positionen, setPositionen] = useState<{ [key: string]: BestellPosition[] }>({});
  const [selectedBestellung, setSelectedBestellung] = useState<ShopBestellung | null>(null);
  const [loading, setLoading] = useState(true);
  const [notizen, setNotizen] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const loadBestellungen = async () => {
    try {
      setLoading(true);
      
      // Lade Bestellungen aus der einfachen Tabelle
      const { data: bestellungenData, error: bestellungenError } = await supabase
        .from('simple_bestellungen_2025_10_31_12_00')
        .select('*')
        .order('created_at', { ascending: false });

      if (bestellungenError) throw bestellungenError;

      // Konvertiere zu ShopBestellung Format
      const convertedBestellungen: ShopBestellung[] = (bestellungenData || []).map(b => ({
        id: b.id,
        bestellnummer: `#${b.id.slice(-8)}`,
        kunde_id: b.id, // Verwende ID als Kunde-ID
        kunde_name: b.name,
        kunde_email: b.email,
        kunde_telefon: b.telefon || '',
        kunde_adresse: b.adresse || '',
        bestelldatum: b.created_at,
        gesamtpreis: b.gesamtpreis,
        status: b.status || 'neu',
        zahlungsstatus: 'offen',
        lieferstatus: 'vorbereitung',
        notizen: b.nachricht || '',
        created_at: b.created_at,
        updated_at: b.created_at
      }));

      // Sortiere nach Status-Priorität
      const sortedBestellungen = convertedBestellungen.sort((a, b) => {
        const statusOrder = { 'neu': 0, 'bestätigt': 1, 'storniert': 2 };
        const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
        const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
        
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setBestellungen(sortedBestellungen);
      setFilteredBestellungen(sortedBestellungen);

      // Lade Bestellpositionen
      const { data: positionenData, error: positionenError } = await supabase
        .from('simple_bestellpositionen_2025_10_31_12_00')
        .select('*');

      if (positionenError) throw positionenError;

      // Gruppiere Positionen nach Bestellung
      const positionenMap: { [key: string]: BestellPosition[] } = {};
      positionenData?.forEach(position => {
        if (!positionenMap[position.bestellung_id]) {
          positionenMap[position.bestellung_id] = [];
        }
        positionenMap[position.bestellung_id].push({
          id: position.id,
          bestellung_id: position.bestellung_id,
          produkt_name: position.produkt_name,
          menge: position.menge,
          einzelpreis: position.einzelpreis,
          gesamtpreis: position.gesamtpreis
        });
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
      
      loadBestellungen();
    } catch (error: any) {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateNotizen = async (bestellungId: string) => {
    try {
      const { error } = await supabase
        .from('simple_bestellungen_2025_10_31_12_00')
        .update({ nachricht: notizen })
        .eq('id', bestellungId);

      if (error) throw error;

      toast({
        title: "Notizen aktualisiert",
        description: "Die Notizen wurden erfolgreich gespeichert.",
      });

      loadBestellungen();
      setSelectedBestellung(null);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generatePDF = (bestellung: ShopBestellung) => {
    const doc = new jsPDF();
    const bestellPositionen = positionen[bestellung.id] || [];
    
    // Header
    doc.setFontSize(20);
    doc.text('Lieferschein', 20, 30);
    
    // Bestellinformationen
    doc.setFontSize(12);
    doc.text(`Bestellnummer: ${bestellung.bestellnummer}`, 20, 50);
    doc.text(`Datum: ${new Date(bestellung.bestelldatum).toLocaleDateString('de-DE')}`, 20, 60);
    doc.text(`Status: ${bestellung.status}`, 20, 70);
    
    // Kundeninformationen
    doc.text('Kunde:', 20, 90);
    doc.text(`Name: ${bestellung.kunde_name}`, 20, 100);
    doc.text(`E-Mail: ${bestellung.kunde_email}`, 20, 110);
    doc.text(`Telefon: ${bestellung.kunde_telefon}`, 20, 120);
    doc.text(`Adresse: ${bestellung.kunde_adresse}`, 20, 130);
    
    // Bestellpositionen
    doc.text('Bestellte Artikel:', 20, 150);
    let yPos = 160;
    
    bestellPositionen.forEach((position, index) => {
      doc.text(`${index + 1}. ${position.produkt_name}`, 20, yPos);
      doc.text(`   Menge: ${position.menge}`, 20, yPos + 10);
      doc.text(`   Einzelpreis: ${position.einzelpreis.toFixed(2)}€`, 20, yPos + 20);
      doc.text(`   Gesamtpreis: ${position.gesamtpreis.toFixed(2)}€`, 20, yPos + 30);
      yPos += 50;
    });
    
    // Gesamtpreis
    doc.setFontSize(14);
    doc.text(`Gesamtpreis: ${bestellung.gesamtpreis.toFixed(2)}€`, 20, yPos + 20);
    
    // Notizen
    if (bestellung.notizen) {
      doc.setFontSize(12);
      doc.text('Notizen:', 20, yPos + 40);
      doc.text(bestellung.notizen, 20, yPos + 50);
    }
    
    doc.save(`Lieferschein_${bestellung.bestellnummer}.pdf`);
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

  const openBestellungDetails = (bestellung: ShopBestellung) => {
    setSelectedBestellung(bestellung);
    setNotizen(bestellung.notizen || '');
  };

  useEffect(() => {
    loadBestellungen();
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
            Bestellverwaltung mit Status-System
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
            <Button onClick={loadBestellungen} variant="outline" size="sm">
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
                      {bestellung.bestellnummer}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(bestellung.status)}
                    </TableCell>
                    <TableCell>{bestellung.kunde_name}</TableCell>
                    <TableCell>{bestellung.kunde_email}</TableCell>
                    <TableCell>{bestellung.gesamtpreis.toFixed(2)}€</TableCell>
                    <TableCell>
                      {new Date(bestellung.bestelldatum).toLocaleDateString('de-DE')}
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openBestellungDetails(bestellung)}
                              title="Details anzeigen"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Bestelldetails - {bestellung.bestellnummer}</DialogTitle>
                            </DialogHeader>
                            {selectedBestellung && (
                              <div className="space-y-6">
                                {/* Kundeninformationen */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                      <Package className="h-4 w-4" />
                                      Bestellinformationen
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>Bestellnummer:</strong> {selectedBestellung.bestellnummer}</p>
                                      <p><strong>Datum:</strong> {new Date(selectedBestellung.bestelldatum).toLocaleDateString('de-DE')}</p>
                                      <p><strong>Status:</strong> {getStatusBadge(selectedBestellung.status)}</p>
                                      <p><strong>Gesamtpreis:</strong> {selectedBestellung.gesamtpreis.toFixed(2)}€</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      Kundeninformationen
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>Name:</strong> {selectedBestellung.kunde_name}</p>
                                      <p><strong>E-Mail:</strong> {selectedBestellung.kunde_email}</p>
                                      <p><strong>Telefon:</strong> {selectedBestellung.kunde_telefon}</p>
                                      <p><strong>Adresse:</strong> {selectedBestellung.kunde_adresse}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Bestellpositionen */}
                                <div>
                                  <h3 className="font-semibold mb-2">Bestellte Artikel</h3>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Artikel</TableHead>
                                        <TableHead>Menge</TableHead>
                                        <TableHead>Einzelpreis</TableHead>
                                        <TableHead>Gesamtpreis</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {(positionen[selectedBestellung.id] || []).map((position) => (
                                        <TableRow key={position.id}>
                                          <TableCell>{position.produkt_name}</TableCell>
                                          <TableCell>{position.menge}</TableCell>
                                          <TableCell>{position.einzelpreis.toFixed(2)}€</TableCell>
                                          <TableCell>{position.gesamtpreis.toFixed(2)}€</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                {/* Notizen */}
                                <div>
                                  <h3 className="font-semibold mb-2">Notizen</h3>
                                  <Textarea
                                    value={notizen}
                                    onChange={(e) => setNotizen(e.target.value)}
                                    placeholder="Notizen zur Bestellung..."
                                    className="min-h-[100px]"
                                  />
                                  <Button
                                    onClick={() => updateNotizen(selectedBestellung.id)}
                                    className="mt-2"
                                    size="sm"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Notizen speichern
                                  </Button>
                                </div>

                                {/* Aktionen */}
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => generatePDF(selectedBestellung)}
                                    variant="outline"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    PDF Lieferschein
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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