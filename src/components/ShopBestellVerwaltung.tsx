import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
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
  const [positionen, setPositionen] = useState<{ [key: string]: BestellPosition[] }>({});
  const [selectedBestellung, setSelectedBestellung] = useState<ShopBestellung | null>(null);
  const [loading, setLoading] = useState(true);
  const [notizen, setNotizen] = useState('');
  const [activeTab, setActiveTab] = useState('alle');
  const { toast } = useToast();
  const { user } = useAuth();

  const loadBestellungen = async () => {
    try {
      setLoading(true);
      
      // Lade Bestellungen aus der einfachen Tabelle
      const { data: bestellungenData, error: bestellungenError } = await supabase
        .from('simple_bestellungen_2025_11_06_21_00')
        .select('*')
        .order('created_at', { ascending: false });

      if (bestellungenError) throw bestellungenError;

      // Konvertiere zu ShopBestellung Format
      const convertedBestellungen: ShopBestellung[] = (bestellungenData || []).map(b => ({
        id: b.id,
        bestellnummer: `#${b.id.slice(-8)}`,
        kunde_id: b.id,
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

      setBestellungen(convertedBestellungen);

      // Lade Bestellpositionen
      const { data: positionenData, error: positionenError } = await supabase
        .from('simple_bestellpositionen_2025_11_06_21_00')
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
      console.log('Updating status for order:', id, 'to:', newStatus);
      
      const { error } = await supabase
        .from('simple_bestellungen_2025_11_06_21_00')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        console.error('Status update error:', error);
        throw error;
      }
      
      toast({
        title: "Status aktualisiert",
        description: `Bestellung wurde als ${newStatus} markiert.`,
      });
      
      // Reload data
      await loadBestellungen();
    } catch (error: any) {
      console.error('Error updating status:', error);
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
        .from('simple_bestellungen_2025_11_06_21_00')
        .update({ nachricht: notizen })
        .eq('id', bestellungId);

      if (error) throw error;

      toast({
        title: "Notizen aktualisiert",
        description: "Die Notizen wurden erfolgreich gespeichert.",
      });

      await loadBestellungen();
      setSelectedBestellung(null);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generatePDF = async (bestellung: ShopBestellung) => {
    try {
      // Dynamischer Import von jsPDF
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const bestellPositionen = positionen[bestellung.id] || [];
      
      // Jagdliches Design - Grüne Farben
      const jagdGruen = [34, 139, 34];
      const dunkelGruen = [0, 100, 0];
      
      // Jagdlicher Header mit grünem Hintergrund
      doc.setFillColor(...jagdGruen);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('🦌 JAGDREVIER LIEFERSCHEIN 🦌', 105, 25, { align: 'center' });
      
      // Zurück zu schwarzer Schrift
      doc.setTextColor(0, 0, 0);
      
      // Bestellinformationen
      doc.setFontSize(14);
      doc.setTextColor(...dunkelGruen);
      doc.text('📋 BESTELLINFORMATIONEN', 20, 55);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Bestellnummer: ${bestellung.bestellnummer}`, 20, 70);
      doc.text(`Datum: ${new Date(bestellung.bestelldatum).toLocaleDateString('de-DE')}`, 20, 80);
      doc.text(`Status: ${bestellung.status.toUpperCase()}`, 20, 90);
      
      // Kundeninformationen
      doc.text('Kunde:', 20, 90);
      doc.text(`Name: ${bestellung.kunde_name}`, 20, 100);
      doc.text(`E-Mail: ${bestellung.kunde_email}`, 20, 110);
      doc.text(`Telefon: ${bestellung.kunde_telefon}`, 20, 120);
      doc.text(`Adresse: ${bestellung.kunde_adresse}`, 20, 130);
      
      // Bestellpositionen
      doc.text('Bestellte Artikel:', 20, 150);
      let yPos = 160;
      
      if (bestellPositionen.length > 0) {
        bestellPositionen.forEach((position, index) => {
          doc.text(`${index + 1}. ${position.produkt_name}`, 20, yPos);
          doc.text(`   Menge: ${position.menge}`, 20, yPos + 10);
          yPos += 30;
        });
      } else {
        doc.text('Details nicht verfügbar (migrierte Bestellung)', 20, yPos);
        yPos += 20;
      }
      
      // Gesamtpreis entfernt - keine Preise im PDF
      
      // Notizen
      if (bestellung.notizen) {
        doc.setFontSize(12);
        doc.text('Notizen:', 20, yPos + 40);
        doc.text(bestellung.notizen, 20, yPos + 50);
      }
      
      doc.save(`Lieferschein_${bestellung.bestellnummer}.pdf`);
      
      toast({
        title: "PDF erstellt",
        description: "Der Lieferschein wurde erfolgreich heruntergeladen.",
      });
    } catch (error: any) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF-Fehler",
        description: "Fehler beim Erstellen des PDFs: " + error.message,
        variant: "destructive",
      });
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

  // Filter Bestellungen nach Status
  const getFilteredBestellungen = (status: string) => {
    if (status === 'alle') {
      return bestellungen.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return bestellungen
      .filter(b => b.status === status)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // Bestellungen-Tabelle Komponente
  const BestellungenTable = ({ bestellungen }: { bestellungen: ShopBestellung[] }) => (
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
        {bestellungen.map((bestellung) => (
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
                
                {/* Für bestätigte und stornierte Bestellungen: Status zurücksetzen */}
                {(bestellung.status === 'bestätigt' || bestellung.status === 'storniert') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateBestellungStatus(bestellung.id, 'neu')}
                    className="text-blue-600 hover:text-blue-700"
                    title="Status zurücksetzen auf Neu"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
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
                              {(positionen[selectedBestellung.id] || []).length > 0 ? (
                                positionen[selectedBestellung.id].map((position) => (
                                  <TableRow key={position.id}>
                                    <TableCell>{position.produkt_name}</TableCell>
                                    <TableCell>{position.menge}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={2} className="text-center text-gray-500">
                                    Keine Artikeldetails verfügbar (migrierte Bestellung)
                                  </TableCell>
                                </TableRow>
                              )}
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
  );

  useEffect(() => {
    loadBestellungen();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Lade Bestellungen...</span>
      </div>
    );
  }

  const neueBestellungen = getFilteredBestellungen('neu');
  const bestaetigteBestellungen = getFilteredBestellungen('bestätigt');
  const stornierteBestellungen = getFilteredBestellungen('storniert');
  const alleBestellungen = getFilteredBestellungen('alle');

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Bestellverwaltung mit Status-Tabs
          </CardTitle>
          <div className="flex justify-end">
            <Button onClick={loadBestellungen} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="alle" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Alle ({alleBestellungen.length})
              </TabsTrigger>
              <TabsTrigger value="neu" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Neue ({neueBestellungen.length})
              </TabsTrigger>
              <TabsTrigger value="bestätigt" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Bestätigt ({bestaetigteBestellungen.length})
              </TabsTrigger>
              <TabsTrigger value="storniert" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Storniert ({stornierteBestellungen.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="alle" className="mt-6">
              {alleBestellungen.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine Bestellungen vorhanden</p>
                </div>
              ) : (
                <BestellungenTable bestellungen={alleBestellungen} />
              )}
            </TabsContent>
            
            <TabsContent value="neu" className="mt-6">
              {neueBestellungen.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine neuen Bestellungen vorhanden</p>
                </div>
              ) : (
                <BestellungenTable bestellungen={neueBestellungen} />
              )}
            </TabsContent>
            
            <TabsContent value="bestätigt" className="mt-6">
              {bestaetigteBestellungen.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine bestätigten Bestellungen vorhanden</p>
                </div>
              ) : (
                <BestellungenTable bestellungen={bestaetigteBestellungen} />
              )}
            </TabsContent>
            
            <TabsContent value="storniert" className="mt-6">
              {stornierteBestellungen.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine stornierten Bestellungen vorhanden</p>
                </div>
              ) : (
                <BestellungenTable bestellungen={stornierteBestellungen} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};